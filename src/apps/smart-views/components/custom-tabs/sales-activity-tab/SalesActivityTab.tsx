import SmartViewTab from '../../smartview-tab/SmartViewTab';
import { ISalesActivityTab } from './sales-activity-tab.types';
import useSalesActivityTab from './use-sales-activity-tab';
import { GridShimmer } from '@lsq/nextgen-preact/grid';
import styles from './sales-activity.module.css';
import customTabStyles from '../custom-tabs.module.css';
import { classNames } from 'common/utils/helpers/helpers';

const SalesActivityTab = ({ entityDetailsTabCoreData }: ISalesActivityTab): JSX.Element => {
  const { tabData, activeTabId, featureRestrictionRef } = useSalesActivityTab({
    entityDetailsTabCoreData
  });
  return (
    <div className={classNames(styles.sales_activity_tab, customTabStyles.custom_tab)}>
      {tabData ? (
        <SmartViewTab
          featureRestriction={featureRestrictionRef && featureRestrictionRef.current}
          tabData={tabData}
          tabId={activeTabId}
        />
      ) : (
        <GridShimmer rows={4} columns={8} />
      )}
    </div>
  );
};

SalesActivityTab.defaultProps = {};

export default SalesActivityTab;
