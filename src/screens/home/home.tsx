import { useRef } from 'react';
import { TextInput, View } from 'react-native';

import AppleButton from '@/components/apple-button';
import GoogleButton from '@/components/google-button';
import Input from '@/components/input';
import Layout from '@/components/layout';
import {
  APPLE_BUTTON_LABELS,
  GOOGLE_BUTTON_LABELS,
  GOOGLE_BUTTON_SHAPES,
  GOOGLE_BUTTON_TYPES,
} from '@/constants';

import { styles } from './home.styles';

const Home = () => {
  const passwordRef = useRef<TextInput>(null);

  return (
    <Layout contentContainerStyle={styles.content}>
      <View style={styles.fields}>
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
      </View>
    </Layout>
  );
};

export default Home;
