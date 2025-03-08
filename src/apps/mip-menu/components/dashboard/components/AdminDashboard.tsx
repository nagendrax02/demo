import styles from '../dashboard.module.css';
import { IDashboard } from '../dashboard.types';

const AdminDashboard = ({ menuItem }: { menuItem: IDashboard }): JSX.Element => {
  return (
    <div className={styles.admin_dashboard}>
      <a className={styles.anchor} title={menuItem?.label} href={menuItem?.url}>
        {menuItem?.label}
      </a>
    </div>
  );
};

export default AdminDashboard;
