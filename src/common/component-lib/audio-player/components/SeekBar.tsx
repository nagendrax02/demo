import { ISeekBar } from '../audio-player.types';
import styles from './styles.module.css';

const SeekBar = ({
  audioSeekTime,
  duration,
  handleSeekBar,
  startTimer,
  disabled,
  className = ''
}: ISeekBar): JSX.Element => {
  const progress = duration ? (audioSeekTime / Math.floor(duration)) * 100 : 0;

  if (disabled) {
    return (
      <div className={`${styles.audio_seek_control} ${className} audio-seek-control invalid_audio`}>
        <div className={styles.seekBarDisabled}></div>
      </div>
    );
  } else {
    return (
      <div className={`${styles.audio_seek_control} ${className} audio-seek-control`}>
        <input
          aria-label="Seek bar"
          type="range"
          step="1"
          min="0"
          className="seek-bar"
          value={audioSeekTime}
          max={duration ? Math.floor(duration) : 0}
          onInput={handleSeekBar}
          onMouseUp={() => {
            startTimer(true);
          }}
          onKeyUp={() => {
            startTimer(true);
          }}
          style={{
            backgroundSize: `${progress}% 100%`
          }}
        />
      </div>
    );
  }
};

export default SeekBar;
