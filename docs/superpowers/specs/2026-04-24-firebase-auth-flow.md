# Firebase Auth Flow — Design Spec

**Date:** 2026-04-24
**Scope:** Replace the mock Zustand auth with Firebase. Email/password (unified
sign-in/sign-up), native Apple Sign-In, Google sign-in via system sheet,
session policy (absolute max age + recent-auth gate), and an opt-in biometric
lock on app resume.

---

## 1. Decisions

| Topic          | Choice                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| SDK            | `@react-native-firebase/*` v24 (modular API, auto-init from plist/json)                                    |
| Apple          | `expo-apple-authentication` → Firebase credential                                                          |
| Google         | `expo-auth-session` (system sheet) → Firebase credential                                                   |
| Email          | Single screen, auto-creates account on first attempt, toast on creation                                    |
| Profile + role | Firestore `users/{uid}` document                                                                           |
| Session        | Absolute max age (`sessionMaxAgeMs`, default 30d) + recent-auth gate (`recentAuthMaxAgeSec`, default 5min) |
| Biometric lock | Opt-in. Re-locks after backgrounding `>30s`.                                                               |
| Splash         | `expo-splash-screen` held until first `onAuthStateChanged` resolves                                        |
| Errors         | Centralized `code → message` lookup                                                                        |
| Secrets        | Firebase owns tokens (Keychain/Keystore). MMKV stores cache + prefs only.                                  |

---

## 2. Architecture

### 2.1 File layout

```
src/services/firebase/
  init.ts                       # auth/db instances + type re-exports
  errors.ts                     # type guards (firebase auth + user-cancelled)
  types.ts                      # UserProfile, AuthProvider, UserRole
  oauth-config.ts               # Google client IDs from Constants.expoConfig.extra
  sign-in-with-email.ts
  sign-in-with-apple.ts
  sign-in-with-google.ts
  sign-out.ts
  user-profile.ts               # createIfMissing + fetch
  index.ts                      # barrel — only entry point for features

src/features/auth/
  config.ts                     # session policy
  types.ts                      # AuthUser, SocialProvider
  store/auth.store.ts
  utils/
    merge-auth-user.ts
    firebase-error-message.ts
  hooks/
    use-auth.ts                 # selectors (useCurrentUser etc.)
    use-auth-session.ts         # Firebase listener → store hydration
    use-sign-in-form.ts
    use-social-sign-in.ts
    use-session-expiry-watchdog.ts
    use-require-recent-auth.ts
  index.ts                      # public API

src/features/biometric-lock/
  config.ts
  store/biometric-lock.store.ts
  hooks/
    use-biometric-lock.ts
    use-biometric-availability.ts
  services/authenticate-with-biometrics.ts
  components/
    biometric-lock-overlay.tsx
    biometric-lock-overlay.styles.ts
  index.ts
```

### 2.2 Dependency direction

- `features/*` → `services/firebase/*` (one direction).
- `features/biometric-lock` → `features/auth` (reads `useIsAuthenticated`); never reverse.
- Nothing outside `services/firebase` imports `@react-native-firebase/*` directly.

### 2.3 Dependencies

```bash
pnpm expo install \
  @react-native-firebase/app@^24 \
  @react-native-firebase/auth@^24 \
  @react-native-firebase/firestore@^24 \
  expo-apple-authentication \
  expo-auth-session \
  expo-crypto \
  expo-local-authentication \
  expo-build-properties \
  sonner-native
```

**v24 notes:**

1. **Modular API only.** Namespaced calls (`firebase.auth().signInWith…`) are
   deprecated and expected to be removed in v25. Don't mix the two — most
   tutorials online still use the namespaced API.
2. **Firestore types moved to package root:**
   `import type { DocumentSnapshot } from '@react-native-firebase/firestore'`
   (no longer under `FirebaseFirestoreTypes`). Auth types still live under
   `FirebaseAuthTypes`.

### 2.4 Existing infrastructure (referenced)

`src/services/store.ts` provides four primitives every store in the project
uses. They were introduced before this spec; the rules below are the
contract this spec depends on.

#### `create` (wrapped) vs `create` (direct)

- **`create`** — `import { create } from '@/services'`. Auto-registers with
  `resetAllStores()`. Use for **session-scoped** state (auth, transient UI).
  Default choice.
- **`create`** — `import { create } from 'zustand'`. Skips the registry. Use
  for **device-scoped** state (preferences, opt-ins).

The default is reset because forgetting to opt out costs a UX preference;
forgetting to opt in risks one user's session leaking into the next.

#### `resetAllStores`

```ts
import { resetAllStores } from '@/services';
```

Walks every registered store and resets it to its initial state. Called
once, from `useAuthStore.hydrateFromFirebase(null)`, on sign-out.

#### `zustandStorage`

```ts
import { zustandStorage } from '@/services';
```

MMKV-backed adapter for Zustand's `persist` middleware. Synchronous,
hardware-accelerated. Used as `createJSONStorage(() => zustandStorage)`.

#### `createPersistMigrator` — store migration helper

Returns the `{ version, migrate }` pair that `persist()` expects. Takes an
**append-only** array of migration functions; `version` is derived from
`migrations.length` so adding a migration auto-bumps the version — nobody
has to remember to update both.

The helper runs only on cross-version mismatch (cold start after an upgrade).
It does NOT run on sign-out (sign-out calls `resetAllStores()` and bypasses
persist entirely) and it does NOT run on every read.

**Rules:**

1. **Append-only.** Never edit, reorder, or delete a shipped migration.
   Insert a no-op `(state) => state` if you need to retire one.
2. **One migration per shape change.** Each entry migrates state from
   version N (its index) to N+1.
3. **Empty array is valid.** New stores start with `[]`; the helper resolves
   to `version: 0` and `migrate` is a never-called identity.

```ts
// src/services/store.ts
import { create as actualCreate, type StateCreator } from 'zustand';

const storeResetFunctions = new Set<() => void>();

export const create = (<T>() =>
  (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    storeResetFunctions.add(() => store.setState(store.getInitialState(), true));
    return store;
  }) as typeof actualCreate;

export const resetAllStores = () => {
  storeResetFunctions.forEach((reset) => reset());
};

// Append-only migration helper. See rules above.
type PersistMigration<TState> = (state: any) => TState;

export const createPersistMigrator = <TState>(migrations: PersistMigration<TState>[]) => ({
  version: migrations.length,
  migrate: (state: unknown, fromVersion: number): TState => {
    let nextState = state as TState;
    for (let migrationIndex = fromVersion; migrationIndex < migrations.length; migrationIndex++) {
      nextState = migrations[migrationIndex](nextState);
    }
    return nextState;
  },
});
```

**Usage pattern (works for any store using `persist`):**

```ts
import { create, createPersistMigrator, zustandStorage } from '@/services';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useFooStore = create<FooState>()(
  persist(
    (set) => ({
      /* ... */
    }),
    {
      name: 'foo',
      storage: createJSONStorage(() => zustandStorage),
      // Append a migration here when the persisted shape changes — version
      // bumps automatically.
      ...createPersistMigrator<Partial<FooState>>([
        // Example future migration:
        // (previousState) => ({ ...previousState, newField: 'default' }),
      ]),
      partialize: (state) => ({
        /* fields safe to persist */
      }),
    },
  ),
);
```

When you later add a field to `FooState`, append one entry to the migrations
array. Stored values from older versions get walked through every migration
above their stored version on next cold start; users on the current version
pay no cost.

---

## 3. Initialization

`@react-native-firebase` auto-initializes from `GoogleService-Info.plist` (iOS)
and `google-services.json` (Android). No JS-side `initializeApp()`.

### 3.1 `app.config.ts`

Replaces static `app.json` so OAuth IDs and Firebase service files differ per
build variant (`development` / `production`) and template identifiers
(`BUNDLE_PREFIX`, `APP_NAME`, `APP_SCHEME`) are set once in `.env.local` —
no find-and-replace through code when forking the template.

OAuth client IDs are _not_ secrets (Google verifies bundle ID + SHA-1, not ID
secrecy). Env-driven values exist for per-variant isolation. Adding a
`staging` variant later is a matter of one new entry in the `variants`
record below; we don't ship it pre-built.

