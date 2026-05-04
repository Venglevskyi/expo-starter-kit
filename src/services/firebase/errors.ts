import type { FirebaseAuthError } from './init';

const FIREBASE_AUTH_ERROR_CODE_PREFIX = 'auth/';

export const isFirebaseAuthError = (error: unknown): error is FirebaseAuthError => {
  if (typeof error !== 'object' || error === null) return false;
  const errorCode = (error as { code?: unknown }).code;
  return typeof errorCode === 'string' && errorCode.startsWith(FIREBASE_AUTH_ERROR_CODE_PREFIX);
};

const USER_CANCELLED_CODES = new Set<string>(['ERR_REQUEST_CANCELED', 'AUTH_USER_CANCELLED']);

type UserCancelledError = Error & { code: 'AUTH_USER_CANCELLED' };

export const createUserCancelledError = (): UserCancelledError => {
  const error = new Error('Sign-in was cancelled.') as UserCancelledError;
  error.code = 'AUTH_USER_CANCELLED';
  return error;
};

export const isUserCancelledError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) return false;
  const errorCode = (error as { code?: unknown }).code;
  return typeof errorCode === 'string' && USER_CANCELLED_CODES.has(errorCode);
};
