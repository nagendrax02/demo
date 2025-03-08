import { trackError } from 'common/utils/experience/utils/track-error';
import { IFileInfo } from './files.type';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from '../rest-client/constant';
import { FAILED_TO_FETCH } from 'common/constants';

type Alert = (notification: INotification) => void;

const getAugmentedFileName = (fileName: string, url: string): string | null => {
  if (url) {
    // eslint-disable-next-line no-useless-escape
    const urlInfo = url?.split(/\#|\?/)[0].split('.');
    const extension = urlInfo?.pop()?.trim();
    return `${fileName}.${extension}`;
  }
  return null;
};

export const download = async (url: string): Promise<Blob> => {
  const response = await fetch(url, {
    cache: 'no-cache'
  });
  return response.blob();
};

const singleFileDownload = async (data: IFileInfo, alert: Alert): Promise<void> => {
  const fileName = getAugmentedFileName(data.Files[0].FileName, data.Files[0].FileUrl);
  if (!fileName) {
    return;
  }
  try {
    const response = await fetch(data.Files[0].FileUrl, {
      cache: 'no-cache'
    });
    if (!response.ok) throw new Error('Download error');
    const fileBlob = await response.blob();
    import('file-saver')
      .then((fileSaver) => {
        fileSaver.default.saveAs(fileBlob, fileName);
      })
      .catch((importError) => {
        trackError(importError);
      });
    alert({ message: 'Download completed successfully', type: Type.SUCCESS });
  } catch (error) {
    if (error?.message === FAILED_TO_FETCH && data?.Files?.[0]?.FileUrl) {
      window.open(data?.Files?.[0]?.FileUrl, '_blank');
      return;
    }
    alert({
      message: ERROR_MSG.generic,
      type: Type.ERROR
    });
  }
};

export const exportZip = (blobs: Blob[], data: IFileInfo, alert: Alert): void => {
  import('jszip').then((module) => {
    const zip = module.default();
    const filesMap: Record<string, number> = {};
    blobs.forEach((blob, i: number) => {
      let fileName = data.Files[i].FileName;
      if (filesMap[fileName]) {
        filesMap[fileName] = filesMap[fileName] + 1;
        fileName = fileName + '-' + filesMap[fileName];
      } else filesMap[fileName] = 1;
      const augmentedFileName = `${getAugmentedFileName(fileName, data.Files[i].FileUrl)}`;
      zip.file(augmentedFileName, blob);
    });
    zip
      .generateAsync({ type: 'blob' })
      .then((zipFile) => {
        alert({
          message: 'Download completed successfully',
          type: Type.SUCCESS
        });
        import('file-saver')
          .then((fileSaver) => {
            fileSaver.default.saveAs(zipFile, `${data.ZipFolderName}.zip`);
          })
          .catch((importError) => {
            trackError(importError);
          });
        return true;
      })
      .catch((exception) => {
        alert({
          message: ERROR_MSG.generic,
          type: Type.ERROR
        });
        console.log(exception);
      });
  });
};

const multipleFilesDownload = async (data: IFileInfo, alert: Alert): Promise<void> => {
  Promise.all(
    data.Files.map((file) => {
      return download(file.FileUrl);
    })
  )
    .then((fileBlobs) => {
      exportZip(fileBlobs, data, alert);
    })
    .catch((error) => {
      alert({
        message: ERROR_MSG.generic,
        type: Type.ERROR
      });
      trackError(error);
    });
};

const downloadFiles = async (data: IFileInfo, alert: Alert): Promise<void> => {
  try {
    if (data.Files && data.Files.length === 1) {
      await singleFileDownload(data, alert);
    } else {
      await multipleFilesDownload(data, alert);
    }
  } catch (error) {
    trackError(error);
  }
};

export { downloadFiles };
