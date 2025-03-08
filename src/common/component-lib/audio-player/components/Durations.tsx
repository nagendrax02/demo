import { IDurations } from '../audio-player.types';
import styles from './styles.module.css';

const Durations = ({ currentTime, duration, disabled }: IDurations): JSX.Element => {
  return (
    <div className={`${styles.audio_durations} ${disabled ? styles.invalid_audio : ''}`}>
      <span className="current-time">
        {currentTime.minutes < 10 ? `0${currentTime.minutes}` : currentTime.minutes}:
        {currentTime.seconds < 10 ? `0${currentTime.seconds}` : currentTime.seconds}
      </span>
      <span>/</span>
      <span className="duration">
        {duration.minutes < 10 ? `0${duration.minutes}` : duration.minutes}:
        {duration.seconds < 10 ? `0${duration.seconds}` : duration.seconds}
      </span>
    </div>
  );
};

export default Durations;
