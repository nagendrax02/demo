import { IDashboard } from '../dashboard.types';
import styles from '../dashboard.module.css';
const MenuItem = ({ menuItem }: { menuItem: IDashboard }): JSX.Element => {
  return (
    <a className={`${styles.anchor} ${styles.hover}`} href={menuItem?.url}>
      <div className={styles.menu_item} title={menuItem?.label}>
        {menuItem?.label}
      </div>
    </a>
  );
};

export default MenuItem;
