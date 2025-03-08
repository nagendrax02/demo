import { trackError } from 'common/utils/experience/utils/track-error';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
//Added WritableDraft to fix annotation issue during components build
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WritableDraft } from 'immer/dist/immer';
import { ICommonTabSettings, ISmartViews, ITabResponse } from './smartviews.types';
import {
  CalendarView,
  IMarvinData,
  ITabConfig,
  TabView
} from './components/smartview-tab/smartview-tab.types';
import {
  augmentTabData,
  getAugmentedFetchCriteria,
  isCustomTypeTab,
  isDetailsPage,
  isManageTab,
  isSmartviewTab,
  updateSVMetadataCache
} from './utils/utils';
import { API_ROUTES } from 'common/constants';
import { httpPut, CallerSource, Module } from 'common/utils/rest-client';
import { IEntityRepresentationName } from '../entity-details/types/entity-data.types';
import { getTabData, setActiveTab } from './components/smartview-tab/smartview-tab.store';
import { postTabData } from './components/custom-tabs/utils';
import { safeParseJson } from 'common/utils/helpers';
import { CALENDAR_VIEW_MAP_CACHE, TAB_VIEW_MAP } from './augment-tab-data/task/constants';
import { isCasaManageTaskTab } from 'common/utils/casa/casa-data';

export interface ISmartViewStore extends ISmartViews {
  isLoading: boolean;
  refresh: number;
}

const initialState: ISmartViewStore = {
  isLoading: true,
  smartViewId: '',
  panel: null,
  commonTabSettings: null,
  rawTabData: {},
  allTabIds: [],
  manageTabsIds: [],
  activeTabId: '',
  leadRepresentationName: {
    SingularName: 'Lead',
    PluralName: 'Leads'
  },
  refresh: 0
};

const useSmartViewStore = create<ISmartViewStore>()(
  immer(() => ({
    // state
    ...initialState
  }))
);

// setters
const setIsLoading = (loading: boolean): void => {
  useSmartViewStore.setState((state) => {
    state.isLoading = loading;
  });
};

const setSmartViewData = (data: ISmartViews): void => {
  useSmartViewStore.setState((state) => {
    state.panel = data.panel;
    state.commonTabSettings = data.commonTabSettings;
    state.smartViewId = data.smartViewId;
    state.allTabIds = data.allTabIds;
    state.manageTabsIds = data.manageTabsIds;
    state.activeTabId = data.activeTabId;
    state.rawTabData = data.rawTabData;
    state.leadRepresentationName = data?.leadRepresentationName;
  });
};

const setActiveTabId = (id: string): void => {
  useSmartViewStore.setState((state) => {
    if (id) state.activeTabId = id;
  });
};

const getActiveTabId = (): string => {
  return useSmartViewStore.getState().activeTabId;
};

const setRefresh = (): void => {
  useSmartViewStore.setState((state) => {
    state.refresh = Math.random();
  });
};

const getRawTabData = (tabId: string): ITabResponse => {
  return useSmartViewStore?.getState()?.rawTabData?.[tabId];
};

const getCommonTabSettings = (): ICommonTabSettings | null => {
  return useSmartViewStore?.getState()?.commonTabSettings;
};

const setRawTabData = (tabId: string, tabData: ITabResponse): void => {
  useSmartViewStore.setState((state) => {
    state.rawTabData[tabId] = tabData;
  });
};

// updates tabIds and removes tabData of ids from store not present in given tabIds argument
const setAllTabIds = (tabIds: string[]): void => {
  useSmartViewStore.setState((state) => {
    const toDeleteTabIds = state?.allTabIds?.filter((tabId) => !tabIds.includes(tabId)) || [];
    state.allTabIds = tabIds;
    toDeleteTabIds.map((tabId) => {
      delete state.rawTabData[tabId];
    });
  });
};

const setDefaultTabId = ({
  newDefaultTabId,
  currentDefaultTabId
}: {
  newDefaultTabId: string;
  currentDefaultTabId: string;
}): void => {
  useSmartViewStore.setState((state) => {
    if (state?.rawTabData?.[currentDefaultTabId]?.TabConfiguration) {
      state.rawTabData[currentDefaultTabId].TabConfiguration.IsDefault = false;
    }
    if (state?.rawTabData?.[newDefaultTabId]?.TabConfiguration) {
      state.rawTabData[newDefaultTabId].TabConfiguration.IsDefault = true;
    }
    state.activeTabId = newDefaultTabId;
  });
  setActiveTab(newDefaultTabId);
};

const setSelectedColumns = ({
  selectedColumns,
  tabId
}: {
  selectedColumns: string;
  tabId: string;
}): void => {
  useSmartViewStore.setState((state) => {
    if (state?.rawTabData?.[tabId]?.TabContentConfiguration?.FetchCriteria) {
      state.rawTabData[tabId].TabContentConfiguration.FetchCriteria.SelectedColumns =
        selectedColumns;
    }
  });
};

