import { trackError } from 'common/utils/experience/utils/track-error';
import { IAugmentedTabConfig } from '../types';

const getLastVisibleTab = (
  tabConfig: IAugmentedTabConfig[]
): { config: IAugmentedTabConfig; index: number } | null => {
  try {
    if (!tabConfig?.length) {
      return null;
    }
    const visibleTabs = tabConfig?.filter((tab) => !tab?.isOverflowing);
    const lastVisibleTabIndex = visibleTabs?.length - 1;
    const lastVisibleTab = visibleTabs[lastVisibleTabIndex];
    return {
      config: lastVisibleTab,
      index: lastVisibleTabIndex
    };
  } catch (error) {
    trackError(error);
  }
  return null;
};

const swapLastVisibleTabWithSelectedOverflowingTab = (
  tabConfig: IAugmentedTabConfig[],
  selectedOverflowingTab: IAugmentedTabConfig | undefined
): IAugmentedTabConfig[] => {
  try {
    if (!(tabConfig?.length && selectedOverflowingTab)) {
      return [];
    }
    const lastVisibleTab = getLastVisibleTab(tabConfig);
    if (!lastVisibleTab) {
      return tabConfig;
    }
    const selectedOverflowingTabIndex = tabConfig.indexOf(selectedOverflowingTab);
    tabConfig[lastVisibleTab?.index] = { ...selectedOverflowingTab, isOverflowing: false };
    tabConfig[selectedOverflowingTabIndex] = {
      ...lastVisibleTab?.config,
      isOverflowing: true
    };
    return [...tabConfig];
  } catch (error) {
    trackError(error);
  }
  return [];
};

const swapActiveTabWithLastVisibleTab = (
  tabConfig: IAugmentedTabConfig[],
  activeTabId: string | undefined
): IAugmentedTabConfig[] => {
  try {
    if (!(tabConfig?.length && activeTabId)) {
      return [];
    }
    const lastVisibleTab = getLastVisibleTab(tabConfig);
    const activeTabIndex = tabConfig.findIndex((tab) => tab?.id === activeTabId);
    const activeTab = tabConfig[activeTabIndex];
    if (!(activeTab?.isOverflowing && lastVisibleTab)) {
      return tabConfig;
    }
    tabConfig[lastVisibleTab?.index] = { ...activeTab, isOverflowing: false };
    tabConfig[activeTabIndex] = { ...lastVisibleTab?.config, isOverflowing: true };

    return [...tabConfig];
  } catch (error) {
    trackError(error);
  }
  return [];
};

export { swapLastVisibleTabWithSelectedOverflowingTab, swapActiveTabWithLastVisibleTab };
