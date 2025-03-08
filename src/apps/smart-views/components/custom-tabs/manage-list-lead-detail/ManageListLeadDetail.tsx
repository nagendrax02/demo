import SmartViewTab from 'apps/smart-views/components/smartview-tab/SmartViewTab';
import useManageListLeadDetail from './useManageListLeadDetail';
import styles from './manage-list-lead-detail.module.css';
import { classNames } from 'src/common/utils/helpers/helpers';
import SmartViewsShimmer from 'apps/smart-views/SmartviewsShimmer';

const ManageListLeadDetail = (): JSX.Element => {
  const { tabData, activeTabId } = useManageListLeadDetail();

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

export default ManageListLeadDetail;
