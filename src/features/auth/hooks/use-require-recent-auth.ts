import { useCallback } from 'react';
import { toast } from 'sonner-native';

import { firebaseAuth, signOut } from '@/services/firebase';

import { authConfig } from '../config';

export const useRequireRecentAuth = () =>
  useCallback(async (): Promise<boolean> => {
    const lastSignInTime = firebaseAuth.currentUser?.metadata.lastSignInTime;
    if (!lastSignInTime) return false;

    const secondsSinceLastSignIn = Math.floor(
      (Date.now() - new Date(lastSignInTime).getTime()) / 1000,
    );
    if (secondsSinceLastSignIn <= authConfig.recentAuthMaxAgeSec) return true;

    toast.info('Please sign in again to continue.');
    await signOut();
    return false;
  }, []);
