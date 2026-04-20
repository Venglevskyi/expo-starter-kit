# CLAUDE.md

This file provides critical guidance to Claude Code for this repository.

## 🚀 Project Overview

**Flat-Modular Expo SDK 55** (React Native). High performance, modular, and AI-optimized.

- **Routing:** Expo Router (File-based)
- **Styling:** Unistyles v3
- **State:** Zustand & TanStack Query
- **Package Manager:** `pnpm` (managed via Corepack)

## 🚪 Entry point

`index.ts` imports Unistyles config (`src/theme/unistyles.ts`) **before** `expo-router/entry` — this order is required.

## 🛠 Commands

- **Start dev server:** `pnpm start` (runs `expo start --reset-cache`)
- **iOS:** `pnpm ios` | **Android:** `pnpm android` | **Web:** `pnpm web`
- **Lint:** `pnpm lint` (uses `expo lint` — flat ESLint config with Prettier integration)
- **Check deps:** `pnpm deps:check` | **Fix deps:** `pnpm deps:align`
- **Reset deps:** `pnpm deps:reset`

No test runner is configured.

## 🏗 Mandatory Rules

**Always follow** the specific rules located in `./claude/rules/` before implementation:

### 📋 Core Standards

- **Architecture:** `./claude/rules/architecture.md`
- **Code Styling:** `./claude/rules/code-styling.md`
- **Git Operations:** `./claude/rules/git-operation.md`
- **Native Font Plugins:** `./claude/rules/font-config-plugin.md`
- **List Performance:** All `./claude/rules/list-performance-*.md`
- **Core Rendering:** All `./claude/rules/rendering-*.md`
- **User Interface:** All `./claude/rules/ui-*.md`
- **React State:** All `./claude/rules/react-state-*.md`
- **Scroll Optimization:** All `./claude/rules/scroll-*.md`
- **React Compiler:** All `./claude/rules/react-compiler-*.md`
- **State Architecture:** All `./claude/rules/state-*.md`
- **Navigation:** All `./claude/rules/navigation-*.md`
- **Monorepo:** All `./claude/rules/monorepo-*.md`

### 🎨 Styling: react-native-unistyles v3

**Always follow** the specific `SKILLS` located in `./claude/skills/react-native-unistyles-v3` before implementation:

- Import `StyleSheet` from `react-native-unistyles` (not `react-native`) when you need theme access
- Theme is configured in `src/theme/unistyles.ts` with a `light` and `dark` theme
- Create stylesheets with `StyleSheet.create((theme) => ({...}))` to access theme values
- Dynamic styles use function syntax: `styles.container({ variant, size })` with typed parameters
- Theme object shape: `theme.{typo, fonts, colors, radius, shadows, spacings, components}`

### 🧩 Component patterns

- Components use `pressto` for pressable interactions (`PressableScale`, `CustomPressableProps`)
- SVGs are imported as React components via `react-native-svg-transformer`

## 🧠 Skills

Project-specific Claude skills are available in `.claude/skills/`. Use the `Skill` tool to invoke them when working on related tasks:

- **react-native-unistyles-v3** — always use when writing or modifying styles
- **rn-best-practice** - React Native and Expo best practices for building performant mobile apps

## 🔌 External skills via plugins

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

## 🔄 Execution Protocol

1. **Scan rules:** Check ./claude/rules/ for mandatory constraints.
2. **Select skills:** Identify and invoke relevant local or external skills.
3. **Analyze patterns:** Follow existing code patterns and modularity rules.
4. **Implement:** Write code adhering to the Public API and @/ alias rules.
5. **Quality Check:** Ensure code passes Husky + lint-staged (ESLint & Prettier) before finalizing.