```ts
// app.config.ts
import type { ExpoConfig } from 'expo/config';

type Variant = 'development' | 'production';

const variant = (process.env.APP_VARIANT ?? 'development') as Variant;

// Single point of rebrand. Real projects override these in .env.local
// (or EAS env) and run `pnpm expo prebuild --clean`.
const BUNDLE_PREFIX = process.env.BUNDLE_PREFIX ?? 'com.expostarter.app';
const APP_NAME = process.env.APP_NAME ?? 'Expo Starter';
const APP_SCHEME = process.env.APP_SCHEME ?? 'expo-starter-kit';

const variants: Record<
  Variant,
  {
    bundleIdentifier: string;
    androidPackage: string;
    displayName: string;
    iosGoogleServicesFile: string;
    androidGoogleServicesFile: string;
    googleWebClientId: string;
    googleIosClientId: string;
    googleAndroidClientId: string;
  }
> = {
  development: {
    bundleIdentifier: `${BUNDLE_PREFIX}.dev`,
    androidPackage: `${BUNDLE_PREFIX}.dev`,
    displayName: `${APP_NAME} (dev)`,
    iosGoogleServicesFile: './firebase/dev/GoogleService-Info.plist',
    androidGoogleServicesFile: './firebase/dev/google-services.json',
    googleWebClientId: process.env.DEV_GOOGLE_WEB_CLIENT_ID ?? '',
    googleIosClientId: process.env.DEV_GOOGLE_IOS_CLIENT_ID ?? '',
    googleAndroidClientId: process.env.DEV_GOOGLE_ANDROID_CLIENT_ID ?? '',
  },
  production: {
    bundleIdentifier: BUNDLE_PREFIX,
    androidPackage: BUNDLE_PREFIX,
    displayName: APP_NAME,
    iosGoogleServicesFile: './firebase/prod/GoogleService-Info.plist',
    androidGoogleServicesFile: './firebase/prod/google-services.json',
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID ?? '',
    googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID ?? '',
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID ?? '',
  },
};

const env = variants[variant];

const config: ExpoConfig = {
  name: env.displayName,
  slug: 'expo-starter-kit',
  scheme: APP_SCHEME,
  plugins: [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    // 'static' frameworks are MANDATORY for RNFirebase v24 on iOS — removing
    // this breaks the iOS build with cryptic Pod errors.
    ['expo-build-properties', { ios: { useFrameworks: 'static' } }],
    'expo-apple-authentication',
    'expo-local-authentication',
  ],
  ios: {
    bundleIdentifier: env.bundleIdentifier,
    usesAppleSignIn: true,
    googleServicesFile: env.iosGoogleServicesFile,
  },
  android: {
    package: env.androidPackage,
    googleServicesFile: env.androidGoogleServicesFile,
  },
  extra: {
    variant,
    googleWebClientId: env.googleWebClientId,
    googleIosClientId: env.googleIosClientId,
    googleAndroidClientId: env.googleAndroidClientId,
  },
};

export default config;
```

> **Step-1 note.** Firebase plugins (`@react-native-firebase/*`,
> `expo-build-properties`) and `googleServicesFile` paths land with the deps
> in Step-3. Step-1 ships only the variant scaffolding above with those
> entries omitted.

Delete `app.json` in the same commit as `app.config.ts` — Expo prefers the TS
config when both exist, but coexistence invites silent drift.

#### `.env.local` (gitignored)

Each developer fills in their own dev-project credentials.

```bash
# --- Rebrand (set once when forking the template) -----------------------
BUNDLE_PREFIX=com.expostarter.app
APP_NAME=Expo Starter
# URL scheme — must match the OAuth redirect URI authorized in Google
# Cloud Console: <APP_SCHEME>:/oauthredirect
APP_SCHEME=expo-starter-kit

# --- Build variant (development | production) --------------------------
APP_VARIANT=development

# --- Google OAuth client IDs (per variant) -----------------------------
DEV_GOOGLE_WEB_CLIENT_ID=xxx.apps.googleusercontent.com
DEV_GOOGLE_IOS_CLIENT_ID=yyy.apps.googleusercontent.com
DEV_GOOGLE_ANDROID_CLIENT_ID=zzz.apps.googleusercontent.com

# Production IDs land here (or as EAS Secrets) when you're ready to ship:
# GOOGLE_WEB_CLIENT_ID=
# GOOGLE_IOS_CLIENT_ID=
# GOOGLE_ANDROID_CLIENT_ID=
```

`.env.local.example` (committed) holds the same keys with empty values. Expo
loads `.env.local` automatically (SDK 49+).

#### CI / EAS Build

Register the prod keys as EAS Secrets and pick the variant per build profile
in `eas.json`:

```bash
eas secret:create --scope project --name GOOGLE_WEB_CLIENT_ID     --value "..."
eas secret:create --scope project --name GOOGLE_IOS_CLIENT_ID     --value "..."
eas secret:create --scope project --name GOOGLE_ANDROID_CLIENT_ID --value "..."
```

```json
{
  "build": {
    "development": { "env": { "APP_VARIANT": "development" } },
    "production": { "env": { "APP_VARIANT": "production" } }
  }
}
```

EAS injects the secrets into the build env; `app.config.ts` reads them via
`process.env` exactly the same way it reads `.env.local` locally.

### 3.2 `src/services/firebase/init.ts`

```ts
import { getAuth, type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

// getAuth() / getFirestore() return the default-app instance, auto-initialized
// at native startup from the platform google-services file. Calling at module
// load is safe — native is ready by the time JS evaluates.
export const firebaseAuth = getAuth();
export const firebaseDb = getFirestore();

export type FirebaseUser = FirebaseAuthTypes.User;
export type FirebaseAuthError = FirebaseAuthTypes.NativeFirebaseAuthError;
```

### 3.3 `src/services/firebase/oauth-config.ts`

OAuth IDs flow `.env.local` / EAS Secret → `process.env` → `app.config.ts`
(extra) → here. Validation lives in this module so a misconfigured ID
surfaces on cold start, not 30 s later as an opaque "Google sign-in failed"
toast.

```ts
import Constants from 'expo-constants';

// Fail loudly in dev so misconfiguration is impossible to miss. Degrade
// silently in production — paying users shouldn't crash on launch over a
// missing EAS Secret. The social button stays clickable but fails fast.
const getRequiredExtraConfigValue = (key: string): string => {
  const value = Constants.expoConfig?.extra?.[key];
  if (typeof value === 'string' && value.length > 0) return value;
  const message =
    `[oauth-config] Missing extra.${key}. ` + 'Check .env.local (dev) or EAS Secrets (CI).';
  if (__DEV__) throw new Error(message);
  console.warn(message);
  return '';
};

export const oauthConfig = {
  googleWebClientId: getRequiredExtraConfigValue('googleWebClientId'),
  googleIosClientId: getRequiredExtraConfigValue('googleIosClientId'),
  googleAndroidClientId: getRequiredExtraConfigValue('googleAndroidClientId'),
} as const;
```

### 3.4 `src/features/auth/config.ts`

Session policy lives with the feature (app-level UX, not infra).

```ts
export const authConfig = {
  sessionMaxAgeMs: 30 * 24 * 60 * 60 * 1000,
  recentAuthMaxAgeSec: 5 * 60,
} as const;
```

---

## 4. Splash + auth gating

### `index.ts` (entry)

```ts
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

import '@/theme/unistyles';
import 'expo-router/entry';
```

### `src/features/auth/hooks/use-auth-session.ts`

Subscribes to Firebase auth state and writes both `user` and `isSessionReady`
into the store. Mount **once** at the top of `app/_layout.tsx` — multiple
mounts would create duplicate listeners.

```ts
import { useEffect } from 'react';
import { onAuthStateChanged } from '@react-native-firebase/auth';

import { firebaseAuth } from '@/services/firebase';

import { useAuthStore } from '../store/auth.store';

export const useAuthSession = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      try {
        await useAuthStore.getState().hydrateFromFirebase(firebaseUser);
      } catch (error) {
        if (__DEV__) console.warn('[auth] hydrateFromFirebase failed', error);
      } finally {
        // Always reach `true`, even on hydration failure — guarantees the
        // splash hides. Idempotent across subsequent token refresh / sign-out.
        useAuthStore.setState({ isSessionReady: true });
      }
    });
    return unsubscribe;
  }, []);
};
```

### `app/_layout.tsx`

Side-effect hooks run at the top so Firebase listeners attach on first commit
even while we render `null`. They don't read React context — only Firebase,
`AppState`, and zustand selectors — so it's safe to call them above
`RootProviders`.

```tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Toaster } from 'sonner-native';

import { RootProviders } from '@/providers';
import {
  useAuthSession,
  useIsAuthenticated,
  useIsSessionReady,
  useSessionExpiryWatchdog,
} from '@/features/auth';
import { BiometricLockOverlay, useBiometricLock } from '@/features/biometric-lock';

const RootLayout = () => {
  useAuthSession();
  useSessionExpiryWatchdog();
  useBiometricLock();

  const isSessionReady = useIsSessionReady();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isSessionReady) SplashScreen.hideAsync();
  }, [isSessionReady]);

  if (!isSessionReady) return null;

  return (
    <RootProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(main)" />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
      <BiometricLockOverlay />
      {/* Last in JSX → highest z-order; toasts paint above the lock overlay. */}
      <Toaster position="top-center" />
    </RootProviders>
  );
};

export default RootLayout;
```

Three layers guarantee the splash never hides early:

1. `useAuthSession` flips `isSessionReady` inside `try/finally`.
2. The effect only calls `hideAsync` when ready.
3. `if (!isSessionReady) return null` in render — no protected route mounts under the splash.

