import { IUseSmartViews } from '../custom-tabs.types';
import { TABS_CACHE_KEYS } from '../constants';
import { resetSmartViewsStore, setRawTabData } from 'apps/smart-views/smartviews-store';
import { useEffect } from 'react';
import { Module, setMiPHeaderModule } from 'common/component-lib/mip-header';
import { ITabConfig } from '../../smartview-tab/smartview-tab.types';
import { endSVExpEvent, startSVExpEvent } from 'apps/smart-views/utils/utils';
import { SmartViewsEvents } from 'common/utils/experience/experience-modules';
import { getListTabData } from './utils';
import {
  resetSmartViewsTabStore,
  setActiveTab,
  setTabData,
  useSmartViewTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { trackError } from 'common/utils/experience';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { getCommonTabSetting } from '../utils';

const getAugmentedData = async (tabData: ITabResponse): Promise<ITabConfig | undefined> => {
  const augmentedData = await (
    await import('./augment')
  )?.default?.({
    tabData,
    allTabIds: [],
    commonTabSettings: getCommonTabSetting({ maxAllowedTabs: 0 })
  });

  return augmentedData;
};

const initializeData = async (tabId: string, tabData?: ITabConfig): Promise<void> => {
  try {
    startSVExpEvent(SmartViewsEvents.TabMetaDataFetchAndAugmentation, tabId);

    const initialTabData = await getListTabData(tabData);
    setActiveTab(tabId);
    const augmentedData = await getAugmentedData(initialTabData);

    if (augmentedData) {
      // Considering Manage Lists as part of SV as it is available in left panel in standalone mode. So, adding rawTabData to SV Store
      setRawTabData(tabId, initialTabData);
      setTabData(tabId, augmentedData);
    }
  } catch (error) {
    trackError(error);
  }
  endSVExpEvent(SmartViewsEvents.TabMetaDataFetchAndAugmentation, tabId);
};

const useManageLists = (): IUseSmartViews => {
  const tabId = TABS_CACHE_KEYS.MANAGE_LISTS_TAB;
  const tabData = useSmartViewTab(tabId);

  useEffect(() => {
    setMiPHeaderModule(Module.ManageLists);
    initializeData(tabId, tabData);

    return () => {
      resetSmartViewsStore();
      resetSmartViewsTabStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading: false,
    tabData,
    activeTabId: TABS_CACHE_KEYS.MANAGE_LISTS_TAB
  };
};

export default useManageLists;
