import { useState } from 'react';
import FilePreview from 'common/component-lib/file-preview';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import useFileLibraryStore from 'common/component-lib/file-library/file-library.store';
import { IFile } from 'common/component-lib/file-library/file-library.types';
import { deleteFile } from '../right-panel/right-panel.service';
import { calculateFilesSize } from '../../utils';
import DeleteModal from '../delete-modal';
import NotFound from '../not-found';
import Shimmer from '../shimmer';
import Card from './card';
import styles from './grid.module.css';

interface IGrid {
  isLoadingNextPage: boolean;
  intersectionRef: React.RefObject<HTMLDivElement>;
}

// eslint-disable-next-line complexity, max-lines-per-function
const Grid = ({ isLoadingNextPage, intersectionRef }: IGrid): JSX.Element => {
  const {
    selectedLibraryType,
    isLoading,
    files,
    selectedFiles,
    setSelectedFiles,
    maxFilesSize,
    maxFiles,
    disabledFiles,
    setDisabledFiles,
    onFilesSelect,
    isSingleSelect,
    removeFile,
    selectedFolder,
    setShow,
    callerSource
  } = useFileLibraryStore((state) => ({
    isLoading: state.isLoading,
    files: state.filesData?.Files,
    selectedLibraryType: state.library.selected,
    selectedFiles: state.selectedFiles,
    setSelectedFiles: state.setSelectedFiles,
    maxFilesSize: state.maxFilesSize,
    maxFiles: state.maxFiles,
    disabledFiles: state.disableFiles,
    setDisabledFiles: state.setDisabledFiles,
    onFilesSelect: state.onFilesSelect,
    isSingleSelect: state.isSingleSelect,
    removeFile: state.removeFile,
    selectedFolder: state.selectedFolder,
    setShow: state.setShow,
    callerSource: state.callerSource
  }));

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [fileSelectedForAction, setFileSelectedForAction] = useState<IFile>();

  const { showAlert } = useNotification();

  const handlePreview = (file: IFile): void => {
    setFileSelectedForAction(file);
    setShowPreviewModal(true);
  };

  const handleDelete = (file: IFile): void => {
    setFileSelectedForAction(file);
    setShowDeleteModal(true);
  };

  const handleAbort = async (file: IFile): Promise<void> => {
    removeFile(file.Id);
    deleteFile({
      fileName: file.Name,
      folderName: selectedFolder,
      libraryType: selectedLibraryType,
      callerSource
    });
  };

  const isFileSizeExceeded = (file: IFile): boolean => {
    const allFileSize = calculateFilesSize([...selectedFiles, file], true);
    return allFileSize > maxFilesSize / 1024;
  };

  const handleAdd = (file: IFile): void => {
    const augmentedFile: IFile = { ...file };
    if (selectedLibraryType) augmentedFile.FileType = `${selectedLibraryType}`;
    if (isSingleSelect) {
      onFilesSelect?.([augmentedFile]);
      setShow(false);
      return;
    }
    const isFileSelected = selectedFiles.some(
      (storedFile) => storedFile.Path === augmentedFile.Path
    );
    const isExceedingFileSize = isFileSizeExceeded(augmentedFile);

    if (isFileSelected) {
      setSelectedFiles(
        selectedFiles.filter((selectedFile) => selectedFile.Path !== augmentedFile.Path)
      );
      setDisabledFiles(false);
    } else if (isExceedingFileSize) {
      showAlert({
        type: Type.WARNING,
        message: `The file you are trying to select exceeds the overall ${
          maxFilesSize / 1024
        }mb attachment limit`
      });
    } else {
      setSelectedFiles([...selectedFiles, augmentedFile]);
      if (selectedFiles.length === maxFiles - 1) {
        setDisabledFiles(true);
      }
    }
  };

  return (
    <>
      <div className={`${styles.grid} grid`} id="grid">
        {isLoading ? (
          <div className={styles.cards_wrapper}>
            <Shimmer />
          </div>
        ) : (
          <>
            {files?.length ?? 0 > 0 ? (
              <div className={styles.cards_wrapper}>
                {files?.map((file) => (
                  <Card
                    key={file.Id}
                    file={file}
                    libraryType={selectedLibraryType}
                    selectedFiles={selectedFiles}
                    disabledFiles={disabledFiles || false}
                    maxFiles={maxFiles || 5}
                    handlePreview={handlePreview}
                    handleDelete={handleDelete}
                    handleAdd={handleAdd}
                    handleAbort={handleAbort}
                  />
                ))}
                {isLoadingNextPage ? <Shimmer /> : null}
                <div ref={intersectionRef} />
              </div>
            ) : (
              <NotFound />
            )}
          </>
        )}
      </div>
      {showDeleteModal && fileSelectedForAction ? (
        <DeleteModal file={fileSelectedForAction} setShowDeleteModal={setShowDeleteModal} />
      ) : null}

      {showPreviewModal ? (
        <FilePreview
          previewData={[
            {
              name: fileSelectedForAction?.Name || '',
              previewUrl: fileSelectedForAction?.Path || '',
              type: fileSelectedForAction?.Extension
            }
          ]}
          showModal
          setShowModal={setShowPreviewModal}
          removeDownloadOption
          container={document.getElementById('grid') as HTMLElement}
        />
      ) : null}
    </>
  );
};

export default Grid;
