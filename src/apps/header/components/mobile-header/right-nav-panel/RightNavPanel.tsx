import Profile from 'apps/header/components/profile';
import QuickAdd from 'apps/header/components/quick-add';
import Search from 'apps/header/components/search';
import styles from '../mobile-header.module.css';

const RightNavPanel = (): JSX.Element => {
  return (
    <div className={styles.nav_panel}>
      <QuickAdd />
      <Search />
      <Profile />
    </div>
  );
};

export default RightNavPanel;
