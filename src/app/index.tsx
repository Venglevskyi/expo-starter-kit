import { View, StyleSheet } from 'react-native';

import AppleButton, { APPLE_BUTTON_LABELS } from '@/components/AppleButton';
import GoogleButton, {
  GOOGLE_BUTTON_SHAPES,
  GOOGLE_BUTTON_LABELS,
  GOOGLE_BUTTON_TYPES,
} from '@/components/GoogleButton';
import Typography from '@/components/Typography';

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <GoogleButton
          type={GOOGLE_BUTTON_TYPES.light}
          shape={GOOGLE_BUTTON_SHAPES.rounded}
          label={GOOGLE_BUTTON_LABELS.signIn}
          onPress={async () => {}}
        />
        <AppleButton label={APPLE_BUTTON_LABELS.signIn} onPress={async () => {}} />
      </View>

      <Typography variant="bodyMedium" font="medium">
        Expo Starter Kit
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  buttons: {
    gap: 12,
  },
});
