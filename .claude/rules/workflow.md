# Workflow & Project Standards

## Dependency Management

- **Primary Command**: Always use `npx expo install` for adding, updating, or installing any packages in this project.
- **Reasoning**: This ensures that all dependencies are compatible with the current Expo SDK version (automatic compatibility checks).
- **Prohibited Commands**: Do not use `npm install`, `yarn add`, or `pnpm add` for installing project dependencies unless it is a global tool or explicitly required.
- **Maintenance**: If you detect version mismatches, suggest running `npx expo install --check`.

### Imports & Path Aliasing

- **Rule**: ALWAYS use the `@/` alias for all internal imports.
- **Root**: `@/` points to the `src/` directory (and sometimes `app/` depending on tsconfig).
- **Prohibited**: Do not use relative paths (e.g., `../../components`).

### Naming Conventions

- **Rule**: ALWAYS use `kebab-case` for all files and directories.
- **Consistency**: This aligns with Expo SDK 55 standards and ensures cross-platform compatibility.
- **Examples**:
  - `@/features/auth/login-form.tsx`
  - `@/theme/light-theme.ts`
  - `@/components/primary-button.tsx`
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
