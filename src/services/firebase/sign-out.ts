import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signOut as firebaseSignOut } from '@react-native-firebase/auth';

import { firebaseAuth } from './init';

export const signOut = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    if (__DEV__) console.warn('[auth] GoogleSignin.signOut failed', error);
  }

  await firebaseSignOut(firebaseAuth);
};
