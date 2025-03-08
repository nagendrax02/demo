import { useEffect, useState } from 'react';
import useDebounce from 'common/utils/helpers/use-debounce';
import useGlobalSearchStore, {
  setEntityId,
  setError,
  setIsSearchResultsLoading,
  setPageIndex,
  setResults
} from '../global-searchV2.store';
import { CallerSource } from 'common/utils/rest-client';
import { getQuerySearchData } from '../utils/utils';
import useInfiniteScroll from 'common/utils/infinite-scroll';
import { defaultResults, listLength } from '../constants';

import { EntityType } from 'common/types';
import { ISearchRecord, ISearchResult } from '../global-searchV2.types';
interface IUseSearchFilters {
  hasNextData: boolean;
  intersectionRef: React.RefObject<HTMLDivElement>;
  isLoadingNextPage: boolean;
}
// eslint-disable-next-line max-lines-per-function
const useSearchFilters = (): IUseSearchFilters => {
  const filters = useGlobalSearchStore((state) => state.filters);
  const { searchText, entityType, leadType } = filters;
  const debouncedSearchText = useDebounce(searchText, 300);

  const { pageSize = 8, results } = useGlobalSearchStore((state) => ({
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    results: state.results
  }));

  const [hasNextData, setHasNextData] = useState<boolean>(true);

  const getResponseCount = (response: ISearchResult): number => {
    return response?.Data?.length || 0;
  };

  // eslint-disable-next-line max-lines-per-function
  const fetchInitialSearchResults = async (): Promise<void> => {
    if (searchText?.trim().length >= 3) {
      try {
        setIsSearchResultsLoading(true);
        const filtersPayload: { searchText: string; entityType: EntityType; leadType?: string } = {
          searchText: searchText,
          entityType: entityType,
          leadType: leadType
        };
        const paginationPayload: { pageIndex: number; pageSize?: number } = {
          pageIndex: 1,
          pageSize
        };

        const response: ISearchResult = await getQuerySearchData(
          filtersPayload,
          CallerSource.GlobalSearch,
          paginationPayload
        );

        const updatedData: ISearchRecord[] = response.Data.map((item: ISearchRecord) => ({
          ...item,
          entityType: item.EntityType
        }));
        const updatedResults: ISearchResult = {
          ...response,
          Data: [...updatedData],
          TotalRecords: response.TotalRecords
        };
        setResults(updatedResults);
        setHasNextData(getResponseCount(updatedResults) < response.TotalRecords);
      } catch (error) {
        setResults(defaultResults);
        setHasNextData(false);
      } finally {
        setIsSearchResultsLoading(false);
      }
    }
  };

  // eslint-disable-next-line max-lines-per-function
  const fetchNextSearchResults = async (pageNumber: number): Promise<number> => {
    if (debouncedSearchText?.trim().length >= 3 && hasNextData) {
      try {
        setIsSearchResultsLoading(true);
        setPageIndex(pageNumber);
        const filtersPayload: { searchText: string; entityType: EntityType; leadType?: string } = {
          searchText: debouncedSearchText,
          entityType: entityType,
          leadType: leadType
        };
        const paginationPayload: { pageIndex: number; pageSize?: number } = {
          pageIndex: pageNumber,
          pageSize
        };

        const response: ISearchResult = await getQuerySearchData(
          filtersPayload,
          CallerSource.GlobalSearch,
          paginationPayload
        );

        const updatedData: ISearchRecord[] = response.Data.map((item: ISearchRecord) => ({
          ...item,
          entityType: item.EntityType
        }));

        const updatedResults: ISearchResult = {
          ...response,
          Data: [...results.Data, ...updatedData],
          TotalRecords: response.TotalRecords
        };
        setResults(updatedResults);
        const totalNewResults = getResponseCount(response);
        setHasNextData(getResponseCount(updatedResults) < response.TotalRecords);
        return totalNewResults;
      } catch (error) {
        setResults(defaultResults);
        setHasNextData(false);
        return listLength;
      } finally {
        setIsSearchResultsLoading(false);
      }
    }
    return listLength;
  };

  const { isLoadingNextPage, intersectionRef } = useInfiniteScroll({
    fetchData: fetchNextSearchResults,
    paginationConfig: {
      hasMoreData: hasNextData,
      resetPageIndex: searchText.length >= 3,
      pageSize
    }
  });
  useEffect(() => {
    if (debouncedSearchText?.trim().length >= 3) {
      setError(false);
      setEntityId('');
      setResults(defaultResults);
      fetchInitialSearchResults();
    }
  }, [debouncedSearchText, entityType, leadType]);

  return {
    hasNextData,
    isLoadingNextPage,
    intersectionRef
  };
};

export default useSearchFilters;
