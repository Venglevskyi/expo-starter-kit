import { type TextProps } from 'react-native';

import { type TypoVariant } from '@/theme/typo';

export type TextStyleProps = {
  font?: string;
  color?: string;
  flex?: boolean;
  underline?: boolean;
  variant: TypoVariant;
  align?: 'left' | 'center' | 'right';
};

export type Props = TextProps & TextStyleProps;
