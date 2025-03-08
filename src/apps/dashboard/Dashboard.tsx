import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useState } from 'react';
import { DashboardType } from './dashboard.types';
import DefaultDashboard from './default-dashboard';
import Casa from './casa';
import Spinner from '@lsq/nextgen-preact/spinner';
import styles from './dashboard.module.css';
import { fetchDashboardType } from './utils';
import { IWithSuspense } from '@lsq/nextgen-preact/suspense/withSuspense';

const Dashboard = (): JSX.Element => {
  const [dashboardType, setDashboardType] = useState<DashboardType>(DashboardType.Default);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const type = await fetchDashboardType();
        setDashboardType(type);
      } catch (err) {
        trackError(err);
      }
      setIsLoading(false);
    })();
  }, []);

  const dashboardComponentMap: Record<DashboardType, (props?: IWithSuspense) => JSX.Element> = {
    [DashboardType.Default]: DefaultDashboard,
    [DashboardType.Casa]: Casa
  };

  if (isLoading) {
    return (
      <div className={styles.spinner_wrapper}>
        <Spinner customStyleClass={styles.spinner} />
      </div>
    );
  }

  return dashboardComponentMap?.[dashboardType]();
};

export default Dashboard;
