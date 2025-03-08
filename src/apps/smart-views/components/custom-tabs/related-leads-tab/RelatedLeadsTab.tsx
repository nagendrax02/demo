import SmartViewTab from '../../smartview-tab/SmartViewTab';
import { IRelatedLeadsTab } from './related-leads.types';
import useRelatedLeads from './use-related-leads';
import { GridShimmer } from '@lsq/nextgen-preact/grid';
import styles from '../custom-tabs.module.css';

const RelatedLeadsTab = ({ coreData }: IRelatedLeadsTab): JSX.Element => {
  const { tabData, activeTabId, featureRestrictionRef } = useRelatedLeads({ coreData });
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

RelatedLeadsTab.defaultProps = {};

export default RelatedLeadsTab;
