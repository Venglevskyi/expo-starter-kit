import Layout from '@/components/layout';
import Typography from '@/components/typography';

import { styles } from './profile.styles';

const Profile = () => {
  return (
    <Layout contentContainerStyle={styles.content}>
      <Typography variant="headlineSmall" align="center">
        Profile
      </Typography>
    </Layout>
  );
};

export default Profile;
