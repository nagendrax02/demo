import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import useFileLibraryStore from '../../../file-library.store';
import { SORT_FILTER_OPTION } from '../../../constants';
import styles from '../right-panel.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const TopSection = (): JSX.Element => {
  const { searchText, sortFilter, setSortFilter, isLoading, totalCount } = useFileLibraryStore(
    (state) => ({
      searchText: state.searchText,
      sortFilter: state.sortFilter,
      setSortFilter: state.setSortFilter,
      isLoading: state.isLoading,
      totalCount: state.filesData?.TotalCount || 0
    })
  );

  const getSortFilterOption = (): IOption[] => {
    return SORT_FILTER_OPTION.map((option) => {
      const clonedOption = { ...option } as IOption;
      clonedOption.customComponent = (
        <>
          {option.label}
          {option.text ? <span className={styles.sort_filter_option}>{option.text}</span> : <></>}
        </>
      );
      return clonedOption;
    });
  };

  const setSelectedValues = (selectedValues: IOption[]): void => {
    setSortFilter(selectedValues[0]);
  };

  return (
    <div className={styles.top_section}>
      <div className={styles.count_wrapper}>
        {!searchText ? 'All' : 'Search Results'}
        {`(${!isLoading ? totalCount : 0})`}
      </div>
      <div className={styles.filter_wrapper}>
        <Dropdown
          fetchOptions={getSortFilterOption}
          setSelectedValues={setSelectedValues}
          selectedValues={sortFilter ? [sortFilter] : []}
          hideClearButton
          showCheckIcon
          customStyleClass={styles.sort_filter_dropdown}
          showCustomComponentAsLabel
        />
      </div>
    </div>
  );
};

export default TopSection;
