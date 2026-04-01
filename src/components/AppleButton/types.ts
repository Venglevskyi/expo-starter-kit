import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { SOCIAL_BUTTON_HEIGHT, IS_IOS } from '@/constants';
import { theme } from '@/theme';

// LABELS ===========================
export const APPLE_BUTTON_LABELS = {
  signIn: 'Sign in with Apple',
  signUp: 'Sign up with Apple',
  continue: 'Continue with Apple',
} as const;

export type AppleButtonLabel = (typeof APPLE_BUTTON_LABELS)[keyof typeof APPLE_BUTTON_LABELS];

// DIMENSIONS ========================
export const APPLE_BUTTON_DIMENSIONS = {
  height: SOCIAL_BUTTON_HEIGHT,
  paddingHorizontal: theme.spacings.x16,
  gap: IS_IOS ? theme.spacings.x12 : theme.spacings.x10,
  borderRadius: theme.spacings.x20,
  iconSize: 20,
} as const;

// STYLE PROPS =======================
export type StyleProps = {
  width: number | `${number}%`;
  height: number;
};

// PROP TYPES  =======================
export type Props = ViewProps &
  Partial<StyleProps> & {
    label: AppleButtonLabel;
    isLoading?: boolean;
    onPress: () => Promise<void>;
    style?: StyleProp<ViewStyle>;
  };
