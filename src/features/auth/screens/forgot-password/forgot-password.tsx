import Layout from '@/components/layout';
import Typography from '@/components/typography';

import { styles } from './forgot-password.styles';

const ForgotPassword = () => {
  return (
    <Layout contentContainerStyle={styles.content}>
      <Typography variant="headlineSmall" align="center">
        Forgot Password
      </Typography>
    </Layout>
  );
};

export default ForgotPassword;
