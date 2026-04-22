import { createJSONStorage, persist } from 'zustand/middleware';

import { create, resetAllStores, zustandStorage } from '@/services';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => {
        resetAllStores();
      },
    }),
    { name: 'auth', storage: createJSONStorage(() => zustandStorage) },
  ),
);
