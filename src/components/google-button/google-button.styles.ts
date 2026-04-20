import { StyleSheet } from 'react-native-unistyles';

import {
  IS_IOS,
  GOOGLE_BUTTON_DIMENSIONS,
  GOOGLE_BUTTON_SHAPES,
  GOOGLE_BUTTON_TYPES,
} from '@/constants';

import type { GoogleButtonType } from './types';

export const styles = StyleSheet.create((theme) => ({
  pressable: (
    type: GoogleButtonType,
    height: number,
    width: number | `${number}%`,
    shape: GOOGLE_BUTTON_SHAPES,
  ) => {
    const colors = theme.colors.googleButton[type];
    return {
      justifyContent: 'center',
      alignItems: 'center',
      height,
      width: shape === GOOGLE_BUTTON_SHAPES.CIRCLE ? height : width,
      borderRadius:
        shape === GOOGLE_BUTTON_SHAPES.CIRCLE
          ? height / 2
          : shape === GOOGLE_BUTTON_SHAPES.ROUNDED
            ? theme.radius.full
            : theme.radius.sm,
      backgroundColor: colors.bg,
      borderWidth: type === GOOGLE_BUTTON_TYPES.LIGHT ? 1 : 0,
      borderColor: colors.border,
    };
  },
  content: (iconOnly: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: iconOnly ? 0 : IS_IOS ? theme.spacings.x8 : theme.spacings.x5,
    gap: iconOnly ? 0 : GOOGLE_BUTTON_DIMENSIONS.GAP,
  }),
}));
