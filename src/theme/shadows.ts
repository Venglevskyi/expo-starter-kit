export const shadows = {
  card: {
    shadowColor: 'rgba(31, 58, 50, 0.08)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 4,
  },
  bottomBar: {
    shadowColor: 'rgba(129, 128, 135, 0.1)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

export type ShadowsKey = keyof typeof shadows;
