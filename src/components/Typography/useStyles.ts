import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@/theme';

import type { StyleProps } from './types';

export const useStyles = ({ variant, font, color, align, underline, flex }: StyleProps) => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          ...theme.typo[variant],
          fontFamily: theme.fonts[font],
          color,
          textAlign: align,
          textDecorationLine: underline ? 'underline' : 'none',
          flex: flex ? 1 : undefined,
          includeFontPadding: false,
        },
      }),
    [variant, font, color, align, underline, flex],
  );

  return { styles };
};
