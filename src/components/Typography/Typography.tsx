import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { Props } from './types';

export const Typography = ({
  font,
  style,
  color,
  variant,
  flex = false,
  align = 'left',
  underline = false,
  ...rest
}: Props) => {
  styles.useVariants({ variant, align, underline, flex });

  return <Text {...rest} style={[styles.text, styles.dynamic(color, font), style]} />;
};

export default Typography;

const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.text.primary,
    includeFontPadding: false,
    variants: {
      variant: theme.typo,
      align: {
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
      },
      underline: {
        true: { textDecorationLine: 'underline' },
        false: {},
      },
      flex: {
        true: { flex: 1 },
        false: {},
      },
    },
  },
  dynamic: (color?: string, font?: string) => ({
    ...(color !== undefined && { color }),
    ...(font !== undefined && { fontFamily: font }),
  }),
}));
