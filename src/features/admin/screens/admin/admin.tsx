import Layout from '@/components/layout';
import Typography from '@/components/typography';

import { styles } from './admin.styles';

const Admin = () => {
  return (
    <Layout contentContainerStyle={styles.content}>
      <Typography variant="headlineSmall" align="center">
        Admin
      </Typography>
    </Layout>
  );
};

export default Admin;
