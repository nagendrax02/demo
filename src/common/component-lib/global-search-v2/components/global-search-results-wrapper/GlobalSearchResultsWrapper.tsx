import React, { ReactNode, useEffect } from 'react';
import { IKeyword } from '../results/Results';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import EmptyStates from '../empty-states/EmptyStates';
import useGlobalSearchStore, {
  setEntityId,
  setIsSearchResultsLoading,
  setPageIndex,
  setRecentKeywords,
  setRecentSearchResults
} from '../../global-searchV2.store';
import useSearchFilters from '../../hooks/use-search-filters';
import styles from './global-search-results-wrapper.module.css';
import { EmptyStateType, ISearchResult } from '../../global-searchV2.types';
import ResultsLoader from '../results-loader';
import { CHAR_TO_START_SEARCHING, defaultResults } from '../../constants';
interface IGlobalSearchResultsWrapperProps {
  children: ReactNode;
  error: boolean;
}
/* eslint-disable complexity */
const GlobalSearchResultsWrapper: React.FC<IGlobalSearchResultsWrapperProps> = ({
  children,
  error
}): ReactNode => {
  const { filters, recentSearches, results, isSearchResultsLoading, pageIndex } =
    useGlobalSearchStore((state) => ({
      filters: state.filters,
      results: state.results,
      isSearchResultsLoading: state.isSearchResultsLoading,
      recentSearches: state.recentSearches,
      pageIndex: state.pageIndex
    }));
  const searchText: string = filters.searchText?.toLowerCase();
  const { searchKeywords, searchResults } = recentSearches;

  useEffect(() => {
    setEntityId('');
    if (searchText.length >= 3) {
      setIsSearchResultsLoading(true);
      setPageIndex(1);
    }
  }, [searchText]);
  const { isLoadingNextPage, intersectionRef } = useSearchFilters();

  useEffect(() => {
    const localSearchKeywords = getItem<IKeyword[]>(StorageKey.GlobalSearchKeywordsHistory) ?? [];
    const localSearchResults =
      getItem<ISearchResult>(StorageKey.GlobalSearchResultsHistory) ?? defaultResults;
    setRecentKeywords(localSearchKeywords);
    setRecentSearchResults(localSearchResults);
  }, []);

  if (error) {
    return <EmptyStates type={EmptyStateType.SomethingWentWrong} />;
  }
  if (searchKeywords?.length === 0 && searchResults?.TotalRecords === 0 && searchText.length < 3) {
    return <EmptyStates type={EmptyStateType.FirstSearch} />;
  }

  if (searchText.length >= CHAR_TO_START_SEARCHING && isSearchResultsLoading && pageIndex === 1) {
    return <ResultsLoader />;
  }

  if (
    searchText.length >= CHAR_TO_START_SEARCHING &&
    !isSearchResultsLoading &&
    results.TotalRecords === 0
  ) {
    return (
      <div className={styles.not_found}>
        <EmptyStates type={EmptyStateType.NoResultsFound} />
      </div>
    );
  }
  return (
    <div className={styles.results_wrapper}>
      <div className={styles.results}>{children}</div>
      {searchText.length >= CHAR_TO_START_SEARCHING && results.TotalRecords !== 0 ? (
        <div ref={intersectionRef}>{isLoadingNextPage ? <ResultsLoader /> : null}</div>
      ) : null}
    </div>
  );
};

export default GlobalSearchResultsWrapper;
