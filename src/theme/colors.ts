import type { Colors } from './types';

// ---------------------------------------------------------------------------
// 1. Palette from Figma (Base colors)
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

// ---------------------------------------------------------------------------
// 2. Light Theme
// ---------------------------------------------------------------------------
export const light: Colors = {
  background: {
    primary: '#fafafa',
    gradient: [palette.burgundy[200], palette.green[100]],
  },
  surface: {
    default: palette.neutral.white,
    subtle: palette.neutral[50],
  },
  text: {
    primary: palette.neutral[900],
    secondary: palette.neutral[800],
    muted: palette.neutral[700],
    placeholder: palette.neutral[600],
    inverse: palette.neutral.white,
  },
  border: {
    default: palette.neutral[600],
    // Mirrors iOS `quaternarySystemFill` — a subtle neutral that works on light surfaces.
    subtle: 'rgba(116, 116, 128, 0.18)',
  },
  brand: {
    default: palette.green[700],
    dark: palette.green[800],
    light: palette.green[50],
  },
  action: {
    default: palette.orange[600],
    hover: palette.orange[400],
    light: palette.orange[50],
  },
  accent: {
    default: palette.burgundy[700],
    dark: palette.burgundy[800],
    mid: palette.burgundy[200],
    light: palette.burgundy[50],
  },
  tag: {
    green: { bg: palette.green[100], text: palette.green[800] },
    burgundy: { bg: palette.burgundy[200], text: palette.burgundy[800] },
    blue: { bg: palette.blue[600], text: palette.blue[50] },
    dark: { bg: palette.green[800], text: palette.neutral[50] },
  },
  icon: {
    default: palette.neutral[700],
    muted: palette.neutral[600],
    inverse: palette.neutral.white,
  },
  star: palette.orange[400],
  button: {
    primaryBg: palette.orange[600],
    primaryText: palette.orange[50],
    secondaryBorder: palette.orange[600],
    secondaryText: palette.orange[600],
    neutralBg: palette.neutral[50],
    neutralText: palette.neutral[700],
    iconBg: palette.neutral[50],
  },
  appleButton: {
    backgroundColor: '#000000',
    text: '#FFFFFF',
    borderColor: '#000000',
  },
  googleButton: {
    light: { bg: '#FFFFFF', text: '#1F1F1F', border: '#747775' },
    neutral: { bg: '#F2F2F2', text: '#1F1F1F', border: 'transparent' },
  },
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// ---------------------------------------------------------------------------
// 3. Dark Theme
// ---------------------------------------------------------------------------
export const dark: Colors = {
  background: {
    primary: palette.neutral[900],
    gradient: [palette.neutral[700], palette.neutral[900]],
  },
  surface: {
    default: '#2C3135',
    subtle: palette.neutral[800],
  },
  text: {
    primary: palette.neutral.white,
    secondary: palette.neutral[200],
    muted: palette.neutral[600],
    placeholder: palette.neutral[700],
    inverse: palette.neutral[900],
  },
  border: {
    default: palette.neutral[800],
    // Mirrors iOS dark `quaternarySystemFill`.
    subtle: 'rgba(118, 118, 128, 0.36)',
  },
  brand: {
    default: palette.green[100],
    dark: palette.green[50],
    light: palette.green[800],
  },
  action: {
    default: palette.orange[400],
    hover: palette.orange[600],
    light: palette.orange[50],
  },
  accent: {
    default: palette.burgundy[200],
    dark: palette.burgundy[50],
    mid: palette.burgundy[700],
    light: palette.burgundy[800],
  },
  tag: {
    green: { bg: palette.green[800], text: palette.green[100] },
    burgundy: { bg: palette.burgundy[800], text: palette.burgundy[200] },
    blue: { bg: palette.blue[600], text: palette.blue[50] },
    dark: { bg: palette.neutral.white, text: palette.neutral[900] },
  },
  icon: {
    default: palette.neutral[200],
    muted: palette.neutral[600],
    inverse: palette.neutral[900],
  },
  star: palette.orange[400],
  button: {
    primaryBg: palette.orange[400],
    primaryText: palette.neutral[900],
    secondaryBorder: palette.orange[400],
    secondaryText: palette.orange[400],
    neutralBg: palette.neutral[800],
    neutralText: palette.neutral[200],
    iconBg: palette.neutral[800],
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
    text: '#000000',
    borderColor: '#FFFFFF',
  },
  googleButton: {
    light: { bg: '#131314', text: '#E3E3E3', border: '#8E918F' },
    neutral: { bg: '#131314', text: '#E3E3E3', border: '#8E918F' },
  },
  shadow: 'rgba(0, 0, 0, 0.5)',
};
