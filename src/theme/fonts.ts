export const fonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  robotoMedium: 'Roboto-Medium',
} as const;

export type FontKey = keyof typeof fonts;
