import { IDashboard } from '../dashboard.types';
import Menuitem from './MenuItem';
import styles from '../dashboard.module.css';
import { canShowMenuItem } from '../utils';
interface IDashboardList {
  menu: IDashboard[];
  groupTitle: string;
  searchKey: string;
}

const DashboardList = ({ menu, groupTitle, searchKey }: IDashboardList): JSX.Element => {
  const list = menu?.filter((menuItem) => canShowMenuItem(menuItem.label, searchKey?.trim()));
  return (
    <div className={styles.form_field_wrapper}>
      <div className={styles.group_title}>{groupTitle}</div>
      <div className={styles.list}>
        {list?.length ? (
          list?.map((menuItem) => {
            return <Menuitem key={menuItem?.dashboardId} menuItem={menuItem} />;
          })
        ) : (
          <div className={styles.no_dashboard}>No Dashboards Available</div>
        )}
      </div>
    </div>
  );
};

export default DashboardList;
