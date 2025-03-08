import OtherFilters from './OtherFilters';
import PinnedFilters from './PinnedFilters';
import {
  getTabData,
  setOpenFilter,
  updatePinnedFilter
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { updateSmartViewsTab } from 'apps/smart-views/smartviews-store';
import { segregateFilters } from './utils';
import Search from '@lsq/nextgen-preact/v2/text-field/search-bar';
import { classNames } from 'common/utils/helpers/helpers';
import styles from './select-filter-dropdown.module.css';
import { DropdownSeparator } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown';
import { IHeaderFilterConfig } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

const getFilterOptions = ({
  tabId,
  filterConfig,
  search,
  setSearch
}: {
  tabId: string;
  filterConfig: IHeaderFilterConfig;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element | null => {
  const { selectedFilters, bySchemaName } = filterConfig.filters;
  const visibleSelectedFilters = selectedFilters.filter((filter) => !bySchemaName[filter].isHidden);
  const { pinnedFilters, otherFilters } = segregateFilters(
    visibleSelectedFilters,
    bySchemaName,
    search
  );
  const isPinLimitReached = pinnedFilters.length >= 5;

  const handleOnPinClick = (filter: string, isPinned: boolean): void => {
    if ((isPinned && isPinLimitReached) || bySchemaName[filter].disablePinAction) {
      return;
    }

    updatePinnedFilter(tabId, filter, isPinned);
    updateSmartViewsTab(tabId, getTabData(tabId));
  };

  const handleOnOptionClick = (filter: string): void => {
    /* 
      setTimeout is added to fix following issue:
        - When option is clicked for the first time, filter gets selected and open
        - When same option is clicked again, filter opens and closes immediately 
        - onOpenChange of radix dropdown is getting executed on second mount 
          which should happen when you change open state rather than on mount
    */
    setTimeout(() => {
      setOpenFilter(tabId, filter);
    }, 50);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    /*
        search input is losing focus when entering first letter without stopPropagation
        due to event listeners of radix dropdown
      */
    event.stopPropagation();
  };

  return visibleSelectedFilters.length ? (
    <>
      <Search
        value={search}
        onChange={setSearch}
        onKeyDown={handleKeyDown}
        focusOnMount
        size="xs"
        className={styles.search}
      />
      <DropdownSeparator />
      <div className={classNames('ng_scrollbar', styles.scrollable_content)}>
        <PinnedFilters
          filters={pinnedFilters}
          bySchemaName={bySchemaName}
          onOptionClick={handleOnOptionClick}
          onPinClick={handleOnPinClick}
        />
        <DropdownSeparator />
        <OtherFilters
          filters={otherFilters}
          bySchemaName={bySchemaName}
          onOptionClick={handleOnOptionClick}
          onPinClick={handleOnPinClick}
          disablePinAction={isPinLimitReached}
        />
      </div>
    </>
  ) : null;
};

export default getFilterOptions;
