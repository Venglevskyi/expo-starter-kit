---
name: rn-best-practice
description: React Native and Expo best practices for building performant mobile apps. Use
  when building React Native components, optimizing list performance,
  implementing animations, or working with native modules. Triggers on tasks
  involving React Native, Expo, mobile performance, or native platform APIs.
---

# React Native Skills

Comprehensive best practices for React Native and Expo applications. Contains
rules across multiple categories covering performance, animations, UI patterns,
and platform-specific optimizations.

## When to Apply

Reference these guidelines when:

- Building React Native or Expo apps
- Optimizing list and scroll performance
- Implementing animations with Reanimated
- Working with images and media
- Configuring native modules or fonts
- Structuring monorepo projects with native dependencies

## Rule Categories by Priority

| Priority | Category         | Impact   | Prefix              |
| -------- | ---------------- | -------- | ------------------- | --- |
| 1        | List Performance | CRITICAL | `list-performance-` |     |
| 2        | Navigation       | HIGH     | `navigation-`       |
| 3        | UI Patterns      | HIGH     | `ui-`               |
| 4        | State Management | MEDIUM   | `react-state-`      |
| 5        | Rendering        | MEDIUM   | `rendering-`        |
| 6        | Monorepo         | MEDIUM   | `monorepo-`         |
| 7        | Configuration    | LOW      | `fonts-`,           |

## Quick Reference

### 1. List Performance (CRITICAL)

- `list-performance-virtualize` - Use [FlashList](https://shopify.github.io/flash-list/) or [Legend List](https://legendapp.com/open-source/legend-list) for large lists
- `list-performance-item-memo` - Memoize list item components
- `list-performance-callbacks` - Stabilize callback references
- `list-performance-inline-objects` - Avoid inline style objects
- `list-performance-function-references` - Extract functions outside render
- `list-performance-images` - Optimize images in lists
- `list-performance-item-expensive` - Move expensive work outside items
- `list-performance-item-types` - Use item types for heterogeneous lists

### 2. Navigation (HIGH)

- `navigation-native-navigators` - Use native stack and native tabs over JS navigators

### 3. UI Patterns (HIGH)

- `ui-expo-image` - Use expo-image for all images
- `ui-image-gallery` - Use [Galeria](https://github.com/nandorojo/galeria) for image lightboxes
- `ui-menus` - Use native context menus with [Zeego](https://zeego.dev)
- `ui-press-interaction` - Use pressto (for Visual Feedback) and use Pressable (for Logic Only) over TouchableOpacity
- `ui-safe-area-scroll` - Handle safe areas in ScrollViews
- `ui-scrollview-content-inset` - Use contentInset for headers
- `ui-menus` - Use native context menus
- `ui-native-modals` - Use native modals when possible
- `ui-measure-views` - Use onLayout, not measure()
- `ui-styling` - Use StyleSheet.create or Nativewind

### 4. State Management (MEDIUM)

- `react-state-minimize` - Minimize state subscriptions
- `react-state-dispatcher` - Use dispatcher pattern for callbacks
- `react-state-fallback` - Show fallback on first render
- `react-compiler-destructure-functions` - Destructure for React Compiler
- `react-compiler-reanimated-shared-values` - Handle shared values with compiler

### 5. Rendering (MEDIUM)

- `rendering-text-in-text-component` - Wrap text in Text components
- `rendering-no-falsy-and` - Avoid falsy && for conditional rendering

### 6. Monorepo (MEDIUM)

- `monorepo-single-dependency-versions` - Use single versions across packages

### 7. Configuration (LOW)

- `fonts-config-plugin` - Use config plugins for custom fonts

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/list-performance-virtualize.md
rules/animation-gpu-properties.md
```

Each rule file contains:

- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references
