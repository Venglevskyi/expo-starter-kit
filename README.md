# Expo Starter Kit

Opinionated Expo SDK 55 template with Firebase Auth (email + Google + Apple),
Zustand + TanStack Query, Unistyles v3, and a flat-modular feature
architecture.

## Forking this template

If you're starting a new app from this repo, read
[`docs/template-setup.md`](./docs/template-setup.md) first — it walks through
every value you need to change (bundle IDs, Firebase config, OAuth client IDs,
Apple Sign In, EAS).

## Local development

```bash
pnpm install
cp .env.local.example .env.local   # fill in values per docs/template-setup.md
pnpm expo prebuild --clean         # only needed once, or after native config changes
pnpm ios                           # or: pnpm android
```

Common scripts:

| Script            | Purpose                                 |
| ----------------- | --------------------------------------- |
| `pnpm start`      | Metro dev server (`--reset-cache`)      |
| `pnpm ios`        | Build & run iOS dev client              |
| `pnpm android`    | Build & run Android dev client          |
| `pnpm web`        | Run web target                          |
| `pnpm lint`       | ESLint (flat config + Prettier)         |
| `pnpm deps:check` | Check Expo SDK dependency compatibility |
| `pnpm deps:align` | Auto-align mismatched Expo deps         |

No test runner is configured yet.

## Project layout

Flat-modular: each feature under `src/features/<name>/` is self-contained
(`api`, `components`, `hooks`, `screens`, `store`). Files in `src/app/` only
re-export screens; routing lives there, business logic does not.

See [`CLAUDE.md`](./CLAUDE.md) and [`.claude/rules/`](./.claude/rules) for the
full architecture and coding rules.

## Documentation

- [`docs/template-setup.md`](./docs/template-setup.md) — what to change when
  forking the template.
- [`docs/superpowers/specs/`](./docs/superpowers/specs) — feature specs
  (currently: Firebase auth flow, Firebase external setup runbook).
