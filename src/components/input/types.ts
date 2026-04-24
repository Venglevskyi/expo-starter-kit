import type { Ref } from 'react';
import type { TextInput, TextInputProps, ViewStyle } from 'react-native';
import type { ReduceMotion } from 'react-native-reanimated';

export type Props = Omit<TextInputProps, 'style' | 'placeholder'> & {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showSecureToggle?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  reduceMotion?: ReduceMotion;
  ref?: Ref<TextInput>;
};
