import SmartViewTab from 'apps/smart-views/components/smartview-tab/SmartViewTab';
import useManageActivity from './useManageActivity';
import Leftpanel from './Leftpanel';
import styles from './manage-activity-tab.module.css';
import MediaModal from 'common/component-lib/media-modal';
import SmartViewsShimmer from 'apps/smart-views/SmartviewsShimmer';
import SmartViewTabShimmer from '../../smartview-tab/SmartViewTabShimmer';

const ManageActivity = (): JSX.Element => {
  const { categoryData, tabId, tabData, selectedActivity, isLoading } = useManageActivity();

  return isLoading ? (
    <SmartViewsShimmer />
  ) : (
    <div className={styles.manage_activity_container}>
      <Leftpanel categoryData={categoryData} selectedActivity={selectedActivity} />
      {tabData ? (
        <div className={styles.manage_activity_tab_content}>
          <SmartViewTab tabData={tabData} tabId={tabId} />
        </div>
      ) : (
        <SmartViewTabShimmer />
      )}
      {/* To Render Media Modal for Audio Column */}
      <MediaModal />
    </div>
  );
};

export default ManageActivity;
