import { TABS_CACHE_KEYS } from 'apps/smart-views/components/custom-tabs/constants';

import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { IQuickFilterResponse } from './quick-filter/quick-filter.types';
import { QUICK_FILTER_DEFAULT_OPTION, STARRED_LEAD } from './quick-filter/constant';
import { isGlobalSearchPage } from 'common/utils/helpers/helpers';
import { getTabData } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { ITabConfig } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { isFilterSelected } from 'apps/smart-views/components/smartview-tab/utils';

export const isQuickFilterEnabled = (tabId: string): boolean => {
  return tabId === TABS_CACHE_KEYS.MANAGE_LEADS_TAB && !isGlobalSearchPage();
};

export const showAdvanceSearchButton = (tabId: string, quickFilterName?: string): boolean => {
  return isQuickFilterEnabled(tabId) && quickFilterName !== STARRED_LEAD;
};

export const showConfigureFields = (tabId: string, quickFilterName?: string): boolean => {
  const selectFilterPopupConfig =
    getTabData(tabId)?.headerConfig?.secondary?.filterConfig?.selectFilterPopupConfig;

  if (selectFilterPopupConfig?.removeConfigureFields) {
    return false;
  }

  if (isQuickFilterEnabled(tabId)) {
    return quickFilterName !== STARRED_LEAD;
  }
  return true;
};

// here we persist the selected quick filter i.e whole object, not just name
export const persistQuickFilterSelected = (data: IQuickFilterResponse): void => {
  setItem(StorageKey.QuickFilter, data);
};

export const getQuickFilterSelected = (): IQuickFilterResponse => {
  const storedFilter = getItem(StorageKey.QuickFilter);
  if (storedFilter) {
    return (storedFilter as IQuickFilterResponse) || {};
  }
  return QUICK_FILTER_DEFAULT_OPTION;
};

export const getFilterCount = (tabId: string, tabData: ITabConfig): number => {
  const quickFilter = tabData?.headerConfig?.secondary?.quickFilterConfig?.quickFilter;
  const isManageEntityAdvancedSearchApplied =
    !!tabData?.gridConfig?.isManageEntityAdvancedSearchApplied;
  const showHiddenLists = tabData?.gridConfig?.fetchCriteria?.ShowHidden;
  const filterConfig = tabData?.headerConfig?.secondary?.filterConfig;
  const selectedFilters = filterConfig?.filters?.selectedFilters;
  let filterCount = 0;
  const bySchemaName = filterConfig?.filters?.bySchemaName;

  selectedFilters?.forEach((filter) => {
    if (
      isFilterSelected(bySchemaName[filter]?.selectedValue) &&
      !bySchemaName[filter]?.isNotCounted
    ) {
      filterCount += 1;
    }
  });
  if (
    (isQuickFilterEnabled(tabId) &&
      quickFilter &&
      quickFilter?.Name !== QUICK_FILTER_DEFAULT_OPTION.Name) ||
    showHiddenLists
  ) {
    filterCount += 1;
  }

  if (isManageEntityAdvancedSearchApplied) filterCount += 1;

  return filterCount;
};
