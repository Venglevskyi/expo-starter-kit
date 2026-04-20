import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { GOOGLE_BUTTON_TYPES, GOOGLE_BUTTON_SHAPES, GOOGLE_BUTTON_LABELS } from '@/constants';

export type GoogleButtonType = `${GOOGLE_BUTTON_TYPES}`;
export type GoogleButtonShape = `${GOOGLE_BUTTON_SHAPES}`;
export type GoogleButtonLabel = `${GOOGLE_BUTTON_LABELS}`;

type CircleOnlyProps = {
  shape: GOOGLE_BUTTON_SHAPES.CIRCLE;
  label?: never;
  isIconOnly?: true;
};

type RoundedProps = {
  shape: GOOGLE_BUTTON_SHAPES.ROUNDED;
  label: GoogleButtonLabel;
  isIconOnly?: false;
};

type SquareProps =
  | {
      shape: GOOGLE_BUTTON_SHAPES.SQUARE;
      label: GoogleButtonLabel;
      isIconOnly?: false;
    }
  | {
      shape: GOOGLE_BUTTON_SHAPES.SQUARE;
      label?: never;
      isIconOnly: true;
    };

type BaseProps = ViewProps & {
  type?: GoogleButtonType;
  width?: number | `${number}%`;
  height?: number;
  isLoading?: boolean;
  onPress: () => Promise<void>;
  style?: StyleProp<ViewStyle>;
};

export type Props =
  | (BaseProps & CircleOnlyProps)
  | (BaseProps & RoundedProps)
  | (BaseProps & SquareProps);
