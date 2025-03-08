import { trackError } from 'common/utils/experience/utils/track-error';
import { IDashboardResponse, ISegregatedDashboard } from '../dashboard.types';
import AdminDashboard from './AdminDashboard';
import NonSystemDashboard from './NonSystemDashboard';
import styles from '../dashboard.module.css';
import { useState, useEffect } from 'react';
import { API_ROUTES } from 'src/common/constants';
import { CallerSource, Module, httpPost } from 'src/common/utils/rest-client';
import { getSegregatedAction } from '../utils';
import PopupFallback from './PopupFallback';

const MenuContainer = ({ showPopup }: { showPopup: boolean }): JSX.Element => {
  const [dashboard, setDashboard] = useState<ISegregatedDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const dashboards: IDashboardResponse = await httpPost({
          path: API_ROUTES.dashboardGet,
          body: {
            Paging: {
              Offset: 0
            }
          },
          module: Module.Marvin,
          callerSource: CallerSource.MiPNavMenu
        });
        setDashboard(getSegregatedAction(dashboards));
        setIsLoading(false);
      } catch (error) {
        trackError(error);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {isLoading ? (
        <PopupFallback message="Fetching Dashboards..." />
      ) : (
        <>
          {dashboard ? (
            <div className={styles.menu_container}>
              <AdminDashboard menuItem={dashboard.adminDashboard} />
              <NonSystemDashboard dashboards={dashboard} showPopup={showPopup} />
            </div>
          ) : (
            <PopupFallback message="No Dashboards Available" />
          )}
        </>
      )}
    </>
  );
};

export default MenuContainer;
