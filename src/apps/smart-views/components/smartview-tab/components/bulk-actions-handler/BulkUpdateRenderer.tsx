import { ISearchParams } from 'common/component-lib/bulk-update/bulk-update.types';
import { useSmartViewTab as getSmartViewTab, refreshGrid } from '../../smartview-tab.store';
import BulkUpdate from 'common/component-lib/bulk-update';
import { EntityType } from 'common/types';
import { CallerSource } from 'common/utils/rest-client';
import { IBulkAction } from '../../smartview-tab.types';
import { getGridConfig } from './actionHelper';
import { STARRED_LEAD } from '../header/search-filter/quick-filter/constant';
import SuccessModal from 'apps/smart-views/components/custom-tabs/manage-list-lead-detail/success-modal';
import { UPDATE_ALL_ENTITY } from 'common/component-lib/bulk-update/constant';
import RequestHistorySubDescription from 'apps/smart-views/components/custom-tabs/manage-list-lead-detail/success-modal/RequestHistory';
import { getRepresentationName } from './utils';

const getOrder = (value: number): string => {
  switch (value) {
    case 0:
      return 'asc';
    case 1:
      return 'desc';
    case 2:
      return 'None';
    default:
      return 'None';
  }
};

const getSearchParams = (tabId: string, sourceId?: string): ISearchParams => {
  const fetchCriteria = getSmartViewTab(tabId)?.gridConfig?.fetchCriteria;
  const quickFilterConfig = getSmartViewTab(tabId)?.headerConfig?.secondary?.quickFilterConfig;
  const quickFilterId =
    quickFilterConfig?.quickFilter?.InternalName === STARRED_LEAD
      ? quickFilterConfig.quickFilter.ID
      : '';

  return {
    advancedSearchText: fetchCriteria?.AdvancedSearch,
    advancedSearchTextNew: fetchCriteria?.AdvancedSearch,
    searchText: fetchCriteria?.SearchText,
    customFilters:
      typeof fetchCriteria?.CustomFilters === 'string' ? fetchCriteria?.CustomFilters : '',
    pageSize: `${fetchCriteria?.PageSize}`,
    sortOn: `${fetchCriteria?.SortOn}-${getOrder(fetchCriteria?.SortBy)}`,
    listId: sourceId ?? quickFilterId
  };
};

const BulkUpdateRenderer = ({
  bulkAction,
  tabId,
  handleClose,
  entityType,
  updateAllEntity,
  sourceId
}: {
  bulkAction: IBulkAction | null;
  tabId: string;
  handleClose: () => void;
  entityType: EntityType;
  updateAllEntity?: boolean;
  sourceId?: string;
}): JSX.Element => {
  const showModal = ({
    onClose,
    repPluralName
  }: {
    onClose: () => void;
    repPluralName?: string;
  }): JSX.Element => (
    <SuccessModal
      handleClose={onClose}
      title={getRepresentationName({
        text: UPDATE_ALL_ENTITY.SUCCESS_MODAL_TITLE,
        repName: repPluralName ?? 'Leads',
        value: '{entityPluralName}'
      })}
      message={getRepresentationName({
        text: UPDATE_ALL_ENTITY.SUCCESS_MESSAGE,
        repName: repPluralName ?? 'Leads',
        value: '{entityPluralName}'
      })}
      description={UPDATE_ALL_ENTITY.SUCCESS_DESCRIPTION}
      subDescription={<RequestHistorySubDescription />}
    />
  );

  return (
    <BulkUpdate
      callerSource={CallerSource.SmartViews}
      entityIds={Object.keys(bulkAction?.selectedRows || {}) as string[]}
      eventCode={getSmartViewTab(tabId)?.entityCode}
      entityType={entityType}
      gridConfig={getGridConfig(
        tabId,
        Object.keys(bulkAction?.selectedRows || {})?.length,
        updateAllEntity
      )}
      searchParams={getSearchParams(tabId, sourceId)}
      setShow={handleClose}
      successModal={updateAllEntity ? showModal : undefined}
      onSuccess={() => {
        setTimeout(() => {
          refreshGrid(tabId);
        }, 200);
      }}
    />
  );
};

export default BulkUpdateRenderer;
