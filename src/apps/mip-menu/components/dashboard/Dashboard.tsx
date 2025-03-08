import React, { Suspense } from 'react';

import PopupMenu from 'common/component-lib/popup-menu';
import DashboardShimmer from './components/DashboardShimmer';
import styles from './dashboard.module.css';
const MenuContainer = React.lazy(() => import('./components/MenuContainer'));

const Dashboard = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <PopupMenu
      triggerSource={() => children}
      popupContent={({ showPopup }) => (
        <Suspense fallback={<></>}>
          <MenuContainer showPopup={showPopup as boolean} />
        </Suspense>
      )}
      popupDimension={{ height: 440, width: 600 }}
      customPopStyle={styles.pop_style}
      suspenseFallback={<DashboardShimmer />}
      popupStyleConfig={{ adjustHeight: false }}
    />
  );
};

export default Dashboard;
