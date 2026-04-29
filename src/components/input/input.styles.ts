import { StyleSheet } from 'react-native-unistyles';

import { DEFAULT_HEIGHT } from '@/constants/sizes';

export const styles = StyleSheet.create((theme) => ({
  container: {
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
    height: DEFAULT_HEIGHT,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    borderWidth: 1,
    backgroundColor: theme.colors.surface.default,
    paddingHorizontal: theme.spacings.x8,
  },
  inputArea: {
    flex: 1,
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
  },
  labelTransform: {
    backgroundColor: theme.colors.surface.default,
    paddingHorizontal: theme.spacings.x4,
    marginLeft: -theme.spacings.x4,
    borderTopLeftRadius: theme.radius.sm,
    borderTopRightRadius: theme.radius.sm,
    borderCurve: 'continuous',
  },
  labelText: {
    ...theme.typo.bodyMedium,
    fontFamily: theme.fonts.poppinsRegular,
  },
  input: {
    ...theme.typo.bodyMedium,
    fontFamily: theme.fonts.poppinsRegular,
    color: theme.colors.text.primary,
    flex: 1,
    // Android: prevents extra top padding and vertical misalignment of secure-text dots
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  errorSlot: {
    minHeight: theme.spacings.x6,
    paddingHorizontal: theme.spacings.x2,
  },
}));
