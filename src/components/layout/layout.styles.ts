import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    variants: {
      backgroundColor: {
        primary: { backgroundColor: theme.colors.background.primary },
        gradient: {},
      },
    },
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: rt.insets.top,
    paddingBottom: rt.insets.bottom,
  },
}));
