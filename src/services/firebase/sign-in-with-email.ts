import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

import { firebaseAuth } from './init';
import { isFirebaseAuthError } from './errors';
import { createUserProfileIfMissing } from './user-profile';

export const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
  try {
    const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await createUserProfileIfMissing({ user, provider: 'email' });
    return true;
  } catch (error) {
    if (!isFirebaseAuthError(error) || error.code !== 'auth/email-already-in-use') {
      throw error;
    }
    const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password);
    await createUserProfileIfMissing({ user, provider: 'email' });
    return false;
  }
};