const addNewTab = (tabData: ITabResponse): void => {
  useSmartViewStore.setState((state) => {
    if (state?.rawTabData && state?.allTabIds) {
      if (tabData?.TabContentConfiguration) {
        tabData.TabContentConfiguration.FetchCriteria = getAugmentedFetchCriteria(tabData);
      }
      updateSVMetadataCache(tabData);
      state.rawTabData[tabData.Id] = tabData;
      state.allTabIds.push(tabData.Id);
    }
  });
};

const getUpdatedRawTabData = (tabData: ITabResponse): ITabResponse => {
  const fetchCriteria = getAugmentedFetchCriteria(tabData);
  const currentTabData = { ...getTabData(tabData?.Id) };
  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;

  // updating advancedSearchEnglish of currentTabData as augmentTabData uses it to create updatedTabData
  if (currentTabData?.headerConfig?.primary) {
    currentTabData.headerConfig = {
      ...currentTabData?.headerConfig,
      primary: {
        ...currentTabData?.headerConfig?.primary,
        advancedSearchEnglish: fetchCriteria.AdvancedSearchText_English
      }
    };
  }

  // update tabview of currentTabData as augmentTabData uses it to create updatedTabData
  if (currentTabData) {
    currentTabData.tabView = TAB_VIEW_MAP[
      additionalData?.Marvin?.ActiveTaskView as string
    ] as TabView;
    currentTabData.calendarView = CALENDAR_VIEW_MAP_CACHE[
      additionalData?.Marvin?.ActiveCalendarView as string
    ] as CalendarView;
  }

  const updatedTabData = augmentTabData(tabData, currentTabData);
  return updatedTabData;
};

const updateCustomTab = (tabData: ITabResponse): void => {
  useSmartViewStore.setState((state) => {
    try {
      if (state?.rawTabData && state?.allTabIds) {
        const updatedTabData = isCustomTypeTab(tabData) ? tabData : getUpdatedRawTabData(tabData);
        updateSVMetadataCache(updatedTabData);
        state.rawTabData[tabData.Id] = updatedTabData;
        state.refresh = Math.random();
      }
    } catch (error) {
      trackError(error);
    }
  });
};

const handleManageTabUpdate = ({
  tabId,
  newTabData,
  rawTabData,
  updateRawState
}: {
  tabId: string;
  newTabData: ITabConfig;
  rawTabData: Record<string, ITabResponse>;
  updateRawState: boolean | undefined;
}): void => {
  newTabData?.handleCaching?.(newTabData);

  if (rawTabData[tabId]) {
    const updatedData = augmentTabData(rawTabData[tabId], newTabData);
    useSmartViewStore.setState((state) => {
      if (updateRawState) {
        state.rawTabData[tabId] = updatedData;
        state.refresh = Math.random();
      }
    });
  }
};

// eslint-disable-next-line max-lines-per-function, complexity
const updateSmartViewsTab = (
  tabId: string,
  newTabData: ITabConfig,
  updateRawState?: boolean
): void => {
  try {
    const { rawTabData, smartViewId } = useSmartViewStore.getState();
    if (isSmartviewTab(tabId)) {
      if (!isCustomTypeTab(rawTabData[tabId]) && rawTabData[tabId]) {
        const updatedData = augmentTabData(rawTabData[tabId], newTabData);
        httpPut({
          path: API_ROUTES.smartviews.updateTab,
          module: Module.SmartViews,
          body: {
            SmartviewId: smartViewId,
            Tab: { ...updatedData }
          },
          callerSource: CallerSource.SmartViews
        });
        updateSVMetadataCache(updatedData);
        useSmartViewStore.setState((state) => {
          if (updateRawState) {
            state.rawTabData[tabId] = updatedData;
            state.refresh = Math.random();
          }
        });
      }
    } else if (isManageTab(tabId) || isDetailsPage(tabId)) {
      if (!isCasaManageTaskTab())
        handleManageTabUpdate({ tabId, newTabData, rawTabData, updateRawState });
    } else {
      postTabData(newTabData, CallerSource.SmartViews);
    }
  } catch (error) {
    trackError(error);
  }
};

const resetSmartViewsStore = (): void => {
  useSmartViewStore.setState(initialState);
};

const getDefaultTabId = (): string => {
  const allTabIds = useSmartViewStore?.getState()?.allTabIds;
  const rawTabData = useSmartViewStore?.getState()?.rawTabData;

  const defaultTabId = allTabIds?.filter(
    (tabId) => rawTabData?.[tabId]?.TabConfiguration?.IsDefault
  )?.[0];

  return defaultTabId;
};

const getLeadRepresentationName = (): IEntityRepresentationName => {
  return useSmartViewStore?.getState().leadRepresentationName;
};

const getSmartviewId = (): string => {
  return useSmartViewStore.getState().smartViewId;
};

// export only functions that manipulate store, write other utilities in seperate files
export {
  resetSmartViewsStore,
  addNewTab,
  updateCustomTab,
  setIsLoading,
  setAllTabIds,
  setActiveTabId,
  getActiveTabId,
  setDefaultTabId,
  setSmartViewData,
  updateSmartViewsTab,
  setSelectedColumns,
  getDefaultTabId,
  getLeadRepresentationName,
  getRawTabData,
  setRawTabData,
  getCommonTabSettings,
  getSmartviewId,
  setRefresh
};
export default useSmartViewStore;
