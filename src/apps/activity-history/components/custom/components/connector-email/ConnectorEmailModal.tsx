import Modal from '@lsq/nextgen-preact/modal';
import { Variant } from 'common/types';
import EmailModalBody from './EmailModalBody';
import styles from './connector-email.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IConnectorEmailModal {
  show: boolean;
  setShow: (value: React.SetStateAction<boolean>) => void;
  activityName: string;
  createdByName: string;
  eventNoteRecord: {
    [key: string]: string;
  } | null;
  isConnectorEmailOnS3: boolean;
}

const ConnectorEmailModal = (props: IConnectorEmailModal): JSX.Element => {
  const { show, setShow, activityName, createdByName, eventNoteRecord, isConnectorEmailOnS3 } =
    props;

  const closeModal = (): void => {
    setShow(false);
  };

  return (
    <Modal show={show}>
      <Modal.Header title={`${activityName} added by ${createdByName}`} onClose={closeModal} />
      <Modal.Body customStyleClass={styles.modal_body}>
        <EmailModalBody
          eventNoteRecord={eventNoteRecord}
          isConnectorEmailOnS3={isConnectorEmailOnS3}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant={Variant.Secondary} text={'Close'} onClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

export default ConnectorEmailModal;
