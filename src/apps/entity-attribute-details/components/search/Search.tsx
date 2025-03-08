import ClearIcon from './ClearIcon';
import SearchIcon from './SearchIcon';
import styles from './search.module.css';
import { useEntityAttributeDetailsStore } from '../../store/entity-attribute-details-store';
import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const BaseInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/base-input')));

const SEARCH = { Name: 'Search Field', Id: 'search-field' };

const Search = (): JSX.Element => {
  const { searchValue, setSearchValue } = useEntityAttributeDetailsStore();
  return (
    <div data-testid="ead-search" className={styles.search}>
      <BaseInput
        value={searchValue}
        setValue={setSearchValue}
        placeholder={SEARCH.Name}
        name={SEARCH.Id}
        title={SEARCH.Name}
        ariaLabel={SEARCH.Name}
        dataTestId={SEARCH.Id}
        customStyleClass={styles.input}
      />
      <div className={styles.search_actions}>
        {searchValue ? (
          <ClearIcon
            onClick={(): void => {
              setSearchValue('');
            }}
          />
        ) : (
          <SearchIcon onClick={(): void => {}} />
        )}
      </div>
    </div>
  );
};

export default Search;
