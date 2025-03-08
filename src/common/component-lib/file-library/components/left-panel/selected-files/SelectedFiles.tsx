import useFileLibraryStore from '../../../file-library.store';
import { IFile } from '../../../file-library.types';
import { getFilesSize } from '../../../utils';
import File from './File';
import styles from '../left-panel.module.css';

const SelectedFiles = (): JSX.Element => {
  const { selectedFiles, maxFiles, maxFilesSize, setSelectedFiles, setDisabledFiles } =
    useFileLibraryStore((state) => ({
      selectedFiles: state.selectedFiles,
      maxFiles: state.maxFiles,
      maxFilesSize: state.maxFilesSize,
      setSelectedFiles: state.setSelectedFiles,
      setDisabledFiles: state.setDisabledFiles
    }));

  const handleDelete = (file: IFile): void => {
    setSelectedFiles(
      selectedFiles.filter(
        (selectedFile) => selectedFile?.Id !== file?.Id || selectedFile?.Path !== file?.Path
      )
    );
    setDisabledFiles(false);
  };

  return (
    <div className={styles.file_list_container}>
      <div className={styles.file_list_header}>Files Selected</div>
      <div className={styles.file_count_wrapper}>
        <div>
          {selectedFiles.length} of {maxFiles}
        </div>
        <ul>
          <li>{`${getFilesSize(selectedFiles)} / ${maxFilesSize / 1024} MB`}</li>
        </ul>
      </div>
      <div className={styles.file_list_wrapper}>
        {selectedFiles.map((file) => {
          return <File key={file.Id} file={file} handleDelete={handleDelete} />;
        })}
      </div>
    </div>
  );
};

export default SelectedFiles;
