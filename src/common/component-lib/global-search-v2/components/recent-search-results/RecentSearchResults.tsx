import styles from './recent-search-results.module.css';
import GlobalSearchResultCards from '../global-search-result-cards/GlobalSearchResultCards';
import { IRecentSearchResultsProps, ISearchRecord } from '../../global-searchV2.types';
import useGlobalSearchStore from '../../global-searchV2.store';
import { ReactNode } from 'react';
import { classNames } from 'common/utils/helpers/helpers';
import { CHAR_TO_START_SEARCHING } from '../../constants';

interface IExtendedRecentSearchResultsProps extends IRecentSearchResultsProps {
  canRemove: boolean;
  onSelect: (entityId: string, record: ISearchRecord, canRemove: boolean) => void;
}

const RecentSearchResults = ({
  data,
  canRemove,
  onSelect
}: IExtendedRecentSearchResultsProps): ReactNode => {
  const { searchText, entityId, isSearchResultsLoading, results } = useGlobalSearchStore(
    (state) => ({
      searchText: state.filters.searchText,
      entityId: state.entityId,
      isSearchResultsLoading: state.isSearchResultsLoading,
      results: state.results
    })
  );

  const getHeadingText = (): ReactNode => {
    if (searchText.length >= CHAR_TO_START_SEARCHING && !isSearchResultsLoading) {
      const pluralSuffix = results?.TotalRecords > 1 ? 's' : '';
      return `${results?.TotalRecords} Result${pluralSuffix}`;
    } else if (data.TotalRecords !== 0) {
      return 'Recent Search Results';
    }
  };

  return (
    <div className={styles.recent_search_results}>
      <div className={classNames(styles.recent_search_heading, 'ng_h_5_r')}>{getHeadingText()}</div>
      <GlobalSearchResultCards
        canRemove={canRemove}
        data={data}
        searchText={searchText}
        entityId={entityId}
        onSelect={onSelect}
      />
    </div>
  );
};

export default RecentSearchResults;
