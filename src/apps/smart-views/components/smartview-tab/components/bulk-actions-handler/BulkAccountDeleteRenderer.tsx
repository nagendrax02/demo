import { getTabData } from '../../smartview-tab.store';
import { IBulkAction } from '../../smartview-tab.types';
import { updateGridDataAfterPause } from 'apps/smart-views/utils/utils';
import AccountDelete from 'common/component-lib/entity-actions/account-delete';
import { getUserStandardTimeZone } from '../../utils';
import { getGridConfig } from './actionHelper';

const getAdvancedSearchText = (advancedSearch: string): string => {
  const queryTimeZone = getUserStandardTimeZone();

  if (advancedSearch) {
    return advancedSearch;
  }

  return JSON.stringify({
    GrpConOp: 'And',
    QueryTimeZone: queryTimeZone ?? '',
    Conditions: []
  });
};

const BulkAccountDeleteRenderer = ({
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
    <AccountDelete
      handleClose={handleClose}
      onSuccess={updateGridDataAfterPause}
      entityIds={Object.keys(bulkAction?.selectedRows || {})}
      companyTypeId={tabData.entityCode || ''}
      repName={tabData.representationName}
      gridConfig={getGridConfig(tabId, Object.keys(bulkAction?.selectedRows || {})?.length)}
      searchParams={{
        advancedSearchText: getAdvancedSearchText(
          tabData?.gridConfig?.fetchCriteria?.AdvancedSearch
        )
      }}
    />
  );
};

export default BulkAccountDeleteRenderer;
