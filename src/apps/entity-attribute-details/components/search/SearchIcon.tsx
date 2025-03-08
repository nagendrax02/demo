import Icon from '@lsq/nextgen-preact/icon';
import styles from './search.module.css';

interface ISearchIcon {
  onClick: () => void;
}

const SearchIcon = ({ onClick }: ISearchIcon): JSX.Element => {
  return (
    <div onClick={onClick} data-testid="ead-search-icon">
      <Icon name="search" customStyleClass={styles.search_icon} />
    </div>
  );
};

export default SearchIcon;
