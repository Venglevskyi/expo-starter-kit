import type { FirebaseUser, UserProfile } from '@/services/firebase';

import type { AuthUser } from '../types';

export const mergeAuthUser = (
  firebaseUser: FirebaseUser,
  profile: UserProfile | null,
): AuthUser => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: profile?.displayName ?? firebaseUser.displayName ?? null,
  photoURL: profile?.photoURL ?? firebaseUser.photoURL ?? null,
  role: profile?.role ?? 'user',
  provider: profile?.provider ?? 'email',
  isEmailVerified: firebaseUser.emailVerified,
  createdAt: profile?.createdAt ?? null,
  updatedAt: profile?.updatedAt ?? null,
});