`isSessionReady` lives in the store (not local state) so any descendant can
read it via `useIsSessionReady()` and Fast Refresh of the layout doesn't
reset readiness.

---

## 5. Public API — `src/features/auth/index.ts`

```ts
export {
  useCurrentUser,
  useIsAuthenticated,
  useIsAdmin,
  useIsSessionReady,
} from './hooks/use-auth';
export { useAuthSession } from './hooks/use-auth-session';
export { useSignInForm } from './hooks/use-sign-in-form';
export { useSocialSignIn } from './hooks/use-social-sign-in';
export { useRequireRecentAuth } from './hooks/use-require-recent-auth';
export { useSessionExpiryWatchdog } from './hooks/use-session-expiry-watchdog';

export { authConfig } from './config';
export type { AuthUser, AuthProvider, SocialProvider } from './types';
```

Consumers never import from `@/services/firebase/*` directly (except
`features/auth` itself) and never touch Firebase types.

---

## 6. Email sign-in (unified)

### 6.1 `src/services/firebase/sign-in-with-email.ts`

Returns `true` if a new account was created, `false` on sign-in to an existing
account. Order matters: under Firebase's **Email Enumeration Protection**
(default-on since 2023), `auth/user-not-found` and `auth/wrong-password`
collapse into `auth/invalid-credential`, so "try sign-in then create" no
longer works. `auth/email-already-in-use` is preserved by EEP — the only
reliable pivot for a unified flow.

```ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

import { firebaseAuth } from './init';
import { isFirebaseAuthError } from './errors';
import { createUserProfileIfMissing } from './user-profile';

export const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
  try {
    const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await createUserProfileIfMissing({ user, provider: 'email' });
    return true;
  } catch (error) {
    if (!isFirebaseAuthError(error) || error.code !== 'auth/email-already-in-use') {
      throw error;
    }
    const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password);
    // Idempotent — legacy users without a profile self-heal here.
    await createUserProfileIfMissing({ user, provider: 'email' });
    return false;
  }
};
```

A unified flow under EEP leaks account-existence on the "weak password on a
new email" path (existing → `email-already-in-use`, new → `weak-password`).
If account-existence privacy ever becomes a requirement, split into two
screens.

### 6.2 `src/features/auth/hooks/use-sign-in-form.ts`

```ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner-native';

import { signInWithEmail } from '@/services/firebase';
import { signInSchema, type SignInFormValues } from '@/utils/validation';

import { getReadableAuthErrorMessage } from '../utils/firebase-error-message';

export const useSignInForm = () => {
  const { control, handleSubmit, formState } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      const wasAccountCreated = await signInWithEmail(email, password);
      if (wasAccountCreated) toast.success('Account created. Welcome!');
    } catch (error) {
      toast.error(getReadableAuthErrorMessage(error));
    }
  });

  return {
    control,
    onSubmit,
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
  };
};
```

Submit button must bind `disabled={!isValid || isSubmitting}` to prevent
concurrent submissions.

### 6.3 `src/features/auth/utils/firebase-error-message.ts`

Centralized translator. Swap the lookup body for `t(key)` later for i18n.

```ts
import { isFirebaseAuthError } from '@/services/firebase';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again in a few minutes.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/requires-recent-login': 'For security, please sign in again to continue.',
  'auth/account-exists-with-different-credential':
    'An account with this email exists under a different sign-in method.',
};

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

export const getReadableAuthErrorMessage = (error: unknown): string => {
  if (!isFirebaseAuthError(error)) return FALLBACK_MESSAGE;
  return AUTH_ERROR_MESSAGES[error.code] ?? FALLBACK_MESSAGE;
};
```

### 6.4 `src/services/firebase/sign-out.ts`

```ts
import { signOut as firebaseSignOut } from '@react-native-firebase/auth';

import { firebaseAuth } from './init';

// RNFirebase clears local credentials *before* the server revocation request,
// so onAuthStateChanged fires with null immediately and the rest of teardown
// (hydrateFromFirebase(null) → resetAllStores) flows from there. Network
// failures only delay server-side revocation.
//
// `firebaseSignOut` alias avoids name-shadowing our own export.
export const signOut = (): Promise<void> => firebaseSignOut(firebaseAuth);
```

Callers swallow rejection — local sign-out has already happened by the time
the await resolves.

---

## 7. Auth user model

### 7.1 `src/features/auth/types.ts`

The merged shape that the rest of the app consumes — zero Firebase-specific
fields.

```ts
import type { AuthProvider, UserRole } from '@/services/firebase';

export type { AuthProvider };
export type SocialProvider = Extract<AuthProvider, 'apple' | 'google'>;

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  // Defaults to 'user' until the Firestore profile loads. Admin gates must
  // check `role === 'admin'` explicitly. Real authorization is enforced by
  // Firestore rules (§17.2) — client role is UI gating only.
  role: UserRole;
  isEmailVerified: boolean;
  // Recorded at first sign-in. Account-linking would add `linkedProviders`.
  provider: AuthProvider;
  // ISO strings — round-trip through MMKV's JSON persistence with no work.
  // Null until the Firestore profile is read at least once.
  createdAt: string | null;
  updatedAt: string | null;
};
```

### 7.2 `src/features/auth/utils/merge-auth-user.ts`

Pure transformation. `profile` may be null on first launch or Firestore
failure — the user is still authenticated via Firebase, so we build a valid
`AuthUser` from auth metadata alone and the profile self-heals on next
hydration.

Field precedence: profile wins for `displayName` / `photoURL` / `role` /
`provider`; Firebase wins for `isEmailVerified`; only the profile has
timestamps.

```ts
import type { FirebaseUser, UserProfile } from '@/services/firebase';

import type { AuthUser } from '../types';

export const mergeAuthUser = (
  firebaseUser: FirebaseUser,
  profile: UserProfile | null,
): AuthUser => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: profile?.displayName ?? firebaseUser.displayName ?? null,
  photoURL: profile?.photoURL ?? firebaseUser.photoURL ?? null,
  role: profile?.role ?? 'user',
  provider: profile?.provider ?? 'email',
  isEmailVerified: firebaseUser.emailVerified,
  createdAt: profile?.createdAt ?? null,
  updatedAt: profile?.updatedAt ?? null,
});
```

### 7.3 `src/features/auth/hooks/use-auth.ts`

The reactive read API for the entire feature — anything outside
`features/auth` consumes these, never `useAuthStore` directly.

```ts
import { useAuthStore } from '../store/auth.store';

export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.user !== null);
// Compare against the literal — `role !== 'user'` would silently grant access
// to a future role like 'banned' or 'pending'. Explicit is safer.
export const useIsAdmin = () => useAuthStore((state) => state.user?.role === 'admin');
export const useIsSessionReady = () => useAuthStore((state) => state.isSessionReady);
```

For single-field consumers, prefer atomic selectors
(`useAuthStore((state) => state.user?.displayName)`) to avoid re-rendering on
unrelated user changes.

---

## 8. Firestore profile

Schema lives in `services/firebase/types.ts` — both services (write) and
features (read) use it; placing it under features would invert the dependency
direction.

### 8.1 `src/services/firebase/types.ts`

```ts
export type UserRole = 'user' | 'admin';
export type AuthProvider = 'email' | 'apple' | 'google';

// Wire shape AS RETURNED by fetchUserProfile. Firestore Timestamp → ISO
// string conversion happens at the service boundary so features never see
// Firestore types.
export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  // Auth method used at first sign-in. Frozen on create — never inferred at
  // runtime. Account-linking would add `linkedProviders`; this stays the primary.
  provider: AuthProvider;
  // serverTimestamp() at write; ISO string at read.
  createdAt: string;
  updatedAt: string;
};
```

### 8.2 `src/services/firebase/user-profile.ts`

Idempotent create + read. `getDoc` first (extra round-trip) instead of blind
`setDoc({ merge: true })` — merge would let a stale local payload overwrite
fresher server data on `createdAt` / `role` / `provider`.

```ts
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from '@react-native-firebase/firestore';

import { firebaseDb } from './init';
import type { FirebaseUser } from './init';
import type { AuthProvider, UserProfile } from './types';

type CreateUserProfileArgs = {
  user: FirebaseUser;
  provider: AuthProvider;
  // Apple returns the full name only on the very first sign-in, ever; we
  // pass it through here so it lands in Firestore even when
  // firebaseUser.displayName is null.
  displayName?: string | null;
};

export const createUserProfileIfMissing = async ({
  user,
  provider,
  displayName,
}: CreateUserProfileArgs): Promise<void> => {
  const profileRef = doc(firebaseDb, 'users', user.uid);
  const snapshot = await getDoc(profileRef);
  if (snapshot.exists()) return;

  await setDoc(profileRef, {
    uid: user.uid,
    email: user.email,
    displayName: displayName ?? user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    role: 'user' as const,
    provider,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// Defensive: serverTimestamp() should always populate these, but a client can
// briefly read the doc back before the server stamps the field. Treat null
// as "right now" for sort-stable behavior.
const convertFirestoreTimestampToIsoString = (timestamp: Timestamp | null): string => {
  if (timestamp === null) return new Date().toISOString();
  return timestamp.toDate().toISOString();
};

// Returns null for missing doc; throws on network failure (caller falls back
// to Firebase auth metadata via mergeAuthUser).
export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snapshot = await getDoc(doc(firebaseDb, 'users', uid));
  if (!snapshot.exists()) return null;

  const firestoreProfile = snapshot.data() as Omit<UserProfile, 'createdAt' | 'updatedAt'> & {
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
  };

  return {
    ...firestoreProfile,
    createdAt: convertFirestoreTimestampToIsoString(firestoreProfile.createdAt),
    updatedAt: convertFirestoreTimestampToIsoString(firestoreProfile.updatedAt),
  };
};
```

