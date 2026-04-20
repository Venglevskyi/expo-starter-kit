import { ActivityIndicator } from 'react-native';
import { PressableScale } from 'pressto';

import Typography from '@/components/typography';

import { ButtonSize, ButtonVariant, type Props } from './types';
import { styles } from './button.styles';

export const Button = ({
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
  onPress,
  ...rest
}: Props) => {
  const isDisabled = disabled || loading;

  styles.useVariants({ variant, size, fullWidth: fullWidth ? 'true' : 'false' });

  return (
    <PressableScale
      enabled={!isDisabled}
      style={[styles.container, disabled && styles.disabled, style]}
      onPress={onPress}
      {...rest}>
      {leftIcon}

      <Typography
        variant="titleSmall"
        style={[styles.label, loading && styles.labelHidden, labelStyle]}>
        {label}
      </Typography>

      {rightIcon}

      {!!loading && <ActivityIndicator size="small" style={styles.loader} />}
    </PressableScale>
  );
};

export default Button;
