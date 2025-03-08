/* eslint-disable max-lines-per-function */
import { useEffect, useRef } from 'react';
import { setActiveTab, setTabData, useSmartViewTab } from '../../smartview-tab/smartview-tab.store';
import getSVAugmenter from 'apps/smart-views/augment-tab-data';
import { IRelatedLeadsTab } from './related-leads.types';
import { getEntityLeadsResponseData } from './utils';
import useEntityDetailStore from 'apps/entity-details/entitydetail.store';
import { entityTypeMap } from './constants';
import { IUseSmartViews } from '../custom-tabs.types';
import useEntityTabsStore from 'common/component-lib/entity-tabs/store';
import { EntityType } from 'common/types';
import useFeatureRestrictionStore from 'common/utils/feature-restriction/use-feature-restriction-store';
import { getIsFeatureRestriction } from 'apps/smart-views/utils/feature-restriction';
import { IGetIsFeatureRestriction } from 'apps/smart-views/smartviews.types';

const useRelatedLeads = ({ coreData }: IRelatedLeadsTab): IUseSmartViews => {
  const { entityIds, entityDetailsType, tabId } = coreData;
  const activeTabId = entityTypeMap[entityDetailsType] as string;
  const tabData = useSmartViewTab(activeTabId);
  const activeTabKey = useEntityTabsStore((state) => state?.activeTabKey);
  const properties = useEntityDetailStore((state) => state.augmentedEntityData?.properties);
  const { restrictionData } = useFeatureRestrictionStore();
  const featureRestrictionRef = useRef<IGetIsFeatureRestriction | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      if (activeTabKey === tabId) {
        if (restrictionData) {
          try {
            const featureRestriction = await getIsFeatureRestriction(restrictionData);
            featureRestrictionRef.current = featureRestriction;
          } catch (error) {
            console.log(error);
          }
        }
        const currentTabData = await getEntityLeadsResponseData({
          ...coreData,
          entityData: properties?.fields as Record<string, string>
        });

        setActiveTab(activeTabId);
        const augmentedData = await (
          await getSVAugmenter(currentTabData.Type)
        )?.augmentedTabData?.({
          tabData: currentTabData,
          allTabIds: [],
          commonTabSettings: {
            maxAllowedTabs: 0,
            maxFiltersAllowed: { [EntityType.Lead]: 30 } as Record<EntityType, number>,
            disableSelection: true,
            hidePrimaryHeader: entityDetailsType === EntityType.Account
          }
        });
        if (augmentedData) setTabData(activeTabId, augmentedData);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityDetailsType, entityIds, activeTabKey]);

  return {
    isLoading: false,
    tabData,
    activeTabId,
    featureRestrictionRef
  };
};

export default useRelatedLeads;
