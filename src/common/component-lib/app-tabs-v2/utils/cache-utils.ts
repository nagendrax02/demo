import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { ITabConfig } from '../app-tabs.types';

export interface IAppTabsCache {
  appTabsConfig: ITabConfig[];
  moreTabsList: string[];
}

export const getCachedTabConfig = (): ITabConfig[] | null => {
  const cachedData = getItem<IAppTabsCache>(StorageKey.AppTabsConfig);
  return cachedData?.appTabsConfig || null;
};

export const setTabConfigInCache = (config: ITabConfig[]): void => {
  const cachedData = getItem<IAppTabsCache>(StorageKey.AppTabsConfig);
  setItem(StorageKey.AppTabsConfig, { ...cachedData, appTabsConfig: config });
};

export const getCachedMoreTabsList = (): string[] | null => {
  const cachedData = getItem<IAppTabsCache>(StorageKey.AppTabsConfig);
  return cachedData?.moreTabsList || null;
};

export const setMoreTabsListInCache = (config: string[]): void => {
  const cachedData = getItem<IAppTabsCache>(StorageKey.AppTabsConfig);
  setItem(StorageKey.AppTabsConfig, { ...cachedData, moreTabsList: config });
};
