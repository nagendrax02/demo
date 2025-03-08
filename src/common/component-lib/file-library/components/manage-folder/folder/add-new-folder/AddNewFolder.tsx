import { useState } from 'react';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from '../folder.module.css';
import { CONSTANTS } from '../../constants';
import EditFolder from '../edit-folder';
import useFileLibraryStore from '../../../../file-library.store';
import { createFolder, updateFolder } from '../../../right-panel/right-panel.service';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';

const AddNewFolder = (): JSX.Element => {
  const { showAlert } = useNotification();
  const [showEditFolder, setShowEditFolder] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('');

  const { libraryType, refreshGrid, callerSource, filesData, setFilesData } = useFileLibraryStore(
    (state) => ({
      libraryType: state.library.selected,
      refreshGrid: state.refreshGrid,
      callerSource: state.callerSource,
      filesData: state.filesData,
      setFilesData: state.setFilesData
    })
  );

  const handleInput = (): void => {
    setShowEditFolder(true);
  };

  const handleSave = async (newFolderName: string): Promise<void> => {
    try {
      await createFolder({
        folderName: newFolderName,
        oldFolderName: '',
        libraryType,
        callerSource
      });
      await updateFolder({
        callerSource,
        filesData: filesData,
        setFilesData: setFilesData
      });
      setShowEditFolder(false);
      refreshGrid();
    } catch (err) {
      showAlert({
        type: Type.ERROR,
        message: (err?.message || ERROR_MSG.generic) as string
      });
    }
  };

  const handleClear = (): void => {
    setShowEditFolder(false);
    setFolderName('');
  };

  if (showEditFolder) {
    return (
      <EditFolder
        folderName={folderName}
        setFolderName={setFolderName}
        onSave={handleSave}
        onClear={handleClear}
        focus
      />
    );
  }

  return (
    <div className={`${styles.wrapper} ${styles.new_folder}`} onClick={handleInput}>
      <Icon
        name="create_new_folder"
        variant={IconVariant.Filled}
        customStyleClass={styles.new_folder_icon}
      />
      <div className={styles.new_folder_name}>{CONSTANTS.ADD_NEW_FOLDER}</div>
    </div>
  );
};

export default AddNewFolder;
