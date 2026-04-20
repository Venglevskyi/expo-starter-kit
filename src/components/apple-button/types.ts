import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { APPLE_BUTTON_LABELS } from '@/constants';

export type AppleButtonLabel = `${APPLE_BUTTON_LABELS}`;

export type Props = ViewProps & {
  width?: number | `${number}%`;
  height?: number;
  label: AppleButtonLabel;
  isLoading?: boolean;
  onPress: () => Promise<void>;
  style?: StyleProp<ViewStyle>;
};
