import type { TextProps } from 'react-native';

import type { FontKey } from '@/theme/fonts';
import type { TypoKey } from '@/theme/typo';

export type StyleProps = {
  variant: TypoKey;
  font: FontKey;
  color: string;
  align: 'left' | 'center' | 'right';
  underline: boolean;
  flex: boolean;
};

export type Props = TextProps & Partial<StyleProps>;
