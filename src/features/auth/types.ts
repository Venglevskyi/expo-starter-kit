import type { AuthProvider, UserRole } from '@/services/firebase';

export type { AuthProvider };
export type SocialProvider = Extract<AuthProvider, 'apple' | 'google'>;

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  provider: AuthProvider;
  createdAt: string | null;
  updatedAt: string | null;
};
