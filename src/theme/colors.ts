// ---------------------------------------------------------------------------
// Palette from Figma
// ---------------------------------------------------------------------------
export const palette = {
  neutral: {
    white: '#ffffff',
    50: '#f4f5f6',
    200: '#e0e3e7',
    600: '#888b8f',
    700: '#686b6e',
    800: '#45484b',
    900: '#212629',
  },

  green: {
    50: '#eef8f3',
    100: '#d8efe5',
    700: '#295c4d',
    800: '#264e43',
  },

  burgundy: {
    50: '#faf5f7',
    200: '#f0dae2',
    700: '#954152',
    800: '#7c3844',
  },

  orange: {
    50: '#fff5ed',
    400: '#f87c3f',
    600: '#e84010',
  },

  blue: {
    50: '#eefbfd',
    600: '#197ba1',
  },
} as const;

export const colors = {
  // App background (--bg)
  background: '#fafafa',

  // Surface / card backgrounds
  surface: {
    default: palette.neutral.white,
    subtle: palette.neutral[50],
  },

  // Text hierarchy
  text: {
    primary: palette.neutral[900],
    secondary: palette.neutral[800],
    muted: palette.neutral[700],
    placeholder: palette.neutral[600],
    inverse: palette.neutral.white,
  },

  // Borders & dividers
  border: {
    default: palette.neutral[200],
  },

  // Brand — green identity
  brand: {
    default: palette.green[700],
    dark: palette.green[800],
    light: palette.green[50],
  },

  // Primary action / CTA — orange
  action: {
    default: palette.orange[600],
    hover: palette.orange[400],
    light: palette.orange[50],
  },

  // Secondary accent — burgundy (tags, category chips)
  accent: {
    default: palette.burgundy[700],
    dark: palette.burgundy[800],
    mid: palette.burgundy[200],
    light: palette.burgundy[50],
  },

  // Tag colors for status labels
  tag: {
    green: {
      bg: palette.green[100],
      text: palette.green[800],
    },
    burgundy: {
      bg: palette.burgundy[200],
      text: palette.burgundy[800],
    },
    blue: {
      bg: palette.blue[600],
      text: palette.blue[50],
    },
    dark: {
      bg: palette.green[800],
      text: palette.neutral[50],
    },
  },

  // Icons
  icon: {
    default: palette.neutral[700],
    muted: palette.neutral[600],
    inverse: palette.neutral.white,
  },

  // Star rating
  star: palette.orange[400],

  // Button-specific
  button: {
    primaryBg: palette.orange[600],
    primaryText: palette.orange[50],
    secondaryBorder: palette.orange[600],
    secondaryText: palette.orange[600],
    neutralBg: palette.neutral[50],
    neutralText: palette.neutral[700],
    iconBg: palette.neutral[50],
  },

  // Apple Sign-In button (per Apple HIG)
  appleButton: {
    bg: '#000000',
    text: '#FFFFFF',
    border: '#000000',
  },

  // Google Sign-In button (per Google brand guidelines)
  googleButton: {
    light: {
      bg: '#FFFFFF',
      text: '#1F1F1F',
      border: '#747775',
    },
    dark: {
      bg: '#131314',
      text: '#E3E3E3',
      border: '#8E918F',
    },
    neutral: {
      bg: '#F2F2F2',
      text: '#1F1F1F',
    },
  },
} as const;
