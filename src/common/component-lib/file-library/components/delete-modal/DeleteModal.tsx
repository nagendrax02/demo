import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { Variant } from 'common/types';
import { IFile, LibraryType } from '../../file-library.types';
import useFileLibraryStore from '../../file-library.store';
import { deleteFile } from '../right-panel/right-panel.service';
import styles from './delete-modal.module.css';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface IDeleteModal {
  file: IFile;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteModal = (props: IDeleteModal): JSX.Element => {
  const { file, setShowDeleteModal } = props;

  const { libraryType, refreshGrid, folders, callerSource } = useFileLibraryStore((state) => ({
    libraryType: state.library.selected,
    refreshGrid: state.refreshGrid,
    folders: state.filesData?.Folders,
    callerSource: state.callerSource
  }));

  const { showAlert } = useNotification();

  const getDescription = (): JSX.Element => {
    return (
      <>
        <div className={styles.warning_wrapper}>
          <div>Are you sure you want to delete file</div>{' '}
          <div className={styles.name}>{file.Name}</div>?
        </div>
        <div>Deleting will remove this file from library.</div>
      </>
    );
  };

  const onClose = (): void => {
    setShowDeleteModal(false);
  };

  const getParentFolderPath = (path: string): string => {
    if (path && path !== '/') {
      const lastSlashIndex = path.lastIndexOf('/');
      return lastSlashIndex > 0 ? path.substring(0, lastSlashIndex) : path;
    }
    return '';
  };

  const getFolderNameByFileType = (): string => {
    try {
      let fileTypeFolderName = '';
      switch (libraryType) {
        case LibraryType.Images:
          fileTypeFolderName = 'images';
          break;
        case LibraryType.Documents:
          fileTypeFolderName = 'documents';
          break;
      }
      const fileTypeFolderIndex = file.Path.indexOf(fileTypeFolderName);
      const fileNameIndex = file.Path.indexOf(file.Name);
      return file.Path.substring(
        fileTypeFolderIndex + fileTypeFolderName.length,
        fileNameIndex - 1
      );
    } catch (error) {
      return '';
    }
  };

  const getFileRelativePath = (): string => {
    const rootFolder = folders?.find((folder) => folder.Name === 'root');
    const rootPath = rootFolder?.Path ?? '';
    let fileRelativePath = '';

    if (rootPath) {
      fileRelativePath = `/${file.Path.split(rootPath).slice(-1)[0]}`;
      fileRelativePath = fileRelativePath.substring(0, fileRelativePath.indexOf(file.Name));
    } else {
      fileRelativePath = getFolderNameByFileType();
    }

    return fileRelativePath;
  };

  const handleFileDelete = async (): Promise<void> => {
    try {
      const fileRelativePath = getFileRelativePath();
      await deleteFile({
        fileName: file.Name,
        folderName: getParentFolderPath(fileRelativePath),
        libraryType: libraryType,
        callerSource
      });
      refreshGrid();
      showAlert({
        type: Type.SUCCESS,
        message: `${file.Name} Deleted Successfully`
      });
    } catch (error) {
      showAlert({
        type: Type.ERROR,
        message: error.message as string
      });
    }
    onClose();
  };

  const buttonConfig = [
    {
      id: 1,
      name: 'No',
      variant: Variant.Primary,
      onClick: onClose
    },
    {
      id: 1,
      name: 'Yes, Delete',
      variant: Variant.Secondary,
      showSpinnerOnClick: true,
      onClick: handleFileDelete,
      customStyleClass: styles.delete_button
    }
  ];

  return (
    <ConfirmationModal
      show
      onClose={onClose}
      title={`Delete ${file.Name}`}
      description={getDescription()}
      buttonConfig={buttonConfig}
    />
  );
};

export default DeleteModal;
