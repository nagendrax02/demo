import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import useAuditTrailStore from '../../entity-audit-trail.store';
import { setTypeFilterSelectedValueInCache } from '../../utils/cache-data';
import styles from './type-filter.module.css';
import { getFilteredOptions } from './utils';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const AuditTrailTypeFilter = (): JSX.Element => {
  const { filters, setTypeFilterSelectedValue, setFetchCriteria } = useAuditTrailStore();

  const fetchOptions = (searchText: string): IOption[] => {
    if (searchText) {
      return getFilteredOptions(filters?.typeFilter?.filterOptions, searchText);
    }
    return filters?.typeFilter?.filterOptions;
  };

  const setTypeFilter = (opt: IOption[]): void => {
    if (!opt.length && !filters?.typeFilter?.selectedValue?.length) return;
    setTypeFilterSelectedValue(opt);
    setTypeFilterSelectedValueInCache(opt);
    setFetchCriteria({
      pageCountArray: [0],
      totalRecordCount: 0,
      pageNumber: 0
    });
  };

  return (
    <Dropdown
      fetchOptions={fetchOptions}
      isMultiselect
      renderConfig={{ customMenuDimension: { height: 300 } }}
      selectedValues={filters?.typeFilter?.selectedValue}
      setSelectedValues={setTypeFilter}
      placeHolderText="All Selected"
      customStyleClass={styles.type_filter_wrapper}
    />
  );
};

export default AuditTrailTypeFilter;
