import { INavItem } from 'apps/header/header.types';
import Help from '../../help';
import Profile from '../../profile';
import QuickAdd from '../../quick-add';
import styles from '../../styles.module.css';
import NavItems from '../top-nav-panel/nav-items';

const BottomNavPanel = ({ navItems }: { navItems: INavItem[] }): JSX.Element => {
  return (
    <div className={styles.nav_panel}>
      <NavItems navItems={navItems} />
      <Help />
      <QuickAdd />
      <Profile />
    </div>
  );
};

export default BottomNavPanel;
