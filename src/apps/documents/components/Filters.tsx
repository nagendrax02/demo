import styles from '../documents.module.css';
import useDocumentStore, { setFileTypeFilter, setSearch, setSource } from '../documents.store';
import { EntityType } from 'common/types';
import { getSourceFilterOptions } from '../utils';
import { IEntityRepNames } from '../../entity-details/types/entity-store.types';
import { fileTypeFilterOptions } from '../constants';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const Search = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/search')));

interface IDocumentsFilters {
  entityType: EntityType;
  entityRepNames: IEntityRepNames;
  entityTypeRepName?: string;
}

const DocumentsFilters = (props: IDocumentsFilters): JSX.Element => {
  const { entityType, entityRepNames, entityTypeRepName } = props;
  const { search, source, fileTypeFilter } = useDocumentStore((state) => ({
    search: state.search,
    source: state.source,
    fileTypeFilter: state.fileTypeFilter
  }));

  const handleSource = (value): void => {
    setSource(value[0]);
  };

  const handleFileTypeFilter = (value): void => {
    setFileTypeFilter(value[0]);
  };

  return (
    <div className={styles.filters_container}>
      <div className={styles.search_container}>
        <Search
          search={search}
          setSearch={setSearch}
          config={{ name: 'Search Documents', id: 'docs-search' }}
        />
      </div>
      <div className={styles.source_filter}>
        <Dropdown
          disableSearch
          hideClearButton
          fetchOptions={() => getSourceFilterOptions(entityType, entityRepNames, entityTypeRepName)}
          setSelectedValues={handleSource}
          selectedValues={[source]}
          renderConfig={{
            customMenuDimension: { height: 140 }
          }}
          showCheckIcon
        />
      </div>
      {entityType === EntityType.Opportunity ? (
        <div className={styles.source_filter}>
          <Dropdown
            disableSearch
            hideClearButton
            fetchOptions={() => fileTypeFilterOptions}
            setSelectedValues={handleFileTypeFilter}
            selectedValues={[fileTypeFilter]}
            renderConfig={{
              customMenuDimension: { height: 140 }
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DocumentsFilters;
