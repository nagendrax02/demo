import { useCallback, useEffect, useState } from 'react';
import styles from '../search-filter.module.css';
import { setTabSearch, useSmartViewsSearch } from '../../../../smartview-tab.store';

import { useLocation } from 'wouter';
import SearchBar from '@lsq/nextgen-preact/v2/text-field/search-bar';

const Search = ({ tabId }: { tabId: string }): JSX.Element => {
  const [search, setSearch] = useState('');
  const [loc, setLocation] = useLocation();

  const searchParams = window?.location?.href?.toLowerCase()?.split('key=')?.[1];

  let cachedSearchText = useSmartViewsSearch(tabId) || '';
  if (searchParams) {
    cachedSearchText = searchParams;
  }

  useEffect(() => {
    if (cachedSearchText) {
      try {
        setSearch(decodeURI(cachedSearchText || ''));
      } catch (err) {
        setSearch(cachedSearchText);
      }
    }
  }, [cachedSearchText, tabId]);

  const handleClick = (val): void => {
    if (!val) {
      setSearch('');
      setTabSearch(tabId, '');
      if (loc.includes('search')) {
        setLocation(`${loc}`);
      }
    } else {
      setSearch(val);
    }
  };

  const handleSearch = useCallback((): void => {
    if (search.trim().length > 2) setTabSearch(tabId, search?.trim());
    if (!search.trim()) setTabSearch(tabId, '');
    if (loc.includes('search')) {
      setLocation(`${loc}?key=${search}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleEvent = (e: React.SyntheticEvent | null): void => {
    if ((e as React.KeyboardEvent)?.key === 'Enter' || e?.type === 'click') {
      handleSearch();
    }
  };

  return (
    <div className={styles.search_wrapper}>
      <SearchBar onChange={handleClick} value={search} size="xs" handleSearchEvent={handleEvent} />
    </div>
  );
};

export default Search;
