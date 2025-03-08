import useFileLibraryStore from '../../file-library.store';
import { LibraryType } from '../../file-library.types';
import { Info, DocDualTone, ImageDualTone } from '../icons';
import styles from './not-found.module.css';

const NotFound = (): JSX.Element => {
  const { searchText, selectedLibrary } = useFileLibraryStore((state) => ({
    searchText: state.searchText,
    selectedLibrary: state.library.selected
  }));

  const getIcon = (): JSX.Element => {
    if (searchText) {
      return <Info />;
    }
    if (selectedLibrary === LibraryType.Documents) {
      return <DocDualTone />;
    }
    return <ImageDualTone />;
  };

  const getDescription = (): string => {
    if (searchText) {
      return 'No Results Found';
    }
    if (selectedLibrary === LibraryType.Documents) {
      return 'No Documents Available';
    }
    return 'No Images Available';
  };

  return (
    <div className={styles.not_found_wrapper}>
      <div className={styles.not_found}>
        {getIcon()}
        <div className={styles.description}>{getDescription()}</div>
      </div>
    </div>
  );
};

export default NotFound;
