import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  content: {
    paddingHorizontal: theme.spacings.x12,
    gap: theme.spacings.x12,
  },
  form: {
    gap: theme.spacings.x6,
    flex: 1,
    justifyContent: 'center',
  },
  fields: {
    gap: theme.spacings.x4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordLabel: {
    color: theme.colors.action.default,
    textDecorationLine: 'underline',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacings.x4,
    marginVertical: theme.spacings.x4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.subtle,
  },
  dividerLabel: {
    color: theme.colors.text.muted,
  },
  socialButtons: {
    gap: theme.spacings.x8,
  },
  footer: {
    color: theme.colors.text.muted,
  },
}));
