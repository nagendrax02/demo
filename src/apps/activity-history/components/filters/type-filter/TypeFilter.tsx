import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { fetchOptions } from './utils';
import useActivityHistoryStore from '../../../activity-history.store';
import { TabType } from 'apps/entity-details/types/entity-data.types';
import { IActivityHistoryStore } from 'apps/activity-history/types';
import { EntityType } from 'common/types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

interface ITypeFilter {
  type: EntityType;
  customTypeFilter?: IOption[];
  tabType?: TabType;
  eventCode?: string;
  isAccountLeadActivityHistoryTab?: boolean;
}

const TypeFilter = ({
  customTypeFilter,
  tabType,
  type,
  eventCode,
  isAccountLeadActivityHistoryTab
}: ITypeFilter): JSX.Element => {
  const { typeFilter, setTypeFilter } = useActivityHistoryStore<IActivityHistoryStore>();

  const leadRepName = useLeadRepName();

  const handleFetchOptions = async (searchText?: string): Promise<IOption[]> => {
    return fetchOptions({
      searchText,
      customTypeFilter,
      tabType,
      leadRepName,
      type,
      eventCode
    });
  };

  return (
    <Dropdown
      fetchOptions={handleFetchOptions}
      isMultiselect
      renderConfig={{ customMenuDimension: { height: 300 } }}
      selectedValues={typeFilter}
      showDefaultFooter
      setSelectedValues={(data: IOption[]) => {
        setTypeFilter(data, isAccountLeadActivityHistoryTab);
      }}
      placeHolderText="All Activities"
    />
  );
};

TypeFilter.defaultProps = {
  tabType: undefined,
  customTypeFilter: undefined,
  eventCode: undefined
};

export default TypeFilter;
