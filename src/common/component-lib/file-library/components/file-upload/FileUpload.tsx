import { useRef, lazy } from 'react';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { Variant } from 'common/types';
import { CONSTANTS } from './constants';
import { convertFileFormat, uploadFile, validateFile } from './utils';
import { generateUUIDv4 } from 'common/utils/helpers';
import { IUploadHandler, LibraryType } from '../../file-library.types';
import { CallerSource } from 'common/utils/rest-client';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

export interface IFileUpload {
  maxFileSize: number;
  libraryType: LibraryType;
  folderName: string;
  callerSource: CallerSource;
  allowedFileFormats?: string[];
  blockedFileFormats?: string[];
  uploadHandler?: IUploadHandler;
  disabled?: boolean;
}

const FileUpload = (props: IFileUpload): JSX.Element => {
  const {
    maxFileSize,
    libraryType,
    folderName,
    allowedFileFormats,
    blockedFileFormats,
    uploadHandler,
    disabled,
    callerSource
  } = props;
  const { showAlert } = useNotification();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (): void => {
    inputRef.current?.click();
  };

  const handleUploadAPI = async (file: File, fileId: string): Promise<void> => {
    if (uploadHandler?.onUploadStart) {
      await uploadHandler?.onUploadStart(file, fileId);
    }
    const response = await uploadFile({ file, libraryType, folderName, callerSource });
    if (response && response?.Status === 'Failure') {
      if (uploadHandler?.onUploadError)
        await uploadHandler?.onUploadError(
          response?.Message ? `${response?.Message}` : ERROR_MSG.generic,
          fileId
        );
    } else {
      if (uploadHandler?.onUploadComplete) await uploadHandler?.onUploadComplete(response, fileId);
    }
  };

  const handleFileChange = async (e): Promise<void> => {
    const file = e.target.files[0] as File;
    if (file) {
      const fileId = generateUUIDv4();
      try {
        validateFile({
          file: file,
          maxFileSize: maxFileSize,
          allowedFileFormats: allowedFileFormats,
          blockedFileFormats: blockedFileFormats
        });
        await handleUploadAPI(file, fileId);
      } catch (err) {
        showAlert({
          type: Type.ERROR,
          message: err?.message ? `${err?.message}` : ERROR_MSG.generic
        });
        if (uploadHandler?.onUploadError) await uploadHandler?.onUploadError(err?.message, fileId);
      }
    }
  };

  return (
    <>
      <Button
        text={CONSTANTS.UPLOAD_NEW}
        onClick={handleClick}
        variant={Variant.Primary}
        disabled={disabled}
      />
      <input
        type="file"
        multiple={false}
        onChange={handleFileChange}
        ref={inputRef}
        style={{ display: 'none' }}
        accept={allowedFileFormats ? convertFileFormat(allowedFileFormats) : undefined}
      />
    </>
  );
};

FileUpload.defaultProps = {
  allowedFileFormats: undefined,
  blockedFileFormats: undefined,
  uploadHandler: undefined,
  disabled: false
};

export default FileUpload;
