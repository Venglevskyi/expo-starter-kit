import { useRouter } from 'expo-router';
import { View } from 'react-native';

import Button, { ButtonVariant } from '@/components/button';
import Layout from '@/components/layout';
import Typography from '@/components/typography';
import { signOut, useIsAdmin } from '@/features/auth';

import { styles } from './settings.styles';

const Settings = () => {
  const { push } = useRouter();
  const isAdmin = useIsAdmin();

  return (
    <Layout contentContainerStyle={styles.content}>
      <Typography variant="headlineSmall" align="center">
        Settings
      </Typography>
      <View style={styles.actions}>
        {isAdmin ? (
          <Button
            label="Open Admin"
            variant={ButtonVariant.Secondary}
            onPress={() => push('/admin')}
          />
        ) : null}
        <Button label="Sign out" variant={ButtonVariant.Neutral} onPress={signOut} />
      </View>
    </Layout>
  );
};

export default Settings;
