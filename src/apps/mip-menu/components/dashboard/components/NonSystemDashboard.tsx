import { lazy, useEffect, useState } from 'react';
import DashboardList from './DashboardList';
import { ISegregatedDashboard } from '../dashboard.types';
import styles from '../dashboard.module.css';
import DashboardShimmer from './DashboardShimmer';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Input = withSuspense(lazy(() => import('@lsq/nextgen-preact/input')));

const NonSystemDashboard = ({
  dashboards,
  showPopup
}: {
  dashboards: ISegregatedDashboard;
  showPopup: boolean;
}): JSX.Element => {
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    setSearchKey('');
  }, [showPopup]);
  return (
    <div>
      <div className={styles.input}>
        <Input
          value={searchKey}
          focusOnMount
          setValue={setSearchKey}
          placeholder="Search Dashboards"
          suspenseFallback={<DashboardShimmer />}
        />
      </div>
      <div className={styles.non_admin_dashboards}>
        <div className={styles.border_right}>
          <DashboardList
            menu={dashboards.sharedDashboard}
            groupTitle="SHARED DASHBOARDS"
            searchKey={searchKey}
          />
        </div>
        <div>
          <DashboardList
            menu={dashboards.myDashboard}
            groupTitle="MY DASHBOARDS"
            searchKey={searchKey}
          />
        </div>
      </div>
    </div>
  );
};

export default NonSystemDashboard;
