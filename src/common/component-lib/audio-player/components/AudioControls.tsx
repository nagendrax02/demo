import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { IAudioControls } from '../audio-player.types';
import styles from '../audio-player.module.css';

const AudioControls = ({ isPlaying, handlePlay }: IAudioControls): JSX.Element => {
  return (
    <div className={styles.audio_controls}>
      <button
        onClick={handlePlay}
        type="button"
        aria-label={isPlaying ? 'Pause the audio' : 'Play the audio'}>
        <div
          className={`${styles.audio_control_icon_container} audio-control-icon-container`}
          title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <Icon name="pause" customStyleClass={styles.audio_controls_icon} />
          ) : (
            <Icon
              name="play_arrow"
              variant={IconVariant.Filled}
              customStyleClass={styles.audio_controls_icon}
            />
          )}
        </div>
      </button>
    </div>
  );
};

export default AudioControls;
