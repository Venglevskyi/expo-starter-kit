import { Stack } from 'expo-router';

import { useIsAuthenticated } from '@/features/auth';
import { RootProviders } from '@/providers';

const RootLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <RootProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(main)" />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </RootProviders>
  );
};

export default RootLayout;
