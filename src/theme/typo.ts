export const typo = {
  // Headline
  headlineMedium: { fontSize: 20, lineHeight: 26 },
  headlineSmall: { fontSize: 18, lineHeight: 23 },

  // Title
  titleMedium: { fontSize: 16, lineHeight: 24 },

  // Body
  bodyLarge: { fontSize: 14, lineHeight: 20 },
  bodyMedium: { fontSize: 14, lineHeight: 20 },
  bodySmallMedium: { fontSize: 12, lineHeight: 15 },
  bodySmall: { fontSize: 12, lineHeight: 15 },

  // Labels & Tags
  labelSmall: { fontSize: 12, lineHeight: 14 },
  labelMedium: { fontSize: 14, lineHeight: 18 },
} as const;

export type TypoKey = keyof typeof typo;
