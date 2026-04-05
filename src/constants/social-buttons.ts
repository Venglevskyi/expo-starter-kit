import { IS_IOS } from './platform';

// APPLE ================================
export enum APPLE_BUTTON_LABELS {
  SIGN_IN = 'Sign in with Apple',
  SIGN_UP = 'Sign up with Apple',
  CONTINUE = 'Continue with Apple',
}

export enum APPLE_BUTTON_DIMENSIONS {
  HEIGHT = 44,
  ICON_SIZE = 20,
  GAP = 8,
}

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

export enum GOOGLE_BUTTON_DIMENSIONS {
  HEIGHT = IS_IOS ? 44 : 40,
  ICON_SIZE = 20,
  GAP = IS_IOS ? 12 : 10,
}
