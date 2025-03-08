import styles from './search-input.module.css';

import useGlobalSearchStore, {
  setFilters,
  setRecentKeywords,
  setResults
} from 'common/component-lib/global-search-v2/global-searchV2.store';
import { getUUId } from 'common/utils/helpers/helpers';
import { useEffect } from 'react';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import Input from '@lsq/nextgen-preact/input';
import Search from 'assets/custom-icon/v2/Search';
import { Button } from '@lsq/nextgen-preact/v2/button';
import { defaultResults, MAX_RESULTS_TO_CACHE } from '../../../constants';

const SearchInput = (): JSX.Element => {
  const { searchText } = useGlobalSearchStore((state) => state.filters);
  const recentSearches = useGlobalSearchStore((state) => state.recentSearches.searchKeywords);
  useEffect(() => {
    useGlobalSearchStore.setState((state) => ({
      recentSearches: {
        ...state.recentSearches,
        searchKeywords: recentSearches
      }
    }));
  }, [recentSearches]);

  useEffect(() => {
    if (searchText.length < 3) {
      setResults(defaultResults);
    }
  }, [searchText]);

  const addRecentSearchKeyword = (keyword: string): void => {
    if (!keyword.trim()) return;

    const cachedKeywords: { id: string; name: string }[] =
      getItem(StorageKey.GlobalSearchKeywordsHistory) ?? [];

    const recentKeywordsArray = Array.isArray(recentSearches) ? recentSearches : [];

    const combinedKeywords = [
      { id: getUUId(), name: keyword },
      ...cachedKeywords,
      ...recentKeywordsArray
    ];

    const updatedKeywords = Array.from(
      new Map(combinedKeywords.map((item) => [item.name, item])).values()
    ).slice(0, MAX_RESULTS_TO_CACHE);

    setRecentKeywords(updatedKeywords);

    setItem(StorageKey.GlobalSearchKeywordsHistory, updatedKeywords);
  };

  const handleInputChange = (value: string): void => {
    setFilters({ searchText: value });
  };

  const handleClear = (): void => {
    setFilters({ searchText: '' });
  };

  const handleSearch = (): void => {
    if (searchText.trim()) {
      addRecentSearchKeyword(searchText);
    }
  };

  useEffect(() => {
    const handleKeyboardEvents = (e: KeyboardEvent): void => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };
    window.addEventListener('keydown', handleKeyboardEvents);
    return () => {
      window.removeEventListener('keydown', handleKeyboardEvents);
    };
  }, [handleSearch]);

  return (
    <div className={styles.search_input_wrapper}>
      <Search className={styles.search_icon} type="outline" />
      <Input
        focusOnMount
        value={searchText}
        placeholder={`Type to Search `}
        setValue={handleInputChange}
      />
      {searchText.length ? (
        <Button
          text={'Clear'}
          customStyleClass={styles.search_input_clear_button}
          onClick={handleClear}
        />
      ) : null}
    </div>
  );
};

export default SearchInput;
