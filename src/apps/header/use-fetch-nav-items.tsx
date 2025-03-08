import { useEffect } from 'react';
import useHeaderStore from './header.store';
import { fetchNavItems, getAugmentedNavItems, getNavItemNameOfRoute } from './utils';
import { INavItem } from './header.types';
import { useLocation } from 'wouter';
import { IModuleConfig } from 'common/types/authentication.types';
import { HeaderModules, ORDER_OF_DEFAULT_APPS } from './constants';
import { APP_ROUTE } from 'common/constants';
import { getCustomMenuApps } from '../external-app/custom-menu/utils';

interface IUseFetchNavItems {
  isLoading: boolean;
  navItems: INavItem[];
}

const useFetchNavItems = (): IUseFetchNavItems => {
  const { isLoading, setIsLoading, setNavItems, navItems, setActiveNavItemName, removeNavItem } =
    useHeaderStore((state) => ({
      isLoading: state.isLoading,
      setIsLoading: state.setIsLoading,
      setNavItems: state.setNavItems,
      navItems: state.navItems,
      setActiveNavItemName: state.setActiveNavItemName,
      removeNavItem: state.removeNavItem
    }));
  const [loc, setLoc] = useLocation();

  const setActiveNavItem = (): void => {
    const selectedNavItemFromRoute = getNavItemNameOfRoute(navItems, loc);
    setActiveNavItemName(selectedNavItemFromRoute || '-1');
  };

  const redirectToDefaultApp = async (navItemsResponse: IModuleConfig[]): Promise<void> => {
    if (loc !== APP_ROUTE.default || !navItemsResponse?.length) {
      return;
    }

    const defaultApps = navItemsResponse
      ?.filter((item) => Object.keys(ORDER_OF_DEFAULT_APPS).includes(item?.Name))
      ?.sort((a, b) => ORDER_OF_DEFAULT_APPS[a.Name] - ORDER_OF_DEFAULT_APPS[b.Name]);

    if (defaultApps?.length) {
      setLoc(defaultApps?.[0]?.RouteConfig?.RoutePath);
    } else {
      setLoc(navItemsResponse?.[0]?.RouteConfig?.RoutePath);
    }
  };

  const handleCustomMenuVisibility = async (navItemsResponse: IModuleConfig[]): Promise<void> => {
    const customMenuItem = navItemsResponse?.filter(
      (item) => item.Name === HeaderModules.CustomMenu
    )?.[0];
    if (customMenuItem) {
      const response = await getCustomMenuApps();
      if (!response?.ApplicationMenus?.length) {
        removeNavItem(customMenuItem);
      }
    }
  };

  const getNavItems = async (): Promise<void> => {
    setIsLoading(true);
    const response = fetchNavItems();
    await getAugmentedNavItems(response);
    handleCustomMenuVisibility(response);
    setNavItems(response || []);
    setIsLoading(false);
  };

  useEffect(() => {
    redirectToDefaultApp(navItems);
    setActiveNavItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navItems, loc]);

  useEffect(() => {
    getNavItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading, navItems };
};

export default useFetchNavItems;
