import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@/theme';

import { ButtonSize, ButtonVariant, type StyleProps } from './types';

const VARIANT_STYLES = {
  [ButtonVariant.Primary]: {
    container: {
      backgroundColor: theme.colors.button.primaryBg,
    },
    label: {
      color: theme.colors.button.primaryText,
    },
  },
  [ButtonVariant.Secondary]: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.button.secondaryBorder,
    },
    label: {
      color: theme.colors.button.secondaryText,
    },
  },
  [ButtonVariant.Neutral]: {
    container: {
      backgroundColor: theme.colors.button.neutralBg,
    },
    label: {
      color: theme.colors.button.neutralText,
    },
  },
};

const SIZE_CONFIG = {
  [ButtonSize.Md]: {
    height: theme.spacings.x20,
    paddingHorizontal: theme.spacings.x4,
    paddingVertical: theme.spacings.x2,
  },
  [ButtonSize.Sm]: {
    height: theme.spacings.x12,
    paddingHorizontal: theme.spacings.x3,
    paddingVertical: theme.spacings.x1,
  },
};

export const useStyles = ({ variant, size, fullWidth, disabled }: StyleProps) => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacings.x1,
          borderRadius: theme.radius.full,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.4 : 1,
          ...SIZE_CONFIG[size],
          ...VARIANT_STYLES[variant].container,
        },
        labelHidden: {
          opacity: 0,
        },
        loader: {
          position: 'absolute',
        },
      }),
    [variant, size, fullWidth, disabled],
  );

  const loaderColor = VARIANT_STYLES[variant].label.color;

  return { styles, loaderColor };
};
