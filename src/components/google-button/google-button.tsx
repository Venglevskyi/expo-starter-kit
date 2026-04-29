import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { PressableScale } from 'pressto';

import GoogleIcon from '@/assets/icons/google_icon.svg';
import Typography from '@/components/typography';

import { type Props } from './types';
import { styles } from './google-button.styles';
import { GOOGLE_BUTTON_DIMENSIONS, GOOGLE_BUTTON_SHAPES, GOOGLE_BUTTON_TYPES } from '@/constants';

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
      enabled={!isLoading}
      style={[styles.pressable(type, height, width, shape), style]}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <View style={styles.content(isIconOnly)}>
          <GoogleIcon
            width={GOOGLE_BUTTON_DIMENSIONS.ICON_SIZE}
            height={GOOGLE_BUTTON_DIMENSIONS.ICON_SIZE}
          />

          {!isIconOnly && label ? (
            <Typography variant="titleMedium" font="Roboto-Medium" color={colors.text}>
              {label}
            </Typography>
          ) : null}
        </View>
      )}
    </PressableScale>
  );
};

export default GoogleButton;
