# Project Architecture: Flat-Modular React Native (Expo)

## Architecture Overview

This project follows a **Flat-Modular** architecture to ensure scalability and AI-readiness. The core idea is that features are self-contained modules that provide ready-to-use screens to the router.

- **src/api/**: Global networking setup (Axios client, QueryClient config).
- **src/app/**: Expo Router navigation. Contains only routes and root layouts.
- **src/assets/**: Static assets. Subfolders: `icons/`, `images/`.
- **src/components/**: Shared UI library. FLAT structure. No subdirectories.
- **src/constants/**: Static configuration values and hardcoded strings.
- **src/features/**: Domain-driven modules. Each module is self-contained (api, components, hooks, store).
  - `[feature]/screens/`: Entry point components (e.g., `sign-in.tsx`, `settings.tsx`, `profile.tsx`).
  - `[feature]/hooks/`: Business logic, validation, and state coordination (Headless Logic).
  - `[feature]/store/`: Feature-specific state (Zustand).
  - `[feature]/api/`: Feature-specific data fetching (TanStack Query).
  - `[feature]/components/`: Internal UI components used _exclusively_ within this feature.
- **src/hooks/**: Global, cross-feature utility hooks (e.g., `useDebounce`, `useAppState`).
- **src/localization/**: i18n dictionaries and translation setup.
- **src/plugins/**: Expo Config Plugins for native module configuration.
- **src/providers/**: Global context providers and library wrappers (e.g., QueryProvider, AuthProvider). Use this to keep `app/_layout.tsx` clean.
- **src/services/**: External integrations (MMKV, SecureStore, Analytics, Firebase etc.).
- **src/theme/**: Unistyles 3 design system.
  - `unistyles.ts`: Global registry and configuration.
  - `common.ts`: Shared tokens (typo, spacing, radius, etc.).
  - `light.ts` / `dark.ts`: Theme-specific colors and compositions.
- **src/types/**: Global TypeScript interfaces and domain models.
- **src/utils/**: Pure helper functions (formatting, validation, math).

## Tech Stack

- **Framework**: Expo (SDK 55+) with pnpm.
- **State**: Zustand (Local feature state)
- **Data Fetching**: TanStack Query
- **Styling**: Unistyles 3
- **Rules**: Strict TypeScript, ESLint, Prettier, Husky pre-commit hooks.

## Core Principles

### Route Isolation

Files inside `app/` MUST ONLY contain a single-line re-export of a screen from `@/[features]/screens`.

- **Standard Syntax**: `export { default } from '@/[features]/screens/[ScreenName]';`
- **Alternative (if layout is needed)**: Use a minimal functional component.
- **Prohibited**: Do not write JSX, Unistyles, or any business logic inside `app/`. The `app/` folder is strictly for defining the URL structure.
- **Server Routes**: Use `+api.ts` for backend logic (e.g., webhooks, proxying requests, server-side data processing).

_Example:_

```tsx
// app/(auth)/sign-in.tsx
export { default } from '@/feature/screens/sign-in';
```

### Colocation Principle

- **Styles**: Always keep `[Component].styles.ts` in the same folder as the component.
- **Tests**: Keep `__tests__` or `[Component].test.ts` inside the feature/component folder.
- **Local Assets**: If an image or icon is used ONLY by one feature, place it inside `src/features/[name]/assets/`. Use `src/assets/` only for truly global images.

### Dependency Direction

- **Allowed**: `app/` -> `@/[features]` -> `@//components`.
- **Forbidden**: `@/components` importing from `@/features`.

### Cross-Feature Communication

- **Rule**: If Feature A needs to use Logic/API from Feature B, it MUST import it via the Public API (`src/features/B/index.ts`).
- **Restriction**: Deep imports (e.g., `@/features/B/api/internal-func`) are STRCITLY FORBIDDEN to prevent coupling.
- **Shared Logic**: If an API request is used by >3 features and has no clear owner, move it to `@/api`.

### Single Source of Truth for API

- All network requests MUST use the centralized client from `@/api/client.ts`.
- Avoid direct `fetch` or `axios` calls without the configured client to ensure interceptors and auth headers are always applied.
