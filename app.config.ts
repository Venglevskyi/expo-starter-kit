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
  }
> = {
  development: {
    bundleIdentifier: `${BUNDLE_PREFIX}.dev`,
    androidPackage: `${BUNDLE_PREFIX}.dev`,
    displayName: `${APP_NAME} (dev)`,
  },
  production: {
    bundleIdentifier: BUNDLE_PREFIX,
    androidPackage: BUNDLE_PREFIX,
    displayName: APP_NAME,
  },
};

const env = variants[variant];

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
  },
  android: {
    package: env.androidPackage,
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
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    variant,
  },
};

export default config;
