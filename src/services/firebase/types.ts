export type UserRole = 'user' | 'admin';
export type AuthProvider = 'email' | 'apple' | 'google';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  provider: AuthProvider;
  createdAt: string;
  updatedAt: string;
};
