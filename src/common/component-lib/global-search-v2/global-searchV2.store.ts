import { create } from 'zustand';
import { EntityType } from 'src/common/types';
import { IEntityRepresentationConfig } from 'src/apps/entity-details/types/entity-store.types';
import { DEFAULT_REPRESENTATION_NAME } from 'src/apps/entity-details/constants';
import { ISearchRecord, ISearchResult } from './global-searchV2.types';
import { DEFAULT_PAGE_INDEX, defaultResults, listLength } from './constants';

export interface IGlobalSearchStore {
  pageIndex: number;
  pageSize: number;
  error: boolean;
  entityDetailsFetchError: boolean;
  isSearchResultsLoading: boolean;
  entityId: string;
  entityRecord: ISearchRecord | null;
  representationNames: IEntityRepresentationConfig;
  filters: {
    entityType: EntityType;
    searchText: string;
    leadType: string;
  };
  selectedRecordEntityType: EntityType;
  results: ISearchResult;
  recentSearches: {
    searchKeywords: { id: string; name: string }[];
    searchResults: ISearchResult;
  };
}

const useGlobalSearchStore = create<IGlobalSearchStore>(() => ({
  error: false,
  entityDetailsFetchError: false,
  pageIndex: DEFAULT_PAGE_INDEX,
  pageSize: listLength,
  isSearchResultsLoading: true,
  entityId: '',
  representationNames: DEFAULT_REPRESENTATION_NAME,
  entityRecord: null,
  selectedRecordEntityType: EntityType.Lead,
  filters: {
    entityType: EntityType.Lead,
    searchText: '',
    leadType: ''
  },
  results: defaultResults,
  recentSearches: {
    searchKeywords: [],
    searchResults: defaultResults
  }
}));

export const setPageIndex = (index: number): void => {
  useGlobalSearchStore.setState(() => ({
    pageIndex: index
  }));
};

export const getPageIndex = (): number => {
  return useGlobalSearchStore.getState().pageIndex;
};

export const setRecentKeywords = (searchKeywords: { id: string; name: string }[]): void => {
  useGlobalSearchStore.setState((state) => ({
    recentSearches: {
      ...state.recentSearches,
      searchKeywords
    }
  }));
};

export const getRecentKeywords = (): { id: string; name: string }[] => {
  return useGlobalSearchStore.getState().recentSearches.searchKeywords;
};
export const setRecentSearchResults = (searchResults: ISearchResult): void => {
  useGlobalSearchStore.setState((state) => ({
    recentSearches: {
      ...state.recentSearches,
      searchResults
    }
  }));
};
export const setIsSearchResultsLoading = (isLoading: boolean): void => {
  useGlobalSearchStore.setState(() => ({
    isSearchResultsLoading: isLoading
  }));
};

export const setEntityId = (id: string | undefined): void => {
  useGlobalSearchStore.setState(() => ({
    entityId: id
  }));
};

export const getEntityId = (): string => {
  return useGlobalSearchStore.getState().entityId;
};

export const setRepresentationNames = (config: IEntityRepresentationConfig): void => {
  useGlobalSearchStore.setState(() => ({
    representationNames: config
  }));
};

export const setFilters = (filters: Partial<IGlobalSearchStore['filters']>): void => {
  useGlobalSearchStore.setState((state) => ({
    filters: { ...state.filters, ...filters }
  }));
};

export const setSearchText = (searchText: string): void => {
  useGlobalSearchStore.setState((state) => ({
    filters: { ...state.filters, searchText }
  }));
};

export const setRecentSearches = (recentSearches: IGlobalSearchStore['recentSearches']): void => {
  useGlobalSearchStore.setState(() => ({
    recentSearches
  }));
};

export const getFilters = (): IGlobalSearchStore['filters'] => {
  return useGlobalSearchStore.getState().filters;
};

export const getResults = (): IGlobalSearchStore['results'] => {
  return useGlobalSearchStore.getState().results;
};
export const setResults = (results: IGlobalSearchStore['results']): void => {
  useGlobalSearchStore.setState(() => ({
    results
  }));
};
export const getRecentSearches = (): IGlobalSearchStore['recentSearches'] => {
  return useGlobalSearchStore.getState().recentSearches;
};

export const getEntityType = (): EntityType => {
  return useGlobalSearchStore.getState().filters.entityType;
};
export const setEntityRecord = (data: ISearchRecord | null): void => {
  useGlobalSearchStore.setState(() => ({
    entityRecord: data
  }));
};

export const getEntityData = (): ISearchRecord | null => {
  return useGlobalSearchStore.getState().entityRecord;
};

export const setError = (hasError: boolean): void => {
  useGlobalSearchStore.setState(() => ({
    error: hasError
  }));
};

export const setEntityDetailsFetchError = (hasError: boolean): void => {
  useGlobalSearchStore.setState(() => ({
    entityDetailsFetchError: hasError
  }));
};

export const setSelectedRecordEntityType = (entityType: EntityType): void => {
  useGlobalSearchStore.setState(() => ({
    selectedRecordEntityType: entityType
  }));
};
export const resetGlobalSearchStore = (): void => {
  useGlobalSearchStore.setState(() => ({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: listLength,
    error: false,
    entityDetailsFetchError: false,
    isSearchResultsLoading: true,
    isQuickViewDetailsLoading: false,
    isQuickViewLoading: false,
    entityId: '',
    entityRecord: null,
    selectedRecordEntityType: EntityType.Lead,
    representationNames: DEFAULT_REPRESENTATION_NAME,
    filters: {
      entityType: EntityType.Lead,
      searchText: '',
      leadType: ''
    },
    results: defaultResults,
    recentSearches: {
      searchKeywords: [],
      searchResults: defaultResults
    }
  }));
};

export default useGlobalSearchStore;