### 8.3 `src/services/firebase/index.ts` (barrel)

```ts
export { firebaseAuth, firebaseDb } from './init';
export type { FirebaseUser, FirebaseAuthError } from './init';
export type { AuthProvider, UserProfile, UserRole } from './types';

export { signInWithEmail } from './sign-in-with-email';
export { signInWithApple } from './sign-in-with-apple';
export { signInWithGoogle } from './sign-in-with-google';
export { signOut } from './sign-out';
export { fetchUserProfile } from './user-profile';
export { isFirebaseAuthError, isUserCancelledError } from './errors';
// createUserProfileIfMissing is intentionally NOT exported — it's an
// implementation detail of the sign-in services.
```

---

## 9. Error type guards — `src/services/firebase/errors.ts`

```ts
import type { FirebaseAuthError } from './init';

// All RNFirebase auth errors carry `code: 'auth/<x>'`. Native errors are
// plain JS objects (not Error instances), so we narrow on the prefix.
const FIREBASE_AUTH_ERROR_CODE_PREFIX = 'auth/';

export const isFirebaseAuthError = (error: unknown): error is FirebaseAuthError => {
  if (typeof error !== 'object' || error === null) return false;
  const errorCode = (error as { code?: unknown }).code;
  return typeof errorCode === 'string' && errorCode.startsWith(FIREBASE_AUTH_ERROR_CODE_PREFIX);
};

// Cross-provider cancel normalization. Two cancel paths exist:
//   - Apple (expo-apple-authentication) throws with code 'ERR_REQUEST_CANCELED'.
//   - Google (expo-auth-session) returns { type: 'cancel' } — no throw.
//     sign-in-with-google.ts wraps that into a synthetic error via
//     createUserCancelledError so a single try/catch in useSocialSignIn
//     handles both flows.
const USER_CANCELLED_CODES = new Set<string>([
  'ERR_REQUEST_CANCELED', // expo-apple-authentication's native cancel code
  'AUTH_USER_CANCELLED', // our synthetic code, see createUserCancelledError
]);

type UserCancelledError = Error & { code: 'AUTH_USER_CANCELLED' };

export const createUserCancelledError = (): UserCancelledError => {
  const error = new Error('Sign-in was cancelled.') as UserCancelledError;
  error.code = 'AUTH_USER_CANCELLED';
  return error;
};

export const isUserCancelledError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) return false;
  const errorCode = (error as { code?: unknown }).code;
  return typeof errorCode === 'string' && USER_CANCELLED_CODES.has(errorCode);
};
```

---

## 10. Apple sign-in

### `src/services/firebase/sign-in-with-apple.ts`

Nonce binding: Apple receives the SHA-256 hash and stamps it into the signed
JWT; Firebase receives the raw value and verifies by re-hashing. A captured
token is useless without the original nonce.

```ts
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { AppleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';

import { IS_IOS } from '@/constants/platform';

import { firebaseAuth } from './init';
import { createUserProfileIfMissing } from './user-profile';

const generateRandomNonce = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const signInWithApple = async (): Promise<void> => {
  // The button is iOS-only; we guard at the service level too so a stray call
  // (deep link, dev shortcut) fails with a clear message instead of an opaque
  // native error.
  if (!IS_IOS) {
    throw new Error('Apple sign-in is only available on iOS.');
  }

  const rawNonce = await generateRandomNonce();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!appleCredential.identityToken) {
    throw new Error('Apple sign-in did not return an identity token.');
  }

  // Apple returns `fullName` only on the very first sign-in, ever. Capture it now.
  const givenName = appleCredential.fullName?.givenName ?? '';
  const familyName = appleCredential.fullName?.familyName ?? '';
  const appleDisplayName = `${givenName} ${familyName}`.trim() || null;

  const firebaseCredential = AppleAuthProvider.credential(appleCredential.identityToken, rawNonce);
  const { user } = await signInWithCredential(firebaseAuth, firebaseCredential);

  // Post-credential housekeeping. The user is already signed in. Failures
  // self-heal on next sign-in via createUserProfileIfMissing's idempotency.
  // We deliberately do NOT call updateProfile(user, {displayName}) —
  // mergeAuthUser reads from the Firestore profile first; persisting via
  // createUserProfileIfMissing is sufficient.
  try {
    await createUserProfileIfMissing({
      user,
      provider: 'apple',
      displayName: appleDisplayName,
    });
  } catch (error) {
    if (__DEV__) console.warn('[auth] Apple post-sign-in housekeeping failed', error);
  }
};
```

`signInWithCredential` failures propagate up to `useSocialSignIn`, which is
the single error boundary for social providers (cancel → silent, real failure
→ translated toast).

### Screen-side button — use the native button

A custom `<AppleButton/>` (custom font, scale animation, theme-driven colors)
is **not Apple HIG compliant** — App Store guideline 4.8 implicitly requires
the official button look-and-feel when third-party logins are offered
alongside SiwA. Use `expo-apple-authentication`'s native button — it ships
SF font, geometry, dark/light variants, and press behavior at the platform
level.

```tsx
import * as AppleAuthentication from 'expo-apple-authentication';
import { useUnistyles } from 'react-native-unistyles';

import { IS_IOS } from '@/constants/platform';

const APPLE_BUTTON_HEIGHT_POINTS = 44;
const APPLE_BUTTON_CORNER_RADIUS = 999;

export const SignInWithAppleButton = () => {
  const { signInWithApple } = useSocialSignIn();
  const { themeName } = useUnistyles();

  if (!IS_IOS) return null;

  const buttonStyle =
    themeName === 'dark'
      ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
      : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK;

  return (
    <AppleAuthentication.AppleAuthenticationButton
      // Remount on theme change — the native button doesn't observe runtime updates.
      key={themeName}
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={buttonStyle}
      cornerRadius={APPLE_BUTTON_CORNER_RADIUS}
      style={{ height: APPLE_BUTTON_HEIGHT_POINTS, width: '100%' }}
      onPress={signInWithApple}
    />
  );
};
```

The native button has no `disabled` / `loading` prop. `useSocialSignIn`'s ref
guard already silently no-ops duplicate presses; overlay a spinner if you
need a visual loading indicator.

`GoogleButton` stays as-is — Google's branding policy is more lenient and the
existing component is compliant.

---

## 11. Google sign-in

### `src/services/firebase/sign-in-with-google.ts`

Implicit flow (`responseType: id_token`). Firebase's
`GoogleAuthProvider.credential()` consumes the ID token directly; we never
touch Google's access token.

```ts
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';

import { IS_IOS } from '@/constants/platform';

import { createUserCancelledError } from './errors';
import { createUserProfileIfMissing } from './user-profile';
import { firebaseAuth } from './init';
import { oauthConfig } from './oauth-config';

const GOOGLE_OAUTH_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

const generateRandomNonce = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const signInWithGoogle = async (): Promise<void> => {
  // makeRedirectUri reads scheme from app.config.ts automatically — never
  // hardcode it (would break forks that override APP_SCHEME).
  const redirectUri = AuthSession.makeRedirectUri({});
  const clientId = IS_IOS ? oauthConfig.googleIosClientId : oauthConfig.googleAndroidClientId;
  const nonce = await generateRandomNonce();

  const authRequest = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.IdToken,
    extraParams: { nonce },
  });

  await authRequest.makeAuthUrlAsync(GOOGLE_OAUTH_DISCOVERY);
  const authResponse = await authRequest.promptAsync(GOOGLE_OAUTH_DISCOVERY);

  if (authResponse.type === 'cancel' || authResponse.type === 'dismiss') {
    throw createUserCancelledError();
  }
  if (authResponse.type !== 'success') {
    throw new Error('Google sign-in failed.');
  }

  const googleIdToken = authResponse.params.id_token;
  if (!googleIdToken) {
    throw new Error('Google sign-in did not return an id_token.');
  }

  const firebaseCredential = GoogleAuthProvider.credential(googleIdToken);
  const { user } = await signInWithCredential(firebaseAuth, firebaseCredential);

  await createUserProfileIfMissing({ user, provider: 'google' });
};
```

---

## 12. Social sign-in coordinator

