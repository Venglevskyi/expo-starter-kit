export {
  useCurrentUser,
  useIsAuthenticated,
  useIsAdmin,
  useIsSessionReady,
} from './hooks/use-auth';
export { useAuthSession } from './hooks/use-auth-session';
export { useSignInForm } from './hooks/use-sign-in-form';
export { useSocialSignIn } from './hooks/use-social-sign-in';
export { useRequireRecentAuth } from './hooks/use-require-recent-auth';
export { useSessionExpiryWatchdog } from './hooks/use-session-expiry-watchdog';

export { signOut } from '@/services/firebase';

export { authConfig } from './config';
export type { AuthUser, AuthProvider, SocialProvider } from './types';
