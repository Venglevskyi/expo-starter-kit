import { memo, useCallback, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import Typography from '../Typography';

import { theme } from '@/theme';
import { type Props } from './types';
import { useStyles } from './useStyles';

const InputComponent = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  inputRef,
  style,
  containerStyle,
  editable = true,
  onFocus,
  onBlur,
  ...rest
}: Props) => {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const disabled = !editable;

  const ref = useRef<TextInput>(null);

  const { styles } = useStyles({ focused, hasError, disabled });

  const onSetRef = useCallback(
    (input: TextInput | null) => {
      (ref as React.RefObject<TextInput | null>).current = input;
      if (inputRef) {
        (inputRef as React.RefObject<TextInput | null>).current = input;
      }
    },
    [inputRef],
  );

  const onPress = useCallback(() => {
    ref.current?.focus();
  }, []);

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

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography variant="bodySmall" color={theme.colors.text.muted}>
          {label}
        </Typography>
      )}

      <Pressable style={[styles.field, style]} onPress={onPress}>
        {leftIcon}

        <TextInput
          ref={onSetRef}
          style={styles.input}
          editable={editable}
          placeholderTextColor={theme.colors.text.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {rightIcon}
      </Pressable>

      {(error || helperText) && (
        <Typography
          variant="bodySmall"
          color={error ? theme.colors.accent.default : theme.colors.text.muted}
          style={styles.errorText}>
          {error ?? helperText}
        </Typography>
      )}
    </View>
  );
};

export const Input = memo(InputComponent);

export default Input;
