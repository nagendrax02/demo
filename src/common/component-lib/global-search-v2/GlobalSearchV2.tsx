import styles from './global-search-v2.module.css';
import useGlobalSearchStore, { resetGlobalSearchStore } from './global-searchV2.store';
import Icon from '@lsq/nextgen-preact/icon';
import GlobalSearchModal from './components/global-search-modal';
import GlobalSearchBodyWrapper from './components/global-search-body-wrapper/GlobalSearchBodyWrapper';
import GlobalSearchFooter from './components/global-search-footer';
import GlobalSearchHeaderWrapper from './components/global-search-header-wrapper';
import GlobalSearchFilters from './components/global-search-filters/GlobalSearchFilters';
import GlobalSearchQuickView from './components/global-search-quick-view/GlobalSearchQuickView';
import Results from './components/results';
import GlobalSearchResultsWrapper from './components/global-search-results-wrapper';
import { classNames } from 'common/utils/helpers/helpers';
import { ReactNode } from 'react';

const GlobalSearchV2 = ({ setShow }: { setShow: (show: boolean) => void }): ReactNode => {
  const { entityId, error, results, filters, entityRecord } = useGlobalSearchStore((state) => ({
    entityId: state.entityId,
    error: state.error,
    entityDetailsFetchError: state.entityDetailsFetchError,
    results: state.results,
    filters: state.filters,
    entityRecord: state.entityRecord
  }));
  const { searchText, entityType } = filters;

  const closeSearch = (): void => {
    setShow(false);
    resetGlobalSearchStore();
  };

  return (
    <GlobalSearchModal handleClose={closeSearch}>
      <GlobalSearchHeaderWrapper closeIcon={<Icon name="close" />} closeHandler={closeSearch}>
        <GlobalSearchFilters />
      </GlobalSearchHeaderWrapper>
      <GlobalSearchBodyWrapper>
        <div className={styles.body}>
          <div className={classNames(styles.search_results_body, 'ng_scrollbar')}>
            <GlobalSearchResultsWrapper error={error}>
              <Results />
            </GlobalSearchResultsWrapper>
          </div>
          <div className={styles.quick_view_wrapper}>
            <GlobalSearchQuickView
              error={error}
              entityId={entityId}
              entityType={entityRecord?.EntityType ?? entityType}
              searchText={searchText}
              searchResults={results}
              entityRecord={entityRecord ?? undefined}
            />
          </div>
        </div>
        <GlobalSearchFooter />
      </GlobalSearchBodyWrapper>
    </GlobalSearchModal>
  );
};

export default GlobalSearchV2;
