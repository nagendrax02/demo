import { IFileInfo } from 'common/utils/files';
import { fileExtensions } from './constants';
import { IPreviewData } from './file-preview.types';

const getFileType = (data: IPreviewData): string | undefined => {
  let fileType: string | undefined = undefined;
  Object.keys(fileExtensions).forEach((type) => {
    const index = fileExtensions[type].findIndex(
      (ext: string) => data?.previewUrl?.includes(ext)
    ) as number;
    if (index > -1) {
      fileType = type;
    }
  });
  return fileType;
};

const removeFileExtension = (filename: string): string => {
  return filename?.replace(/\.[^/.]+$/, '');
};

const getDownloadData = (previewData: IPreviewData): IFileInfo => {
  return {
    Files: [
      {
        FileUrl: previewData?.previewUrl,
        FileName: removeFileExtension(previewData?.name)
      }
    ],
    ZipFolderName: ''
  };
};

export { getFileType, getDownloadData };
