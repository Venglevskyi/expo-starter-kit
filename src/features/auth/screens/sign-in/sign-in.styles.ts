import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacings.x12,
    gap: theme.spacings.x8,
  },
  actions: {
    gap: theme.spacings.x4,
  },
}));
