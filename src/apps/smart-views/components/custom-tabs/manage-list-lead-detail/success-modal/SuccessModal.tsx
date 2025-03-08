import SuccessMessage from 'common/component-lib/success-message';
import Modal from '@lsq/nextgen-preact/modal';
import styles from './success-modal.module.css';
import { Variant } from 'common/types';
import Button from 'common/component-lib/button';

const SuccessModal = ({
  handleClose,
  title,
  message,
  description,
  subDescription
}: {
  handleClose: () => void;
  title: string;
  message: string;
  description?: string;
  subDescription?: JSX.Element | string;
}): JSX.Element => {
  return (
    <Modal show customStyleClass={styles.success_modal}>
      <Modal.Header
        title={title}
        onClose={(): void => {
          handleClose();
        }}
      />
      <Modal.Body customStyleClass={styles.body}>
        <SuccessMessage
          message={message}
          description={description}
          subDescription={subDescription}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.footer}>
          <Button
            customStyleClass={styles.btn}
            text="OK"
            onClick={(): void => {
              handleClose();
            }}
            variant={Variant.Secondary}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

SuccessModal.defaultProps = {
  description: undefined,
  subDescription: undefined
};

export default SuccessModal;
