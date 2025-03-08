import Icon from '@lsq/nextgen-preact/icon';
import { IFile } from '../../../file-library.types';
import FileIcons from '../../file-icons';
import styles from '../left-panel.module.css';

interface IFileProps {
  file: IFile;
  handleDelete: (file: IFile) => void;
}

const File = ({ file, handleDelete }: IFileProps): JSX.Element => {
  return (
    <div className={styles.file_wrapper}>
      <div className={styles.file_detail}>
        <FileIcons extension={file.Extension} height="20" width="20" />
        <div className={styles.file_name_wrapper} title={file.Name}>
          <span>{file.Name}</span>
        </div>
      </div>
      <div
        onClick={() => {
          handleDelete(file);
        }}>
        <Icon name="clear" customStyleClass={styles.clear_icon} />
      </div>
    </div>
  );
};

export default File;
