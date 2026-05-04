import * as SplashScreen from 'expo-splash-screen';

// index.ts — import Unistyles config BEFORE the router
import './src/theme/unistyles';
import 'expo-router/entry';

SplashScreen.preventAutoHideAsync();
