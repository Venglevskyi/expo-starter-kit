import { light } from './colors';
import { common } from './common';

export const lightTheme = {
  ...common,
  colors: light,
} as const;
