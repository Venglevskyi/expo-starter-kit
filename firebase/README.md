# Firebase native config

Per-variant Firebase service files. Files under `dev/` and `prod/` are
gitignored — drop the downloads in here, they don't get committed.

## Required files

For each variant you actually build:

```
firebase/<variant>/GoogleService-Info.plist   # iOS
firebase/<variant>/google-services.json       # Android
```

`app.config.ts` reads these paths per variant. Without them,
`pnpm expo prebuild` fails — that's expected until Step-3 of the
implementation roadmap (§19 of the auth flow spec).

## How to obtain

See spec §17.2 ("External setup") for the full Firebase Console runbook.
Summary:

1. Firebase Console → create one project per variant.
2. Add iOS app (bundle ID matching `app.config.ts`) → download
   `GoogleService-Info.plist`.
3. Add Android app (package matching `app.config.ts`, SHA-1 of debug
   keystore from `gradlew signingReport`) → download `google-services.json`.
4. Drop both files into the matching `firebase/<variant>/` folder.
