## Interactions & Pressable Strategy

Never use legacy components like `TouchableOpacity` or `TouchableHighlight`. Follow this hierarchy for all interactive elements:

1. Priority: pressto (for Visual Feedback)
   Use the pressto library as the primary component for buttons, cards, and any element requiring high-quality visual feedback.

Scale Effect: If a scale or shrink effect is needed on press, always use pressto.

Source: https://www.npmjs.com/package/pressto

Usage Example:

```tsx
import { PressableScale } from 'pressto';

<PressableScale
  enabled={!isDisabled}
  style={[styles.container, disabled && styles.disabled, style]}
  onPress={onPress}
  {...rest}>
  <Text>Press me</Text>
</PressableScale>;
```

2. Secondary: `Pressable` (for Logic Only)
   Use `Pressable` (from `react-native` or `react-native-gesture-handler`) only when:

- You need a low-level interaction without any built-in scale or opacity effects.
- You are building a custom complex gesture that conflicts with pre-defined feedback.

> ### 💡 Why this matters for our project:
>
> - **Consistent UX:** Using `pressto` ensures a uniform "active" state across the entire app (especially the scale effect).
> - **Performance:** `Pressable` and `pressto` are optimized for the New Architecture and Fabric renderer.
> - **Code Quality:** Prevents "messy" manual scale animation implementations for every button.
