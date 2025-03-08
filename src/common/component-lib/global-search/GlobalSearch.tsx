import { lazy, useCallback, useEffect, useRef, useState } from 'react';
import styles from './global-search.module.css';
import useDebounce from 'common/utils/helpers/use-debounce';
import { getQuerySearchData, handleEnterPress, handleKeyboardEvents } from './utils';
import Icon from '@lsq/nextgen-preact/icon';
import { ILeadRecord } from './global-search.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { isMiP } from 'common/utils/helpers';
import { CallerSource } from 'common/utils/rest-client';
import { useLocation } from 'wouter';
import getEntityDataManager from 'common/utils/entity-data-manager';
import { EntityType } from 'common/types';
import { fetchProcessData } from 'apps/smart-views/utils/utils';
import { workAreaIds } from 'common/utils/process';
import { getItem, StorageKey } from 'common/utils/storage-manager';

const Input = withSuspense(lazy(() => import('@lsq/nextgen-preact/input')));

const LeadDropdown = withSuspense(lazy(() => import('./LeadsDropdown')));

const GlobalSearch = ({
  show,
  setShow
}: {
  show: boolean;
  setShow: (show: boolean) => void;
}): JSX.Element => {
  const [leadRepname, setLeadRepName] = useState<string>('Leads');
  const [searchHistory, setSearchHistory] = useState<string[]>(
    () => getItem(StorageKey.SearchHistory) ?? []
  );
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<ILeadRecord[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const handleInput = (val): void => {
    setSearch(val);
  };

  const debouncedValue = useDebounce(search, 500);

  const closeSearch = (): void => {
    setSearch('');
    setShow(false);
  };

  useEffect(() => {
    (async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      window['PROCESS_QUICK_ADD'] = fetchProcessData(workAreaIds.QUICK, '');
    })();
  }, []);

  useEffect(() => {
    (async (): Promise<void> => {
      const fetchLeadRepresentationName = (await getEntityDataManager(EntityType.Lead))
        ?.fetchRepresentationName;

      const repName = await fetchLeadRepresentationName?.(CallerSource.SmartViews, '');
      setLeadRepName(repName?.PluralName ?? 'Leads');
    })();
  }, []);

  useEffect(() => {
    if (!search) {
      setLoading(false);
      setRecords([]);
    }
  }, [search]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (debouncedValue?.trim().length >= 3) {
        setRecords([]);
        setLoading(true);
        const resp = await getQuerySearchData(debouncedValue, CallerSource.MiPNavMenu);
        setRecords(resp);
        setLoading(false);
      }
    })();
  }, [debouncedValue]);

  const openSearchResults = (): void => {
    if (isMiP()) handleEnterPress(search);
    else {
      const history = new Set([search, ...searchHistory]);
      localStorage.setItem(StorageKey.SearchHistory, JSON.stringify([...history]));
      setSearchHistory([...history]);
      setLocation(`/search?key=${search}`);
      closeSearch();
    }
  };

  const handleSearch = useCallback(
    (close): void => {
      if (close) {
        closeSearch();
      } else {
        if (search?.trim().length >= 3) {
          openSearchResults();
        }
      }
    },
    [search]
  );

  useEffect(() => {
    return handleKeyboardEvents(show, handleSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, handleSearch]);

  return (
    <>
      {show ? (
        <div onClick={closeSearch} className={styles.search_wrapper}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            ref={searchRef}
            className={styles.search_container}>
            <Input
              value={search}
              focusOnMount
              placeholder={`Search ${leadRepname}`}
              setValue={handleInput}
            />
            {search ? (
              <span
                className={styles.close_icon}
                onClick={() => {
                  setSearch('');
                }}>
                <Icon name="close" />
              </span>
            ) : null}
            {search?.trim().length < 3 && searchHistory.length ? (
              <div className={styles.dropdown_container}>
                {searchHistory.map((item) => {
                  return (
                    <div
                      onClick={() => {
                        setSearch(item);
                      }}
                      className={styles.history_item}
                      key={item}>
                      <Icon name="history" customStyleClass={styles.action} />
                      <span className={styles.history_text}>{item}</span>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {search?.trim().length >= 3 ? (
              <LeadDropdown
                closeSearch={closeSearch}
                debouncedValue={debouncedValue}
                records={records}
                loading={loading}
                searchedText={search}
                openSearchResults={openSearchResults}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default GlobalSearch;