### `src/features/auth/hooks/use-social-sign-in.ts`

Single error boundary for both providers: cancel → silent, real failure →
translated toast, always resets in-flight state.

```ts
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner-native';

import {
  firebaseAuth,
  isUserCancelledError,
  signInWithApple as signInWithAppleService,
  signInWithGoogle as signInWithGoogleService,
} from '@/services/firebase';

import { useAuthStore } from '../store/auth.store';
import type { SocialProvider } from '../types';
import { getReadableAuthErrorMessage } from '../utils/firebase-error-message';

const socialSignInServices: Record<SocialProvider, () => Promise<void>> = {
  apple: signInWithAppleService,
  google: signInWithGoogleService,
};

export const useSocialSignIn = () => {
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(null);

  // Ref guard, not state: setState is batched; ref writes are synchronous —
  // protects against fast double-tap before re-render.
  const isSocialSignInInProgress = useRef(false);

  const signInWithProvider = useCallback(async (provider: SocialProvider) => {
    if (isSocialSignInInProgress.current) return;
    isSocialSignInInProgress.current = true;
    setPendingProvider(provider);

    try {
      await socialSignInServices[provider]();

      // Race-close: the first onAuthStateChanged → hydrate can resolve before
      // the service's createUserProfileIfMissing finishes writing. On Apple's
      // first-ever sign-in this loses appleCredential.fullName until next
      // cold start. Re-hydrate here picks up the freshly written profile.
      // Idempotent — sequence id inside hydrateFromFirebase (§13) discards
      // either call if a newer one supersedes it.
      const { currentUser } = firebaseAuth;
      if (currentUser) {
        await useAuthStore.getState().hydrateFromFirebase(currentUser);
      }
    } catch (error) {
      if (isUserCancelledError(error)) return;
      toast.error(getReadableAuthErrorMessage(error));
    } finally {
      isSocialSignInInProgress.current = false;
      setPendingProvider(null);
    }
  }, []);

  const signInWithApple = useCallback(() => signInWithProvider('apple'), [signInWithProvider]);
  const signInWithGoogle = useCallback(() => signInWithProvider('google'), [signInWithProvider]);

  return {
    signInWithApple,
    signInWithGoogle,
    pendingProvider,
    isLoading: pendingProvider !== null,
  };
};
```

`useAuthStore.getState()` (not a selector) — fire the action once
imperatively without re-rendering on action-ref identity changes.

---

## 13. Store + hydration

### `src/features/auth/store/auth.store.ts`

`hydrateFromFirebase` covers three concerns: graceful degradation when
Firestore is unreachable (splash never hangs), out-of-order async hydration
(sequence id discards stale results), and `sessionStartedAt` semantics
(preserved on token refresh, reset on account switch).

```ts
import { persist, createJSONStorage } from 'zustand/middleware';

// `create` from '@/services' — wraps with auto-reset on sign-out via
// resetAllStores(). Session-scoped store. See §2.4.
import { create, createPersistMigrator, resetAllStores, zustandStorage } from '@/services';
import { fetchUserProfile } from '@/services/firebase';
import type { FirebaseUser, UserProfile } from '@/services/firebase';

import type { AuthUser } from '../types';
import { mergeAuthUser } from '../utils/merge-auth-user';

type AuthState = {
  user: AuthUser | null;
  sessionStartedAt: number | null;
  // Splash gate. NOT persisted (partialize) — must re-prove readiness on
  // every cold start so the new Firebase listener confirms the session.
  isSessionReady: boolean;
  hydrateFromFirebase: (firebaseUser: FirebaseUser | null) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Closure-scoped sequence id. Every hydrate increments it; older calls
      // that lose the race exit silently instead of overwriting the store
      // with stale data after a sign-out / account switch.
      let pendingHydrationId = 0;

      return {
        user: null,
        sessionStartedAt: null,
        isSessionReady: false,

        hydrateFromFirebase: async (firebaseUser) => {
          const currentHydrationId = ++pendingHydrationId;

          if (!firebaseUser) {
            // Wipes auth + every other session-scoped store. Device-scoped
            // stores (biometric-lock isEnabled) are not registered and survive.
            resetAllStores();
            return;
          }

          // Profile fetch can fail on cold start with no network. The user is
          // still authenticated via Firebase; mergeAuthUser builds a valid
          // AuthUser from auth metadata alone and the profile self-heals on
          // next hydration. Without this guard a Firestore outage would hang
          // the splash forever.
          let profile: UserProfile | null = null;
          try {
            profile = await fetchUserProfile(firebaseUser.uid);
          } catch (error) {
            if (__DEV__) console.warn('[auth] fetchUserProfile failed', error);
          }

          // Discard stale results: a newer hydrate (sign-out, account switch)
          // superseded this one while we were awaiting Firestore.
          if (currentHydrationId !== pendingHydrationId) return;

          const previousUid = get().user?.uid;
          set({
            user: mergeAuthUser(firebaseUser, profile),
            // Same uid → preserve clock (token refresh, hot reload).
            // Different uid → fresh clock (account switch / re-sign-in).
            sessionStartedAt:
              previousUid === firebaseUser.uid
                ? (get().sessionStartedAt ?? Date.now())
                : Date.now(),
          });
        },
      };
    },
    {
      name: 'auth',
      storage: createJSONStorage(() => zustandStorage),
      // Append a migration here when the persisted shape (AuthUser fields,
      // sessionStartedAt) changes. See createPersistMigrator rules in §2.4.
      ...createPersistMigrator<Partial<AuthState>>([]),
      // isSessionReady is a runtime gate, not a session attribute. Persisting
      // it would let MMKV "remember" the splash already finished from the
      // previous launch and skip the gate on cold start.
      partialize: (state) => ({
        user: state.user,
        sessionStartedAt: state.sessionStartedAt,
      }),
    },
  ),
);
```

**Extension point — profile-loading state.** If a screen later needs to
distinguish "profile is loading" from "profile loaded but missing", add an
`isProfileLoading: boolean` to `AuthState` (flip true before `try`, false
inside the final `set`). Don't add speculatively.

---

## 14. Session policy

### 14.1 Absolute session max age

### `src/features/auth/hooks/use-session-expiry-watchdog.ts`

```ts
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { signOut } from '@/services/firebase';

import { authConfig } from '../config';
import { useAuthStore } from '../store/auth.store';

const signOutIfSessionExpired = async (sessionExpiresAt: number) => {
  if (Date.now() < sessionExpiresAt) return;
  try {
    await signOut();
  } catch (error) {
    // Local sign-out has already happened by the time we reach this catch
    // (RNFirebase clears credentials before the server call), so there's
    // nothing for the UI to recover from.
    if (__DEV__) console.warn('[auth] signOut from watchdog failed', error);
  }
};

export const useSessionExpiryWatchdog = () => {
  const sessionStartedAt = useAuthStore((state) => state.sessionStartedAt);

  useEffect(() => {
    if (sessionStartedAt === null) return;
    const sessionExpiresAt = sessionStartedAt + authConfig.sessionMaxAgeMs;

    signOutIfSessionExpired(sessionExpiresAt);

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') signOutIfSessionExpired(sessionExpiresAt);
    });

    return () => subscription.remove();
  }, [sessionStartedAt]);
};
```

`signOutIfSessionExpired` is module-scope: it has no React state and takes
`sessionExpiresAt` as a parameter, so hoisting it gives a stable reference,
makes it directly unit-testable, and keeps the hook body focused on wiring.

No `setTimeout` deliberately — its delay arg is a 32-bit signed int (~24.8d
max), so any timer beyond that fires immediately. The cold-start call +
`AppState 'active'` listener cover every realistic expiry path for a
multi-day max-age.

### 14.2 Recent-auth gate

Inlines the "seconds since last sign-in" check (single call site, no need
for a separate file). Uses `metadata.lastSignInTime` (only updated on
explicit sign-in), not the ID token's `iat` (refreshes hourly).

### `src/features/auth/hooks/use-require-recent-auth.ts`

```ts
import { useCallback } from 'react';
import { toast } from 'sonner-native';

import { firebaseAuth, signOut } from '@/services/firebase';

import { authConfig } from '../config';

// Returns true → caller may proceed with a sensitive action.
// Returns false → caller bails out; we've signed the user out and routed
// back to /sign-in (simpler than building a mid-flow reauth modal).
export const useRequireRecentAuth = () =>
  useCallback(async (): Promise<boolean> => {
    const lastSignInTime = firebaseAuth.currentUser?.metadata.lastSignInTime;
    if (!lastSignInTime) return false;

    const secondsSinceLastSignIn = Math.floor(
      (Date.now() - new Date(lastSignInTime).getTime()) / 1000,
    );
    if (secondsSinceLastSignIn <= authConfig.recentAuthMaxAgeSec) return true;

    toast.info('Please sign in again to continue.');
    await signOut();
    return false;
  }, []);
```

---

## 15. Biometric lock

### 15.1 Config + store

### `src/features/biometric-lock/config.ts`

