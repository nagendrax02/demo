import { trackError } from 'common/utils/experience';
import {
  setAppHeaderData,
  setIsAppHeaderLoading,
  setNavigationReferenceMap,
  setSelectedModuleId,
  setSelectedModuleItemId
} from '../app-header.store';
import { fetchAppHeaderData } from './fetch-data';
import { Path } from 'wouter';
import { IAppHeaderData, INavigationItem, INavigationReferenceMap } from '../app-header.types';
import { getNavItemFromUrl } from './nav-item-utils';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';

interface IInitializeAppHeaderData {
  setLocation: (
    to: Path,
    options?: {
      replace?: boolean;
    }
  ) => void;
}

const createNavigationReferenceMap = (appHeader: {
  NavigationMenu: INavigationItem[];
}): INavigationReferenceMap => {
  const referenceMap: INavigationReferenceMap = {};

  const findLeafModuleItemId = (item: INavigationItem): string | undefined => {
    if (!item?.SubMenu?.length) {
      return item?.Id;
    }
    let currentItem = item.SubMenu[0];
    while (currentItem.SubMenu && currentItem.SubMenu.length > 0) {
      currentItem = currentItem.SubMenu[0];
    }
    return currentItem.Id;
  };
  const traverse = (item: INavigationItem, rootModuleId?: string): void => {
    const leafModuleItemId = findLeafModuleItemId(item);
    referenceMap[item.Id] = {
      data: item,
      rootModuleId: rootModuleId ?? '',
      leafModuleItemId: leafModuleItemId ?? ''
    };

    if (item.SubMenu) {
      item.SubMenu.forEach((subItem) => {
        traverse(subItem, rootModuleId ?? item.Id);
      });
    }
  };

  appHeader.NavigationMenu.forEach((item) => {
    traverse(item);
  });

  return referenceMap;
};

/**
 * Gets the selected module and selected module item based on the current URL.
 *
 * This function is used to determine the selected module and module item from the
 * current URL. It updates the store with the selected module ID and selected module item ID.
 */

export const getSelectedModuleAndSelectedModuleItem = ({
  data,
  navigationReferenceMap
}: {
  data: IAppHeaderData;
  navigationReferenceMap: INavigationReferenceMap;
}): void => {
  const path = window.location.pathname + window.location.search;

  const navItem = getNavItemFromUrl(path, data?.NavigationMenu);

  if (navItem) {
    const rootNavItem =
      navigationReferenceMap?.[navigationReferenceMap?.[navItem.Id].rootModuleId || '']?.data;
    if (rootNavItem) {
      setSelectedModuleId(rootNavItem?.Id);
      setSelectedModuleItemId(navItem?.Id);
    } else {
      const leafNavItem =
        navigationReferenceMap?.[navigationReferenceMap?.[navItem.Id].leafModuleItemId || '']?.data;
      setSelectedModuleId(navItem?.Id);
      setSelectedModuleItemId(leafNavItem?.Id);
    }
  }
};

/**
 * Gets the home page URL from the app header data and updates the browser path.
 *
 * This function retrieves the home page URL from the app header data and sets the
 * browser location to the home page URL.
 */

const getHomePageUrlAndUpdateBrowserPath = ({
  data,
  setLocation
}: {
  data: IAppHeaderData;
  setLocation: (
    to: Path,
    options?: {
      replace?: boolean;
    }
  ) => void;
}): void => {
  const isAppHeaderInitialized = getItem(StorageKey.IsAppHeaderInitialized);
  if (!isAppHeaderInitialized) {
    const homePageUrl = data.HomeConfiguration.HomePageURL;
    setLocation(homePageUrl);
    setItem(StorageKey.IsAppHeaderInitialized, true);
  }
};

/**
 * Fetches the app header data from API and updates the store.
 *
 * This function fetches the app header data from the API and updates the store
 * with the fetched data.
 */

const getAppHeaderDataAndUpdateStore = async (): Promise<IAppHeaderData> => {
  const response = await fetchAppHeaderData();
  setAppHeaderData(response);
  return response;
};

/**
 * Initializes the app header data by setting the selected module and module item
 * based on the current URL, and updating the browser path to the home page URL.
 *
 * This function is called during the initialization of the app header. It fetches
 * the app header data, updates the store, sets the browser location to the home page URL,
 * and determines the selected module and module item based on the current URL.
 */

export const initializeAppHeaderData = async ({
  setLocation
}: IInitializeAppHeaderData): Promise<void> => {
  try {
    setIsAppHeaderLoading(true);

    const response = await getAppHeaderDataAndUpdateStore();
    getHomePageUrlAndUpdateBrowserPath({ data: response, setLocation });
    const navigationReferenceMap = createNavigationReferenceMap(response);
    getSelectedModuleAndSelectedModuleItem({
      data: response,
      navigationReferenceMap
    });
    setNavigationReferenceMap(navigationReferenceMap);

    setIsAppHeaderLoading(false);
  } catch (err) {
    trackError(err);
    throw err;
  }
  setIsAppHeaderLoading(false);
};
