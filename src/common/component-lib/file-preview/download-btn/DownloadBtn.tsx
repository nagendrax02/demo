import { trackError } from 'common/utils/experience/utils/track-error';
import { useState } from 'react';
import styles from '../file-preview.module.css';
import Spinner from '@lsq/nextgen-preact/spinner';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { IPreviewData } from '../file-preview.types';
import { IFileInfo } from 'common/utils/files';

interface IDownloadBtnProps {
  previewData: IPreviewData;
}

const DownloadBtn = ({ previewData }: IDownloadBtnProps): JSX.Element => {
  const [downloading, setDownloading] = useState(false);
  const { showAlert } = useNotification();

  const handleDownload = async (): Promise<void> => {
    setDownloading(true);
    try {
      const fileData: IFileInfo = {
        Files: [
          { FileUrl: previewData.previewUrl, FileName: previewData.name?.split('.').shift() || '' }
        ],
        ZipFolderName: ''
      };
      import('common/utils/files').then(async ({ downloadFiles }) => {
        await downloadFiles(fileData, showAlert);
      });
    } catch (err) {
      trackError(err);
    }
    setDownloading(false);
  };
  return (
    <>
      {downloading ? (
        <Spinner customStyleClass={styles.spinner} />
      ) : (
        <>
          {previewData && !previewData.restrictDownload ? (
            <span
              data-testid="file-download-btn"
              className={styles.download_btn}
              onClick={handleDownload}>
              <Icon name="download" variant={IconVariant.Filled} />
              Download
            </span>
          ) : null}
        </>
      )}
    </>
  );
};

export default DownloadBtn;
