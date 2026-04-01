import type { TextStyle, ViewStyle } from 'react-native';
import type { CustomPressableProps } from 'pressto';

export type StyleProps = {
  selected: boolean;
  disabled: boolean;
};

export type Props = Omit<CustomPressableProps, 'style' | 'children'> &
  Partial<StyleProps> & {
    label: string;
    icon?: React.ReactNode;
    style?: ViewStyle;
    labelStyle?: TextStyle;
  };
