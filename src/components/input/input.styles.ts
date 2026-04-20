import { StyleSheet } from 'react-native-unistyles';

import { INPUT_HEIGHT } from '@/constants/sizes';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacings.x4,
    variants: {
      disabled: {
        true: { opacity: 0.4 },
        false: { opacity: 1 },
      },
    },
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: INPUT_HEIGHT,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacings.x8,
    gap: theme.spacings.x2,
    overflow: 'hidden',
    variants: {
      border: {
        error: { borderColor: theme.colors.accent.default },
        focused: { borderColor: theme.colors.brand.default },
        idle: { borderColor: theme.colors.border.default },
      },
    },
  },
  input: {
    flex: 1,
    ...theme.typo.bodyMedium,
    fontFamily: theme.fonts.poppinsRegular,
    color: theme.colors.text.primary,
    lineHeight: undefined,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  errorText: {
    paddingHorizontal: theme.spacings.x12,
  },
}));
