import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { ALL_FOLDERS_OPTION } from './constants';
import { IFolder } from '../../file-library.types';

const getSelectedFolderOption = (
  folders: IFolder[],
  selectedFolder: string | undefined
): IOption[] => {
  if (!selectedFolder) {
    return [ALL_FOLDERS_OPTION];
  } else {
    const folderOption = folders?.find((folder) => folder?.Name === selectedFolder);
    return folderOption
      ? [{ label: folderOption?.Name?.replace('/', ''), value: folderOption?.Name || '' }]
      : [];
  }
};

export { getSelectedFolderOption };
