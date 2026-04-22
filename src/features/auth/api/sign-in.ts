import type { User } from '@/types';

export const signInApi = async (_email: string, _password: string): Promise<User> => {
  throw new Error('Not implemented — wire real API here');
};
