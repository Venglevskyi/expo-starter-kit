import { Stack } from 'expo-router';

import { useIsAdmin } from '@/features/auth';

const MainLayout = () => {
  const isAdmin = useIsAdmin();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Protected guard={isAdmin}>
        <Stack.Screen name="admin" options={{ headerShown: true, title: 'Admin' }} />
      </Stack.Protected>
    </Stack>
  );
};

export default MainLayout;
