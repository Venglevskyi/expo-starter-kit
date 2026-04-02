import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@/theme';
import { INPUT_HEIGHT } from '@/constants/sizes';

import type { StyleProps } from './types';

const getBorderColor = (focused: boolean, hasError: boolean): string => {
  if (hasError) return theme.colors.accent.default;
  if (focused) return theme.colors.brand.default;
  return theme.colors.border.default;
};

export const useStyles = ({ focused, hasError, disabled }: StyleProps) => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: theme.spacings.x4,
          opacity: disabled ? 0.4 : 1,
        },
        field: {
          flexDirection: 'row',
          alignItems: 'center',
          height: INPUT_HEIGHT,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: getBorderColor(focused, hasError),
          backgroundColor: theme.colors.background,
          paddingHorizontal: theme.spacings.x12,
          gap: theme.spacings.x2,
          overflow: 'hidden',
        },
        input: {
          flex: 1,
          ...theme.typo.bodyMedium,
          fontFamily: theme.fonts.regular,
          color: theme.colors.text.primary,
          lineHeight: undefined,
        },
        errorText: {
          paddingHorizontal: theme.spacings.x12,
        },
      }),
    [focused, hasError, disabled],
  );

  return { styles };
};
