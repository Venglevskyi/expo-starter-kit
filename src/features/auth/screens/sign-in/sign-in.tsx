import { View } from 'react-native';

import Button, { ButtonVariant } from '@/components/button';
import Layout from '@/components/layout';
import Typography from '@/components/typography';
import { Role, type User } from '@/types';

import { useAuthStore } from '../../store/auth.store';

import { styles } from './sign-in.styles';

const MOCK_USER: User = {
  id: 'mock-user-1',
  email: 'user@example.com',
  name: 'Demo User',
  role: Role.User,
};

const MOCK_ADMIN: User = {
  id: 'mock-admin-1',
  email: 'admin@example.com',
  name: 'Demo Admin',
  role: Role.Admin,
};

const SignIn = () => {
  const signIn = useAuthStore((state) => state.signIn);

  return (
    <Layout contentContainerStyle={styles.content}>
      <Typography variant="headlineSmall" align="center">
        Sign In
      </Typography>
      <View style={styles.actions}>
        <Button label="Sign in as User" onPress={() => signIn(MOCK_USER)} />
        <Button
          label="Sign in as Admin"
          variant={ButtonVariant.Secondary}
          onPress={() => signIn(MOCK_ADMIN)}
        />
      </View>
    </Layout>
  );
};

export default SignIn;
