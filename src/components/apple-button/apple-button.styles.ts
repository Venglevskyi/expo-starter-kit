import { StyleSheet } from 'react-native-unistyles';

import { APPLE_BUTTON_DIMENSIONS } from '@/constants';

export const styles = StyleSheet.create((theme) => ({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.full,
  },
  container: {
    paddingHorizontal: theme.spacings.x16,
    flexDirection: 'row',
    gap: APPLE_BUTTON_DIMENSIONS.GAP,
    alignItems: 'center',
  },
}));
