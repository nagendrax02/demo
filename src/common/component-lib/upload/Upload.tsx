import ErrorRenderer from './error-renderer';
import FileRenderer from './file-renderer/FileRenderer';
import useUploadUtils from './use-upload-utils';
import styles from './upload.module.css';
import useUploadStore from './upload.store';
import { DEFAULT_FILE_SIZE_LIMIT, UPLOAD } from './constants';
import { useEffect } from 'react';
import { IPreviewData } from '../file-preview';
import { ISelectedFile } from './upload.types';

export interface IUpload {
  onFileUpload: (file: File) => Promise<void>;
  onFileDelete: (file: File) => Promise<void>;
  updateFileList: (updateFiles: File[]) => void;
  previewData: Record<string, IPreviewData>;
  label?: string;
  multiple?: boolean;
  maxSizeInMB?: number;
  restrictedFormats?: string[];
  maxFileCount?: number;
  selectedFiles?: ISelectedFile[];
  customStyleClass?: string;
  onFilePreviewClick?: () => Promise<void>;
  allowedExtensions?: string[];
}

const Upload = (props: IUpload): JSX.Element => {
  const {
    label,
    onFileUpload,
    onFileDelete,
    updateFileList,
    multiple,
    maxSizeInMB,
    restrictedFormats,
    maxFileCount,
    previewData,
    selectedFiles,
    customStyleClass,
    onFilePreviewClick,
    allowedExtensions
  } = props;

  const { files, setFiles, fileError, reset } = useUploadStore();
  const { getValidatedFiles, clearError } = useUploadUtils(selectedFiles);

  useEffect(() => {
    const augmentedFiles = Object.values(files).map((file) => file.info);
    updateFileList(augmentedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClick = (): void => {
    clearError();
  };

  const handleFileChange = (e): void => {
    e.preventDefault();
    const newFiles = e?.target?.files as FileList;
    if (newFiles.length) {
      const validatedFiles = getValidatedFiles({
        newFiles,
        allFiles: files,
        maxSizeInMB,
        restrictedFormats,
        maxFileCount
      });
      setFiles({ ...files, ...validatedFiles });
    }

    e.target.value = '';
  };

  if (!multiple && Object.keys(files).length === 1) {
    return (
      <FileRenderer
        files={files}
        onFileUpload={onFileUpload}
        onFileDelete={onFileDelete}
        previewData={previewData}
        onFilePreviewClick={onFilePreviewClick}
      />
    );
  }

  const getError = (): JSX.Element => {
    if (Object.keys(fileError).length) {
      return <ErrorRenderer maxSizeInMB={maxSizeInMB || DEFAULT_FILE_SIZE_LIMIT} />;
    }
    return <></>;
  };

  return (
    <div className={`${styles.upload_wrapper} ${customStyleClass}`} data-testid="upload-wrapper">
      <label
        className={`${styles.label_wrapper} ${
          Object.keys(fileError).length ? styles.error_wrapper : ''
        }`}>
        <div className={styles.placeholder}>{label ? label : UPLOAD}</div>
        <input
          type="file"
          onChange={handleFileChange}
          onClick={handleOnClick}
          data-testid="upload-file-input"
          multiple={multiple}
          accept={allowedExtensions ? allowedExtensions?.join() : undefined}
        />
      </label>
      {Object.keys(files).length ? (
        <FileRenderer
          files={files}
          onFileUpload={onFileUpload}
          previewData={previewData}
          onFileDelete={onFileDelete}
        />
      ) : null}
      {getError()}
    </div>
  );
};

Upload.defaultProps = {
  label: '',
  multiple: false,
  maxSizeInMB: undefined,
  restrictedFormats: undefined,
  maxFileCount: undefined,
  customStyleClass: '',
  selectedFiles: undefined,
  onFilePreviewClick: undefined,
  allowedExtensions: undefined
};

export default Upload;
