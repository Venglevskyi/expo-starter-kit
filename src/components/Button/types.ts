import type { TextStyle, ViewStyle } from 'react-native';
import type { CustomPressableProps } from 'pressto';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Neutral = 'neutral',
}

export enum ButtonSize {
  Md = 'md',
  Sm = 'sm',
}

export type Props = Omit<CustomPressableProps, 'style' | 'children'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
};