```ts
export const biometricLockConfig = {
  // Re-lock if the app was backgrounded longer than this. Briefly switching to
  // another app (copy an OTP) shouldn't force a re-unlock.
  lockAfterBackgroundMs: 30_000,
};
```

### `src/features/biometric-lock/store/biometric-lock.store.ts`

```ts
// Direct import from 'zustand' (NOT '@/services'): device-scoped store. The
// opt-in must survive sign-out and account switches. `isLocked` is session
// state but is cleared explicitly by useBiometricLock when auth ends.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { createPersistMigrator, zustandStorage } from '@/services';

type BiometricLockState = {
  isEnabled: boolean; // user opted in from settings
  isLocked: boolean; // current gate state — not persisted
  setEnabled: (enabled: boolean) => void;
  lock: () => void;
  unlock: () => void;
};

export const useBiometricLockStore = create<BiometricLockState>()(
  persist(
    (set) => ({
      isEnabled: false,
      isLocked: false,
      setEnabled: (isEnabled) => set({ isEnabled }),
      lock: () => set({ isLocked: true }),
      unlock: () => set({ isLocked: false }),
    }),
    {
      name: 'biometric-lock',
      storage: createJSONStorage(() => zustandStorage),
      // Append a migration here when the persisted shape changes. See
      // createPersistMigrator rules in §2.4.
      ...createPersistMigrator<Partial<BiometricLockState>>([]),
      // isLocked is session-only; only persist the opt-in preference.
      partialize: (state) => ({ isEnabled: state.isEnabled }),
    },
  ),
);
```

### 15.2 Availability + authentication

### `src/features/biometric-lock/hooks/use-biometric-availability.ts`

```ts
import { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export const useBiometricAvailability = () => {
  const [availability, setAvailability] = useState<'checking' | 'available' | 'unavailable'>(
    'checking',
  );

  useEffect(() => {
    const checkBiometricAvailability = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setAvailability(hasHardware && isEnrolled ? 'available' : 'unavailable');
    };
    checkBiometricAvailability();
  }, []);

  return availability;
};
```

### `src/features/biometric-lock/services/authenticate-with-biometrics.ts`

```ts
import * as LocalAuthentication from 'expo-local-authentication';

export const authenticateWithBiometrics = async (): Promise<boolean> => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock to continue',
    fallbackLabel: 'Use passcode',
    // Allow device passcode fallback so users aren't locked out when
    // biometrics fail (wet finger, sunglasses, etc.).
    disableDeviceFallback: false,
    cancelLabel: 'Cancel',
  });
  return result.success;
};
```

### 15.3 Lock coordinator

### `src/features/biometric-lock/hooks/use-biometric-lock.ts`

```ts
import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { useIsAuthenticated } from '@/features/auth';

import { biometricLockConfig } from '../config';
import { useBiometricLockStore } from '../store/biometric-lock.store';

export const useBiometricLock = () => {
  const isAuthenticated = useIsAuthenticated();
  const { isEnabled, lock, unlock } = useBiometricLockStore(
    useShallow((state) => ({
      isEnabled: state.isEnabled,
      lock: state.lock,
      unlock: state.unlock,
    })),
  );

  // Synchronous decision values — no render needed.
  const backgroundedAtTimestamp = useRef<number | null>(null);
  // Tracks whether the initial lock has fired inside the current
  // (isAuthenticated && isEnabled) window. Reset when the window closes so
  // the lock re-arms on next sign-in / settings toggle-on.
  const hasFiredInitialLock = useRef(false);

  // Locking ONLY on the false→true transition is load-bearing: a naive
  // "lock if conditions are met" runs on every effect re-render and would
  // re-lock the user immediately after a successful Face ID, on any unrelated
  // re-render (token refresh, hot reload, store rehydration).
  useEffect(() => {
    if (!isAuthenticated || !isEnabled) {
      // Sign-out OR feature disabled → drop the lock and re-arm the flag.
      unlock();
      hasFiredInitialLock.current = false;
      return;
    }
    if (!hasFiredInitialLock.current) {
      lock();
      hasFiredInitialLock.current = true;
    }
  }, [isAuthenticated, isEnabled, lock, unlock]);

  useEffect(() => {
    if (!isAuthenticated || !isEnabled) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Track ONLY 'background'. Treat 'inactive' as transient — on iOS it
      // fires for Notification Center, Control Center, incoming calls, the
      // app-switcher. Locking on 'inactive' would hit Face ID every time the
      // user pulls down the status bar. ('inactive' isn't emitted on Android.)
      if (nextAppState === 'background') {
        backgroundedAtTimestamp.current = Date.now();
        return;
      }
      if (nextAppState === 'active' && backgroundedAtTimestamp.current !== null) {
        const millisecondsAway = Date.now() - backgroundedAtTimestamp.current;
        backgroundedAtTimestamp.current = null;
        if (millisecondsAway >= biometricLockConfig.lockAfterBackgroundMs) lock();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isAuthenticated, isEnabled, lock]);
};
```

### 15.4 Overlay

### `src/features/biometric-lock/components/biometric-lock-overlay.tsx`

```tsx
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { PressableScale } from 'pressto';

import { authenticateWithBiometrics } from '../services/authenticate-with-biometrics';
import { useBiometricLockStore } from '../store/biometric-lock.store';

import { styles } from './biometric-lock-overlay.styles';

export const BiometricLockOverlay = () => {
  const isLocked = useBiometricLockStore((state) => state.isLocked);
  const unlock = useBiometricLockStore((state) => state.unlock);

  // Guards against duplicate prompts during fast background→foreground cycles
  // or quick parent re-renders (queues a second native sheet on Android).
  const isPromptingBiometrics = useRef(false);

  const promptForBiometricsOnce = async () => {
    if (isPromptingBiometrics.current) return;
    isPromptingBiometrics.current = true;
    try {
      const wasAuthenticated = await authenticateWithBiometrics();
      if (wasAuthenticated) unlock();
    } finally {
      isPromptingBiometrics.current = false;
    }
  };

  // Auto-prompt when locked so the user doesn't stare at a manual button.
  // If they cancel, retry by tapping the overlay.
  useEffect(() => {
    if (isLocked) promptForBiometricsOnce();
  }, [isLocked]);

  if (!isLocked) return null;

  return (
    <View style={styles.overlay}>
      <PressableScale onPress={promptForBiometricsOnce} style={styles.button} />
    </View>
  );
};
```

### `src/features/biometric-lock/components/biometric-lock-overlay.styles.ts`

```ts
import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  button: {
    width: 120,
    height: 120,
  },
}));
```

`useBiometricLock()` reads `useIsAuthenticated()` internally and bails when
not signed in, so it's safe to mount at the root regardless of which
`(auth)` / `(main)` branch is rendered.

---

## 16. Secure storage strategy

| Data                              | Storage                                       | Rationale                                            |
| --------------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| Firebase user + refresh token     | Keychain / Keystore (RNFirebase)              | Built-in, hardware-backed                            |
| ID token (1h JWT)                 | In-memory (RNFirebase)                        | Never persisted; refreshed on demand                 |
| `sessionStartedAt`, cached `user` | MMKV via Zustand `persist`                    | Cache only; loss = re-login (safe failure)           |
| `biometric-lock.isEnabled`        | MMKV via Zustand `persist`                    | User preference, not a secret                        |
| OAuth client IDs                  | `.env.local` / EAS Secrets → `extra` (bundle) | Public by design — Google verifies bundle ID + SHA-1 |

**`expo-secure-store` is not used.** Core rule: **Firebase owns the secrets;
we cache only what's safe to leak.** A future feature with genuinely
sensitive on-device data (custom server token, local PIN) would add
`src/services/secure-store/` using the same one-file-per-action convention.

MMKV is **not encrypted** — nothing we store is sensitive, and managing an
encryption key ourselves would add an async boot step that blocks the splash.

---

## 17. Migration

### 17.1 Files replaced / deleted

- `src/features/auth/store/auth.store.ts` — rewritten
- `src/features/auth/hooks/use-sign-in-form.ts` — rewritten (removes `MOCK_USER`)
- `src/features/auth/api/` — deleted
- `src/components/apple-button/` — deleted, replaced by native button (§10).
  Drop in the same commit:
  - `src/assets/icons/apple_icon.svg`
  - `theme.colors.appleButton` in `src/theme/colors.ts` (light + dark) and `src/theme/types.ts`
  - `APPLE_BUTTON_*` enums in `src/constants/social-buttons.ts`
