import type { TextInputProps, ViewStyle } from 'react-native';

export type Props = Omit<TextInputProps, 'style'> & {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showSecureToggle?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
};
