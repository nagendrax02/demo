import {
  resetSmartViewsTabStore,
  setActiveTab,
  setTabData,
  useSmartViewTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { IUseSmartViews } from '../custom-tabs.types';
import { useEffect } from 'react';
import { getListLeadTabData, updateAppTabConfig } from './utils';
import { TABS_CACHE_KEYS } from '../constants';
import { Module, setMiPHeaderModule } from 'common/component-lib/mip-header';
import useSmartViewStore, {
  resetSmartViewsStore,
  setRawTabData
} from 'apps/smart-views/smartviews-store';
import { endSVExpEvent, startSVExpEvent } from 'apps/smart-views/utils/utils';
import { SmartViewsEvents } from 'common/utils/experience/experience-modules';
import { ITabConfig } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { trackError } from 'common/utils/experience';

const getAugmentedData = async (initialTabData: ITabResponse): Promise<ITabConfig | undefined> => {
  const augmentedData = await (
    await import('./augment')
  )?.augmentedMangeListLeadTabData?.({
    tabData: initialTabData,
    allTabIds: [],
    commonTabSettings: {
      maxAllowedTabs: 0
    }
  });

  return augmentedData;
};

const initializeData = async (tabData: ITabConfig): Promise<void> => {
  startSVExpEvent(
    SmartViewsEvents.TabMetaDataFetchAndAugmentation,
    TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY
  );

  const initialTabData = await getListLeadTabData(tabData);

  setActiveTab(TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY);
  setMiPHeaderModule(Module.ManageListLeads);

  const augmentedData = await getAugmentedData(initialTabData);

  if (augmentedData) {
    setRawTabData(TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY, initialTabData);
    setTabData(TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY, augmentedData);
    updateAppTabConfig({ augmentedData });
  }
  endSVExpEvent(
    SmartViewsEvents.TabMetaDataFetchAndAugmentation,
    TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY
  );
};

const useManageListLeadDetail = (): IUseSmartViews => {
  const tabData = useSmartViewTab(TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY);
  const { refresh, rawTabData } = useSmartViewStore();
  const tabId = TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY;

  useEffect(() => {
    initializeData(tabData);

    return () => {
      resetSmartViewsStore();
      resetSmartViewsTabStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const setReAugmentedData = async (): Promise<void> => {
      try {
        if (refresh) {
          const currentTabData = rawTabData[tabId];
          const augmentedData = await getAugmentedData(currentTabData);
          if (augmentedData) {
            setTabData(tabId, augmentedData);
          }
        }
      } catch (error) {
        trackError(error);
      }
    };

    setReAugmentedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return {
    isLoading: false,
    tabData,
    activeTabId: TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY
  };
};

export default useManageListLeadDetail;
