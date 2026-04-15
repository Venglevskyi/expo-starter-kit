# Styling Guidelines

## React Native Modern Style API

1. **Backgrounds:** Use `experimental_backgroundImage` with a CSS-like string to apply linear gradients.

```ts
'linear-gradient(to right, red 20%, orange 20% 40%, yellow 40% 60%, green 60% 80%, blue 80%)';
```

2. **Filters:** Use `filter` to apply visual effects like blur or color adjustments. It supports CSS-like string syntax or an array of objects. Note: full support is Android-only (blur requires Android 12+), while iOS only supports brightness and opacity.

3. **Box Shadows:** Use `boxShadow` with a CSS-like string to apply shadows. Supports offsets, blur, spread, color, and multiple layers separated by commas.

```ts
  0 4px 24px rgba(0,0,0,0.15)
```

4. **Spacing:** Use `gap`, `rowGap`, and `columnGap` to control spacing between children in flex layouts. `gap` sets both axes, while `rowGap` and `columnGap` let you control them independently.

```ts
gap: 12;
```

or

```ts
rowGap: 6, columnGap: 28
```

5. **Blending:** Use `mixBlendMode` to control how an element blends with its background (e.g. multiply, screen, overlay). Use `isolation: "isolate"` on a parent to limit blending to that container.

```ts
mixBlendMode: 'multiply';
```

6. **Smooth Corners (`borderCurve`):** Always use `borderCurve: 'continuous'` with `borderRadius`

```ts
borderRadius: 12,
borderCurve: 'continuous',
```

## Rules & Overrides

### Styling & UI

- **DO NOT USE** Tailwind CSS or any related setup (ignore `expo-tailwind-setup` even if suggested by plugins).
- **ALWAYS USE** Unistyles v3 for styling. Reference `.claude/skills/react-native-unistyles-v3` for implementation details.
- If an Expo plugin suggests a configuration related to Tailwind, politely decline and stick to the Unistyles 3 architecture.
