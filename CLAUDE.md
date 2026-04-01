# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start          # Start Expo dev server
pnpm ios            # Run on iOS simulator
pnpm android        # Run on Android emulator
pnpm web            # Run in browser
pnpm lint           # Run ESLint
```

**Always use `pnpm`** — not npm or yarn.

Pre-commit hooks run `lint-staged` automatically via Husky (ESLint + Prettier on staged files).

## Architecture

**Expo Router** with file-based routing. All screens live in `src/app/`. The `@/*` path alias maps to `src/`.

**React 19 + React Native 0.83**, TypeScript strict mode, typed routes enabled (`app.json` → `experiments.typedRoutes`), React Compiler enabled.

### Component Pattern

Screens and components follow a three-hook separation enforced by VS Code snippets:

```
MyScreen.tsx          ← renders UI, composes hooks
useMyScreenStyles.ts  ← StyleSheet.create, returns styles
useMyScreenLogic.ts   ← state, handlers, business logic
```

Inside a component file this looks like:

```tsx
const MyScreen: React.FC = () => {
  const styles = useStyles();
  const logic = useLogic();
  // ...
};
```

### State Management

Zustand stores. Imports use the `@core-store` alias (configure this alias once you set up the store directory).

### Snippets (VS Code)

- `csc` — create screen
- `cc` — create component
- `clc` — create layout
- `ish` / `ush` — create/use styles hook
- `ilh` / `ulh` — create/use logic hook
- `czs` — create Zustand store
