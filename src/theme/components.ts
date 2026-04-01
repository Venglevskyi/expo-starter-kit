export const components = {
  row: { flexDirection: 'row' },
  flex: { flex: 1 },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hidden: { overflow: 'hidden' },
  none: {
    display: 'none',
  },
  test: {
    borderColor: 'red',
    borderWidth: 1,
  },
} as const;

export type StylesKey = keyof typeof components;
