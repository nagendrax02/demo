import { trackError } from 'common/utils/experience/utils/track-error';
import { isMobileDevice } from 'common/utils/helpers';
import { INavItem } from './header.types';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { HEADER_FEATURE_RESTRICTION_MAP, menuItemsSortConfig } from './constants';
import { IModuleConfig } from 'common/types/authentication.types';
import { isFeatureRestricted } from 'common/utils/feature-restriction/utils/augment-data';

const fetchAppConfig = (): INavItem[] => {
  const authData = getPersistedAuthConfig();
  return Object.values(authData?.ModulesConfig || {}) || [];
};

const sortMenuItems = (items: INavItem[]): INavItem[] => {
  const nonSortableItems: INavItem[] = [];
  const sortedItems: INavItem[] = items
    .reduce((acc, item) => {
      if (menuItemsSortConfig[item.Name] !== undefined) {
        acc[menuItemsSortConfig[item.Name]] = { ...item };
      } else {
        nonSortableItems.push({ ...item });
      }
      return acc;
    }, [] as INavItem[])
    .filter(Boolean);
  return [...sortedItems, ...nonSortableItems];
};

export const fetchNavItems = (): INavItem[] => {
  const isAppAvailableInView = (item: INavItem): boolean => {
    let isAppAvailable = false;
    const isMobileView = isMobileDevice();
    const isShownInMobile = item?.ShowIn ? item?.ShowIn?.Mobile : true;
    const isShownInWeb = item?.ShowIn ? item?.ShowIn?.Web : true;

    if (isMobileView && isShownInMobile) {
      isAppAvailable = true;
    } else if (!isMobileView && isShownInWeb) {
      isAppAvailable = true;
    }

    return isAppAvailable;
  };

  const navItems = fetchAppConfig().filter((item) => {
    return item.Category === 1 && isAppAvailableInView(item);
  });

  navItems.sort((item1, item2) => {
    return (item1.DisplayConfig?.SortOrder ?? 0) - (item2.DisplayConfig?.SortOrder ?? 0);
  });

  return sortMenuItems(navItems);
};

export const getNavItemNameOfRoute = (navItems: INavItem[], route: string): string | undefined => {
  return (navItems || []).find(
    (item) => item?.RouteConfig?.RoutePath?.toLowerCase() === route?.toLowerCase()
  )?.Name;
};

export const getAugmentedNavItems = async (navItems: IModuleConfig[]): Promise<void> => {
  try {
    const restrictionApps = navItems.filter(
      (item) => HEADER_FEATURE_RESTRICTION_MAP?.[`${item?.Name}`]
    );

    const restrictionPromises = restrictionApps.map((item) =>
      isFeatureRestricted(HEADER_FEATURE_RESTRICTION_MAP?.[item?.Name])
    );

    const response = await Promise.all(restrictionPromises);

    response.forEach((featureRestricted, index) => {
      if (featureRestricted) {
        const appIndex = navItems.findIndex((item) => item?.Id === restrictionApps[index]?.Id);
        if (appIndex > -1) {
          navItems.splice(appIndex, 1);
        }
      }
    });
  } catch (err) {
    trackError(err);
  }
};
