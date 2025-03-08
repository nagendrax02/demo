import { downloadFiles } from 'common/utils/files';
import Button from '../../button';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from '../file-preview.module.css';
import { IPreviewData } from '../file-preview.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { getDownloadData } from '../utils';
import { useState } from 'react';

const PreviewError = ({ previewData }: { previewData: IPreviewData }): JSX.Element => {
  const { showAlert } = useNotification();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (): Promise<void> => {
    setIsDownloading(true);
    await downloadFiles(getDownloadData(previewData), showAlert);
    setIsDownloading(false);
  };

  return (
    <div className={styles.preview_error}>
      <Icon name="info" variant={IconVariant.Outlined} customStyleClass={styles.error_icon} />
      <div className={styles.error_title}>No Preview Available</div>
      <div className={styles.error_description}>
        Preview for this file is not supported. Please download the file to view.
      </div>
      <div className={styles.error_download_wrapper}>
        <Button
          icon={
            <Icon
              name="download_2"
              variant={IconVariant.Filled}
              customStyleClass={styles.error_download_icon}
            />
          }
          text="Download"
          onClick={handleDownload}
          customStyleClass={styles.error_download_button}
          isLoading={isDownloading}
        />
      </div>
    </div>
  );
};

export default PreviewError;
