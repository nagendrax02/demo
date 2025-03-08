import { Link } from 'wouter';
import { INavItem } from 'apps/header/header.types';
import IconHandler from '../../../IconHandler';
import styles from '../left-nav-panel.module.css';

interface INavSubItem {
  subItem: INavItem;
}

const NavSubItem = ({ subItem }: INavSubItem): JSX.Element => {
  return (
    <div className={styles.nav_sub_item}>
      <Link href={subItem?.RouteConfig.RoutePath}>
        <>
          <IconHandler name={subItem?.DisplayConfig?.Icon} />
          <span className={styles.nav_item_display_name}>
            {subItem?.DisplayConfig?.DisplayName}
          </span>
        </>
      </Link>
    </div>
  );
};

export default NavSubItem;
