import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { PressableScale } from 'pressto';

import GoogleIcon from '@/assets/icons/google_icon.svg';
import Typography from '@/components/Typography';

import { type GoogleButtonType, type Props } from './types';
import {
  IS_IOS,
  GOOGLE_BUTTON_DIMENSIONS,
  GOOGLE_BUTTON_SHAPES,
  GOOGLE_BUTTON_TYPES,
} from '@/constants';

// https://developers.google.com/identity/branding-guidelines
export const GoogleButton = ({
  type = GOOGLE_BUTTON_TYPES.LIGHT,
  shape = GOOGLE_BUTTON_SHAPES.ROUNDED,
  width = '100%',
  height = GOOGLE_BUTTON_DIMENSIONS.HEIGHT,
  label,
  style,
  isLoading,
  isIconOnly = shape === GOOGLE_BUTTON_SHAPES.CIRCLE,
  onPress,
}: Props) => {
  const { theme } = useUnistyles();
  const colors = theme.colors.googleButton[type];

  return (
    <PressableScale
      onPress={onPress}
      enabled={!isLoading}
      style={[styles.pressable(type, height, width, shape), style]}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <View style={styles.content(isIconOnly)}>
          <GoogleIcon
            width={GOOGLE_BUTTON_DIMENSIONS.ICON_SIZE}
            height={GOOGLE_BUTTON_DIMENSIONS.ICON_SIZE}
          />

          {!isIconOnly && label && (
            <Typography variant="titleSmall" font="Roboto-Medium" color={colors.text}>
              {label}
            </Typography>
          )}
        </View>
      )}
    </PressableScale>
  );
};

export default GoogleButton;

const styles = StyleSheet.create((theme) => ({
  pressable: (
    type: GoogleButtonType,
    height: number,
    width: number | `${number}%`,
    shape: GOOGLE_BUTTON_SHAPES,
  ) => {
    const colors = theme.colors.googleButton[type];
    return {
      justifyContent: 'center',
      alignItems: 'center',
      height,
      width: shape === GOOGLE_BUTTON_SHAPES.CIRCLE ? height : width,
      borderRadius:
        shape === GOOGLE_BUTTON_SHAPES.CIRCLE
          ? height / 2
          : shape === GOOGLE_BUTTON_SHAPES.ROUNDED
            ? theme.radius.full
            : theme.radius.sm,
      backgroundColor: colors.bg,
      borderWidth: type === GOOGLE_BUTTON_TYPES.LIGHT ? 1 : 0,
      borderColor: colors.border,
    };
  },
  content: (iconOnly: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: iconOnly ? 0 : IS_IOS ? theme.spacings.x8 : theme.spacings.x5,
    gap: iconOnly ? 0 : GOOGLE_BUTTON_DIMENSIONS.GAP,
  }),
}));
