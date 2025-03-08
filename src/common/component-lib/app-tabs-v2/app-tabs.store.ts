import { create } from 'zustand';
import { ITabConfig, IAppTabsStore } from './app-tabs.types';
import {
  getCachedMoreTabsList,
  setMoreTabsListInCache,
  setTabConfigInCache
} from './utils/cache-utils';
import { trackError } from 'common/utils/experience';

const initialState: IAppTabsStore = {
  isAppTabsEnabled: false,
  appTabsConfig: [],
  moreTabList: undefined
};

const useAppTabsStore = create<IAppTabsStore>(() => ({
  // state
  ...initialState
}));

export const removeTab = (tabId: string): void => {
  try {
    const appTabsConfig = useAppTabsStore.getState().appTabsConfig;
    const updatedTabConfig = appTabsConfig.filter((config) => config?.id !== tabId);
    setTabConfigInCache(updatedTabConfig);
    useAppTabsStore.setState({ appTabsConfig: updatedTabConfig });
  } catch (err) {
    trackError(err);
  }
};

export const updateTabConfig = (tabId: string, newConfig: Partial<ITabConfig>): void => {
  try {
    const appTabsConfig = useAppTabsStore.getState().appTabsConfig;
    const updatedTabConfig = appTabsConfig.map((config) => {
      if (config?.id === tabId) {
        return { ...config, ...newConfig };
      }
      return config;
    });
    setTabConfigInCache(updatedTabConfig);
    useAppTabsStore.setState({ appTabsConfig: updatedTabConfig });
  } catch (err) {
    trackError(err);
  }
};

export const setAppTabsConfig = (newConfig: ITabConfig[]): void => {
  try {
    setTabConfigInCache(newConfig);
    useAppTabsStore.setState({ appTabsConfig: newConfig });
  } catch (err) {
    trackError(err);
  }
};

export const getMoreTabsList = (): string[] => {
  try {
    const moreTabList = useAppTabsStore.getState()?.moreTabList;
    return moreTabList ?? getCachedMoreTabsList() ?? [];
  } catch (err) {
    trackError(err);
    return [];
  }
};

export const setMoreTabsList = (newList: string[]): void => {
  try {
    setMoreTabsListInCache(newList);
    useAppTabsStore.setState({ moreTabList: newList });
  } catch (err) {
    trackError(err);
  }
};

export const setIsAppTabsEnabled = (value: boolean): void => {
  useAppTabsStore.setState({ isAppTabsEnabled: value });
};

export default useAppTabsStore;
