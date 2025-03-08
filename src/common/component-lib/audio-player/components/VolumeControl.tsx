import { trackError } from 'common/utils/experience/utils/track-error';
import { useState } from 'react';
import Icon from '@lsq/nextgen-preact/icon';
import { IVolumeControl } from '../audio-player.types';
import styles from './styles.module.css';

const VolumeControl = ({ audioRef, className, disabled }: IVolumeControl): JSX.Element => {
  const [volume, setVolume] = useState(1);

  const handleVolumeDown = (): void => {
    try {
      const audioRefCurrent = audioRef.current as HTMLAudioElement;
      if (audioRefCurrent) {
        const volumeValue = volume === 0 ? 1 : 0;
        audioRefCurrent.volume = volumeValue;
        setVolume(volumeValue);
      }
    } catch (error) {
      trackError('failed to handle volume down', error);
    }
  };

  const handleVolume = (event): void => {
    try {
      const { value } = event.target as HTMLInputElement;
      const audioRefCurrent = audioRef.current as HTMLAudioElement;
      if (audioRefCurrent) {
        const roundValue = Math.floor(Number(value)) / 100;
        audioRefCurrent.volume = roundValue;
        setVolume(roundValue);
      }
    } catch (error) {
      trackError('failed to handle volume', error);
    }
  };

  const volumeTrackStyle = (): string => {
    const trackStyling = `
        -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${volume}, rgba(var(--marvin-secondary-text))), color-stop(${volume}, rgba(var(--marvin-quaternary-text))))
      `;
    return trackStyling;
  };

  return (
    <div
      id="volume-container"
      className={`${styles.volume_container} ${disabled ? styles.invalid_audio : ''}`}>
      <div className={`${styles.volume_seek_bar_wrapper} volume-seek-bar-wrapper ${className}`}>
        <div
          className="volume-seek-bar"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}>
          <input
            type="range"
            className="volume-range"
            step="1"
            value={volume * 100}
            min={Math.round(volume)}
            max="100"
            onChange={handleVolume}
            onMouseUp={handleVolume}
            onKeyUp={handleVolume}
            style={{ background: volumeTrackStyle() }}
          />
        </div>

        <button
          className="audio-volume-btn"
          onClick={handleVolumeDown}
          type="button"
          title={volume > 0 ? 'Mute' : 'Unmute'}>
          {volume > 0 ? (
            <Icon name="volume_up" customStyleClass={styles.volume_icon} />
          ) : (
            <Icon name="volume_off" customStyleClass={styles.volume_icon} />
          )}
        </button>
      </div>
    </div>
  );
};

export default VolumeControl;
