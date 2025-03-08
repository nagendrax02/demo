import { getTabData } from '../../smartview-tab.store';
import { IAdvancedSearch, IBulkAction } from '../../smartview-tab.types';
import { updateGridDataAfterPause } from 'apps/smart-views/utils/utils';
import OpportunityDelete from 'common/component-lib/entity-actions/opportunity-bulk-delete';
import { getGridConfig } from './actionHelper';
import { safeParseJson } from 'common/utils/helpers';

const getActivitySearchCondition = (
  advancedSearchString: string,
  customFilterString: string
): string => {
  const advancedSearch = safeParseJson(advancedSearchString) as IAdvancedSearch;
  const customFilters = JSON.parse(customFilterString || '{}') as IAdvancedSearch;

  return JSON.stringify({
    ...(advancedSearch || {}),
    Conditions: [...(advancedSearch?.Conditions || []), ...(customFilters.Conditions ?? [])]
  });
};

const BulkOpportunityDeleteRenderer = ({
  bulkAction,
  tabId,
  handleClose
}: {
  bulkAction: IBulkAction | null;
  tabId: string;
  handleClose: () => void;
}): JSX.Element => {
  const tabData = getTabData(tabId);
  return (
    <OpportunityDelete
      handleClose={handleClose}
      onSuccess={updateGridDataAfterPause}
      entityIds={Object.keys(bulkAction?.selectedRows || {})}
      eventCode={tabData.entityCode || ''}
      gridConfig={getGridConfig(tabId, Object.keys(bulkAction?.selectedRows || {})?.length)}
      searchParams={{
        activitySearchCondition: getActivitySearchCondition(
          tabData?.gridConfig?.fetchCriteria?.AdvancedSearch,
          tabData?.gridConfig?.fetchCriteria?.CustomFilters as string
        ),
        searchText: tabData?.gridConfig?.fetchCriteria?.SearchText
      }}
    />
  );
};

export default BulkOpportunityDeleteRenderer;
