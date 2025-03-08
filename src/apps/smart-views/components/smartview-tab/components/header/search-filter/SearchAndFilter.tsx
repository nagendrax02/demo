import Search from './search';
import { useSmartViewSecondaryHeader } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import ClearFilters from './clear-filters';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import { useEffect, useState } from 'react';
import { getFilterCount, isQuickFilterEnabled } from './utils';
import QuickFilter from './quick-filter';
import Filters from './filters';
import SelectFilterDropdown from './select-filter-dropdown/SelectFilterDropdown';
import { ITabConfig } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

export interface ISearchAndFilter {
  tabId: string;
  tabData: ITabConfig;
}

const SearchAndFilter = (props: ISearchAndFilter): JSX.Element => {
  const { tabId, tabData } = props;
  const { filterConfig, hideSearchBar } = useSmartViewSecondaryHeader(tabId) || {};
  const selectedFilters = filterConfig?.filters?.selectedFilters;
  const [showAdvanceSearchModal, setShowAdvanceSearchModal] = useState(false);
  const [showManageFiltersModal, setShowManageFiltersModal] = useState(false);

  const filterCount = getFilterCount(tabId, tabData);

  useEffect(() => {
    //Inserted the below line to introduce an error to check fatal scenarios.
    if (getItem(StorageKey.InduceFatal) === 1) {
      throw new Error('Induced intentional fatal');
    }
  }, []);

  return (
    <>
      {hideSearchBar ? null : <Search tabId={tabId} />}
      {isQuickFilterEnabled(tabId) ? <QuickFilter /> : null}
      {!filterConfig?.selectFilterPopupConfig?.removePopup ? (
        <SelectFilterDropdown
          filterConfig={filterConfig}
          tabId={tabId}
          setShowAdvanceSearchModal={setShowAdvanceSearchModal}
          setShowManageFiltersModal={setShowManageFiltersModal}
        />
      ) : null}
      <Filters
        tabId={tabId}
        showAdvanceSearchModal={showAdvanceSearchModal}
        setShowAdvanceSearchModal={setShowAdvanceSearchModal}
        showManageFiltersModal={showManageFiltersModal}
        setShowManageFiltersModal={setShowManageFiltersModal}
      />
      {selectedFilters?.length ? <ClearFilters filterCount={filterCount} tabId={tabId} /> : null}
    </>
  );
};

export default SearchAndFilter;
