import { create } from 'zustand';
import { FileError, IFile, IUploadStore } from './upload.types';

const initialState = {
  files: {},
  fileError: {}
};

const useUploadStore = create<IUploadStore>((set) => ({
  // state
  ...initialState,

  // setState
  setFiles: (newFiles: Record<string, IFile>): void => {
    set({ files: newFiles });
  },

  setFileError: (newError: Partial<Record<FileError, string[]>>): void => {
    set({ fileError: newError });
  },

  // reset all states to initial values
  reset: (): void => {
    set({ ...initialState });
  }
}));

export default useUploadStore;
