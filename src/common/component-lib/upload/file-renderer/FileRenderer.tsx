import { IPreviewData } from '../../file-preview';
import File from '../file';
import { IFile } from '../upload.types';
import styles from './file-renderer.module.css';

interface IFileRenderer {
  files: Record<string, IFile>;
  onFileUpload: (file: File) => Promise<void>;
  onFileDelete: (file: File) => Promise<void>;
  previewData: Record<string, IPreviewData>;
  onFilePreviewClick?: () => Promise<void>;
}

const FileRenderer = ({
  files,
  onFileUpload,
  onFileDelete,
  previewData,
  onFilePreviewClick
}: IFileRenderer): JSX.Element => {
  return (
    <div className={styles.files_wrapper} data-testid="upload-file-renderer">
      {Object.values(files)?.map((file) => {
        return (
          <File
            key={file.info.name}
            config={file}
            onFileUpload={onFileUpload}
            previewData={previewData}
            onFileDelete={onFileDelete}
            onFilePreviewClick={onFilePreviewClick}
          />
        );
      })}
    </div>
  );
};

FileRenderer.defaultProps = {
  onFilePreviewClick: undefined
};

export default FileRenderer;
