import { trackError } from 'common/utils/experience/utils/track-error';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { useState, useEffect, lazy } from 'react';
import useFileLibraryStore from '../../../file-library.store';
import { IFileUploadResponse, LibraryType } from '../../../file-library.types';
import { MAX_FILE_SIZE_ALLOWED } from '../../../constants';
import FileUpload from '../../file-upload';
import styles from '../right-panel.module.css';
import ManageFolder from '../../manage-folder';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Search = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/search')));

const Header = (): JSX.Element => {
  const {
    searchText,
    setSearchText,
    filesData,
    selectedFolder,
    setSelectedFolder,
    refreshGrid,
    setFilesData,
    removeFile,
    callerSource,
    selectedLibraryType
  } = useFileLibraryStore((state) => ({
    searchText: state.searchText,
    setSearchText: state.setSearchText,
    filesData: state.filesData,
    selectedFolder: state.selectedFolder,
    setSelectedFolder: state.setSelectedFolder,
    refreshGrid: state.refreshGrid,
    setFilesData: state.setFilesData,
    removeFile: state.removeFile,
    selectedLibraryType: state.library.selected,
    callerSource: state.callerSource
  }));

  const [search, setSearch] = useState(searchText);

  const { showAlert } = useNotification();

  useEffect(() => {
    setSearch(searchText);
  }, [searchText]);

  const uploadNewButton = useFileLibraryStore((state) => {
    const selectedLibraryData = state.library.data.filter(
      (item) => item.id === state.library.selected
    );
    return selectedLibraryData[0]?.uploadNewButton ?? { show: true, disabled: false };
  });

  const onUploadStart = (uploadingFile: File, id: string): void => {
    const clonedFilesData = filesData ? { ...filesData } : { Files: [], Folders: [] };
    if (uploadingFile) {
      clonedFilesData.Files.unshift({
        Name: uploadingFile.name,
        Extension: uploadingFile.name.split('.')?.[1] || '',
        Size: uploadingFile.size,
        Id: id,
        Path: '',
        DownloadableURL: '',
        LastModifiedOn: `${new Date().getTime()}`,
        disabled: true
      });
      setFilesData(clonedFilesData);
    }
  };

  const onUploadError = (message: string, id: string): void => {
    removeFile(id);
    showAlert({
      type: Type.ERROR,
      message
    });
  };

  const onUploadComplete = (data: IFileUploadResponse, id: string): void => {
    try {
      if (data) {
        showAlert({
          type: Type.SUCCESS,
          message: `${data?.uploadedFile} Uploaded Successfully`
        });
        refreshGrid();
      }
    } catch (e) {
      trackError('Error while uploading file', e);
      onUploadError(e as string, id);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.search}>
        <Search
          search={search}
          setSearch={setSearch}
          onEnterKeyPress={setSearchText}
          showKeyboardReturnIcon
          config={{
            name: 'Search'
          }}
        />
      </div>
      <ManageFolder
        folders={filesData?.Folders || []}
        setSelectedFolder={setSelectedFolder}
        selectedFolder={selectedFolder}
        onFolderSelect={() => {
          refreshGrid();
        }}
      />
      <div className={styles.upload}>
        {uploadNewButton.show ? (
          <FileUpload
            maxFileSize={(filesData?.AllowedFileSize || 1) * MAX_FILE_SIZE_ALLOWED}
            allowedFileFormats={filesData?.AllowedFileExtensions}
            blockedFileFormats={
              filesData?.BlockedFileExtensions ? [filesData.BlockedFileExtensions] : undefined
            }
            uploadHandler={{
              onUploadStart,
              onUploadComplete,
              onUploadError
            }}
            disabled={uploadNewButton.disabled}
            libraryType={selectedLibraryType || LibraryType.Documents}
            folderName={selectedFolder}
            callerSource={callerSource}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Header;
