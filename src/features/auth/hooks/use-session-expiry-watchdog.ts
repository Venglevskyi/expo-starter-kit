import { useEffect } from 'react';
import { AppState } from 'react-native';

import { signOut } from '@/services/firebase';

import { authConfig } from '../config';
import { useAuthStore } from '../store/auth.store';

const signOutIfSessionExpired = async (sessionExpiresAt: number) => {
  if (Date.now() < sessionExpiresAt) return;
  try {
    await signOut();
  } catch (error) {
    if (__DEV__) console.warn('[auth] signOut from watchdog failed', error);
  }
};

export const useSessionExpiryWatchdog = () => {
  const sessionStartedAt = useAuthStore((state) => state.sessionStartedAt);

  useEffect(() => {
    if (sessionStartedAt === null) return;
    const sessionExpiresAt = sessionStartedAt + authConfig.sessionMaxAgeMs;

    signOutIfSessionExpired(sessionExpiresAt);

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') signOutIfSessionExpired(sessionExpiresAt);
    });

    return () => subscription.remove();
  }, [sessionStartedAt]);
};
