import { DEFAULT_FILE_SIZE_LIMIT } from './constants';
import { FileError, IFile } from './upload.types';

const getFileExtension = (fileName: string): string | undefined => {
  return fileName.split('.').pop();
};

const isFileNameOnlySpecialCharacters = (fileName: string): void => {
  // eslint-disable-next-line no-useless-escape
  const fileInfo = fileName.split(/\#|\?/)[0].split('.');
  fileInfo.pop();
  const onlyFileName = fileInfo.join('.');
  const onlyCharReg = /^[^a-zA-Z0-9]+$/;
  if (onlyCharReg.test(onlyFileName)) {
    throw new Error(FileError.FileNameOnlySpecialCharacters);
  }
};

const isFileExtensionValid = (file: File, blockedExtensions?: string[]): void => {
  const ext = getFileExtension(file.name);
  if (blockedExtensions && ext && blockedExtensions?.includes(ext)) {
    throw new Error(FileError.FileFormatInvalid);
  }
};

const isFileSizeBelowMaxLimit = (file: File, maxLimit?: number): void => {
  if (file?.size > (maxLimit ? maxLimit : DEFAULT_FILE_SIZE_LIMIT) * 1024 * 1024) {
    throw new Error(FileError.FileSizeExceeded);
  }
};

const isFileSizeZero = (file: File): void => {
  if (file?.size === 0) {
    throw new Error(FileError.FileSizeZero);
  }
};

const isFileCountBelowMaxLimit = (
  newFiles: FileList,
  allFiles: Record<string, IFile>,
  maxFileCount?: number
): boolean => {
  if (maxFileCount) {
    const newFilesCount = Object.values(newFiles).length || 0;
    const allFilesCount = Object.values(allFiles).length || 0;
    return newFilesCount + allFilesCount <= maxFileCount;
  }

  return true;
};

const validateFile = (file: File, maxLimit?: number, blockedExtensions?: string[]): void => {
  isFileSizeBelowMaxLimit(file, maxLimit);
  isFileSizeZero(file);
  isFileExtensionValid(file, blockedExtensions || undefined);
  isFileNameOnlySpecialCharacters(file?.name);
};

export { validateFile, isFileCountBelowMaxLimit, getFileExtension };
