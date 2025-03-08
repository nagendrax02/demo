import RecentSearchIcon from 'assets/custom-icon/RecentSearchIcon';
import styles from './recent-search-keywords.module.css';
import HighlightText from '../highlight-text/HighlightText';
import { setItem, StorageKey } from 'common/utils/storage-manager';
import Icon from '@lsq/nextgen-preact/icon';
import useGlobalSearchStore, { setRecentSearches } from '../../global-searchV2.store';
import { classNames } from 'common/utils/helpers/helpers';

interface IRecentSearchKeywordsResultsProps {
  recentSearches: { id: string; name: string }[];
  onSelect: (name: string) => void;
}

const RecentSearchKeywordsResults = ({
  recentSearches,
  onSelect
}: IRecentSearchKeywordsResultsProps): JSX.Element => {
  const searchText = useGlobalSearchStore((state) => state.filters.searchText);

  const handleDelete = (id: string): void => {
    const updatedSearches = recentSearches.filter((search) => search.id !== id);

    setItem(StorageKey.GlobalSearchKeywordsHistory, JSON.stringify(updatedSearches));

    setRecentSearches({
      searchKeywords: updatedSearches,
      searchResults: useGlobalSearchStore.getState().recentSearches.searchResults
    });
  };

  if (recentSearches.length === 0) {
    return <></>;
  }
  return (
    <div className={styles.recent_search_result_wrapper}>
      <div className={classNames(styles.recent_search_heading, 'ng_btn_2_r')}>
        Recent Searches Keywords
      </div>
      {recentSearches.map((search) => (
        <button
          key={search.id}
          className={`${styles.recent_search_item} `}
          onClick={() => {
            onSelect(search.name);
          }}>
          <div className={styles.recent_search}>
            <div className={styles.recent_search_result_icon}>
              <RecentSearchIcon />
            </div>
            <div className={styles.recent_search_result_text}>
              {HighlightText(search.name, searchText, styles.highlighted_text)}
            </div>
          </div>
          <button
            className={styles.recent_search_result_action}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(search.id);
            }}>
            <Icon name="close" customStyleClass={styles.delete_icon} />
          </button>
        </button>
      ))}
    </div>
  );
};

export default RecentSearchKeywordsResults;
