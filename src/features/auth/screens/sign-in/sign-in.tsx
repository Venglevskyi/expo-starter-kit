import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { PressableScale } from 'pressto';

import AppleButton from '@/components/apple-button';
import Button from '@/components/button';
import GoogleButton from '@/components/google-button';
import Input from '@/components/input';
import Layout from '@/components/layout';
import Typography from '@/components/typography';

import {
  APPLE_BUTTON_LABELS,
  GOOGLE_BUTTON_LABELS,
  GOOGLE_BUTTON_SHAPES,
  IS_IOS,
} from '@/constants';
import { useSignInForm } from '@/features/auth/hooks';

import { styles } from './sign-in.styles';

const SignIn = () => {
  const { control, isValid, isSubmitting, onSignIn, onSocialAuth, onForgotPassword } =
    useSignInForm();

  return (
    <Layout backgroundColor="gradient" contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <View style={styles.fields}>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <Input
                label="Email"
                value={value}
                returnKeyType="next"
                autoComplete="email"
                autoCapitalize="none"
                error={error?.message}
                keyboardType="email-address"
                textContentType="emailAddress"
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <Input
                value={value}
                secureTextEntry
                label="Password"
                showSecureToggle
                returnKeyType="done"
                autoCapitalize="none"
                error={error?.message}
                autoComplete="password"
                textContentType="password"
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={onSignIn}
              />
            )}
          />
        </View>

        <PressableScale style={styles.forgotPassword} onPress={onForgotPassword}>
          <Typography variant="labelMedium" style={styles.forgotPasswordLabel}>
            Forgot password?
          </Typography>
        </PressableScale>

        <Button
          fullWidth
          label="Sign In"
          disabled={!isValid}
          loading={isSubmitting}
          onPress={onSignIn}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Typography variant="bodySmall" style={styles.dividerLabel}>
            or
          </Typography>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <GoogleButton
            shape={GOOGLE_BUTTON_SHAPES.ROUNDED}
            label={GOOGLE_BUTTON_LABELS.CONTINUE}
            onPress={onSocialAuth}
          />
          {IS_IOS ? (
            <AppleButton label={APPLE_BUTTON_LABELS.CONTINUE} onPress={onSocialAuth} />
          ) : null}
        </View>
      </View>

      <Typography align="center" variant="bodySmall" style={styles.footer}>
        By continuing, you agree to our Terms of Service and Privacy Policy. Personal data added
        here is public by default — refer to our Privacy FAQ to make changes.
      </Typography>
    </Layout>
  );
};

export default SignIn;
