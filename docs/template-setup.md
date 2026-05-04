# Template setup

Checklist for forking this repo into a new app. Work through it top-to-bottom —
later steps depend on earlier ones (e.g. Google OAuth needs the bundle ID
already set).

## 1. Rebrand identifiers

All app-level identifiers are driven by environment variables and read in
[`app.config.ts`](../app.config.ts). Copy `.env.local.example` to `.env.local`
and edit:

| Variable        | Example                    | Used for                                                                              |
| --------------- | -------------------------- | ------------------------------------------------------------------------------------- |
| `BUNDLE_PREFIX` | `com.acme.app`             | iOS `bundleIdentifier` and Android `package`. Dev variant appends `.dev` (see below). |
| `APP_NAME`      | `Acme`                     | Display name under the icon. Dev variant appends ` (dev)`.                            |
| `APP_SCHEME`    | `acme`                     | Deep-link scheme and OAuth redirect: `acme:/oauthredirect`.                           |
| `APP_VARIANT`   | `development`/`production` | Selects which firebase config and OAuth client IDs to load.                           |

Resulting identifiers:

| Variant       | Bundle ID / Package | Display name |
| ------------- | ------------------- | ------------ |
| `development` | `com.acme.app.dev`  | `Acme (dev)` |
| `production`  | `com.acme.app`      | `Acme`       |

The two variants exist so you can install dev and prod side-by-side on the same
device.

### EAS project ID

`app.config.ts` ships with the template's EAS project ID hardcoded. After
running `eas init` for your own project, replace:

```ts
// app.config.ts
extra: {
  eas: { projectId: 'YOUR_NEW_EAS_PROJECT_ID' },
}
```

## 2. Firebase native config

Firebase Auth and Firestore are wired through `@react-native-firebase`, which
needs platform config files generated in the Firebase Console.

1. Firebase Console → create **one project per variant** (`acme-dev`,
   `acme-prod`). Mixing variants in one project is possible but discouraged —
   you lose per-environment isolation of users and analytics.
2. In each project, register both apps:
   - **iOS app** with bundle ID matching the variant (`com.acme.app.dev` or
     `com.acme.app`) → download `GoogleService-Info.plist`.
   - **Android app** with the same package name. Provide the SHA-1 of your
     debug keystore (run `cd android && ./gradlew signingReport` after
     prebuild) → download `google-services.json`.
3. Drop the files into the matching variant folder:

   ```
   src/services/firebase/dev/GoogleService-Info.plist
   src/services/firebase/dev/google-services.json
   src/services/firebase/prod/GoogleService-Info.plist
   src/services/firebase/prod/google-services.json
   ```

These paths are gitignored — never commit them.

4. In the Firebase Console, enable the auth providers you need:
   **Authentication → Sign-in method → Email/Password, Google, Apple**.

## 3. Google OAuth client IDs

The Google sign-in SDK needs three client IDs from the same Firebase project's
linked Google Cloud Console (**APIs & Services → Credentials**):

| Variable                       | Type                 | Where to find                                                |
| ------------------------------ | -------------------- | ------------------------------------------------------------ |
| `DEV_GOOGLE_WEB_CLIENT_ID`     | OAuth Web client     | Auto-created by Firebase as "Web client (auto created…)"     |
| `DEV_GOOGLE_IOS_CLIENT_ID`     | OAuth iOS client     | Auto-created when you registered the iOS app in Firebase     |
| `DEV_GOOGLE_ANDROID_CLIENT_ID` | OAuth Android client | Auto-created when you registered the Android app in Firebase |

Production variants drop the `DEV_` prefix:
`GOOGLE_WEB_CLIENT_ID`, `GOOGLE_IOS_CLIENT_ID`, `GOOGLE_ANDROID_CLIENT_ID`.

For CI/EAS Build, store these as **EAS Secrets** (`eas secret:create`) — the
template reads `process.env.*` regardless of where the value comes from.

The iOS client ID is reverse-DNS'd at build time
([`app.config.ts`](../app.config.ts) → `reverseGoogleClientId`) and registered
as a URL scheme by the `@react-native-google-signin/google-signin` config
plugin. You don't need to set this manually.

## 4. Apple Sign In

iOS only. Two requirements:

1. In your Apple Developer account, enable the **Sign In with Apple**
   capability for the bundle ID(s) you registered.
2. In Firebase Console → Authentication → Sign-in method → Apple, paste your
   Services ID and key. (Required only if you also need Apple sign-in on web —
   on iOS the native flow uses the bundle ID directly.)

`expo-apple-authentication` is already configured in `app.config.ts`; nothing
to change in code.

## 5. Build & run

After steps 1–4:

```bash
pnpm install
pnpm expo prebuild --clean    # regenerates ios/ and android/ with your IDs
pnpm ios                      # or: pnpm android
```

Prebuild fails fast if any of the `googleServicesFile` paths are missing —
that's intentional. Fix step 2 and re-run.

## 6. What to change in source code

The starter ships with several template-specific values you'll likely want to
swap. None of them block builds, but they're worth a pass before shipping:

| File                                       | What to change                                        |
| ------------------------------------------ | ----------------------------------------------------- |
| [`app.config.ts`](../app.config.ts)        | `slug` (`expo-starter-kit`), `version`, EAS projectId |
| `assets/images/`                           | App icon, adaptive icon, splash, favicon              |
| [`src/theme/`](../src/theme)               | Colors, typography, spacings to match your brand      |
| [`src/localization/`](../src/localization) | Add/remove locales as needed                          |

## Quick reference: where each value lives

```
app.config.ts                 ← BUNDLE_PREFIX, APP_NAME, APP_SCHEME, EAS projectId
.env.local                    ← All env vars (gitignored)
.env.local.example            ← Template for the above (commit this, edit names only if you rename a variable)
src/services/firebase/<variant>/   ← Per-variant Firebase native config (gitignored)
src/services/firebase/oauth-config.ts   ← Reads OAuth client IDs from Constants.expoConfig.extra
src/features/auth/config.ts   ← Session lifetime, recent-auth window
```
