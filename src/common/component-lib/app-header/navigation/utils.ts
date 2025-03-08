import { INavigationItem } from '../app-header.types';

/**
 * Filters the navigation items based on the search text.
 *
 * This function searches through the navigation items and their submenus up to 3 levels deep.
 * It returns the items whose labels match the search text or whose child's labels match the search text.
 * If a child matches the search text, the parent is also included in the results.
 */

const getSearchTextFilteredData = (
  data: INavigationItem[],
  searchText: string
): INavigationItem[] => {
  if (!searchText) {
    return data;
  }

  const lowerCaseSearchText = searchText.toLowerCase();

  const filterItems = (items: INavigationItem[], level: number): INavigationItem[] => {
    if (level > 3) {
      return [];
    }

    return items
      .map((item) => {
        const filteredSubMenu = item.SubMenu ? filterItems(item.SubMenu, level + 1) : null;
        const matchesSearchText = item.Label.toLowerCase().includes(lowerCaseSearchText);
        if (matchesSearchText || (filteredSubMenu && filteredSubMenu.length > 0)) {
          return {
            ...item,
            SubMenu: filteredSubMenu
          };
        }
        return null;
      })
      .filter((item) => item !== null) as INavigationItem[];
  };

  return filterItems(data, 1);
};

export { getSearchTextFilteredData };
