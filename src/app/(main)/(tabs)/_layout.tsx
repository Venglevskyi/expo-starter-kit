import { NativeTabs } from 'expo-router/unstable-native-tabs';

const TabsLayout = () => (
  <NativeTabs>
    <NativeTabs.Trigger name="index">
      <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="profile">
      <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="settings">
      <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
    </NativeTabs.Trigger>
  </NativeTabs>
);

export default TabsLayout;
