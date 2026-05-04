import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Toaster } from 'sonner-native';

import {
  useAuthSession,
  useIsAuthenticated,
  useIsSessionReady,
  useSessionExpiryWatchdog,
} from '@/features/auth';
import { RootProviders } from '@/providers';

const RootLayout = () => {
  useAuthSession();
  useSessionExpiryWatchdog();

  const isSessionReady = useIsSessionReady();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isSessionReady) SplashScreen.hideAsync();
  }, [isSessionReady]);

  if (!isSessionReady) return null;

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
      <Toaster position="top-center" />
    </RootProviders>
  );
};

export default RootLayout;
