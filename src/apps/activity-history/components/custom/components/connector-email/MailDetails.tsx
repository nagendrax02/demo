import { useState } from 'react';
import styles from './connector-email.module.css';
import ConnectorEmailModal from './ConnectorEmailModal';

interface IMailDetails {
  activityName: string;
  createdByName: string;
  eventNoteRecord: {
    [key: string]: string;
  } | null;
  isConnectorEmail: boolean;
  isConnectorEmailOnS3: boolean;
}

const MailDetails = (props: IMailDetails): JSX.Element => {
  const { activityName, createdByName, eventNoteRecord, isConnectorEmail, isConnectorEmailOnS3 } =
    props;

  const [showModal, setShowModal] = useState(false);

  const handleOnClick = (): void => {
    setShowModal(true);
  };

  return (
    <>
      <div className={styles.more_link} onClick={handleOnClick}>
        {isConnectorEmail || isConnectorEmailOnS3 ? 'More' : `${activityName}:`}
      </div>
      {showModal ? (
        <ConnectorEmailModal
          show={showModal}
          setShow={setShowModal}
          activityName={activityName}
          createdByName={createdByName}
          eventNoteRecord={eventNoteRecord}
          isConnectorEmailOnS3={isConnectorEmailOnS3}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default MailDetails;
