import { lazy, useEffect, useState } from 'react';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { IFile } from '../upload.types';
import styles from './file.module.css';
import Spinner from '@lsq/nextgen-preact/spinner';
import useUploadUtils from '../use-upload-utils';
import { DELETE_FILE } from '../constants';
import { IPreviewData } from '../../file-preview';
import FileDeleteModal from '../file-delete-modal';
import withSuspense from '@lsq/nextgen-preact/suspense';

const FilePreview = withSuspense(lazy(() => import('../../file-preview/FilePreview')));

interface IFileProps {
  config: IFile;
  onFileUpload: (file: File) => Promise<void>;
  onFileDelete: (file: File) => Promise<void>;
  previewData: Record<string, IPreviewData>;
  onFilePreviewClick?: () => Promise<void>;
}

const File = (props: IFileProps): JSX.Element => {
  const { config, onFileUpload, onFileDelete, previewData, onFilePreviewClick } = props;
  const [uploading, setIsUploading] = useState<boolean>(true);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const { deleteFile, logError } = useUploadUtils();

  const title = previewData[config?.info?.name]
    ? previewData[config?.info?.name].name
    : config?.info?.name;

  const filePreviewData = [previewData?.[config?.info?.name]];
  const handleFilePreview = async (): Promise<void> => {
    setIsPreviewLoading(true);
    setShowPreview(true);
    await onFilePreviewClick?.();
    setIsPreviewLoading(false);
  };

  const handleFileDeleteModal = (): void => {
    if (!uploading) {
      setShowDeleteModal(true);
    }
  };

  const handleFileDelete = async (): Promise<void> => {
    try {
      await onFileDelete(config.info);
      deleteFile(config?.info?.name);
      setShowDeleteModal(false);
    } catch (err) {
      logError(err, config?.info);
    }
  };

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        await onFileUpload(config.info);
      } catch (err) {
        deleteFile(config?.info?.name);
        logError(err, config?.info);
      }
      setIsUploading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={styles.file} data-testid="file-wrapper">
        <div
          className={`${styles.file_preview_box} ${
            uploading ? styles.file_name_loading : styles.file_name
          }`}
          data-testid="file-preview-box"
          onClick={handleFilePreview}>
          {title}
        </div>
        {uploading ? <Spinner customStyleClass={styles.spinner} /> : null}
        <div className={styles.action_wrapper}>
          <span
            className={`${styles.action} ${styles.clear} ${uploading ? styles.disabled : ''}`}
            title={DELETE_FILE}
            onClick={handleFileDeleteModal}
            data-testid="delete-file-icon">
            <Icon name="cancel" variant={IconVariant.Filled} />
          </span>
        </div>
      </div>
      {showPreview ? (
        <FilePreview
          showModal={showPreview}
          setShowModal={setShowPreview}
          previewData={filePreviewData}
          isLoading={isPreviewLoading}
        />
      ) : null}
      {showDeleteModal ? (
        <FileDeleteModal
          fileName={title}
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          onDelete={handleFileDelete}
        />
      ) : null}
    </>
  );
};

File.defaultProps = {
  onFilePreviewClick: undefined
};

export default File;
