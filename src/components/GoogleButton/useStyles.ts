import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import {
  GOOGLE_BUTTON_BORDER,
  GOOGLE_BUTTON_BORDER_RADIUS,
  GOOGLE_BUTTON_DIMENSIONS,
  GOOGLE_BUTTON_SHAPES,
  GOOGLE_BUTTON_TYPE_COLORS,
  GoogleButtonShape,
  StyleProps,
} from './types';

type UseStylesProps = StyleProps & { shape: GoogleButtonShape };

export const useStyles = ({ type, shape, height, width }: UseStylesProps) => {
  const { bg, text } = GOOGLE_BUTTON_TYPE_COLORS[type];
  const borderStyle = GOOGLE_BUTTON_BORDER[type];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        pressable: {
          justifyContent: 'center',
          alignItems: 'center',
          height,
          backgroundColor: bg,
          borderRadius: GOOGLE_BUTTON_BORDER_RADIUS[shape](height),
          width: shape === GOOGLE_BUTTON_SHAPES.circle ? height : width,
          ...borderStyle,
        },
        container: {
          paddingHorizontal: GOOGLE_BUTTON_DIMENSIONS.paddingHorizontal,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: GOOGLE_BUTTON_DIMENSIONS.gap,
        },
      }),
    [shape, height, width, bg, borderStyle],
  );

  return { styles, loaderColor: text };
};
