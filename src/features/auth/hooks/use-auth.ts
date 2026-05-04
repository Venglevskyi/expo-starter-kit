import { useAuthStore } from '../store/auth.store';

export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.user !== null);
export const useIsAdmin = () => useAuthStore((state) => state.user?.role === 'admin');
export const useIsSessionReady = () => useAuthStore((state) => state.isSessionReady);
