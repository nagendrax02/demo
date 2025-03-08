import { IAugmentedTabConfig } from '../types';
import { ITab } from '../types/entitytabs.types';
import { getTabNameWidth } from './calculate-text-width';
import { getTabName } from './general';

const getOverflowingAndNonOverflowingTabs = (
  containerWidth: number,
  tabs: ITab[] | undefined
): IAugmentedTabConfig[] => {
  if (!containerWidth || !tabs) {
    return [];
  }
  const extraWidth = 50;
  let totalTabsWidth = 0;
  const adjustedTabs: IAugmentedTabConfig[] = [];
  const calculateTabNameWidth = getTabNameWidth();
  tabs.forEach((tab) => {
    const tabWidth = calculateTabNameWidth(getTabName(tab?.name), 12);
    totalTabsWidth += tabWidth;
    if (containerWidth - extraWidth >= totalTabsWidth) {
      adjustedTabs.push({ ...tab, isOverflowing: false, width: tabWidth });
    } else {
      adjustedTabs.push({ ...tab, isOverflowing: true, width: tabWidth });
    }
  });
  return adjustedTabs;
};

export { getOverflowingAndNonOverflowingTabs };
