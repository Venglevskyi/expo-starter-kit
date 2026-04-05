import { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import AppleButton from '@/components/AppleButton';
import Button from '@/components/Button';
import GoogleButton from '@/components/GoogleButton';
import Input from '@/components/Input';
import {
  APPLE_BUTTON_LABELS,
  GOOGLE_BUTTON_LABELS,
  GOOGLE_BUTTON_SHAPES,
  GOOGLE_BUTTON_TYPES,
} from '@/constants';

export default function Index() {
  const passwordRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Input
          placeholder="Email"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <Input ref={passwordRef} placeholder="Password" showSecureToggle returnKeyType="done" />

        <GoogleButton
          type={GOOGLE_BUTTON_TYPES.LIGHT}
          shape={GOOGLE_BUTTON_SHAPES.ROUNDED}
          label={GOOGLE_BUTTON_LABELS.SIGN_IN}
          onPress={async () => {}}
        />
        <AppleButton label={APPLE_BUTTON_LABELS.SIGN_IN} onPress={async () => {}} />

        <Button label="Get Started" fullWidth />
      </View>
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
