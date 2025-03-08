import { GridShimmer } from '@lsq/nextgen-preact/grid';
import { ILeadOpportunityTab } from './lead-opportunity-tab.types';
import SmartViewTab from 'apps/smart-views/components/smartview-tab/SmartViewTab';
import useLeadOppTab from './useLeadOppTab';
import styles from '../custom-tabs.module.css';

const LeadOpportunityTab = ({ coreData }: ILeadOpportunityTab): JSX.Element => {
  const { tabData, activeTabId, featureRestrictionRef } = useLeadOppTab(coreData);

  return (
    <div className={styles.custom_tab}>
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

export default LeadOpportunityTab;
