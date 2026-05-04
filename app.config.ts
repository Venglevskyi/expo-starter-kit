import type { ExpoConfig } from 'expo/config';

type Variant = 'development' | 'production';

const variant = (process.env.APP_VARIANT ?? 'development') as Variant;

const BUNDLE_PREFIX = process.env.BUNDLE_PREFIX ?? 'com.expostarter.app';
const APP_NAME = process.env.APP_NAME ?? 'Expo Starter';
const APP_SCHEME = process.env.APP_SCHEME ?? 'expo-starter-kit';

const variants: Record<
  Variant,
  {
    bundleIdentifier: string;
    androidPackage: string;
    displayName: string;
    iosGoogleServicesFile: string;
    androidGoogleServicesFile: string;
  }
> = {
  development: {
    bundleIdentifier: `${BUNDLE_PREFIX}.dev`,
    androidPackage: `${BUNDLE_PREFIX}.dev`,
    displayName: `${APP_NAME} (dev)`,
    iosGoogleServicesFile: './src/services/firebase/dev/GoogleService-Info.plist',
    androidGoogleServicesFile: './src/services/firebase/dev/google-services.json',
  },
  production: {
    bundleIdentifier: BUNDLE_PREFIX,
    androidPackage: BUNDLE_PREFIX,
    displayName: APP_NAME,
    iosGoogleServicesFile: './src/services/firebase/prod/GoogleService-Info.plist',
    androidGoogleServicesFile: './src/services/firebase/prod/google-services.json',
  },
};

const env = variants[variant];

const oauthClientIds = {
  development: {
    googleWebClientId: process.env.DEV_GOOGLE_WEB_CLIENT_ID ?? '',
    googleIosClientId: process.env.DEV_GOOGLE_IOS_CLIENT_ID ?? '',
    googleAndroidClientId: process.env.DEV_GOOGLE_ANDROID_CLIENT_ID ?? '',
  },
  production: {
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID ?? '',
    googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID ?? '',
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID ?? '',
  },
}[variant];

// "123-abc.apps.googleusercontent.com" → "com.googleusercontent.apps.123-abc"
// Required by @react-native-google-signin/google-signin to register the
// OAuth callback URL scheme in Info.plist via its config plugin.
const reverseGoogleClientId = (clientId: string): string => {
  if (!clientId) return '';
  const prefix = clientId.replace(/\.apps\.googleusercontent\.com$/, '');
  return `com.googleusercontent.apps.${prefix}`;
};

const googleIosUrlScheme = reverseGoogleClientId(oauthClientIds.googleIosClientId);

const config: ExpoConfig = {
  name: env.displayName,
  slug: 'expo-starter-kit',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: APP_SCHEME,
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
    bundleIdentifier: env.bundleIdentifier,
    usesAppleSignIn: true,
    googleServicesFile: env.iosGoogleServicesFile,
  },
  android: {
    package: env.androidPackage,
    googleServicesFile: env.androidGoogleServicesFile,
    predictiveBackGestureEnabled: false,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/Poppins-Regular.ttf',
          './assets/fonts/Poppins-Medium.ttf',
          './assets/fonts/Poppins-SemiBold.ttf',
          './assets/fonts/Roboto-Medium.ttf',
        ],
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        android: {
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      },
    ],
    'expo-web-browser',
    'expo-image',
    'expo-apple-authentication',
    'expo-local-authentication',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          forceStaticLinking: ['RNFBApp', 'RNFBAuth', 'RNFBFirestore'],
        },
      },
    ],
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    ['@react-native-google-signin/google-signin', { iosUrlScheme: googleIosUrlScheme }],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    variant,
    eas: {
      projectId: '33920df5-c84b-4e79-965a-7161d179aefc',
    },
    ...oauthClientIds,
  },
};

export default config;
