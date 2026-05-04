import { persist, createJSONStorage } from 'zustand/middleware';

import { create, createPersistMigrator, resetAllStores, zustandStorage } from '@/services';
import { fetchUserProfile } from '@/services/firebase';
import type { FirebaseUser, UserProfile } from '@/services/firebase';

import type { AuthUser } from '../types';
import { mergeAuthUser } from '../utils/merge-auth-user';

type AuthState = {
  user: AuthUser | null;
  sessionStartedAt: number | null;
  isSessionReady: boolean;
  hydrateFromFirebase: (firebaseUser: FirebaseUser | null) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      let pendingHydrationId = 0;

      return {
        user: null,
        sessionStartedAt: null,
        isSessionReady: false,

        hydrateFromFirebase: async (firebaseUser) => {
          const currentHydrationId = ++pendingHydrationId;

          if (!firebaseUser) {
            resetAllStores();
            return;
          }

          let profile: UserProfile | null = null;
          try {
            profile = await fetchUserProfile(firebaseUser.uid);
          } catch (error) {
            if (__DEV__) console.warn('[auth] fetchUserProfile failed', error);
          }

          if (currentHydrationId !== pendingHydrationId) return;

          const previousUid = get().user?.uid;
          set({
            user: mergeAuthUser(firebaseUser, profile),
            sessionStartedAt:
              previousUid === firebaseUser.uid
                ? (get().sessionStartedAt ?? Date.now())
                : Date.now(),
          });
        },
      };
    },
    {
      name: 'auth',
      storage: createJSONStorage(() => zustandStorage),
      ...createPersistMigrator<Partial<AuthState>>([]),
      partialize: (state) => ({
        user: state.user,
        sessionStartedAt: state.sessionStartedAt,
      }),
    },
  ),
);