- `src/components/google-button/` — kept (compliant with Google's policy).

### 17.2 External setup

**Firebase Console**

1. Add iOS + Android apps; download `GoogleService-Info.plist` and `google-services.json`.
2. Authentication → enable Email/Password, Apple, Google.
3. Firestore → production mode → apply this rule:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      function isOwner() {
        return request.auth != null && request.auth.uid == uid;
      }

      // Anything outside this whitelist is rejected — defense-in-depth
      // against a future field we forget to validate.
      function hasAllowedKeysOnly() {
        return request.resource.data.keys().hasOnly(
          ['uid', 'email', 'displayName', 'photoURL',
           'role', 'provider', 'createdAt', 'updatedAt']
        );
      }

      allow read: if isOwner();

      // role pinned to 'user'; timestamps must be server-stamped (so a client
      // can't backdate createdAt); uid must match the doc path.
      allow create: if isOwner()
                    && hasAllowedKeysOnly()
                    && request.resource.data.uid == uid
                    && request.resource.data.role == 'user'
                    && request.resource.data.createdAt == request.time
                    && request.resource.data.updatedAt == request.time;

      // role / provider / createdAt are immutable client-side.
      allow update: if isOwner()
                    && hasAllowedKeysOnly()
                    && request.resource.data.role      == resource.data.role
                    && request.resource.data.provider  == resource.data.provider
                    && request.resource.data.createdAt == resource.data.createdAt
                    && request.resource.data.updatedAt == request.time;

      // Account deletion goes through a Cloud Function / admin tool using
      // the Admin SDK (which bypasses rules).
      allow delete: if false;
    }
  }
}
```

Role promotion happens out-of-band: Firebase Console for dev, Cloud Function
or admin endpoint with the Admin SDK in production. Long-term upgrade path:
move role into Firebase **custom claims** (read from `request.auth.token.role`
in rules) — claims live inside the ID token, no extra Firestore read needed.

**Apple Developer**

- App ID → enable "Sign in with Apple"
- Firebase Console → Apple provider → configure Service ID + key

**Google Cloud Console**

- Three OAuth 2.0 client IDs (Web / iOS / Android) **per variant**.
- Android: register SHA-1 of debug + release keystores per variant.
- Authorize redirect URI `<APP_SCHEME>:/oauthredirect`.
- Local: paste dev client IDs into `.env.local`. CI/EAS: register prod IDs as
  EAS Secrets.

### 17.3 `.gitignore`

```
firebase/dev/GoogleService-Info.plist
firebase/dev/google-services.json
firebase/prod/GoogleService-Info.plist
firebase/prod/google-services.json

