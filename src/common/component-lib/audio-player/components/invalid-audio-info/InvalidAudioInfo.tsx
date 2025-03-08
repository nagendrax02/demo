import { useState } from 'react';
import InvalidAudioURL from '../InvalidAudioURL';
import InvalidAudioInfoModal from './components/invalid-audio-info-modal';
import styles from './invalid-audio-info.module.css';
const InvalidAudioInfo = (): JSX.Element => {
  const [showInvalidAudioModal, setShowInvalidAudioModal] = useState(false);
  const handleLearnMoreClick = (): void => {
    setShowInvalidAudioModal(true);
  };
  return (
    <div className={styles.invalid_audio_download_wrapper}>
      {showInvalidAudioModal ? (
        <InvalidAudioInfoModal
          show={showInvalidAudioModal}
          onClose={() => {
            setShowInvalidAudioModal(false);
          }}
        />
      ) : null}
      <InvalidAudioURL />
      <button className="learn-more" onClick={handleLearnMoreClick}>
        Learn more
      </button>
    </div>
  );
};
export default InvalidAudioInfo;
