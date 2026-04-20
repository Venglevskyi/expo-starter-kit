import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
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
