import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from './styles.module.css';
import AudioPlayer from '../audio-player';
import { IAssociatedEntityDetails } from 'apps/entity-details/types/entity-data.types';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from 'common/types';
import useMediaStore from '../media-modal/media.store';
import { shouldEnableDownload } from '../audio-player/utils';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const ToolTip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface IMediaLink {
  fileURL: string;
  associatedEntityDetails?: IAssociatedEntityDetails;
}

const MediaLink = ({ fileURL, associatedEntityDetails }: IMediaLink): JSX.Element | null => {
  const { setModalContent: setDragDropModalContent, setInitialPosition } = useMediaStore();
  const enableDownload = shouldEnableDownload(fileURL, true);

  const getCallDescription = (details?: IAssociatedEntityDetails): string => {
    return `Call with ${
      details?.entityPhoneNumber ?? details?.entityFirstName ?? details?.entityEmail ?? ''
    }`;
  };

  const onPlayClick = (): void => {
    const content = (
      <div className={styles.modal}>
        <div className={styles.modal_header}>
          <span>{getCallDescription(associatedEntityDetails)}</span>
          <button
            className={styles.close_button}
            onClick={(event) => {
              event.stopPropagation();
              setDragDropModalContent(null);
            }}>
            <Icon name="close" variant={IconVariant.Filled} />
          </button>
        </div>
        <div className={styles.modal_body}>
          <AudioPlayer fileURL={fileURL} enableDownload={enableDownload} />
        </div>
      </div>
    );

    setDragDropModalContent(content);
  };

  return (
    <div className={styles.media_link}>
      <ToolTip
        content="Play"
        placement={Placement.Vertical}
        trigger={[Trigger.Hover]}
        theme={Theme.Dark}>
        <div
          className={styles.icon}
          data-testid="play_icon"
          onClick={(e) => {
            e.stopPropagation();
            setInitialPosition((window.innerWidth - 350) / 2, 40); //modal width = 350px. To keep the modal in center initially impleamented this logic.
            onPlayClick();
          }}>
          <Icon name="play_circle" variant={IconVariant.Outlined} />
        </div>
      </ToolTip>

      <ToolTip
        content="Download"
        placement={Placement.Vertical}
        trigger={[Trigger.Hover]}
        theme={Theme.Dark}>
        <a
          href={fileURL}
          download
          target="_blank"
          rel="noopener"
          className={`${styles.icon} ${!enableDownload ? styles.disabled : ''}`}
          data-testid="download_icon"
          onClick={(e) => {
            if (!enableDownload) {
              e.preventDefault();
            }
            e.stopPropagation();
          }}>
          <Icon name="download" variant={IconVariant.Filled} />
        </a>
      </ToolTip>
    </div>
  );
};

export default MediaLink;
