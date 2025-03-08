import { Link } from 'wouter';
import { INavItem } from 'apps/header/header.types';
import useHeaderStore from 'apps/header/header.store';
import IconHandler from 'apps/header/components/IconHandler';
import styles from '../left-nav-panel.module.css';

const NavItem = ({ navItem }: { navItem: INavItem }): JSX.Element => {
  const { activeNavItemName, setActiveNavItemName } = useHeaderStore((state) => ({
    activeNavItemName: state.activeNavItemName,
    setActiveNavItemName: state.setActiveNavItemName
  }));

  const onNavItemClick = (): void => {
    setActiveNavItemName(navItem.Name);
  };

  return (
    <div className={styles.nav_item_container}>
      <Link
        href={navItem.RouteConfig.RoutePath}
        className={`${styles.nav_item} ${
          activeNavItemName === navItem.Name ? styles.active_nav_item : ''
        }`}
        onClick={onNavItemClick}>
        <div className={styles.nav_item_icon}>
          <IconHandler name={navItem?.DisplayConfig?.Icon} />
        </div>
        <span className={styles.nav_item_display_name}>{navItem?.DisplayConfig?.DisplayName}</span>
      </Link>
    </div>
  );
};

export default NavItem;
