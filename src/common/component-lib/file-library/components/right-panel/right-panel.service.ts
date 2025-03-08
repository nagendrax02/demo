import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import {
  IFileResponse,
  IResponse,
  SortFilterValues,
  FileSortBy,
  FileSortOrder,
  LibraryType,
  IFilesFromAPI
} from '../../file-library.types';

const getFormattedFolderName = (folderName: string): string => {
  const trimmedFolderName = (folderName || '').trim();
  if (trimmedFolderName) {
    if (trimmedFolderName.startsWith('/')) return trimmedFolderName;
    return `/${trimmedFolderName}`;
  }
  return trimmedFolderName;
};

const getSortByValue = (sortBy: string): FileSortBy => {
  if (sortBy === SortFilterValues.Ascending || sortBy === SortFilterValues.Descending)
    return FileSortBy.Name;
  if (sortBy === SortFilterValues.SizeAscending || sortBy === SortFilterValues.SizeDescending)
    return FileSortBy.Size;
  return FileSortBy.ModifiedOn;
};

const getSortOrderValue = (sortBy: string): FileSortOrder => {
  if (sortBy === SortFilterValues.Ascending || sortBy === SortFilterValues.SizeAscending)
    return FileSortOrder.Ascending;
  return FileSortOrder.Descending;
};

export const getFilesFromAPI = async ({
  folderName,
  libraryType,
  searchText,
  sortBy,
  pageIndex,
  callerSource
}: IFilesFromAPI): Promise<IFileResponse | null> => {
  try {
    const Response: IFileResponse = await httpPost({
      path: API_ROUTES.fileLibrary,
      module: Module.Marvin,
      body: {
        FileType: libraryType === LibraryType.Documents ? 0 : 1,
        SortBy: getSortByValue(sortBy),
        SortOrder: getSortOrderValue(sortBy),
        PageIndex: pageIndex || 1,
        PageSize: DEFAULT_PAGE_SIZE,
        SearchText: searchText,
        FolderName: folderName
      },
      callerSource
    });
    return Response;
  } catch (error) {
    trackError('error fetching files data', error);
    return null;
  }
};

export const deleteFile = async ({
  fileName,
  folderName,
  libraryType,
  callerSource
}: {
  fileName: string;
  folderName: string;
  libraryType: LibraryType | null;
  callerSource: CallerSource;
}): Promise<boolean> => {
  const body = {
    fileName,
    folderName,
    fileType: libraryType,
    UseDBForContentLibrary: true
  };
  const response: IResponse = await httpPost({
    path: API_ROUTES.deleteFile,
    module: Module.FileUpload,
    body,
    callerSource
  });
  if (response.Status === 'Success') return true;
  throw new Error(response.Message);
};

export const deleteFolder = async (
  folderName: string,
  libraryType: LibraryType | null,
  callerSource: CallerSource
): Promise<boolean> => {
  const response: IResponse = await httpPost({
    path: API_ROUTES.deleteFolder,
    module: Module.FileUpload,
    body: {
      fileType: libraryType,
      folderName: getFormattedFolderName(folderName),
      UseDBForContentLibrary: true
    },
    callerSource
  });
  if (response.Status === 'Success') return true;
  throw new Error(response.Message);
};

export const createFolder = async ({
  folderName,
  callerSource,
  libraryType,
  oldFolderName
}: {
  folderName: string;
  oldFolderName: string;
  libraryType: LibraryType | null;
  callerSource: CallerSource;
}): Promise<boolean> => {
  const response: IResponse = await httpPost({
    path: API_ROUTES.createFolder,
    module: Module.FileUpload,
    body: {
      fileType: libraryType,
      folderName: getFormattedFolderName(oldFolderName),
      newFolderName: getFormattedFolderName(folderName),
      UseDBForContentLibrary: true
    },
    callerSource
  });
  if (response.Status === 'Success') return true;
  throw new Error(response.Message);
};

export const updateFolder = async ({
  callerSource,
  filesData,
  setFilesData
}: {
  callerSource: CallerSource;
  filesData: IFileResponse | null;
  setFilesData: (fileData: IFileResponse) => void;
}): Promise<void> => {
  const response = await getFilesFromAPI({
    folderName: '',
    libraryType: LibraryType.Documents,
    searchText: '',
    sortBy: '2',
    pageIndex: 1,
    callerSource
  });

  if (filesData && response?.Folders && response?.Folders.length > 0)
    setFilesData({ ...filesData, Folders: response.Folders });
};
