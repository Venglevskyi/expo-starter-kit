import { fonts } from './fonts';

export const typo = {
  // Display
  displayLarge: { fontSize: 57, lineHeight: 64, fontFamily: fonts.poppinsSemiBold },
  displayMedium: { fontSize: 45, lineHeight: 52, fontFamily: fonts.poppinsSemiBold },
  displaySmall: { fontSize: 36, lineHeight: 44, fontFamily: fonts.poppinsSemiBold },

  // Headline
  headlineLarge: { fontSize: 32, lineHeight: 40, fontFamily: fonts.poppinsSemiBold },
  headlineMedium: { fontSize: 28, lineHeight: 36, fontFamily: fonts.poppinsSemiBold },
  headlineSmall: { fontSize: 24, lineHeight: 32, fontFamily: fonts.poppinsSemiBold },

  // Title
  titleLarge: { fontSize: 20, lineHeight: 26, fontFamily: fonts.poppinsSemiBold },
  titleMedium: { fontSize: 16, lineHeight: 24, fontFamily: fonts.poppinsMedium },
  titleSmall: { fontSize: 14, lineHeight: 20, fontFamily: fonts.poppinsMedium },

  // Body
  bodyLarge: { fontSize: 16, lineHeight: 24, fontFamily: fonts.poppinsRegular },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontFamily: fonts.poppinsRegular },
  bodySmall: { fontSize: 12, lineHeight: 16, fontFamily: fonts.poppinsRegular },

  // Label
  labelLarge: { fontSize: 14, lineHeight: 20, fontFamily: fonts.poppinsMedium },
  labelMedium: { fontSize: 12, lineHeight: 16, fontFamily: fonts.poppinsMedium },
  labelSmall: { fontSize: 11, lineHeight: 16, fontFamily: fonts.poppinsMedium },
} as const;

export type TypoVariant = keyof typeof typo;
