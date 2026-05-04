import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from '@react-native-firebase/firestore';

import { firebaseDb, type FirebaseUser } from './init';
import type { AuthProvider, UserProfile } from './types';

type CreateUserProfileArgs = {
  user: FirebaseUser;
  provider: AuthProvider;
  displayName?: string | null;
};

export const createUserProfileIfMissing = async ({
  user,
  provider,
  displayName,
}: CreateUserProfileArgs): Promise<void> => {
  const profileRef = doc(firebaseDb, 'users', user.uid);
  const snapshot = await getDoc(profileRef);
  if (snapshot.exists()) return;

  await setDoc(profileRef, {
    uid: user.uid,
    email: user.email,
    displayName: displayName ?? user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    role: 'user' as const,
    provider,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

const convertFirestoreTimestampToIsoString = (timestamp: Timestamp | null): string => {
  if (timestamp === null) return new Date().toISOString();
  return timestamp.toDate().toISOString();
};

export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snapshot = await getDoc(doc(firebaseDb, 'users', uid));
  if (!snapshot.exists()) return null;

  const firestoreProfile = snapshot.data() as Omit<UserProfile, 'createdAt' | 'updatedAt'> & {
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
  };

  return {
    ...firestoreProfile,
    createdAt: convertFirestoreTimestampToIsoString(firestoreProfile.createdAt),
    updatedAt: convertFirestoreTimestampToIsoString(firestoreProfile.updatedAt),
  };
};
