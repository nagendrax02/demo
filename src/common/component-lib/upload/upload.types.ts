enum FileError {
  FileSizeExceeded = 'FileSizeExceeded',
  FileSizeZero = 'FileSizeZero',
  FileFormatInvalid = 'FileFormatInvalid',
  FileCountExceeded = 'FileCountExceeded',
  FileNameOnlySpecialCharacters = 'FileNameOnlySpecialCharacters',
  FileNameValidationFailed = 'FileNameValidationFailed'
}

interface IFile {
  info: File;
}

interface IUploadStore {
  files: Record<string, IFile>;
  setFiles: (newFiles: Record<string, IFile>) => void;
  fileError: Partial<Record<FileError, string[]>>;
  setFileError: (newError: Partial<Record<FileError, string[]>>) => void;
  reset: () => void;
}

interface IGetValidationFiles {
  newFiles: FileList;
  allFiles: Record<string, IFile>;
  maxSizeInMB?: number;
  restrictedFormats?: string[];
  maxFileCount?: number;
}

interface IUploadUtils {
  getValidatedFiles: (props: IGetValidationFiles) => Record<string, IFile>;
  deleteFile: (fileName: string) => void;
  clearError: () => void;
  logError: (err: Error, file: File) => void;
}

interface ISelectedFile {
  name: string;
}

export type { IFile, IUploadStore, IUploadUtils, IGetValidationFiles, ISelectedFile };
export { FileError };
