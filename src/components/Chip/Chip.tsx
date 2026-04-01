import { FC } from 'react';
import { PressableScale } from 'pressto';

import Typography from '../Typography';

import { type Props } from './types';
import { useStyles } from './useStyles';

export const Chip: FC<Props> = ({
  label,
  selected = false,
  disabled = false,
  icon,
  style,
  labelStyle,
  ...rest
}) => {
  const { styles, labelColor } = useStyles({ selected, disabled });

  return (
    <PressableScale enabled={!disabled} style={[styles.container, style]} {...rest}>
      {icon}

      <Typography variant="bodyLarge" color={labelColor} style={labelStyle}>
        {label}
      </Typography>
    </PressableScale>
  );
};

export default Chip;
