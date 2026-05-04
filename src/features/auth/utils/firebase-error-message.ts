import { isFirebaseAuthError } from '@/services/firebase';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again in a few minutes.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/requires-recent-login': 'For security, please sign in again to continue.',
  'auth/account-exists-with-different-credential':
    'An account with this email exists under a different sign-in method.',
};

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

export const getReadableAuthErrorMessage = (error: unknown): string => {
  if (!isFirebaseAuthError(error)) return FALLBACK_MESSAGE;
  return AUTH_ERROR_MESSAGES[error.code] ?? FALLBACK_MESSAGE;
};
