# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Start dev server:** `pnpm start` (runs `expo start --reset-cache`)
- **iOS:** `pnpm ios` | **Android:** `pnpm android` | **Web:** `pnpm web`
- **Lint:** `pnpm lint` (uses `expo lint` — flat ESLint config with Prettier integration)
- **Check deps:** `pnpm deps:check` | **Fix deps:** `pnpm deps:align`
- **Reset deps:** `pnpm deps:reset`

No test runner is configured.

## Architecture

This is an Expo SDK 55 React Native app using file-based routing (Expo Router) with React Compiler enabled.

### Entry point

`index.ts` imports Unistyles config (`src/theme/unistyles.ts`) **before** `expo-router/entry` — this order is required.

### Source structure

All source code lives under `src/` with the `@/*` path alias mapped to `./src/*`.

- `src/app/` — Expo Router file-based routes (layout in `_layout.tsx`)
- `src/components/` — UI components, each in its own folder with `Component.tsx`, `types.ts`, and `index.ts`
- `src/theme/` — Unistyles v3 theme system (colors, typography, spacing, radius, shadows, components)
- `src/constants/` — Platform checks (`IS_IOS`/`IS_ANDROID`) and size constants

### Styling: react-native-unistyles v3

Styling uses `react-native-unistyles` v3 with a Babel plugin (`root: 'src'`). Key points:

- Import `StyleSheet` from `react-native-unistyles` (not `react-native`) when you need theme access
- Theme is configured in `src/theme/unistyles.ts` with a single `light` theme
- Create stylesheets with `StyleSheet.create((theme) => ({...}))` to access theme values
- Dynamic styles use function syntax: `styles.container({ variant, size })` with typed parameters
- Theme object shape: `theme.{typo, fonts, colors, radius, shadows, spacings, components}`

### Typography

Uses Poppins (Regular/Medium/SemiBold) and Roboto (Medium) fonts loaded via `expo-font` plugin. Typography variants follow Material Design 3 naming: `display{Large,Medium,Small}`, `headline{...}`, `title{...}`, `body{...}`, `label{...}`.

### Component patterns

- Components use `pressto` for pressable interactions (`PressableScale`, `CustomPressableProps`)
- Props are defined as enums + a `Props` type in `types.ts`
- SVGs are imported as React components via `react-native-svg-transformer`

### Pre-commit

Husky + lint-staged runs ESLint fix and Prettier on staged `.ts/.tsx/.js/.jsx` files.

## Skills

Project-specific Claude skills are available in `.claude/skills/`. Use the `Skill` tool to invoke them when working on related tasks:

- **react-native-unistyles-v3** — always use when writing or modifying styles
- **rn-best-practice** - React Native and Expo best practices for building performant mobile apps

## External skills via plugins

### Expo Skills

Required for EAS, SDK management, and Expo-specific development tasks. Run these commands in the terminal:

```bash
/plugin marketplace add expo/skills
/plugin install expo
```

### Software Mansion Skills

Add this skill to give your AI coding agent accurate, current guidance for Software Mansion's React Native libraries: Reanimated, Gesture Handler, React Native SVG, ExecuTorch, Audio API, and more.
Run these commands in the terminal:

```bash
/plugin marketplace add software-mansion-labs/skills
/plugin install skills@swmansion
/reload-plugins
```

**Internal Instruction for Claude:**
You are operating in an environment that relies on the `expo` and `swmansion` plugins.

1. **Check Status**: Before performing tasks related to build, deploy, and debug Expo and React Native apps accurately and efficiently or Gesture Handler, React Native SVG, ExecuTorch, Audio API, and more verify if these tools are available.
2. **Prompt User**: If the tools are missing, explicitly ask the user to run the installation commands listed above.
3. **Avoid Fallbacks**: Do not attempt to guess native configurations if the specialized skills from these plugins can provide accurate data.

## Rules

Project rules are stored in `.claude/rules/`. These are **mandatory** constraints that apply to all code changes. Claude must validate all output against these rules

## Execution Protocol

1. Check `.claude/rules/`
2. Identify relevant Skill
3. Follow existing patterns in the codebase
4. Only then implement solution
