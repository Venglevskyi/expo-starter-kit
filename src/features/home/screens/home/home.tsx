import Layout from '@/components/layout';
import Typography from '@/components/typography';

import { styles } from './home.styles';

const Home = () => {
  return (
    <Layout contentContainerStyle={styles.content}>
      <Typography variant="headlineSmall" align="center">
        Home
      </Typography>
    </Layout>
  );
};

export default Home;
