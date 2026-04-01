import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@/theme';
import { APPLE_BUTTON_DIMENSIONS, StyleProps } from './types';

export const useStyles = ({ width, height }: StyleProps) => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        pressable: {
          justifyContent: 'center',
          alignItems: 'center',
          height,
          width,
          backgroundColor: theme.colors.appleButton.bg,
          borderWidth: 1,
          borderColor: theme.colors.appleButton.border,
          borderRadius: APPLE_BUTTON_DIMENSIONS.borderRadius,
        },
        container: {
          paddingHorizontal: APPLE_BUTTON_DIMENSIONS.paddingHorizontal,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: APPLE_BUTTON_DIMENSIONS.gap,
        },
      }),
    [width, height],
  );

  return { styles };
};
