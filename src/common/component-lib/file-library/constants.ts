import { ILibraryData, LibraryType } from './file-library.types';

export const LIBRARY_DATA: ILibraryData[] = [
  {
    id: LibraryType.Documents,
    label: 'Documents',
    type: 'Document',
    order: 100,
    show: true,
    showMangeFolder: true,
    showAllFoldersDropdown: true,
    uploadNewButton: {
      show: true,
      disabled: false
    },
    showDeleteButton: true
  },
  {
    id: LibraryType.Images,
    label: 'Images',
    type: 'Image',
    order: 200,
    show: true,
    showMangeFolder: true,
    showAllFoldersDropdown: true,
    uploadNewButton: {
      show: true,
      disabled: false
    },
    showDeleteButton: true
  }
];

export const SORT_FILTER_OPTION = [
  {
    label: 'Recent',
    value: 'recent'
  },
  {
    label: 'Sort',
    value: 'ascending',
    text: '(A-Z)'
  },
  {
    label: 'Sort',
    value: 'descending',
    text: '(Z-A)'
  },
  {
    label: 'Size',
    value: 'sizeAscending',
    text: '(Ascending)'
  },
  { label: 'Size', value: 'sizeDescending', text: '(Descending)' }
];

export const DEFAULT_PAGE_SIZE = 100;

export const EXTENSIONS_GROUP = {
  images: ['png', 'jpg', 'jpeg', 'gif', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'svg'],
  others: 'others'
};

export const MAX_FILE_SIZE_ALLOWED = 1048576;
