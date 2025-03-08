import {
  getTabData,
  setCustomFilters,
  setFilterDataForSchema,
  useSmartViewSecondaryHeader
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { HeaderAction } from 'apps/smart-views/constants/constants';
import FilterRenderer from 'apps/smart-views/components/smartview-tab/components/filter-renderer';
import { IFilterData } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { isManageEntityAdvSearchEnabled } from 'apps/smart-views/utils/utils';
import AdvancedSearchTrigger from './AdvancedSearchTrigger';
import TabSettings from 'apps/smart-views/components/smartview-tab/components/tab-settings';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { isFilterSelected } from 'apps/smart-views/components/smartview-tab/utils';
import HiddenListTrigger from './HiddenListTrigger';

const ManageLeadAdvancedFilter = withSuspense(lazy(() => import('./ManageLeadAdvancedFilter')));
const ManageEntityAdvSearchModal = withSuspense(lazy(() => import('./ManageEntityAdvSearchModal')));

const Filters = ({
  tabId,
  showAdvanceSearchModal,
  setShowAdvanceSearchModal,
  showManageFiltersModal,
  setShowManageFiltersModal
}: {
  tabId: string;
  showAdvanceSearchModal: boolean;
  setShowAdvanceSearchModal: React.Dispatch<React.SetStateAction<boolean>>;
  showManageFiltersModal: boolean;
  setShowManageFiltersModal: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { filterConfig } = useSmartViewSecondaryHeader(tabId) || {};
  const selectedFilters = filterConfig?.filters?.selectedFilters || [];
  const bySchemaName = filterConfig?.filters?.bySchemaName || {};

  const handleFilterChange = (filterValue: IFilterData, schemaName: string): void => {
    setFilterDataForSchema(tabId, filterValue, schemaName);
    setCustomFilters(tabId);
  };

  const isFilterOpen = (schemaName: string): boolean => {
    return filterConfig?.filters?.filterToOpenOnMount === schemaName;
  };

  const isPinned = (schemaName: string): boolean => {
    return Boolean(bySchemaName[schemaName].isPinned);
  };

  const showFilterOnPage = (schemaName: string): boolean => {
    const filter = bySchemaName?.[schemaName];
    return Boolean(
      filter?.label &&
        !filter?.isHidden &&
        (isFilterOpen(schemaName) || isFilterSelected(filter.selectedValue) || isPinned(schemaName))
    );
  };

  const isHiddenListApplied = (): boolean => {
    return Boolean(getTabData(tabId)?.gridConfig?.fetchCriteria?.ShowHidden);
  };

  return (
    <>
      <AdvancedSearchTrigger tabId={tabId} setShowAdvanceSearchModal={setShowAdvanceSearchModal} />
      {selectedFilters?.map((schemaName) =>
        showFilterOnPage(schemaName) ? (
          <FilterRenderer
            key={schemaName}
            tabId={tabId}
            filterData={bySchemaName[schemaName]}
            schemaName={schemaName}
            onFilterChange={handleFilterChange}
            bySchemaName={bySchemaName}
            filters={filterConfig?.filters}
          />
        ) : null
      )}
      {/* if any use case comes up which needs chip for other tabs. we have to do it through augmentation and render our JSX instead of having separate Trigger */}
      <HiddenListTrigger tabId={tabId} isHiddenListApplied={isHiddenListApplied()} />
      {isManageEntityAdvSearchEnabled(tabId) ? (
        showAdvanceSearchModal ? (
          <ManageEntityAdvSearchModal
            showModal={showAdvanceSearchModal}
            setShowModal={setShowAdvanceSearchModal}
          />
        ) : null
      ) : (
        <ManageLeadAdvancedFilter
          showAdvanceSearchModal={showAdvanceSearchModal}
          setShowAdvanceSearchModal={setShowAdvanceSearchModal}
        />
      )}
      {showManageFiltersModal ? (
        <TabSettings
          selectedAction={{
            label: HeaderAction.ManageFilters,
            value: HeaderAction.ManageFilters
          }}
          tabId={tabId}
          show={showManageFiltersModal}
          setShow={setShowManageFiltersModal}
        />
      ) : null}
    </>
  );
};

export default Filters;
