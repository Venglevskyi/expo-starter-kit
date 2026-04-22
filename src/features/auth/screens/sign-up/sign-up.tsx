import Layout from '@/components/layout';
import Typography from '@/components/typography';

import { styles } from './sign-up.styles';

const SignUp = () => {
  return (
    <Layout contentContainerStyle={styles.content}>
      <Typography variant="headlineSmall" align="center">
        Sign Up
      </Typography>
    </Layout>
  );
};

export default SignUp;
