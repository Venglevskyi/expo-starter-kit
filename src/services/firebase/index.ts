export { firebaseAuth, firebaseDb } from './init';
export type { FirebaseUser, FirebaseAuthError } from './init';
export type { AuthProvider, UserProfile, UserRole } from './types';

export { signInWithEmail } from './sign-in-with-email';
export { signInWithApple } from './sign-in-with-apple';
export { signInWithGoogle } from './sign-in-with-google';
export { signOut } from './sign-out';
export { fetchUserProfile } from './user-profile';
export { isFirebaseAuthError, isUserCancelledError } from './errors';
