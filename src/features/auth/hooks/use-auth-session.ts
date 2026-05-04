import { useEffect } from 'react';
import { onAuthStateChanged } from '@react-native-firebase/auth';

import { firebaseAuth } from '@/services/firebase';

import { useAuthStore } from '../store/auth.store';

export const useAuthSession = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      try {
        await useAuthStore.getState().hydrateFromFirebase(firebaseUser);
      } catch (error) {
        if (__DEV__) console.warn('[auth] hydrateFromFirebase failed', error);
      } finally {
        useAuthStore.setState({ isSessionReady: true });
      }
    });
    return unsubscribe;
  }, []);
};
