import { components } from './components';
import { fonts } from './fonts';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacings } from './spacing';
import { typo } from './typo';

export const common = {
  typo,
  fonts,
  radius,
  shadows,
  spacings,
  components,
} as const;
