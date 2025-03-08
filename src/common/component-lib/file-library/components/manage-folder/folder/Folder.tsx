import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { IFolder } from '../../../file-library.types';
import { deleteFolder, createFolder, updateFolder } from '../../right-panel/right-panel.service';
import styles from './folder.module.css';
import { useState } from 'react';
import EditFolder from './edit-folder';
import IconButton from '../../../../icon-button';
import DeleteFolder from './delete-folder';
import useFileLibraryStore from '../../../file-library.store';

export interface IFolderProps {
  data: IFolder;
}

enum ActionType {
  Edit = 'Edit',
  Delete = 'Delete'
}

const Folder = (props: IFolderProps): JSX.Element => {
  const { data } = props;
  const [showAction, setShowAction] = useState<ActionType | undefined>(undefined);
  const [folderName, setFolderName] = useState<string>(data?.Name.replace('/', ''));

  const { libraryType, refreshGrid, callerSource, filesData, setFilesData } = useFileLibraryStore(
    (state) => ({
      libraryType: state.library.selected,
      refreshGrid: state.refreshGrid,
      callerSource: state.callerSource,
      filesData: state.filesData,
      setFilesData: state.setFilesData
    })
  );

  const handleEditSave = async (newFolderName: string): Promise<void> => {
    await createFolder({
      folderName: newFolderName,
      oldFolderName: folderName,
      libraryType,
      callerSource
    });
    await updateFolder({
      callerSource,
      filesData: filesData,
      setFilesData: setFilesData
    });

    setShowAction(undefined);
    refreshGrid();
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    await deleteFolder(folderName, libraryType, callerSource);
    await updateFolder({
      callerSource,
      filesData: filesData,
      setFilesData: setFilesData
    });

    setShowAction(undefined);
    refreshGrid();
  };

  const handleClear = (): void => {
    setShowAction(undefined);
  };

  if (showAction === ActionType.Edit) {
    return (
      <EditFolder
        folderName={folderName}
        setFolderName={setFolderName}
        onSave={handleEditSave}
        onClear={handleClear}
      />
    );
  } else if (showAction === ActionType.Delete) {
    return <DeleteFolder onConfirm={handleDeleteConfirm} onCancel={handleClear} />;
  }

  return (
    <div className={styles.wrapper}>
      <Icon
        name="folder"
        variant={IconVariant.Filled}
        customStyleClass={styles.existing_folder_icon}
      />
      <div className={styles.existing_folder_name}>{folderName}</div>
      {folderName !== 'root' ? (
        <div className={`${styles.hover_action_wrapper} folder_action_wrapper`}>
          <IconButton
            customStyleClass={styles.hover_action_edit}
            onClick={() => {
              setShowAction(ActionType.Edit);
            }}
            icon={<Icon name="edit" variant={IconVariant.Filled} />}
          />
          <IconButton
            customStyleClass={styles.hover_action_delete}
            onClick={() => {
              setShowAction(ActionType.Delete);
            }}
            icon={<Icon name="delete" variant={IconVariant.Filled} />}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Folder;
