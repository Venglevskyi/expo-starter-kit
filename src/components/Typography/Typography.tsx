import { Text } from 'react-native';

import { theme } from '@/theme';
import { type Props } from './types';
import { useStyles } from './useStyles';

export const Typography = ({
  variant = 'bodyMedium',
  font = 'regular',
  color = theme.colors.text.primary,
  align = 'left',
  underline = false,
  flex = false,
  style,
  ...rest
}: Props) => {
  const { styles } = useStyles({
    variant,
    font,
    color,
    align,
    underline,
    flex,
  });

  return <Text {...rest} style={[styles.text, style]} />;
};

export default Typography;
