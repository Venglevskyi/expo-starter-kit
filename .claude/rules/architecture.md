# Project Architecture: Flat-Modular React Native (Expo)

## Architecture Overview

This project follows a **Flat-Modular** architecture to ensure scalability and AI-readiness.

- **src/api/**: Global networking setup (Axios client, QueryClient config).
- **src/app/**: Expo Router navigation. Contains only routes and root layouts.
- **src/assets/**: Static assets. Subfolders: `icons/`, `images/`.
- **src/components/**: Shared UI library. FLAT structure. No subdirectories.
- **src/constants/**: Static configuration values and hardcoded strings.
- **src/features/**: Domain-driven modules. Each module is self-contained (api, components, hooks, store).
- **src/hooks/**: Global, cross-feature utility hooks (e.g., `useDebounce`, `useAppState`).
- **src/localization/**: i18n dictionaries and translation setup.
- **src/plugins/**: Expo Config Plugins for native module configuration.
- **src/providers/**: Global context providers and library wrappers (e.g., QueryProvider, AuthProvider). Use this to keep `app/_layout.tsx` clean.
- **src/screens/**: Page orchestrators. Compose features and shared components. No direct business logic.
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

Files inside `app/` MUST ONLY contain a single-line re-export of a screen from `src/screens`.

- **Standard Syntax**: `export { default } from '@/screens/screen-name';`
- **Alternative (if layout is needed)**: Use a minimal functional component.
- **Prohibited**: Do not write JSX, Unistyles, or any business logic inside `app/`. The `app/` folder is strictly for defining the URL structure.
- **Server Routes**: Use `+api.ts` for backend logic (e.g., webhooks, proxying requests, server-side data processing).

_Example:_

```tsx
// app/(auth)/sign-in.tsx
export { default } from '@/screens/sign-in';
```

### Colocation Principle

- **Styles**: Always keep `[Component].styles.ts` in the same folder as the component.
- **Tests**: Keep `__tests__` or `[Component].test.ts` inside the feature/component folder.
- **Local Assets**: If an image or icon is used ONLY by one feature, place it inside `src/features/[name]/assets/`. Use `src/assets/` only for truly global images.

### Dependency Direction

- **Rule**: Higher-level layers can import from lower-level layers, never vice-versa.
- **Valid**: `app/` -> `src/screens` -> `src/features` -> `src/components`.
- **Invalid**: `src/components` importing from `src/features`.
- **Invalid**: `src/features` importing from `src/screens`.

### Single Source of Truth for API

- All network requests MUST use the centralized client from `src/api/client.ts`.
- Avoid direct `fetch` or `axios` calls without the configured client to ensure interceptors and auth headers are always applied.

### Imports & Path Aliasing

- **Rule**: ALWAYS use the `@/` alias for all internal imports.
- **Root**: `@/` points to the `src/` directory (and sometimes `app/` depending on tsconfig).
- **Prohibited**: Do not use relative paths (e.g., `../../components`).

### Naming Conventions

- **Rule**: ALWAYS use `kebab-case` for all files and directories.
- **Consistency**: This aligns with Expo SDK 55 standards and ensures cross-platform compatibility.
- **Examples**:
  - `src/screens/home-screen.tsx` (instead of `HomeScreen.tsx`)
  - `src/features/auth/login-form.tsx`
  - `src/theme/light-theme.ts`
  - `src/components/primary-button.tsx`
- **Special Suffixes**:
  - `+api.ts`: Reserved for Expo API Routes.
  - `+html.tsx`: Reserved for custom root HTML (Expo Web).
  - `+not-found.tsx`: Reserved for 404 screens.
  - `.styles.ts`: Reserved for Unistyles/StyleSheet files.

### Arrow Function Pattern

**Rule**: ALWAYS use arrow functions for all functional components and utility functions.

**Correct:**

```tsx
const SomeComponent = () => {
  return <Slot />;
};

export default SomeComponent;

const someUtility = () => {
  // logic here
};
```

**Incorrect:**

```tsx
export default function SomeComponent() {
  return <Slot />;
}
function someUtility() {
  // logic here
}
```
