import { IS_IOS } from '@/constants';

export const spacings = {
  x1: 2,
  x2: 4,
  x3: 6,
  x4: 8,
  x5: 10,
  x6: 12,
  x8: 16,
  x10: 20,
  x12: 24,
  x14: 28,
  x16: 32,
  x20: 40,
  custom: (value: number) => value,
  platform: (ios: number, android: number) => (IS_IOS ? ios : android),
} as const;

export type SpacingKey = keyof typeof spacings;
