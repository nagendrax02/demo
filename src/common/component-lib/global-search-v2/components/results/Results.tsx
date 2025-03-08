import useGlobalSearchStore, {
  setEntityId,
  setEntityRecord,
  setRecentKeywords,
  setRecentSearchResults,
  setSearchText,
  setSelectedRecordEntityType
} from '../../global-searchV2.store';
import RecentSearchKeywordsResults from '../recent-search-keywords';
import styles from './results.module.css';
import { removeCacheItems, updateCachedResults } from '../../utils/utils';
import { getItem, setItem } from 'common/utils/storage-manager/storage';
import { StorageKey } from 'common/utils/storage-manager';
import RecentSearchResults from '../recent-search-results';
import { ISearchRecord, ISearchResult } from '../../global-searchV2.types';
import { CHAR_TO_START_SEARCHING, defaultResults } from '../../constants';
import { Button } from '@lsq/nextgen-preact/v2/button';
import { classNames } from 'common/utils/helpers/helpers';
import { EntityType } from 'common/types';

export interface IKeyword {
  id: string;
  name: string;
}

const Results = (): JSX.Element => {
  const { filters, recentSearches, results } = useGlobalSearchStore((state) => ({
    filters: state.filters,
    recentSearches: state.recentSearches,
    results: state.results,
    isSearchResultsLoading: state.isSearchResultsLoading
  }));

  const { searchResults, searchKeywords } = recentSearches;

  const searchText = filters.searchText?.toLowerCase();

  const handleSelectKeyword = (name: string): void => {
    setSearchText(name);
  };

  const handleSelectResult = (
    entityId: string,
    record: ISearchRecord,
    canRemove: boolean
  ): void => {
    setEntityId(entityId);
    const entity: {
      entityId: string;
      entityType: EntityType;
    } = {
      entityId,
      entityType: record.EntityType
    };
    if (!canRemove) {
      const cachedResults: ISearchResult =
        getItem<ISearchResult>(StorageKey.GlobalSearchResultsHistory) ?? defaultResults;
      const updatedResults = updateCachedResults(entity, record, cachedResults);
      setItem(StorageKey.GlobalSearchResultsHistory, updatedResults);
      setRecentSearchResults(updatedResults);
    }
    setEntityRecord(record);
    setSelectedRecordEntityType(record.EntityType);
  };

  const clearCache = (): void => {
    removeCacheItems([
      StorageKey.GlobalSearchKeywordsHistory,
      StorageKey.GlobalSearchResultsHistory
    ]);
    setRecentKeywords([]);
    setRecentSearchResults(defaultResults);
  };

  return (
    <div className={styles.search_results_body}>
      {searchText.length >= CHAR_TO_START_SEARCHING ? (
        <RecentSearchResults
          data={results}
          canRemove={false}
          focusedIndex={-1}
          onSelect={(entityId, record, canRemove) => {
            handleSelectResult(entityId, record, canRemove);
          }}
        />
      ) : (
        <div className={styles.recent_search_wrapper}>
          <div className={styles.results_wrapper}>
            <RecentSearchKeywordsResults
              recentSearches={searchKeywords}
              onSelect={handleSelectKeyword}
            />
            <RecentSearchResults
              data={searchResults}
              canRemove
              focusedIndex={-1}
              onSelect={(entityId, record, canRemove) => {
                handleSelectResult(entityId, record, canRemove);
              }}
            />
          </div>
          <Button
            size="sm"
            text={'Clear All'}
            onClick={clearCache}
            customStyleClass={classNames(styles.clear_all_btn, 'ng_p_1_r')}></Button>
        </div>
      )}
    </div>
  );
};

export default Results;
