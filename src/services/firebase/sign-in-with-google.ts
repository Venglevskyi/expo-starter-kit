import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';

import { createUserCancelledError } from './errors';
import { createUserProfileIfMissing } from './user-profile';
import { firebaseAuth } from './init';
import { oauthConfig } from './oauth-config';

let isGoogleSignInConfigured = false;

const ensureGoogleSignInConfigured = () => {
  if (isGoogleSignInConfigured) return;
  GoogleSignin.configure({
    webClientId: oauthConfig.googleWebClientId,
    iosClientId: oauthConfig.googleIosClientId,
  });
  isGoogleSignInConfigured = true;
};

export const signInWithGoogle = async (): Promise<void> => {
  ensureGoogleSignInConfigured();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  let response;
  try {
    response = await GoogleSignin.signIn();
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw createUserCancelledError();
    }
    throw error;
  }

  if (!isSuccessResponse(response)) {
    throw createUserCancelledError();
  }

  const { idToken } = response.data;
  if (!idToken) {
    throw new Error('Google sign-in did not return an id_token.');
  }

  const firebaseCredential = GoogleAuthProvider.credential(idToken);
  const { user } = await signInWithCredential(firebaseAuth, firebaseCredential);

  await createUserProfileIfMissing({ user, provider: 'google' });
};
