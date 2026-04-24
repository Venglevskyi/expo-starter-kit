import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';

import { Role, type User } from '@/types';
import { signInSchema, type SignInFormValues } from '@/utils/validation';

import { useAuthStore } from '../store/auth.store';

const MOCK_USER: User = {
  id: 'mock-user-1',
  email: 'user@example.com',
  name: 'Demo User',
  role: Role.User,
};

export const useSignInForm = () => {
  const { push } = useRouter();
  const signIn = useAuthStore((state) => state.signIn);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const onSignIn = handleSubmit(({ email }) => {
    signIn({ ...MOCK_USER, email });
  });

  const onSocialAuth = async () => {
    // TODO: wire OAuth providers.
  };

  const onForgotPassword = () => push('/forgot-password');

  return {
    control,
    isValid,
    isSubmitting,
    onSignIn,
    onSocialAuth,
    onForgotPassword,
  };
};
