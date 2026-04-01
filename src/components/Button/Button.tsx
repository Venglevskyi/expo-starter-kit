import { FC } from 'react';
import { ActivityIndicator } from 'react-native';
import { PressableScale } from 'pressto';

import Typography from '../Typography';

import { ButtonSize, ButtonVariant, type Props } from './types';
import { useStyles } from './useStyles';

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
  const { styles, loaderColor } = useStyles({ variant, size, fullWidth, disabled });
  const isDisabled = disabled || loading;

  return (
    <PressableScale enabled={!isDisabled} style={[styles.container, style]} {...rest}>
      {leftIcon}

      <Typography
        variant="bodyLarge"
        font="medium"
        color={loaderColor}
        style={[loading && styles.labelHidden, labelStyle]}>
        {label}
      </Typography>

      {rightIcon}

      {loading && <ActivityIndicator size="small" color={loaderColor} style={styles.loader} />}
    </PressableScale>
  );
};

export default Button;
