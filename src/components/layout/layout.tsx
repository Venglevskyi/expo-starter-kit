import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { withUnistyles } from 'react-native-unistyles';

import { DEFAULT_KEYBOARD_OFFSET } from '@/constants';
import type { Props } from './types';
import { styles } from './layout.styles';

const ThemedLinearGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: theme.colors.background.gradient,
}));

export const Layout = ({
  children,
  contentContainerStyle,
  scrollEnabled = true,
  keyboardOffset = DEFAULT_KEYBOARD_OFFSET,
  backgroundColor = 'primary',
  showsVerticalScrollIndicator = false,
  bounces = true,
  keyboardDismissMode = 'interactive',
  keyboardShouldPersistTaps = 'handled',
}: Props) => {
  styles.useVariants({ backgroundColor });

  const Container = backgroundColor === 'gradient' ? ThemedLinearGradient : View;

  return (
    <Container style={styles.root}>
      <KeyboardAwareScrollView
        bounces={bounces}
        style={styles.scroll}
        overScrollMode="auto"
        alwaysBounceVertical={false}
        bottomOffset={keyboardOffset}
        scrollEnabled={scrollEnabled}
        keyboardDismissMode={keyboardDismissMode}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>
        {children}
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default Layout;
