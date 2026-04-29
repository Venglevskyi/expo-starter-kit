import { IS_IOS } from './platform';
import { DEFAULT_HEIGHT } from './sizes';

// APPLE ================================
export enum APPLE_BUTTON_LABELS {
  SIGN_IN = 'Sign in with Apple',
  SIGN_UP = 'Sign up with Apple',
  CONTINUE = 'Continue with Apple',
}

export const APPLE_BUTTON_DIMENSIONS = {
  HEIGHT: DEFAULT_HEIGHT,
  ICON_SIZE: 16,
  GAP: 8,
} as const;

export enum APPLE_BUTTON_SHAPES {
  ROUNDED = 'rounded',
  SQUARE = 'square',
}

// GOOGLE ===============================
export enum GOOGLE_BUTTON_TYPES {
  LIGHT = 'light',
  NEUTRAL = 'neutral',
}

export enum GOOGLE_BUTTON_SHAPES {
  CIRCLE = 'circle',
  ROUNDED = 'rounded',
  SQUARE = 'square',
}

export enum GOOGLE_BUTTON_LABELS {
  SIGN_IN = 'Sign in with Google',
  SIGN_UP = 'Sign up with Google',
  CONTINUE = 'Continue with Google',
}

export const GOOGLE_BUTTON_DIMENSIONS = {
  HEIGHT: DEFAULT_HEIGHT,
  ICON_SIZE: 18,
  GAP: IS_IOS ? 12 : 10,
} as const;
