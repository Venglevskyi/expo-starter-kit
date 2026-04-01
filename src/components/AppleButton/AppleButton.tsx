import { PressableScale } from 'pressto';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import AppleIcon from '@/assets/icons/apple_icon.svg';
import Typography from '@/components/Typography';

import { theme } from '@/theme';
import { APPLE_BUTTON_DIMENSIONS, type Props } from './types';
import { useStyles } from './useStyles';

// https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple

const AppleButton = ({
  width = '100%',
  height = APPLE_BUTTON_DIMENSIONS.height,
  label,
  style,
  isLoading,
  onPress,
}: Props) => {
  const { styles } = useStyles({ width, height });

  return (
    <PressableScale onPress={onPress} enabled={!isLoading} style={[styles.pressable, style]}>
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.appleButton.text} />
      ) : (
        <View style={styles.container}>
          <AppleIcon
            width={APPLE_BUTTON_DIMENSIONS.iconSize}
            height={APPLE_BUTTON_DIMENSIONS.iconSize}
          />

          <Typography variant="bodyMedium" font="medium" color={theme.colors.appleButton.text}>
            {label}
          </Typography>
        </View>
      )}
    </PressableScale>
  );
};

export default AppleButton;
