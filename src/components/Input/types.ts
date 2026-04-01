import type { RefObject } from 'react';
import type { TextInput, TextInputProps, ViewStyle } from 'react-native';

export type StyleProps = {
  focused: boolean;
  hasError: boolean;
  disabled: boolean;
};

export type Props = Omit<TextInputProps, 'style'> & {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputRef?: RefObject<TextInput>;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
};
