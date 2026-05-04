# Firebase + OAuth External Setup

Manual setup required before the Firebase services layer can be wired in.
Do these in order — each section depends on the previous one. All values
shown match the dev variant (`com.expostarter.app.dev`, scheme
`expo-starter-kit`).

---

## 1. Firebase Console (dev project)

https://console.firebase.google.com → **Add project** → name it
`expo-starter-kit-dev` (or similar).

### 1a. Add iOS app

- Project Settings → **Add app** → iOS
- Apple bundle ID: `com.expostarter.app.dev`
- Download `GoogleService-Info.plist` → save to `src/services/firebase/dev/`
- Skip Firebase's "Add Firebase SDK" / "Initialize" steps — those are for
  native Xcode projects. Click **Next → Continue to console**.

### 1b. Add Android app

- **Add app** → Android
- Android package name: `com.expostarter.app.dev`
- Leave the **Debug signing certificate SHA-1** field empty for now (we add
  it in §1d after prebuild)
- Download `google-services.json` → save to `src/services/firebase/dev/`
- Skip the "Add Firebase SDK" step. Click **Next → Continue to console**.

### 1c. Enable Authentication providers

Build → Authentication → Sign-in method → enable:

- **Email/Password**
- **Apple**
- **Google**

### 1d. Add the Android debug SHA-1 (chicken-and-egg)

You need the `android/` folder to run `signingReport`, but `android/` only
exists after prebuild, which needs the JSON files. Order:

```bash
APP_VARIANT=development pnpm expo prebuild --clean
cd android && ./gradlew signingReport
```

Find the block:

```
Variant: debug
Store:   ~/.android/debug.keystore
Alias:   AndroidDebugKey
SHA1:    AB:CD:EF:...
```

Copy the **debug** `SHA1`. Add it in two places:

- Firebase Console → Project Settings → your Android app → **Add fingerprint**
- Google Cloud Console (in §3c below)

After adding, **re-download `google-services.json`** from Firebase (it now
contains the OAuth client linked to the SHA-1) → replace
`src/services/firebase/dev/google-services.json`.

> Release SHA-1 only matters for signed release builds (Play Store / EAS
> production). Defer until production hardening.

### 1e. Create Firestore

Build → Firestore Database → **Create database** → **Production mode** →
pick a region near you.

Rules tab → paste the rules block from the auth-flow spec §17.2 →
**Publish**.

---

## 2. Apple Developer (optional for now)

Required when shipping SiwA on a real device or TestFlight. For local iOS
simulator testing of the email/password flow you can defer this.

- https://developer.apple.com/account → Identifiers → your App ID
  (`com.expostarter.app.dev`) → enable **Sign In with Apple**
- Firebase Console → Authentication → Apple provider → run the wizard
  (Service ID + key). Required only for non-iOS clients (Android / web).
  For pure iOS testing, just enabling the provider in Firebase is enough.

---

## 3. Google Cloud Console — OAuth client IDs

https://console.cloud.google.com — Firebase auto-creates a GCP project;
pick the one matching your Firebase project (`expo-starter-kit-dev`).

APIs & Services → **Credentials** → **Create credentials → OAuth client ID**.
Do this **three times**:

### 3a. Web

- Application type: **Web application**
- Authorized redirect URIs: `expo-starter-kit:/oauthredirect`
- Save → copy **Client ID** → save for §4 as `DEV_GOOGLE_WEB_CLIENT_ID`

### 3b. iOS

- Application type: **iOS**
- Bundle ID: `com.expostarter.app.dev`
- Save → copy **Client ID** → save for §4 as `DEV_GOOGLE_IOS_CLIENT_ID`

### 3c. Android

- Application type: **Android**
- Package name: `com.expostarter.app.dev`
- SHA-1: same one you registered in Firebase §1d
- Save → copy **Client ID** → save for §4 as `DEV_GOOGLE_ANDROID_CLIENT_ID`

---

## 4. Update `.env.local`

Add (or uncomment) these three keys with the IDs from §3:

```bash
DEV_GOOGLE_WEB_CLIENT_ID=xxx.apps.googleusercontent.com
DEV_GOOGLE_IOS_CLIENT_ID=yyy.apps.googleusercontent.com
DEV_GOOGLE_ANDROID_CLIENT_ID=zzz.apps.googleusercontent.com
```

---

## 5. Verify

```bash
ls src/services/firebase/dev/
# expects: GoogleService-Info.plist  google-services.json
```

Confirm `.env.local` has all three `DEV_GOOGLE_*` IDs filled.

When everything above is done, the Firebase services layer step
(RNFirebase install + `src/services/firebase/`) is unblocked.
