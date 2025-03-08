import { useRef, useState } from 'react';
import styles from './video-player.module.css';

export interface IVideoPlayer {
  fileUrl: string;
  enableDownload?: boolean;
}

const VideoPlayer = (props: IVideoPlayer): JSX.Element => {
  const { fileUrl, enableDownload } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isErrorInVideo, setIsErrorInVideo] = useState(false);

  const maintainControlsList = (): string => {
    let controlsList = '';
    if (!enableDownload) {
      controlsList += 'nodownload';
    }
    return controlsList;
  };

  return (
    <>
      {!isErrorInVideo ? (
        <div className={`${styles.video_player} video-player`}>
          <video
            data-testid="video-element"
            className={styles.video_player}
            controls
            ref={videoRef}
            controlsList={maintainControlsList()}>
            <source
              data-testid="video-source"
              src={`${fileUrl}`}
              onError={() => {
                setIsErrorInVideo(true);
              }}></source>
          </video>
        </div>
      ) : (
        <div>Unable to retrieve video</div>
      )}
    </>
  );
};

VideoPlayer.defaultProps = {
  enableDownload: false,
  className: ''
};

export default VideoPlayer;
