import SmartViewTab from 'apps/smart-views/components/smartview-tab/SmartViewTab';
import useManageLeadTab from './useManageLeadTab';
import styles from './manage-lead-tab.module.css';
import { classNames } from 'common/utils/helpers/helpers';
import SmartViewsShimmer from 'apps/smart-views/SmartviewsShimmer';

const ManageLeadsTab = (): JSX.Element => {
  const { tabData, activeTabId } = useManageLeadTab();

  return tabData ? (
    <div className={classNames(styles.tab_container, 'ng_v2_style')}>
      <div className={styles.tab_sub_container}>
        <SmartViewTab tabData={tabData} tabId={activeTabId} />
      </div>
    </div>
  ) : (
    <SmartViewsShimmer loadOnlyGrid />
  );
};

export default ManageLeadsTab;
