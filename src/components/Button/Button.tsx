import { FC } from 'react';
import { ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { PressableScale } from 'pressto';

import Typography from '../Typography';

import { ButtonSize, ButtonVariant, type Props } from './types';

export const Button: FC<Props> = ({
  label,
  variant = ButtonVariant.Primary,
  size = ButtonSize.Md,
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  labelStyle,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  styles.useVariants({ variant, size, fullWidth: fullWidth ? 'true' : 'false' });

  return (
    <PressableScale
      enabled={!isDisabled}
      style={[styles.container, disabled && styles.disabled, style]}
      {...rest}>
      {leftIcon}

      <Typography
        variant="titleSmall"
        style={[styles.label, loading && styles.labelHidden, labelStyle]}>
        {label}
      </Typography>

      {rightIcon}

      {loading && <ActivityIndicator size="small" style={styles.loader} />}
    </PressableScale>
  );
};

export default Button;

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacings.x4,
    borderRadius: theme.radius.full,
    variants: {
      variant: {
        [ButtonVariant.Primary]: {
          backgroundColor: theme.colors.button.primaryBg,
        },
        [ButtonVariant.Secondary]: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.button.secondaryBorder,
        },
        [ButtonVariant.Neutral]: {
          backgroundColor: theme.colors.button.neutralBg,
        },
      },
      size: {
        [ButtonSize.Md]: {
          height: 40,
          paddingHorizontal: theme.spacings.x4,
          paddingVertical: theme.spacings.x2,
        },
        [ButtonSize.Sm]: {
          height: 40,
          paddingHorizontal: theme.spacings.x6,
          paddingVertical: theme.spacings.x4,
        },
      },
      fullWidth: {
        true: { alignSelf: 'stretch' },
        false: { alignSelf: 'flex-start' },
      },
    },
  },
  label: {
    variants: {
      variant: {
        [ButtonVariant.Primary]: { color: theme.colors.button.primaryText },
        [ButtonVariant.Secondary]: { color: theme.colors.button.secondaryText },
        [ButtonVariant.Neutral]: { color: theme.colors.button.neutralText },
      },
    },
  },
  disabled: { opacity: 0.4 },
  labelHidden: { opacity: 0 },
  loader: { position: 'absolute' },
}));
