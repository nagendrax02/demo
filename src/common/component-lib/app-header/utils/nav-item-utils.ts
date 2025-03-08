import { Path } from 'wouter';
import { INavigationItem, INavigationReferenceMap } from '../app-header.types';
import { setSelectedModuleId, setSelectedModuleItemId } from '../app-header.store';

/**
 * Finds a navigation item based on its URL.
 *
 * This function searches through the navigation items to find the item
 * that matches the provided URL. It returns the navigation item with the
 * given URL, or undefined if not found.
 */

export const getNavItemFromUrl = (
  url: string,
  data: INavigationItem[]
): INavigationItem | undefined => {
  const findNavItem = (items: INavigationItem[]): INavigationItem | undefined => {
    for (const item of items) {
      if (item.Path === url) {
        return item;
      }
      if (item.SubMenu) {
        const found = findNavItem(item.SubMenu);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  };

  return findNavItem(data);
};

/**
 * Handles the click event for a module item.
 *
 * This function is called when a module item is clicked. It finds the module item
 * by its ID, then finds the child-most navigation item within that module. If the
 * child-most navigation item has a URL, it sets the location to that URL and updates
 * the selected module and selected module item in the store.
 */

export const onModuleItemClick = ({
  moduleItemId,
  setLocation,
  navigationReferenceMap
}: {
  moduleItemId: string;
  setLocation: (
    to: Path,
    options?: {
      replace?: boolean;
    }
  ) => void;
  navigationReferenceMap: INavigationReferenceMap;
}): void => {
  const moduleItem = navigationReferenceMap?.[moduleItemId];
  if (moduleItem) {
    const leafNavItem = navigationReferenceMap?.[moduleItem.leafModuleItemId || '']?.data;
    if (leafNavItem?.Path) {
      setLocation(leafNavItem.Path);
      const rootNavItem = navigationReferenceMap?.[moduleItem.rootModuleId || '']?.data;
      if (rootNavItem) {
        setSelectedModuleId(rootNavItem?.Id);
        setSelectedModuleItemId(leafNavItem?.Id);
      } else {
        setSelectedModuleId(leafNavItem?.Id);
      }
    }
  }
};

/**
 * Handles the click event for a module.
 *
 * This function is called when a module is clicked. It finds the module by its ID,
 * then finds the child-most navigation item within that module. If the child-most
 * navigation item has a URL, it sets the location to that URL and updates the selected
 * module and module item in the store.
 */

export const onModuleClick = ({
  moduleId,
  setLocation,
  navigationReferenceMap
}: {
  moduleId: string;
  setLocation: (
    to: Path,
    options?: {
      replace?: boolean;
    }
  ) => void;
  navigationReferenceMap: INavigationReferenceMap;
}): void => {
  const moduleItem = navigationReferenceMap?.[moduleId];
  if (moduleItem) {
    const leafNavItem =
      navigationReferenceMap?.[moduleItem?.leafModuleItemId || '']?.data ?? moduleItem?.data;
    if (leafNavItem.Path) {
      setLocation(leafNavItem.Path);
      setSelectedModuleId(moduleItem?.data?.Id);
      setSelectedModuleItemId(leafNavItem?.Id);
    }
  }
};

/**
 * Finds a navigation item by its ID.
 *
 * This function searches through the navigation items to find the item with the
 * specified ID. It returns the navigation item with the given ID, or undefined if not found.
 */

export const findNavItemById = (
  id: string,
  data: INavigationItem[]
): INavigationItem | undefined => {
  for (const item of data) {
    if (item.Id === id) {
      return item;
    }
    if (item.SubMenu) {
      const found = findNavItemById(id, item.SubMenu);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};
