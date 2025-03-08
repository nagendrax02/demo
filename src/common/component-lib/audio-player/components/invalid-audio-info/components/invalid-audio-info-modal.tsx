import Modal from '@lsq/nextgen-preact/modal';
import styles from '../invalid-audio-info.module.css';
import { audioIssues } from '../constants';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const InvalidAudioInfoModal = ({
  show,
  onClose
}: {
  show: boolean;
  onClose: () => void;
}): JSX.Element => {
  return (
    <Modal show={show} customStyleClass={styles.modal}>
      <Modal.Header
        title="Unable to Play the Call Recording"
        description="One of the five reasons could be why the audio is not playing"
        onClose={onClose}
        customStyleClass={styles.issue_info_modal_header}
      />
      <Modal.Body>
        <div className={styles.audio_issues_container}>
          {audioIssues.map((issue, index) => (
            <div key={issue.title} className={styles.issue_wrapper}>
              <div className={styles.issue_serial_number}>{index + 1}.</div>
              <div className={styles.issue_content}>
                <span className={styles.issue_title}>{issue.title}:</span>
                {issue.description}
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button text="Close" onClick={onClose} customStyleClass="invalid-audio-info-modal-button" />
      </Modal.Footer>
    </Modal>
  );
};
export default InvalidAudioInfoModal;
