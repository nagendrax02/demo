import { trackError } from 'common/utils/experience/utils/track-error';
import {
  resetSmartViewsTabStore,
  setActiveTab,
  setTabData,
  useSmartViewTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { useEffect } from 'react';
import { getStandaloneSVAugmenter } from 'apps/smart-views/components/custom-tabs';
import { getManageTaskData } from './utils';
import { TABS_CACHE_KEYS } from '../constants';
import { getCommonTabSetting } from '../utils';
import useSmartViewStore, {
  resetSmartViewsStore,
  setRawTabData
} from 'apps/smart-views/smartviews-store';
import { ITabConfig } from '../../smartview-tab/smartview-tab.types';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { Module, setMiPHeaderModule } from 'common/component-lib/mip-header';
import { endSVExpEvent, startSVExpEvent } from 'apps/smart-views/utils/utils';
import { SmartViewsEvents } from 'common/utils/experience/experience-modules';

const getAugmentedData = async (tabData: ITabResponse): Promise<ITabConfig | undefined> => {
  const augmentedData = await (
    await getStandaloneSVAugmenter(tabData.Id)
  )?.augmentedTabData?.({
    tabData,
    allTabIds: [],
    commonTabSettings: getCommonTabSetting({ maxAllowedTabs: 0 })
  });

  return augmentedData;
};

const initializeData = async (tabId: string, tabData?: ITabConfig): Promise<void> => {
  try {
    startSVExpEvent(SmartViewsEvents.TabMetaDataFetchAndAugmentation, tabId);

    const initialTabData = await getManageTaskData(tabData);
    setActiveTab(tabId);
    const augmentedData = await getAugmentedData(initialTabData);

    if (augmentedData) {
      // Considering Manage Tasks as part of SV as it is available in left panel in standalone mode. So, adding rawTabData to SV Store
      setRawTabData(tabId, initialTabData);
      setTabData(tabId, augmentedData);
    }
  } catch (error) {
    trackError(error);
  }
  endSVExpEvent(SmartViewsEvents.TabMetaDataFetchAndAugmentation, tabId);
};

const useManageTasks = (): { isLoading: boolean; activeTabId: string } => {
  const tabId = TABS_CACHE_KEYS.MANAGE_TASKS_TAB;
  const tabData = useSmartViewTab(tabId);
  const { refresh, rawTabData } = useSmartViewStore();

  useEffect(() => {
    setMiPHeaderModule(Module.ManageTasks);
    initializeData(tabId, tabData);

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
    activeTabId: tabId
  };
};

export default useManageTasks;
