import { useLocation } from 'wouter';
import { useSearch } from 'wouter/use-location';
import { useEffect } from 'react';
import { ITabConfig, TabType } from './app-tabs.types';
import { getMoreTabsList, setAppTabsConfig } from './app-tabs.store';
import { getCachedTabConfig } from './utils/cache-utils';
import {
  createNewAppTabConfig,
  getActiveAppTabId,
  getMaxTabLimit,
  isValidPath
} from './utils/hook-utils';
import { trackError } from '../../utils/experience';
import { MAX_TAB_REACHED_MESSAGE } from './constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';

import { getAppTabCount } from './utils/render-utils';

const setActiveTab = (tabs: ITabConfig[], activeTabIndex: number): ITabConfig[] => {
  return tabs.map((tab, index) => ({
    ...tab,
    isActiveTab: index === activeTabIndex
  }));
};

const addNewTab = (tabs: ITabConfig[], newTab: ITabConfig): ITabConfig[] => {
  const existingPrimaryTabIndex = tabs.findIndex((tab) => tab.type === TabType.Primary);

  if (newTab.type === TabType.Primary) {
    if (existingPrimaryTabIndex !== -1) {
      tabs[existingPrimaryTabIndex] = newTab;
    } else {
      tabs.unshift(newTab);
    }
  } else {
    const insertIndex = existingPrimaryTabIndex !== -1 ? 1 : 0;
    tabs.splice(insertIndex, 0, newTab);
  }

  return tabs;
};

const getAppTabLimitReached = (newTab: ITabConfig, tabs: ITabConfig[]): boolean => {
  return newTab.type === TabType.Secondary && getAppTabCount(tabs) === getMaxTabLimit();
};

const initializeAppTabs = ({
  showAlert
}: {
  showAlert: (notification: INotification) => void;
}): void => {
  /* App Tabs Logic explained

    1. When we land on a page, get the pathname from url and form tabId.
    2. Get the cached tab config array from local storage.
    3. If a config with this tabId exists in the array
        3.1 If the tab is a more tab, set isActiveTab as true, change the position to the beginning
        3.2 Else set isActiveTab as true
    4. If there is no config, check if path valid, set all tab's isActiveTab as false, create new tab config
        4.1 If the max tab limit has reached, then remove the last tab and show notification.
        4.2 If tab type is primary and there is already a primary tab in the array, replace that tab.
        4.3 If tab type is primary and there is no existing primary tab, add it to the beginning.
        4.4 If tab type is secondary, add it to the beginning of the array(based on whether primary tab is present or not).
  */

  try {
    const pathName = window.location.pathname.toLowerCase();

    const currentTabId = getActiveAppTabId();

    let tabs = getCachedTabConfig() ?? [];
    const moreTabsList = getMoreTabsList();

    const existingTabIndex = tabs.findIndex((tab) => tab.id === currentTabId);

    tabs = tabs.map((tab) => ({ ...tab, isActiveTab: false }));

    if (existingTabIndex !== -1) {
      tabs = setActiveTab(tabs, existingTabIndex);
      if (moreTabsList?.includes(currentTabId)) {
        const [overflownTab] = tabs.splice(existingTabIndex, 1);
        tabs = addNewTab(tabs, overflownTab);
      }
    } else if (isValidPath(pathName)) {
      const newTab: ITabConfig = createNewAppTabConfig(pathName, tabs?.length);
      if (getAppTabLimitReached(newTab, tabs)) {
        showAlert({
          type: Type.INFO,
          message: MAX_TAB_REACHED_MESSAGE?.replace(
            '{{old tab}}',
            tabs?.[tabs.length - 1]?.title
          )?.replace('{{max tab limit}}', `${getMaxTabLimit()}`)
        });
        tabs.pop();
      }
      tabs = addNewTab(tabs, newTab);
    }
    setAppTabsConfig(tabs);
  } catch (err) {
    trackError(err);
  }
};

const useAppTabs = (): void => {
  const [loc] = useLocation();
  const searchQuery = useSearch();
  const { showAlert } = useNotification();

  useEffect(() => {
    initializeAppTabs({ showAlert });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc, searchQuery]);
};

export default useAppTabs;
