import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import IconButton from 'common/component-lib/icon-button';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from './manage-folder.module.css';
import { IFolder } from '../../file-library.types';
import { ALL_FOLDERS_OPTION } from './constants';
import { getSelectedFolderOption } from './utils';
import { lazy, useState } from 'react';
import ManageFolderModal from './manage-folder-modal';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

export interface IManageFolder {
  folders: IFolder[];
  setSelectedFolder: (selectedFolder: string) => void;
  selectedFolder?: string;
  onFolderSelect?: () => void;
}

const ManageFolder = (props: IManageFolder): JSX.Element => {
  const { folders, setSelectedFolder, selectedFolder, onFolderSelect } = props;
  const [showModal, setShowModal] = useState<boolean>(false);

  const fetchOptions = (): IOption[] => {
    const options = folders.map((folder: IFolder): IOption => {
      return {
        label: folder?.Name.replace('/', ''),
        value: folder?.Name || ''
      };
    });
    options.unshift(ALL_FOLDERS_OPTION);
    return options;
  };

  const augmentedOptions = fetchOptions();

  const handleFolderSelect = (selectedOption: IOption[]): void => {
    if (selectedOption?.length) {
      const opt = selectedOption?.[0];
      if (opt.value === ALL_FOLDERS_OPTION.value) {
        setSelectedFolder('');
      } else {
        const newFolder = folders.find((folder) => folder.Name === opt?.value);
        if (newFolder) setSelectedFolder(newFolder.Name);
      }
      if (onFolderSelect) {
        onFolderSelect();
      }
    }
  };

  return (
    <>
      {showModal ? <ManageFolderModal setShowModal={setShowModal} folders={folders} /> : null}
      <div className={styles.wrapper}>
        <Dropdown
          fetchOptions={fetchOptions}
          setSelectedValues={handleFolderSelect}
          selectedValues={getSelectedFolderOption(folders, selectedFolder)}
          hideClearButton
          showCheckIcon
          disableSearch
          customStyleClass={styles.dropdown}
          useParentDropdownOptions={augmentedOptions}
          renderConfig={{ customMenuDimension: { height: 230 } }}
        />
        <IconButton
          customStyleClass={styles.manage_button}
          icon={<Icon name="settings" variant={IconVariant.Filled} />}
          onClick={() => {
            setShowModal(true);
          }}
        />
      </div>
    </>
  );
};

ManageFolder.defaultProps = {
  selectedFolder: undefined,
  onFolderSelect: undefined
};

export default ManageFolder;
