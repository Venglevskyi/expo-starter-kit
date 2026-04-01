import { PressableScale } from 'pressto';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import GoogleIcon from '@/assets/icons/google_icon.svg';
import Typography from '@/components/Typography';

import {
  GOOGLE_BUTTON_DIMENSIONS,
  GOOGLE_BUTTON_SHAPES,
  GOOGLE_BUTTON_TYPES,
  type Props,
} from './types';
import { useStyles } from './useStyles';

//https://developers.google.com/identity/branding-guidelines

export const GoogleButton = ({
  type = GOOGLE_BUTTON_TYPES.light,
  shape = GOOGLE_BUTTON_SHAPES.rounded,
  width = '100%',
  height = GOOGLE_BUTTON_DIMENSIONS.height,
  label,
  style,
  isLoading,
  isIconOnly = shape === GOOGLE_BUTTON_SHAPES.circle,
  onPress,
}: Props) => {
  const { styles, loaderColor } = useStyles({ type, shape, height, width });

  return (
    <PressableScale onPress={onPress} enabled={!isLoading} style={[styles.pressable, style]}>
      {isLoading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        <View style={styles.container}>
          <GoogleIcon />

          {!isIconOnly && label && (
            <Typography variant="bodyMedium" font="robotoMedium" color={loaderColor}>
              {label}
            </Typography>
          )}
        </View>
      )}
    </PressableScale>
  );
};

export default GoogleButton;
