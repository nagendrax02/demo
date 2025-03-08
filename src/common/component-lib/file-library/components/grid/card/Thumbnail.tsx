import { LibraryType } from 'common/component-lib/file-library/file-library.types';
import Spinner from '@lsq/nextgen-preact/spinner';
import { EXTENSIONS_GROUP } from '../../../constants';
import FileIcons from '../../file-icons';
import styles from './card.module.css';

interface IThumbnail {
  name: string;
  path: string;
  extension: string;
  libraryType: LibraryType | null;
}

const Thumbnail = ({ name, path, extension, libraryType }: IThumbnail): JSX.Element => {
  const getThumbnail = (): JSX.Element => {
    if (path) {
      if (
        libraryType === LibraryType.Images ||
        EXTENSIONS_GROUP.images.includes(extension?.toLowerCase())
      )
        return <img src={path} alt={name} />;
      return <FileIcons extension={extension} width="60" height="60" />;
    }
    return <Spinner />;
  };

  return <div className={styles.thumbnail}>{getThumbnail()}</div>;
};

export default Thumbnail;
