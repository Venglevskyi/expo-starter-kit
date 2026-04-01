export const spacings = {
  x2: 2,
  x4: 4,
  x6: 6,
  x8: 8,
  x10: 10,
  x12: 12,
  x14: 14,
  x16: 16,
  x20: 20,
  x24: 24,
  x32: 32,
  x40: 40,
} as const;

export type SpacingKey = keyof typeof spacings;
