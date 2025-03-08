import { Home as HomeIcon } from 'assets/custom-icon/v2';
import styles from './home.module.css';

/**
 * This component is a button that allows users to quickly navigate to their configured homepage.
 */

const Home = (): JSX.Element => {
  return (
    <button className={styles.home_button} aria-label="Home" title="Home">
      <HomeIcon type="duotone" />
    </button>
  );
};

export default Home;
