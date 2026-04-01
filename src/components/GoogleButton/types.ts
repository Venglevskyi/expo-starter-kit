import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { SOCIAL_BUTTON_HEIGHT, IS_IOS } from '@/constants';
import { theme } from '@/theme';

// TYPES (light/dark/neutral) =======
export const GOOGLE_BUTTON_TYPES = {
  light: 'light',
  dark: 'dark',
  neutral: 'neutral',
} as const;

export type GoogleButtonType = (typeof GOOGLE_BUTTON_TYPES)[keyof typeof GOOGLE_BUTTON_TYPES];

// SHAPES ===========================
export const GOOGLE_BUTTON_SHAPES = {
  circle: 'circle',
  rounded: 'rounded',
  square: 'square',
} as const;

export type GoogleButtonShape = (typeof GOOGLE_BUTTON_SHAPES)[keyof typeof GOOGLE_BUTTON_SHAPES];

// LABELS ===========================
export const GOOGLE_BUTTON_LABELS = {
  signIn: 'Sign in with Google',
  signUp: 'Sign up with Google',
  continue: 'Continue with Google',
} as const;

export type GoogleButtonLabel = (typeof GOOGLE_BUTTON_LABELS)[keyof typeof GOOGLE_BUTTON_LABELS];

// COLORS (bg + label) ==============
export const GOOGLE_BUTTON_TYPE_COLORS = {
  light: {
    bg: theme.colors.googleButton.light.bg,
    text: theme.colors.googleButton.light.text,
  },
  dark: {
    bg: theme.colors.googleButton.dark.bg,
    text: theme.colors.googleButton.dark.text,
  },
  neutral: {
    bg: theme.colors.googleButton.neutral.bg,
    text: theme.colors.googleButton.neutral.text,
  },
} as const;

// BORDER RADIUS =====================
export const GOOGLE_BUTTON_BORDER_RADIUS = {
  circle: (height: number) => height / 2,
  rounded: () => theme.spacings.x20,
  square: () => theme.spacings.x12,
} as const;

// BORDER  ===========================
export const GOOGLE_BUTTON_BORDER = {
  light: {
    borderWidth: 1,
    borderColor: theme.colors.googleButton.light.border,
  },
  dark: {
    borderWidth: 1,
    borderColor: theme.colors.googleButton.dark.border,
  },
  neutral: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
} as const;

// DIMENSIONS ========================
export const GOOGLE_BUTTON_DIMENSIONS = {
  height: SOCIAL_BUTTON_HEIGHT,
  paddingHorizontal: theme.spacings.x4,
  gap: IS_IOS ? theme.spacings.x12 : theme.spacings.x10,
} as const;

// STYLE PROPS =======================
export type StyleProps = {
  type: GoogleButtonType;
  width: number | `${number}%`;
  height: number;
};

// PROP TYPES  =======================
type CircleOnlyProps = {
  shape: typeof GOOGLE_BUTTON_SHAPES.circle;
  label?: never;
  isIconOnly?: true;
};

type RoundedProps = {
  shape: typeof GOOGLE_BUTTON_SHAPES.rounded;
  label: GoogleButtonLabel;
  isIconOnly?: false;
};

type SquareProps =
  | {
      shape: typeof GOOGLE_BUTTON_SHAPES.square;
      label: GoogleButtonLabel;
      isIconOnly?: false;
    }
  | {
      shape: typeof GOOGLE_BUTTON_SHAPES.square;
      label?: never;
      isIconOnly: true;
    };

type BaseProps = ViewProps &
  Partial<StyleProps> & {
    isLoading?: boolean;
    onPress: () => Promise<void>;
    style?: StyleProp<ViewStyle>;
  };

export type Props =
  | (BaseProps & CircleOnlyProps)
  | (BaseProps & RoundedProps)
  | (BaseProps & SquareProps);
