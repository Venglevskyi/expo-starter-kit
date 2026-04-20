import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  content: {
    paddingHorizontal: theme.spacings.x12,
    justifyContent: 'center',
  },
  fields: {
    gap: theme.spacings.x6,
  },
  stickyFooter: {
    paddingHorizontal: theme.spacings.x12,
    paddingVertical: theme.spacings.x4,
  },
}));
