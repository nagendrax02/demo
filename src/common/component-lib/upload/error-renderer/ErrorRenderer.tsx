import { DEFAULT_FILE_SIZE_LIMIT } from '../constants';
import useUploadStore from '../upload.store';
import { FileError } from '../upload.types';
import styles from './error-renderer.module.css';

export interface IErrorRenderer {
  maxSizeInMB?: number;
}

const ErrorRenderer = (props: IErrorRenderer): JSX.Element => {
  const { maxSizeInMB } = props;
  const { fileError } = useUploadStore();

  const getErrorMessage = (error: FileError, fileNames: string[]): string => {
    switch (error) {
      case FileError.FileSizeExceeded:
        return `${fileNames.join(',')} exceeds the file size limit of ${
          maxSizeInMB || DEFAULT_FILE_SIZE_LIMIT
        }MB`;
      case FileError.FileCountExceeded:
        return 'Maximum number of files reached';
      case FileError.FileFormatInvalid:
      case FileError.FileNameValidationFailed:
        return `Error uploading file: ${fileNames.join(
          ','
        )}. Format of uploaded file is not supported!`;
      case FileError.FileSizeZero:
        return `${fileNames.join(',')} size is less than or equal to zero byte.`;
      default:
        return error;
    }
  };

  return (
    <div className={styles.error_wrapper}>
      {Object.keys(fileError).map((error) => {
        return (
          <div className={styles.error} key={error}>
            {getErrorMessage(error as FileError, fileError?.[error])}
          </div>
        );
      })}
    </div>
  );
};

ErrorRenderer.defaultProps = {
  maxSizeInMB: undefined
};

export default ErrorRenderer;
