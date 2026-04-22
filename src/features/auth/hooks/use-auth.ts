import { Role } from '@/types';

import { useAuthStore } from '../store/auth.store';

export const useIsAuthenticated = () => useAuthStore((state) => state.user !== null);

export const useIsAdmin = () => useAuthStore((state) => state.user?.role === Role.Admin);

export const useCurrentUser = () => useAuthStore((state) => state.user);
