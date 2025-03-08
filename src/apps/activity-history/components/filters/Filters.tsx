/* eslint-disable complexity */
import DateFilter from 'common/component-lib/date-filter';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import useActivityHistoryStore from '../../activity-history.store';
import TypeFilter from './type-filter';
import styles from './filters.module.css';
import { TabType } from 'apps/entity-details/types/entity-data.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IActivityHistoryStore } from '../../types';
import { EntityType } from 'common/types';
import AccountLeadFilter from './account-lead-filter';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';

interface IFilters {
  type: EntityType;
  customTypeFilter?: IOption[];
  tabType?: TabType;
  entityIds: IEntityIds;
  eventCode?: string;
}

const Filters = ({
  customTypeFilter,
  tabType,
  type,
  entityIds,
  eventCode
}: IFilters): JSX.Element => {
  const { typeFilter, dateFilter, setDateFilter, clearFilters, accountLeadSelectedOption } =
    useActivityHistoryStore<IActivityHistoryStore>();

  const isClearFilterEnable = (): boolean => !!(typeFilter?.length || dateFilter);

  const isAccountLeadActivityHistoryTab =
    entityIds?.account && type === EntityType.Lead ? true : false;

  const handleClearButton = (): void => {
    clearFilters(isAccountLeadActivityHistoryTab);
  };

  return (
    <>
      {isAccountLeadActivityHistoryTab ? <AccountLeadFilter /> : null}

      {isAccountLeadActivityHistoryTab && !accountLeadSelectedOption?.length ? null : (
        <>
          <div className={styles.type_filter_wrapper} data-testid="ah-type-filter">
            <TypeFilter
              tabType={tabType}
              customTypeFilter={customTypeFilter}
              type={type}
              eventCode={eventCode}
              isAccountLeadActivityHistoryTab={isAccountLeadActivityHistoryTab}
            />
          </div>
          <DateFilter
            selectedOption={dateFilter}
            setSelectedOption={setDateFilter}
            suspenseFallback={<Shimmer width="128px" height="32px" />}
            data-testid="ah-date-filter"
            isAccountLeadActivityHistoryTab={isAccountLeadActivityHistoryTab}
          />
          <div
            title="Clear Filters"
            onClick={isClearFilterEnable() ? handleClearButton : undefined}
            className={`${styles.clear_filters} ${
              isClearFilterEnable() ? styles.enable_clear_filter : ''
            }`}
            data-testid={
              isClearFilterEnable() ? 'ah-clear-filters-enabled' : 'ah-clear-filters-disabled'
            }>
            Clear Filters
          </div>
        </>
      )}
    </>
  );
};

Filters.defaultProps = {
  tabType: undefined,
  customTypeFilter: undefined,
  eventCode: undefined
};

export default Filters;
