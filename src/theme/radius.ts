export const radius = {
  sm: 8,
  md: 12,
  lg: 24,
  full: 1000,
} as const;

export type RadiusKey = keyof typeof radius;
