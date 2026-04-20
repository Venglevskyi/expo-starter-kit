import { forwardRef, useCallback, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Typography from '@/components/typography';

import { type Props } from './types';
import { styles } from './input.styles';

export const Input = forwardRef<TextInput, Props>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      showSecureToggle,
      secureTextEntry,
      style,
      containerStyle,
      editable = true,
      autoCapitalize = 'none',
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useUnistyles();
    const [focused, setFocused] = useState(false);
    const [secureHidden, setSecureHidden] = useState(secureTextEntry ?? true);
    const hasError = Boolean(error);
    const disabled = !editable;

    styles.useVariants({
      disabled: disabled ? 'true' : 'false',
      border: hasError ? 'error' : focused ? 'focused' : 'idle',
    });

    const handleFocus = useCallback(
      (e: Parameters<NonNullable<typeof onFocus>>[0]) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: Parameters<NonNullable<typeof onBlur>>[0]) => {
        setFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const toggleSecure = useCallback(() => {
      setSecureHidden((prev) => !prev);
    }, []);

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? (
          <Typography variant="bodySmall" color={theme.colors.text.muted}>
            {label}
          </Typography>
        ) : null}

        <View style={[styles.field, style]}>
          {leftIcon}

          <TextInput
            ref={ref}
            style={styles.input}
            editable={editable}
            autoCapitalize={autoCapitalize}
            secureTextEntry={showSecureToggle ? secureHidden : secureTextEntry}
            placeholderTextColor={theme.colors.text.placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />

          {showSecureToggle ? (
            <Pressable onPress={toggleSecure} hitSlop={8}>
              <MaterialCommunityIcons
                name={secureHidden ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.colors.text.muted}
              />
            </Pressable>
          ) : null}

          {rightIcon}
        </View>

        {error || helperText ? (
          <Typography
            variant="bodySmall"
            color={error ? theme.colors.accent.default : theme.colors.text.muted}
            style={styles.errorText}>
            {error ?? helperText}
          </Typography>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

export default Input;
