import { getFileExtension } from 'common/component-lib/upload';
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { IFileUploadResponse, LibraryType } from '../../file-library.types';

const validateFileFormat = (
  file: File,
  allowedFileFormats?: string[],
  blockedFileFormats?: string[]
): void => {
  const fileFormat = getFileExtension(file.name);
  if (
    !fileFormat ||
    (allowedFileFormats?.length && !allowedFileFormats.includes(fileFormat)) ||
    (blockedFileFormats?.length && blockedFileFormats.includes(fileFormat))
  ) {
    throw new Error('File type is not allowed');
  }
};

const validateFileSize = (file: File, maxFileSize: number): void => {
  if (file?.size > maxFileSize * 1024) {
    throw new Error(`${file.name} exceeds the file size limit of ${maxFileSize}MB`);
  }
};

const validateFile = ({
  file,
  maxFileSize,
  allowedFileFormats,
  blockedFileFormats
}: {
  file: File;
  maxFileSize: number;
  allowedFileFormats?: string[];
  blockedFileFormats?: string[];
}): void => {
  validateFileFormat(file, allowedFileFormats, blockedFileFormats);
  validateFileSize(file, maxFileSize);
};

const uploadFile = async ({
  file,
  folderName,
  callerSource,
  libraryType
}: {
  file: File;
  libraryType: LibraryType;
  folderName: string;
  callerSource: CallerSource;
}): Promise<IFileUploadResponse> => {
  const formData = new FormData();
  formData.append('uploadFiles', file);
  formData.append('fileType', libraryType);
  formData.append('folderName', folderName);

  const response = (await httpPost({
    path: API_ROUTES.uploadFile,
    module: Module.FileUpload,
    body: formData,
    callerSource
  })) as IFileUploadResponse;

  return response;
};

const convertFileFormat = (fileTypes: string[]): string => {
  return fileTypes.map((fileType) => '.' + fileType).join(', ');
};

export { validateFile, validateFileFormat, validateFileSize, uploadFile, convertFileFormat };
