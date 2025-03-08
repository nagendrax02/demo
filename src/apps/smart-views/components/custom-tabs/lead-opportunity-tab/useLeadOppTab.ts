import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import {
  setActiveTab,
  setTabData,
  useSmartViewTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { IUseSmartViews } from '../custom-tabs.types';
import { useEffect, useRef } from 'react';
import { LEAD_OPPORTUNITY_TAB_ID, LEAD_OPP_SCHEMA_NAMES } from './constants';
import { fetchOppTabProcessData, getLeadOpportunityTabData } from './utils';
import { getStandaloneSVAugmenter } from 'apps/smart-views/components/custom-tabs';
import { getSettingConfig, settingKeys } from 'common/utils/helpers';
import { CallerSource } from 'common/utils/rest-client';
import { fetchOppTypeOptions } from './fetch-options';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { workAreaIds } from 'common/utils/process';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import useFeatureRestrictionStore from 'common/utils/feature-restriction/use-feature-restriction-store';
import { IGetIsFeatureRestriction } from 'apps/smart-views/smartviews.types';
import { getIsFeatureRestriction } from 'apps/smart-views/utils/feature-restriction';
import { IRestrictionData } from 'common/utils/feature-restriction/feature-restriction.types';

interface IInitializeData {
  entityIds: IEntityIds;
  oppTypeFilterValue: string;
  restrictionData: IRestrictionData;
  featureRestrictionRef: React.MutableRefObject<IGetIsFeatureRestriction | null>;
}

const cacheProcessData = (tabId: string, selectedOppId: string, allOppIds: IOption[]): void => {
  window[`PROCESS_${tabId}`] = fetchOppTabProcessData(
    workAreaIds.MANAGE_OPPORTUNITIES,
    selectedOppId,
    allOppIds
  );
};

const initializeData = async (data: IInitializeData): Promise<void> => {
  const { entityIds, oppTypeFilterValue, restrictionData, featureRestrictionRef } = data;
  const [essSetting, oppTypeOptions, featureRestriction] = await Promise.all([
    getSettingConfig(settingKeys.EnableESSForLeadManagement, CallerSource.LeadDetails),
    fetchOppTypeOptions(),
    getIsFeatureRestriction(restrictionData)
  ]);

  featureRestrictionRef.current = featureRestriction;

  cacheProcessData(LEAD_OPPORTUNITY_TAB_ID, oppTypeFilterValue, oppTypeOptions);

  const initialTabData = await getLeadOpportunityTabData({
    leadId: entityIds.lead,
    oppTypeFilterValue,
    isEssEnabled: essSetting === '1',
    oppTypeOptions
  });

  const augmentedData = await (
    await getStandaloneSVAugmenter(LEAD_OPPORTUNITY_TAB_ID)
  )?.augmentedTabData?.({
    tabData: initialTabData,
    allTabIds: [],
    commonTabSettings: {
      maxAllowedTabs: 0,
      disableSelection: true
    }
  });

  if (augmentedData) setTabData(LEAD_OPPORTUNITY_TAB_ID, augmentedData);
};

const useLeadOppTab = (coreData: IEntityDetailsCoreData): IUseSmartViews => {
  const { entityIds } = coreData;
  const tabData = useSmartViewTab(LEAD_OPPORTUNITY_TAB_ID);
  const { restrictionData } = useFeatureRestrictionStore();
  const featureRestrictionRef = useRef<IGetIsFeatureRestriction | null>(null);
  setActiveTab(LEAD_OPPORTUNITY_TAB_ID);

  const oppTypeFilterValue =
    tabData?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName?.[
      LEAD_OPP_SCHEMA_NAMES.OPPORTUNITY_TYPE
    ]?.value;

  useEffect(() => {
    initializeData({ entityIds, oppTypeFilterValue, restrictionData, featureRestrictionRef });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oppTypeFilterValue]);

  return {
    isLoading: false,
    tabData,
    activeTabId: LEAD_OPPORTUNITY_TAB_ID,
    featureRestrictionRef
  };
};

export default useLeadOppTab;
