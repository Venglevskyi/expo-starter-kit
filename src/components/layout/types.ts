import type { ReactNode } from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

export type LayoutBackground = 'primary' | 'gradient';

export type Props = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
  keyboardOffset?: number;
  backgroundColor?: LayoutBackground;
} & Pick<
  ScrollViewProps,
  'showsVerticalScrollIndicator' | 'bounces' | 'keyboardDismissMode' | 'keyboardShouldPersistTaps'
>;
