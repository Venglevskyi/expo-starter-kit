import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner-native';

import { signInWithEmail } from '@/services/firebase';
import { signInSchema, type SignInFormValues } from '@/utils/validation';

import { getReadableAuthErrorMessage } from '../utils/firebase-error-message';

export const useSignInForm = () => {
  const { control, handleSubmit, formState } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const onSignIn = handleSubmit(async ({ email, password }) => {
    try {
      const wasAccountCreated = await signInWithEmail(email, password);
      if (wasAccountCreated) toast.success('Account created. Welcome!');
    } catch (error) {
      toast.error(getReadableAuthErrorMessage(error));
    }
  });

  return {
    control,
    onSignIn,
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
  };
};
