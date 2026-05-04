import { z } from 'zod';

export const emailSchema = z.email('Enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Must be at least 6 characters')
  .regex(/[0-9]/, 'Must contain a digit');

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInFormValues = z.infer<typeof signInSchema>;
