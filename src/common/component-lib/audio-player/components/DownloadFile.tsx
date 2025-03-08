import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { IDownloadFile } from '../audio-player.types';
import styles from './styles.module.css';

const DownloadFile = ({ enableDownload, fileURL, isLink }: IDownloadFile): JSX.Element => {
  return (
    <a
      href={enableDownload ? fileURL : undefined}
      download={enableDownload}
      target={enableDownload ? '_blank' : undefined}
      rel={enableDownload ? 'noopener' : undefined}
      className={`${styles.download_audio_file} ${!enableDownload ? styles.disabled : ''}`}
      title={enableDownload ? 'Download' : 'Download Disabled'}
      onClick={(e) => {
        if (!enableDownload) {
          e.preventDefault();
        }
      }}>
      {isLink ? (
        'Download'
      ) : (
        <Icon
          name="download_2"
          variant={IconVariant.Filled}
          customStyleClass={styles.file_download_icon}
        />
      )}
    </a>
  );
};
export default DownloadFile;
