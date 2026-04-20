import { Text } from 'react-native';

import type { Props } from './types';
import { styles } from './typography.styles';

export const Typography = ({
  font,
  style,
  color,
  variant,
  flex = false,
  align = 'left',
  underline = false,
  ...rest
}: Props) => {
  styles.useVariants({ variant, align, underline, flex });

  return <Text {...rest} style={[styles.text, styles.dynamic(color, font), style]} />;
};

export default Typography;
