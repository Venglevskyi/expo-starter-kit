export const fonts = {
  poppinsRegular: 'Poppins-Regular',
  poppinsMedium: 'Poppins-Medium',
  poppinsSemiBold: 'Poppins-SemiBold',
  robotoMedium: 'Roboto-Medium',
} as const;

export type FontKey = keyof typeof fonts;
export type FontValue = (typeof fonts)[FontKey];
