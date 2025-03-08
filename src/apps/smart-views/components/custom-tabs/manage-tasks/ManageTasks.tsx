import SmartViewTab from 'apps/smart-views/components/smartview-tab/SmartViewTab';
import useManageTasks from './useManageTasks';
import { useSmartViewTab } from '../../smartview-tab/smartview-tab.store';
import GridQuickView from '../../grid-quick-view/GridQuickView';
import styles from './manage-task.module.css';
import SmartViewsShimmer from 'apps/smart-views/SmartviewsShimmer';

const ManageTasks = (): JSX.Element => {
  const { activeTabId } = useManageTasks();
  const tabData = useSmartViewTab(activeTabId);

  return tabData ? (
    <div className={styles.manage_task_container}>
      <div className={styles.tab_container}>
        <SmartViewTab tabData={tabData} tabId={activeTabId} />
      </div>
      <GridQuickView />
    </div>
  ) : (
    <SmartViewsShimmer loadOnlyGrid />
  );
};

export default ManageTasks;
