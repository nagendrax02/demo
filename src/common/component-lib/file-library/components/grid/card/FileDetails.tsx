import { getFileSize } from '../../../utils';
import FileIcons from '../../file-icons';
import styles from './card.module.css';

interface IFileDetails {
  name: string;
  size: number;
  extension: string;
  isFileSelected: boolean;
}

const FileDetails = ({ name, size, extension, isFileSelected }: IFileDetails): JSX.Element => {
  return (
    <div
      className={`${styles.file_details} file-details ${
        isFileSelected ? styles.file_details_selected : ''
      }`}>
      <FileIcons extension={extension.toLowerCase()} />
      <div className={styles.file_detail}>
        <span className={`${styles.file_name}`} title={name}>
          {name}
        </span>
        <span className={`${styles.file_size} `}>{getFileSize(size)}</span>
      </div>
    </div>
  );
};

export default FileDetails;
