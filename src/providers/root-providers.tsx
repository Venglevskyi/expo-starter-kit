import { type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { styles } from './root-providers.styles';

interface Props {
  children: ReactNode;
}

export const RootProviders = ({ children }: Props) => (
  <KeyboardProvider>
    <GestureHandlerRootView style={styles.container}>{children}</GestureHandlerRootView>
  </KeyboardProvider>
);

export default RootProviders;
