/* eslint-disable max-lines-per-function */
import { useEffect } from 'react';
import useUploadStore from './upload.store';
import { FileError, IFile, IUploadUtils, IGetValidationFiles, ISelectedFile } from './upload.types';
import { isFileCountBelowMaxLimit, validateFile } from './utils';

const handleError = ({
  err,
  file,
  fileError,
  setFileError
}: {
  err: Error;
  file: File;
  fileError: Partial<Record<FileError, string[]>>;
  setFileError: (newError: Partial<Record<FileError, string[]>>) => void;
}): void => {
  const tempError = { ...fileError };
  if (tempError?.[err.message]?.length) {
    tempError?.[err.message]?.push(file?.name);
  } else {
    tempError[err.message] = [file.name];
  }
  setFileError(tempError);
};

const handleFileValidation = ({
  newFiles,
  allFiles,
  maxSizeInMB,
  restrictedFormats,
  maxFileCount,
  fileError,
  setFileError
}: {
  newFiles: FileList;
  allFiles: Record<string, IFile>;
  maxSizeInMB?: number;
  restrictedFormats?: string[];
  maxFileCount?: number;
  fileError: Partial<Record<FileError, string[]>>;
  setFileError: (newError: Partial<Record<FileError, string[]>>) => void;
}): Record<string, IFile> => {
  const validatedFiles = {};
  if (isFileCountBelowMaxLimit(newFiles, allFiles, maxFileCount)) {
    Object.values(newFiles).forEach((newFile) => {
      try {
        validateFile(newFile, maxSizeInMB, restrictedFormats);
        validatedFiles[newFile.name] = { info: newFile };
      } catch (err) {
        handleError({ err: err as Error, file: newFile, fileError, setFileError });
      }
    });
  } else {
    handleError({
      err: new Error(FileError.FileCountExceeded),
      file: new File(['allFiles'], 'allFiles'),
      fileError,
      setFileError
    });
  }
  return validatedFiles;
};

const getAugmentedSelectedFiles = (selectedFiles: ISelectedFile[]): Record<string, IFile> => {
  const augmentedSelectedFiles: Record<string, IFile> = {};
  selectedFiles?.forEach((file) => {
    augmentedSelectedFiles[file.name] = {
      info: new File([''], file.name)
    };
  });
  return augmentedSelectedFiles;
};

const useUploadUtils = (selectedFiles?: ISelectedFile[]): IUploadUtils => {
  const { files, setFiles, fileError, setFileError } = useUploadStore();

  useEffect(() => {
    if (selectedFiles?.length) {
      const augmentedSelectedFiles = getAugmentedSelectedFiles(selectedFiles);
      setFiles({ ...augmentedSelectedFiles });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearError = (): void => {
    setFileError({});
  };

  const logError = (err: Error, file: File): void => {
    const tempError = { ...fileError };
    if (tempError?.[err.message]?.length) {
      tempError?.[err.message]?.push(file?.name);
    } else {
      tempError[err.message] = [file.name];
    }
    setFileError(tempError);
  };

  const getValidatedFiles = ({
    newFiles,
    allFiles,
    maxSizeInMB,
    restrictedFormats,
    maxFileCount
  }: IGetValidationFiles): Record<string, IFile> => {
    return handleFileValidation({
      newFiles,
      allFiles,
      maxSizeInMB,
      restrictedFormats,
      maxFileCount,
      fileError,
      setFileError
    });
  };

  const deleteFile = (fileName: string): void => {
    const tempFiles = { ...files };
    delete tempFiles?.[fileName];
    setFiles(tempFiles);
  };

  return { getValidatedFiles, deleteFile, clearError, logError };
};

export default useUploadUtils;
