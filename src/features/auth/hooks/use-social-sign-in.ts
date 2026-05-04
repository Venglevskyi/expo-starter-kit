import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner-native';

import {
  firebaseAuth,
  isUserCancelledError,
  signInWithApple as signInWithAppleService,
  signInWithGoogle as signInWithGoogleService,
} from '@/services/firebase';

import { useAuthStore } from '../store/auth.store';
import type { SocialProvider } from '../types';
import { getReadableAuthErrorMessage } from '../utils/firebase-error-message';

const socialSignInServices: Record<SocialProvider, () => Promise<void>> = {
  apple: signInWithAppleService,
  google: signInWithGoogleService,
};

export const useSocialSignIn = () => {
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(null);
  const isSocialSignInInProgress = useRef(false);

  const signInWithProvider = useCallback(async (provider: SocialProvider) => {
    if (isSocialSignInInProgress.current) return;
    isSocialSignInInProgress.current = true;
    setPendingProvider(provider);

    try {
      await socialSignInServices[provider]();

      const { currentUser } = firebaseAuth;
      if (currentUser) {
        await useAuthStore.getState().hydrateFromFirebase(currentUser);
      }
    } catch (error) {
      if (isUserCancelledError(error)) return;
      toast.error(getReadableAuthErrorMessage(error));
    } finally {
      isSocialSignInInProgress.current = false;
      setPendingProvider(null);
    }
  }, []);

  const signInWithApple = useCallback(() => signInWithProvider('apple'), [signInWithProvider]);
  const signInWithGoogle = useCallback(() => signInWithProvider('google'), [signInWithProvider]);

  return {
    signInWithApple,
    signInWithGoogle,
    pendingProvider,
    isLoading: pendingProvider !== null,
  };
};
