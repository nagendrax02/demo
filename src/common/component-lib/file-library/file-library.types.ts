import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { CallerSource } from 'common/utils/rest-client';

export enum DocumentType {
  IMAGES = 'IMAGES',
  PDF = 'PDF',
  DOCX = 'DOCX',
  PPT = 'PPT',
  CSV = 'CSV',
  OTHERS = 'Others'
}

export enum LibraryType {
  Documents = 'Document',
  Images = 'Image'
}

export enum FileSortBy {
  Name,
  Size,
  ModifiedOn,
  Extension
}

export enum FileSortOrder {
  Ascending,
  Descending
}

export enum FileType {
  Document,
  Image,
  LandingPageDocument,
  ImportCSV,
  ExportCSV,
  LeadAttachment,
  UserProfile,
  DeveloperAppDocument,
  ProductAttachment,
  CustomObjectDocument,
  LeadPhoto,
  FormPreview,
  CompanyAttachment
}

export enum SortFilterValues {
  Recent = 'recent',
  Ascending = 'ascending',
  Descending = 'descending',
  SizeAscending = 'sizeAscending',
  SizeDescending = 'sizeDescending'
}

export interface ILibraryCategories {
  type: LibraryType;
  show: boolean;
}

export type IOnFileSelect = (files: IFile[]) => void;

export interface IFileLibrary {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onFilesSelect: IOnFileSelect;
  selectedFiles?: IFile[];
  callerSource: CallerSource;
  maxFiles?: number;
  maxFilesSize?: number;
  libraryCategories?: ILibraryCategories[];
  showFooter?: boolean;
  isSingleSelect?: boolean;
}

export interface ILibraryData {
  id: LibraryType;
  label: string;
  type: string;
  order: number;
  show: boolean;
  showMangeFolder: boolean;
  showAllFoldersDropdown: boolean;
  uploadNewButton: {
    show: boolean;
    disabled: boolean;
  };
  showDeleteButton: boolean;
}

export interface IRestricted {
  view: boolean;
  delete: boolean;
  update: boolean;
}

export interface IFileLibraryState {
  library: {
    data: ILibraryData[];
    selected: LibraryType | null;
    showManageFolderModal: boolean;
  };
  isLoading: boolean;
  filesData: IFileResponse | null;
  selectedFiles: IFile[];
  callerSource: CallerSource;
  onFilesSelect: IOnFileSelect | null;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  maxFiles: number;
  maxFilesSize: number;
  searchText: string;
  sortFilter: IOption;
  selectedFolder: string;
  refreshGridCount: number;
  viewRestricted: boolean;
  disableFiles: boolean;
  showFooter?: boolean;
  isSingleSelect?: boolean;
}
export interface IFile {
  Id: string;
  Name: string;
  Path: string;
  Size: number;
  Extension: string;
  Tag?: string;
  ContentType?: string;
  DownloadableURL: string;
  FileType?: string;
  ModifiedOn?: string;
  LastModifiedOn?: string;
  disabled?: boolean;
}

export interface IFolder {
  Name: string;
  Path: string;
  Key?: string;
  Value?: string;
  Size?: number;
  Tag?: string;
  NewName?: string;
}

export interface IFileLibraryStore extends IFileLibraryState {
  initializeStore: (data: IFileLibrary) => void;
  setLibrarySelected: (libraryType: LibraryType) => void;
  setShowManageFolderModal: (show: boolean) => void;
  setSelectedFiles: (files: IFile[]) => void;
  setDisabledFiles: (disabled: boolean) => void;
  setSearchText: (searchText: string) => void;
  setSortFilter: (sortFilter: IOption) => void;
  setIsLoading: (isLoading: boolean) => void;
  setFilesData: (filesData: IFileResponse) => void;
  setSelectedFolder: (selectedFolder: string) => void;
  refreshGrid: () => void;
  applyRestriction: (restricted: IRestricted) => void;
  removeFile: (id: string) => void;
  resetStore: () => void;
}

export interface IIcon {
  width?: string;
  height?: string;
  color?: string;
}

export interface IFileResponse {
  AllowedFileExtensions?: string[];
  AllowedFileSize?: number;
  BlockedFileExtensions?: string;
  Files: IFile[];
  Folders: IFolder[];
  TotalCount?: number;
  Message?: string;
  Status?: string;
}

export interface IResponse {
  Message: string;
  Status: 'Success' | 'Failure';
}

export interface IFilesFromAPI {
  folderName: string;
  libraryType: LibraryType | null;
  searchText: string;
  sortBy: string;
  callerSource: CallerSource;
  pageIndex?: number;
}
export interface IFileUploadResponse {
  Status: string;
  description: string | null;
  relativeFilePath: string;
  s3FilePath: string;
  uploadedFile: string;
  Message?: string;
}

export interface IUploadHandler {
  onUploadStart?: (file: File, fileId: string) => Promise<void> | void;
  onUploadComplete?: (response: IFileUploadResponse, fileId: string) => Promise<void> | void;
  onUploadError?: (message: string, fileId: string) => Promise<void> | void;
}
