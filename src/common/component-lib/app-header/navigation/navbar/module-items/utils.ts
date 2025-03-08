import { INavigationItem } from '../../../app-header.types';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';

export const getSegregatedItems = (
  items: INavigationItem[]
): { visibleItems: INavigationItem[]; moreItems: INavigationItem[] } => {
  const visibleItems: INavigationItem[] = [];
  const moreItems: INavigationItem[] = [];

  items?.forEach((item, index) => {
    if (index < 4) {
      visibleItems.push(item);
    } else {
      moreItems.push(item);
    }
  });

  return { visibleItems, moreItems };
};

/**
 * Converts navigation items to action menu options.
 */

export const getActionMenuConvertedData = (data: INavigationItem[]): IOption[] => {
  return data?.map((item: INavigationItem) => {
    return {
      label: item?.Label,
      value: item?.Id,
      subOptions: item?.SubMenu?.length ? getActionMenuConvertedData(item?.SubMenu) : undefined
    };
  });
};
