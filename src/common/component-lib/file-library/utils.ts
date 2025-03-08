import { IFile } from './file-library.types';

const getRoundedFileSize = (fileSize: number): number => {
  return Math.round(fileSize * 100) / 100 || 0;
};

export const getFileSize = (fileSize: number): string => {
  const fileSizeInKB = fileSize / 1024;
  if (fileSizeInKB > 1024) {
    return `${getRoundedFileSize(fileSizeInKB / 1024)} MB`;
  } else {
    return `${getRoundedFileSize(fileSizeInKB)} KB`;
  }
};

export const calculateFilesSize = (files: IFile[], convertToMB?: boolean): number => {
  if (!files) {
    return 0;
  }
  let fileSize = 0;
  for (const file of files) {
    if (file?.Path && file?.Name) {
      fileSize += file.Size;
    }
  }
  fileSize = fileSize / 1024;
  if (convertToMB) {
    fileSize = fileSize / 1024;
  }
  return fileSize;
};

export const getFilesSize = (files: IFile[]): string => {
  const sizeOfFiles = calculateFilesSize(files);
  if (sizeOfFiles > 1024) {
    return `${getRoundedFileSize(sizeOfFiles / 1024)} MB`;
  } else {
    return `${getRoundedFileSize(sizeOfFiles)} KB`;
  }
};
