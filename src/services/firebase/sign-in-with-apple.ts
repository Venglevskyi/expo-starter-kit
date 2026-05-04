import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { AppleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';

import { IS_IOS } from '@/constants/platform';

import { firebaseAuth } from './init';
import { createUserProfileIfMissing } from './user-profile';

const generateRandomNonce = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const signInWithApple = async (): Promise<void> => {
  if (!IS_IOS) {
    throw new Error('Apple sign-in is only available on iOS.');
  }

  const rawNonce = await generateRandomNonce();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!appleCredential.identityToken) {
    throw new Error('Apple sign-in did not return an identity token.');
  }

  const givenName = appleCredential.fullName?.givenName ?? '';
  const familyName = appleCredential.fullName?.familyName ?? '';
  const appleDisplayName = `${givenName} ${familyName}`.trim() || null;

  const firebaseCredential = AppleAuthProvider.credential(appleCredential.identityToken, rawNonce);
  const { user } = await signInWithCredential(firebaseAuth, firebaseCredential);

  try {
    await createUserProfileIfMissing({
      user,
      provider: 'apple',
      displayName: appleDisplayName,
    });
  } catch (error) {
    if (__DEV__) console.warn('[auth] Apple post-sign-in housekeeping failed', error);
  }
};
