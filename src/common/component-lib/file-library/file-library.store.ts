import { create } from 'zustand';
import {
  IFileResponse,
  IFileLibraryState,
  IFileLibraryStore,
  IFileLibrary,
  LibraryType,
  IRestricted,
  ILibraryCategories,
  ILibraryData,
  IFile
} from './file-library.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { LIBRARY_DATA } from './constants';
import { DEFAULT_SORT_OPTION } from './default-sort-option';
import { CallerSource } from 'common/utils/rest-client';

const initialState: IFileLibraryState = {
  library: {
    data: LIBRARY_DATA,
    selected: null,
    showManageFolderModal: false
  },
  isLoading: true,
  filesData: null,
  selectedFiles: [],
  onFilesSelect: null,
  setShow: () => {},
  maxFiles: 5,
  maxFilesSize: 1024 * 10,
  searchText: '',
  sortFilter: DEFAULT_SORT_OPTION,
  selectedFolder: '',
  refreshGridCount: 0,
  viewRestricted: false,
  disableFiles: false,
  showFooter: true,
  isSingleSelect: false,
  callerSource: CallerSource.NA
};

// eslint-disable-next-line max-lines-per-function
const useFileLibraryStore = create<IFileLibraryStore>((set) => ({
  ...initialState,
  initializeStore: (data: IFileLibrary): void => {
    set((state) => {
      const findCategory = (category: ILibraryCategories, libraryConfig: ILibraryData): boolean =>
        category.type === libraryConfig.id;

      let selected = state.library.selected || LIBRARY_DATA[0].id;
      data.libraryCategories?.forEach((category) => {
        if (category.show) selected = category.type;
      });

      const updatedLibraryData = state.library.data.map((libraryConfig) => {
        const foundCategory = data.libraryCategories?.find((category) =>
          findCategory(category, libraryConfig)
        );
        const show = foundCategory?.show ?? true;
        return {
          ...libraryConfig,
          show
        };
      });

      return {
        ...state,
        ...data,
        library: {
          ...state.library,
          data: updatedLibraryData,
          selected: selected
        }
      };
    });
  },
  setLibrarySelected: (libraryType: LibraryType): void => {
    set((state) => ({
      library: { ...state.library, selected: libraryType }
    }));
  },
  setShowManageFolderModal: (show: boolean): void => {
    set((state) => ({
      library: { ...state.library, showManageFolderModal: show }
    }));
  },
  setSelectedFiles: (files: IFile[]): void => {
    set((state) => {
      const updatedLibraryData = state.library.data.map((libraryConfig) => {
        return {
          ...libraryConfig,
          uploadNewButton: {
            ...libraryConfig.uploadNewButton,
            disabled: files.length ? true : false
          }
        };
      });

      return { library: { ...state.library, data: updatedLibraryData }, selectedFiles: files };
    });
  },
  setDisabledFiles: (disabled: boolean): void => {
    set(() => ({
      disableFiles: disabled
    }));
  },
  setSearchText: (searchText: string): void => {
    set(() => ({
      searchText
    }));
  },
  setSortFilter: (sortFilter: IOption): void => {
    set(() => ({
      sortFilter
    }));
  },
  setIsLoading: (isLoading: boolean): void => {
    set(() => ({
      isLoading
    }));
  },
  setFilesData: (filesData: IFileResponse): void => {
    set(() => ({
      filesData
    }));
  },
  setSelectedFolder: (selectedFolder: string): void => {
    set(() => ({
      selectedFolder
    }));
  },
  refreshGrid: (): void => {
    set((state) => ({
      refreshGridCount: state.refreshGridCount + 1
    }));
  },
  applyRestriction: (restricted: IRestricted): void => {
    set((state) => {
      const updatedLibraryData = state.library.data.map((libraryConfig) => {
        return {
          ...libraryConfig,
          uploadNewButton: {
            ...libraryConfig.uploadNewButton,
            show: !restricted.update
          },
          showDeleteButton: !restricted.delete
        };
      });

      return {
        ...state,
        viewRestricted: restricted.view,
        library: {
          ...state.library,
          data: updatedLibraryData
        }
      };
    });
  },
  removeFile: (id: string): void => {
    set((state) => {
      const filteredFiles = state.filesData?.Files.filter((file) => {
        return file.Id !== id;
      });
      const clonedFilesData = state.filesData ? { ...state.filesData } : { Files: [], Folders: [] };
      return {
        filesData: { ...clonedFilesData, Files: filteredFiles as IFile[] }
      };
    });
  },
  resetStore: (): void => {
    set(() => ({
      ...initialState
    }));
  }
}));

export default useFileLibraryStore;
