import { colors } from './colors';
import { components } from './components';
import { fonts } from './fonts';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacings } from './spacing';
import { typo } from './typo';

export const theme = {
  typo,
  fonts,
  colors,
  radius,
  shadows,
  spacings,
  components,
} as const;