.env.local
.env.*.local
```

Commit `.example` variants of each so new devs know the file shape.

### 17.4 Local build

Populate `.env.local`, then:

```bash
APP_VARIANT=development pnpm expo prebuild --clean
APP_VARIANT=development pnpm ios
APP_VARIANT=development pnpm android
```

For prod local builds, swap `APP_VARIANT` and ensure the matching client IDs
are present in your env (or pull EAS Secrets via `eas env:pull`).

**Expo Go cannot run this app** (already true due to MMKV/Nitro — no new
constraint).

### 17.5 Verification checklist

1. Cold start → splash → lands on `/sign-in` when unauthenticated.
2. Email sign-in (new email) → "Account created. Welcome!" → `/(main)` → Firestore `users/{uid}` exists with `role: 'user'`.
3. Email sign-in (existing email) → silent → `/(main)`.
4. Email sign-in (wrong password) → "Email or password is incorrect." (doesn't disclose existence).
5. Apple → native sheet → first-time `displayName` populated from Apple.
6. Google → system sheet (iOS) / Custom Tabs (Android) → signed in.
7. Dismiss Apple/Google sheet → silent (no toast).
8. Force-quit + relaunch → still signed in (no `/sign-in` flash).
9. Temporarily set `sessionMaxAgeMs = 60_000`, restart Metro, wait 60 s → auto sign-out. Revert.
10. Opt into biometric lock → background >30 s → reopen → lock overlay → Face ID unlocks.
11. Sign out → Zustand stores reset; biometric `isEnabled` preserved; Firestore doc remains.

### 17.6 Rollback

The mock store is recoverable via `git revert` of migration commits. Firebase
project can stay unused at no cost. Disable biometric-lock feature-wide by
removing `useBiometricLock()` and `<BiometricLockOverlay/>` from
`app/_layout.tsx` — store and hooks remain inert.

---

## 18. Out of scope

- **Password reset** — `forgot-password.tsx` stays a placeholder.
  `sendPasswordResetEmail` is trivial to wire later.
- **Email verification enforcement** — policy decision deferred. Field is
  reliable on `AuthUser.isEmailVerified` for whenever a verification screen ships.
- **Account linking** (same email across providers) — Firebase supports it;
  deserves its own UX spec.
- **Custom REST backend** — `@/api/` reappears with an interceptor attaching
  `firebaseAuth.currentUser?.getIdToken()`.
- **Role promotion UI / custom claims** — admin promotion needs a Cloud
  Function or admin panel.
- **Deep-link post-login return** — re-auth currently lands on `/sign-in`.
- **Idle timeout (policy A)** — only B + C are implemented.
- **Staging variant** — fork the `production` entry in `app.config.ts`'s
  `variants` record when you actually need it; no point shipping it dormant.
- **Firebase App Check** — recommended pre-launch. DeviceCheck (iOS) + Play
  Integrity (Android); blocks spoofed clients. One config-plugin step away.
- **Crash / error reporting** — `__DEV__ && console.warn` sites in
  `hydrateFromFirebase` and Apple post-sign-in are placeholders for
  Sentry / Crashlytics.

---

## 19. Implementation roadmap

Six steps, each PR-sized, independently revertable. Tick the boxes as you
go; do not start the next step until the previous step's **Verify** items
all pass. Section refs in parentheses point back to the design content.

**Step ordering.** Step-1 → Step-2 is independent of Firebase setup, so they
unblock the UX review without external dependencies. Step-3 → Step-4 →
Step-5 is the auth feature itself, gated by Firebase Console setup
(Step-3) and feature dependencies (Step-4 before Step-5 because
biometric-lock reads `useIsAuthenticated`). Step-6 is post-MVP — don't block
launch on it.

### Step-1 — Foundation

**Code changes**

- [ ] Create `app.config.ts` at repo root with the variant scaffolding from
      §3.1 — but **omit** Firebase plugins, `expo-build-properties`,
      `ios.googleServicesFile`, `android.googleServicesFile`, and the
      `googleWebClientId` / `googleIosClientId` / `googleAndroidClientId`
      entries in `extra`. They land in Step-3.
- [ ] Delete `app.json` in the same commit.
- [ ] Confirm `firebase/dev/` and `firebase/prod/` exist (already scaffolded).
- [ ] Confirm `.gitignore` includes the firebase plist/json + `.env*.local`
      lines (already present after the staging cleanup).
- [ ] Confirm `.env.local.example` matches the trimmed shape from §3.1 (no
      staging entries).

**Local setup**

- [ ] Copy `.env.local.example` → `.env.local`.
- [ ] Set `BUNDLE_PREFIX`, `APP_NAME`, `APP_SCHEME`, `APP_VARIANT=development`.
      Leave `DEV_GOOGLE_*` empty for now.

**Verify**

- [ ] `pnpm start` boots the app exactly as before.
- [ ] `pnpm expo prebuild --clean` completes with no errors.
- [ ] iOS / Android native projects show the new `BUNDLE_PREFIX.dev` bundle ID.

---

### Step-2 — Native Apple button

**Install**

- [ ] `pnpm expo install expo-apple-authentication`
- [ ] Add `'expo-apple-authentication'` to `plugins` in `app.config.ts`.
- [ ] Add `ios.usesAppleSignIn: true` in `app.config.ts`.

**Code changes**

- [ ] Replace `<AppleButton/>` in `src/features/auth/screens/sign-in/sign-in.tsx`
      with the native `<AppleAuthenticationButton/>` component from §10.
      `onPress` keeps calling the existing stub from `useSignInForm`.

**Delete (same commit)**

- [ ] `src/components/apple-button/`
- [ ] `src/assets/icons/apple_icon.svg`
- [ ] `theme.colors.appleButton` from `src/theme/colors.ts` (light + dark)
      and `src/theme/types.ts`.
- [ ] `APPLE_BUTTON_LABELS`, `APPLE_BUTTON_DIMENSIONS`, `APPLE_BUTTON_SHAPES`
      from `src/constants/social-buttons.ts`.

**Verify**

- [ ] `pnpm expo prebuild --clean && pnpm ios` builds.
- [ ] iOS: native button renders in light AND dark theme; remounts with the
      correct color when theme switches.
- [ ] Android: nothing renders where the Apple button was (`IS_IOS` gate).
- [ ] Tapping the button still hits the existing mock-auth stub — no
      regression.

---

### Step-3 — Firebase services layer

**External setup (do FIRST, before any code)**

- [ ] Firebase Console: create a **dev** project. Add iOS app (bundle ID =
      `${BUNDLE_PREFIX}.dev`) and Android app (package = same). Download
      `GoogleService-Info.plist` → `firebase/dev/`,
      `google-services.json` → `firebase/dev/`.
- [ ] Firebase Console → Authentication: enable **Email/Password**, **Apple**,
      **Google**.
- [ ] Firebase Console → Firestore: create database in **production mode** and
      apply the rules from §17.2.
- [ ] Apple Developer: enable "Sign in with Apple" on the App ID. In
      Firebase Console → Apple provider, configure Service ID + key via the
      wizard.
- [ ] Google Cloud Console: create three OAuth 2.0 client IDs (Web, iOS,
      Android). Android: register SHA-1 of the debug keystore
      (`./gradlew signingReport`). Authorize redirect URI
      `<APP_SCHEME>:/oauthredirect` on the Web client.
- [ ] Paste the three dev client IDs into `.env.local`
      (`DEV_GOOGLE_WEB_CLIENT_ID`, `DEV_GOOGLE_IOS_CLIENT_ID`,
      `DEV_GOOGLE_ANDROID_CLIENT_ID`).

**Install deps**

- [ ] `pnpm expo install @react-native-firebase/app@^24
    @react-native-firebase/auth@^24 @react-native-firebase/firestore@^24
    expo-auth-session expo-crypto expo-build-properties sonner-native`

**Update `app.config.ts`** (now light up the Firebase wiring)

- [ ] Add `'@react-native-firebase/app'` and `'@react-native-firebase/auth'`
      to `plugins`.
- [ ] Add `['expo-build-properties', { ios: { useFrameworks: 'static' } }]`
      to `plugins`.
- [ ] Set `ios.googleServicesFile` and `android.googleServicesFile` to the
      per-variant paths from §3.1.
- [ ] Populate `extra.googleWebClientId` / `googleIosClientId` /
      `googleAndroidClientId` from the variant record.

**Update `src/services/store.ts`**

- [ ] Add `createPersistMigrator` per §2.4. Re-export from
      `src/services/index.ts`.

**Create `src/services/firebase/`** (one file per action; nothing outside this
folder imports `@react-native-firebase/*` yet)

- [ ] `init.ts` (§3.2)
- [ ] `oauth-config.ts` (§3.3)
- [ ] `types.ts` (§8.1)
- [ ] `errors.ts` (§9)
- [ ] `user-profile.ts` (§8.2)
- [ ] `sign-in-with-email.ts` (§6.1)
- [ ] `sign-in-with-apple.ts` (§10)
- [ ] `sign-in-with-google.ts` (§11)
- [ ] `sign-out.ts` (§6.4)
- [ ] `index.ts` (barrel — §8.3)

**Verify**

- [ ] `pnpm expo prebuild --clean` succeeds.
- [ ] `pnpm ios` and `pnpm android` build green.
- [ ] App still boots, mock auth still drives the UI.
- [ ] (Optional smoke test) From a temporary dev-only screen, import
      `signInWithEmail` from `@/services/firebase` and call it with a fresh
      email — should hit Firebase, write a `users/{uid}` Firestore doc, and
      return `true`. Roll back the dev screen before merging.

---

### Step-4 — Auth feature rewrite

**Add files**

- [ ] `src/features/auth/config.ts` (§3.4)
- [ ] `src/features/auth/types.ts` (§7.1)
- [ ] `src/features/auth/utils/merge-auth-user.ts` (§7.2)
- [ ] `src/features/auth/utils/firebase-error-message.ts` (§6.3)
- [ ] `src/features/auth/hooks/use-auth-session.ts` (§4)
- [ ] `src/features/auth/hooks/use-social-sign-in.ts` (§12)
- [ ] `src/features/auth/hooks/use-session-expiry-watchdog.ts` (§14.1)
- [ ] `src/features/auth/hooks/use-require-recent-auth.ts` (§14.2)

**Rewrite files**

- [ ] `src/features/auth/store/auth.store.ts` (§13) — replaces the mock store.
- [ ] `src/features/auth/hooks/use-auth.ts` (§7.3) — selectors only; drops
      mock state.
- [ ] `src/features/auth/hooks/use-sign-in-form.ts` (§6.2) — drops `MOCK_USER`,
      wires real `signInWithEmail`.
- [ ] `src/features/auth/index.ts` (§5) — public API surface.

**Delete**

- [ ] `src/features/auth/api/` (entire folder).

**Wire into the app**

- [ ] Add `SplashScreen.preventAutoHideAsync()` to project-root `index.ts`
      per §4.
- [ ] Rewrite `app/_layout.tsx` per §4 — calls `useAuthSession()`,
      `useSessionExpiryWatchdog()`, gates on `useIsSessionReady()`, uses
      `<Stack.Protected>` with `useIsAuthenticated()`.
- [ ] Update sign-in screen to bind `useSignInForm` to the form fields and
      `useSocialSignIn` to the Apple + Google buttons.

**Verify** (§17.5 items 1–9)

- [ ] 1. Cold start unauthenticated → splash → `/sign-in`.
- [ ] 2. Email sign-in with **new** email → "Account created. Welcome!" toast
     → `/(main)`. Firestore `users/{uid}` exists with `role: 'user'`.
- [ ] 3. Email sign-in with **existing** email → silent → `/(main)`.
- [ ] 4. Email sign-in with **wrong password** → "Email or password is
     incorrect." (does not disclose existence).
- [ ] 5. Apple → native sheet → first-time `displayName` populated from Apple.
- [ ] 6. Google → system sheet (iOS) / Custom Tabs (Android) → signed in.
- [ ] 7. Dismiss Apple/Google sheet → silent (no toast).
- [ ] 8. Force-quit + relaunch → still signed in (no `/sign-in` flash).
- [ ] 9. Temporarily set `sessionMaxAgeMs = 60_000` in `auth/config.ts`,
     restart Metro, wait 60 s in foreground → auto sign-out. **Revert.**

---

### Step-5 — Biometric lock

**Install**

- [ ] `pnpm expo install expo-local-authentication`
- [ ] Add `'expo-local-authentication'` to `plugins` in `app.config.ts`.

**Add files**

- [ ] `src/features/biometric-lock/config.ts` (§15.1)
- [ ] `src/features/biometric-lock/store/biometric-lock.store.ts` (§15.1)
- [ ] `src/features/biometric-lock/services/authenticate-with-biometrics.ts` (§15.2)
- [ ] `src/features/biometric-lock/hooks/use-biometric-availability.ts` (§15.2)
- [ ] `src/features/biometric-lock/hooks/use-biometric-lock.ts` (§15.3)
- [ ] `src/features/biometric-lock/components/biometric-lock-overlay.tsx` (§15.4)
- [ ] `src/features/biometric-lock/components/biometric-lock-overlay.styles.ts` (§15.4)
- [ ] `src/features/biometric-lock/index.ts` — exports
      `BiometricLockOverlay`, `useBiometricLock`, `useBiometricLockStore`,
      `useBiometricAvailability`.

**Wire into the app**

- [ ] In `app/_layout.tsx`: call `useBiometricLock()` alongside the other
      side-effect hooks; render `<BiometricLockOverlay />` as a sibling to
      `<Stack>` (above `<Toaster>`).
- [ ] In your settings screen, add a toggle bound to
      `useBiometricLockStore((s) => s.setEnabled)`. Gate the toggle on
      `useBiometricAvailability() === 'available'`.

**Verify** (§17.5 items 10–11)

- [ ] 10. Opt into the lock from settings → background app for >30 s →
      reopen → lock overlay paints → Face ID / Touch ID / passcode unlocks.
- [ ] 11. Sign out from settings → all session-scoped Zustand stores reset;
      `biometric-lock.isEnabled` is preserved across the sign-out;
      Firestore `users/{uid}` doc remains.

---

### Step-6 — Production hardening _(post-launch, optional)_

**Firebase / external**

- [ ] Repeat the §17.2 runbook for the **prod** Firebase project. Drop the
      prod plist/json into `firebase/prod/`.
- [ ] Register prod OAuth client IDs as EAS Secrets:
      `eas secret:create --scope project --name GOOGLE_WEB_CLIENT_ID --value …`
      (and the iOS / Android variants).
- [ ] In `eas.json`, set `build.production.env.APP_VARIANT = 'production'`.

**App Check**

- [ ] `pnpm expo install @react-native-firebase/app-check`
- [ ] Configure DeviceCheck (iOS) and Play Integrity (Android) providers in
      the package config.
- [ ] Enforce App Check on Authentication + Firestore in the Firebase Console.

**Observability**

- [ ] Install Sentry or Crashlytics.
- [ ] Replace `__DEV__ && console.warn` sites in `auth.store.ts`
      (`hydrateFromFirebase` → `fetchUserProfile failed`),
      `sign-in-with-apple.ts` (post-sign-in housekeeping), and
      `use-session-expiry-watchdog.ts` (`signOut from watchdog failed`)
      with structured `captureException(error, { tags: { … } })` calls.

**Verify**

- [ ] App Check enforcement enabled in the Firebase Console.
- [ ] An emulator / unsigned build is **rejected** by Auth + Firestore.
- [ ] A signed release build is **accepted**.
- [ ] A deliberate `throw new Error('test')` in a dev build appears in the
      crash-reporting dashboard with provider/uid tags.
