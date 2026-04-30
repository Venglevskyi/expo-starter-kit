import Constants from 'expo-constants';

const getRequiredExtraConfigValue = (key: string): string => {
  const value = Constants.expoConfig?.extra?.[key];
  if (typeof value === 'string' && value.length > 0) return value;
  const message =
    `[oauth-config] Missing extra.${key}. ` + 'Check .env.local (dev) or EAS Secrets (CI).';
  if (__DEV__) throw new Error(message);
  console.warn(message);
  return '';
};

export const oauthConfig = {
  googleWebClientId: getRequiredExtraConfigValue('googleWebClientId'),
  googleIosClientId: getRequiredExtraConfigValue('googleIosClientId'),
  googleAndroidClientId: getRequiredExtraConfigValue('googleAndroidClientId'),
} as const;
