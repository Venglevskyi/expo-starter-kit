import { useState } from 'react';
import { type LayoutChangeEvent, Pressable, TextInput, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Typography from '@/components/typography';

import { HIT_SLOP, INPUT_HEIGHT } from '@/constants/sizes';
import { type Props } from './types';
import { styles } from './input.styles';

const FLOAT_TRANSLATE_Y = -INPUT_HEIGHT / 2;
const FLOAT_SCALE = 0.8;
const ANIMATION_DURATION = 150;
const FOCUSED_BORDER_WIDTH = 1.5;
const IDLE_BORDER_WIDTH = 1;

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  showSecureToggle,
  secureTextEntry,
  style,
  containerStyle,
  editable = true,
  autoCapitalize = 'none',
  value,
  defaultValue,
  onFocus,
  onBlur,
  onChangeText,
  reduceMotion,
  ref,
  ...rest
}: Props) => {
  const { theme } = useUnistyles();
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [secureHidden, setSecureHidden] = useState(secureTextEntry ?? true);
  const [labelWidth, setLabelWidth] = useState(0);

  const currentValue = value ?? internalValue;
  const hasError = Boolean(error);
  const disabled = !editable;
  const shouldFloat = focused || currentValue.length > 0;
  const idleColor = theme.colors.border.subtle;
  const focusColor = theme.colors.border.default;
  const errorColor = theme.colors.accent.default;

  styles.useVariants({ disabled: disabled ? 'true' : 'false' });

  const floatProgress = useDerivedValue(() =>
    withTiming(shouldFloat ? 1 : 0, { duration: ANIMATION_DURATION, reduceMotion }),
  );
  const focusProgress = useDerivedValue(() =>
    withTiming(focused ? 1 : 0, { duration: ANIMATION_DURATION, reduceMotion }),
  );

  const fieldAnimatedStyle = useAnimatedStyle(() => {
    const progress = focusProgress.get();
    return {
      borderColor: hasError
        ? errorColor
        : interpolateColor(progress, [0, 1], [idleColor, focusColor]),
      borderWidth: interpolate(
        hasError ? 1 : progress,
        [0, 1],
        [IDLE_BORDER_WIDTH, FOCUSED_BORDER_WIDTH],
      ),
    };
  });

  const labelTransformStyle = useAnimatedStyle(() => {
    const progress = floatProgress.get();
    const scale = interpolate(progress, [0, 1], [1, FLOAT_SCALE]);
    // Default transform origin is center; compensate translateX so the label's left edge stays anchored as it shrinks.
    const translateX = -(labelWidth * (1 - scale)) / 2;
    return {
      transform: [
        { translateX },
        { translateY: interpolate(progress, [0, 1], [0, FLOAT_TRANSLATE_Y]) },
        { scale },
      ],
    };
  });

  const labelColorStyle = useAnimatedStyle(() => ({
    color: hasError
      ? errorColor
      : interpolateColor(focusProgress.get(), [0, 1], [idleColor, focusColor]),
  }));

  const handleFocus: NonNullable<Props['onFocus']> = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur: NonNullable<Props['onBlur']> = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    if (value === undefined) setInternalValue(text);
    onChangeText?.(text);
  };

  const toggleSecure = () => setSecureHidden((prev) => !prev);

  const handleLabelLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setLabelWidth((prev) => (prev === width ? prev : width));
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.field, fieldAnimatedStyle, style]}>
        {leftIcon}

        <View style={styles.inputArea}>
          <View pointerEvents="none" style={styles.labelContainer}>
            <Animated.View
              style={[styles.labelTransform, labelTransformStyle]}
              onLayout={handleLabelLayout}>
              <Animated.Text numberOfLines={1} style={[styles.labelText, labelColorStyle]}>
                {label}
              </Animated.Text>
            </Animated.View>
          </View>

          <TextInput
            ref={ref}
            editable={editable}
            style={styles.input}
            value={currentValue}
            autoCapitalize={autoCapitalize}
            secureTextEntry={showSecureToggle ? secureHidden : secureTextEntry}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChangeText={handleChangeText}
            {...rest}
          />
        </View>

        {showSecureToggle ? (
          <Pressable hitSlop={HIT_SLOP} onPress={toggleSecure}>
            <MaterialCommunityIcons
              size={20}
              color={theme.colors.text.muted}
              name={secureHidden ? 'eye-off' : 'eye'}
            />
          </Pressable>
        ) : null}

        {rightIcon}
      </Animated.View>

      <View style={styles.errorSlot}>
        {hasError ? (
          <Typography variant="bodySmall" color={errorColor}>
            {error}
          </Typography>
        ) : null}
      </View>
    </View>
  );
};

export default Input;
