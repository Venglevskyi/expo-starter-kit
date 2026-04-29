import React from 'react';
import { PressableScale } from 'pressto';
import { ActivityIndicator, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import AppleIcon from '@/assets/icons/apple_icon.svg';
import Typography from '@/components/typography';

import { type Props } from './types';
import { styles } from './apple-button.styles';
import { APPLE_BUTTON_DIMENSIONS } from '@/constants';

// https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple
const AppleButton = ({
  width = '100%',
  height = APPLE_BUTTON_DIMENSIONS.HEIGHT,
  label,
  style,
  isLoading,
  onPress,
}: Props) => {
  const { theme } = useUnistyles();
  const { text, backgroundColor, borderColor } = theme.colors.appleButton;

  return (
    <PressableScale
      enabled={!isLoading}
      style={[styles.wrapper, { width, height, backgroundColor, borderColor }, style]}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size="small" color={text} />
      ) : (
        <View style={styles.container}>
          <AppleIcon
            color={text}
            width={APPLE_BUTTON_DIMENSIONS.ICON_SIZE}
            height={APPLE_BUTTON_DIMENSIONS.ICON_SIZE}
          />

          <Typography variant="titleMedium" color={text} font="Roboto-Medium">
            {label}
          </Typography>
        </View>
      )}
    </PressableScale>
  );
};

export default AppleButton;
