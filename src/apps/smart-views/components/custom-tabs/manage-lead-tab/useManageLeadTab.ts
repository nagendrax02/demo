import {
  resetSmartViewsTabStore,
  setActiveTab,
  setTabData,
  useSmartViewTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { IUseSmartViews } from '../custom-tabs.types';
import { useEffect } from 'react';
import { getLeadTabData, updateAppTabConfig } from './utils';
import { TABS_CACHE_KEYS } from '../constants';
import { Module, setMiPHeaderModule } from 'common/component-lib/mip-header';
import { resetSmartViewsStore, setRawTabData } from 'apps/smart-views/smartviews-store';
import { endSVExpEvent, startSVExpEvent } from 'apps/smart-views/utils/utils';
import { SmartViewsEvents } from 'common/utils/experience/experience-modules';

// eslint-disable-next-line max-lines-per-function
const useManageLeadTab = (): IUseSmartViews => {
  const tabData = useSmartViewTab(TABS_CACHE_KEYS.MANAGE_LEADS_TAB);

  useEffect(() => {
    const initializeData = async (): Promise<void> => {
      startSVExpEvent(
        SmartViewsEvents.TabMetaDataFetchAndAugmentation,
        TABS_CACHE_KEYS.MANAGE_LEADS_TAB
      );

      const initialTabData = await getLeadTabData(tabData);

      setActiveTab(TABS_CACHE_KEYS.MANAGE_LEADS_TAB);
      setMiPHeaderModule(Module.ManageLeads);

      const augmentedData = await (
        await import('./augment')
      )?.augmentedMangeLeadTabData?.({
        tabData: initialTabData,
        allTabIds: [],
        commonTabSettings: {
          maxAllowedTabs: 0
        }
      });
      if (augmentedData) {
        // Considering Manage Leads as part of SV as it is available in left panel in standalone mode. So, adding rawTabData to SV Store
        setRawTabData(TABS_CACHE_KEYS.MANAGE_LEADS_TAB, initialTabData);
        setTabData(TABS_CACHE_KEYS.MANAGE_LEADS_TAB, augmentedData);
        updateAppTabConfig({ augmentedData });
      }
      endSVExpEvent(
        SmartViewsEvents.TabMetaDataFetchAndAugmentation,
        TABS_CACHE_KEYS.MANAGE_LEADS_TAB
      );
    };

    initializeData();

    return () => {
      resetSmartViewsStore();
      resetSmartViewsTabStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading: false,
    tabData,
    activeTabId: TABS_CACHE_KEYS.MANAGE_LEADS_TAB
  };
};

export default useManageLeadTab;
