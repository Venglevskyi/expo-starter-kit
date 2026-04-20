import { StyleSheet } from 'react-native-unistyles';

import { ButtonSize, ButtonVariant } from './types';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacings.x4,
    borderRadius: theme.radius.full,
    variants: {
      variant: {
        [ButtonVariant.Primary]: {
          backgroundColor: theme.colors.button.primaryBg,
        },
        [ButtonVariant.Secondary]: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.button.secondaryBorder,
        },
        [ButtonVariant.Neutral]: {
          backgroundColor: theme.colors.button.neutralBg,
        },
      },
      size: {
        [ButtonSize.Md]: {
          height: 40,
          paddingHorizontal: theme.spacings.x4,
          paddingVertical: theme.spacings.x2,
        },
        [ButtonSize.Sm]: {
          height: 40,
          paddingHorizontal: theme.spacings.x6,
          paddingVertical: theme.spacings.x4,
        },
      },
      fullWidth: {
        true: { alignSelf: 'stretch' },
        false: { alignSelf: 'flex-start' },
      },
    },
  },
  label: {
    variants: {
      variant: {
        [ButtonVariant.Primary]: { color: theme.colors.button.primaryText },
        [ButtonVariant.Secondary]: { color: theme.colors.button.secondaryText },
        [ButtonVariant.Neutral]: { color: theme.colors.button.neutralText },
      },
    },
  },
  disabled: { opacity: 0.4 },
  labelHidden: { opacity: 0 },
  loader: { position: 'absolute' },
}));
