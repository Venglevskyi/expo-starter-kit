import { dark } from './colors';
import { common } from './common';

export const darkTheme = {
  ...common,
  colors: dark,
} as const;
