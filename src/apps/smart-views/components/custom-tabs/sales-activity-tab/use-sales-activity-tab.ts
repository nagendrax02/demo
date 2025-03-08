/* eslint-disable max-lines-per-function */
import { useEffect, useRef } from 'react';
import { setActiveTab, setTabData, useSmartViewTab } from '../../smartview-tab/smartview-tab.store';
import getSVAugmenter from 'apps/smart-views/augment-tab-data';
import { ISalesActivityTab } from './sales-activity-tab.types';
import { SALES_ACTIVITY_TAB_ID } from './constants';
import { getSalesActivityTabData } from './utils';
import { IUseSmartViews } from '../custom-tabs.types';
import { EntityType } from 'common/types';
import { ACTION } from 'apps/entity-details/constants';
import useEntityTabsStore from 'common/component-lib/entity-tabs/store';
import useFeatureRestrictionStore from 'common/utils/feature-restriction/use-feature-restriction-store';
import { getIsFeatureRestriction } from 'apps/smart-views/utils/feature-restriction';
import { IGetIsFeatureRestriction } from 'apps/smart-views/smartviews.types';

const useSalesActivityTab = ({ entityDetailsTabCoreData }: ISalesActivityTab): IUseSmartViews => {
  const { entityDetailsType, entityIds, tabId } = entityDetailsTabCoreData;
  const tabData = useSmartViewTab(SALES_ACTIVITY_TAB_ID);
  const activeTabKey = useEntityTabsStore((state) => state?.activeTabKey);
  const { restrictionData } = useFeatureRestrictionStore();
  const featureRestrictionRef = useRef<IGetIsFeatureRestriction | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      if (tabId === activeTabKey) {
        if (restrictionData) {
          try {
            const featureRestriction = await getIsFeatureRestriction(restrictionData);
            featureRestrictionRef.current = featureRestriction;
          } catch (error) {
            console.log(error);
          }
        }
        const currentTabData = await getSalesActivityTabData({
          ...entityDetailsTabCoreData
        });
        setActiveTab(SALES_ACTIVITY_TAB_ID);
        const augmentedData = await (
          await getSVAugmenter(currentTabData.Type)
        )?.augmentedTabData?.({
          tabData: currentTabData,
          allTabIds: [],
          commonTabSettings: {
            maxAllowedTabs: 0,
            disableSelection: true,
            hidePrimaryHeader: true,
            hideSearchBar: true,
            maxFiltersAllowed: { [EntityType.Activity]: 30 } as Record<EntityType, number>,
            rowActions: {
              quickActions: `${ACTION.EditActivity},${ACTION.Cancel}`,
              allowedActions: `${ACTION.EditActivity},${ACTION.Cancel}`
            }
          }
        });
        if (augmentedData) setTabData(SALES_ACTIVITY_TAB_ID, augmentedData);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityDetailsType, entityIds, activeTabKey]);

  return {
    isLoading: false,
    tabData,
    activeTabId: SALES_ACTIVITY_TAB_ID,
    featureRestrictionRef
  };
};

export default useSalesActivityTab;
