import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@/theme';
import { CHIP_HEIGHT } from '@/constants/sizes';
import type { StyleProps } from './types';

export const useStyles = ({ selected, disabled }: StyleProps) => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          height: CHIP_HEIGHT,
          borderRadius: theme.radius.full,
          borderWidth: 1,
          paddingHorizontal: theme.spacings.x4,
          gap: theme.spacings.x1,
          overflow: 'hidden',
          opacity: disabled ? 0.4 : 1,
          backgroundColor: selected ? theme.colors.brand.light : theme.colors.surface.subtle,
          borderColor: selected ? theme.colors.brand.default : theme.colors.border.default,
        },
      }),
    [selected, disabled],
  );

  const labelColor = selected ? theme.colors.brand.default : theme.colors.text.muted;

  return { styles, labelColor };
};
