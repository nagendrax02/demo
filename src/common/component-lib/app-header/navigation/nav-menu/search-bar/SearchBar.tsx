import Search from '@lsq/nextgen-preact/v2/text-field/search-bar';
import styles from './search-bar.module.css';

interface ISearchBarProps {
  searchText?: string;
  setSearchText: (text: string) => void;
}

/**
 * Displays a searchbar for filtering the modules and module items.
 */

const SearchBar = ({ searchText = '', setSearchText }: ISearchBarProps): JSX.Element => {
  return (
    <Search
      value={searchText}
      onChange={(val: string) => {
        setSearchText(val);
      }}
      className={styles.search}
      size="xs"
      placeholder="Search"
    />
  );
};

SearchBar.defaultProps = {
  searchText: ''
};

export default SearchBar;
