import useHeaderStore from 'apps/header/header.store';
import styles from '../left-nav-panel.module.css';
import NavItem from './NavItem';
import NavSubItems from '../nav-sub-items';

const NavItems = (): JSX.Element => {
  const navItems = useHeaderStore((state) => state.navItems);

  return (
    <div className={styles.nav_items}>
      {navItems?.map((navItem) => {
        return (
          <>
            {navItem?.ChildConfig?.IsDynamic ? (
              <NavSubItems navItem={navItem} />
            ) : (
              <NavItem key={navItem?.Id} navItem={navItem} />
            )}
          </>
        );
      })}
    </div>
  );
};

export default NavItems;
