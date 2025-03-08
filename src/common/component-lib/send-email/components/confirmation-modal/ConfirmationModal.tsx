import Button from '@lsq/nextgen-preact/button';
import Modal from '@lsq/nextgen-preact/modal';
import { CONSTANTS, DO_NOT_SHOW_SEND_EMAIL_CONFIRMATION_MODAL } from '../../constants';
import { Variant } from 'common/types';
import styles from './confirmation-modal.module.css';
import Checkbox from '@lsq/nextgen-preact/checkbox';
import { useState } from 'react';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { trackError } from 'common/utils/experience';
import { setItem, StorageKey } from 'common/utils/storage-manager';

const ConfirmationMaodal = ({
  setShowConfirmationModal,
  onSend,
  isLoading,
  callerSource
}: {
  setShowConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSend: (scheduledTime?: string) => Promise<void>;
  isLoading: boolean;
  callerSource: CallerSource;
}): JSX.Element => {
  const [isChecked, setIsChecked] = useState(false);

  const handleSelection = (): void => {
    setIsChecked(!isChecked);
  };

  const handleAction = async (): Promise<void> => {
    try {
      if (isChecked) {
        const response = await httpPost({
          path: API_ROUTES.cachePost,
          body: {
            key: CONSTANTS.DO_NOT_SHOW_LIST_SEND_EMAIL_CONFIRMATION,
            Value: true,
            ExpiryType: DO_NOT_SHOW_SEND_EMAIL_CONFIRMATION_MODAL.EXPIRY_TYPE,
            ExpireIn: DO_NOT_SHOW_SEND_EMAIL_CONFIRMATION_MODAL.EXPIRE_IN
          },
          module: Module.Cache,
          callerSource: callerSource
        });
        setItem(StorageKey.HideSendEmailConfirmationModal, response ?? true);
        onSend();
      } else {
        onSend();
        setShowConfirmationModal(true);
      }
    } catch (error) {
      trackError(error);
    }
  };
  return (
    <Modal show customStyleClass={styles.modal}>
      <Modal.Header
        title={CONSTANTS.EMAIL_CONFIRMATION_TITLE}
        onClose={() => {
          setShowConfirmationModal(true);
        }}
      />
      <Modal.Body>
        <div className={styles.body}>
          <div className={styles.body_description}>
            <div>{CONSTANTS.EMAIL_CONFIRMATION_DESCRIPTION}</div>
          </div>
          <div className={`${styles.checkbox_area}`}>
            <Checkbox checked={isChecked} changeSelection={handleSelection} />
            <div>{CONSTANTS.DO_NOT_SHOW_TEXT}</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.footer}>
          <Button
            text={CONSTANTS.CANCEL_REVIEW}
            variant={Variant.Secondary}
            onClick={() => {
              setShowConfirmationModal(true);
            }}
          />
          <Button
            text={CONSTANTS.YES_SEND}
            variant={Variant.Primary}
            onClick={handleAction}
            isLoading={isLoading}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationMaodal;
