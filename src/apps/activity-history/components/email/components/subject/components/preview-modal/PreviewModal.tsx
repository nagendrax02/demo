import React, { Suspense } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import { IAdditionalDetails } from 'apps/activity-history/types';
import useEmailPreview from '../../useEmailPreview';
import styles from './preview-modal.module.css';
import Button from 'src/common/component-lib/button';
import { Variant } from 'common/types';
import EmailHeader from '../email-header';
import EmailBody from '../email-body';
import Spinner from '@lsq/nextgen-preact/spinner';
import EmailAttachment from '../email-attachment';

export interface IPreviewModal {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  additionalDetails: IAdditionalDetails;
}

const PreviewModal = (props: IPreviewModal): JSX.Element | null => {
  const { show, setShow, additionalDetails } = props;
  const { augmentEmailData, isLoading } = useEmailPreview({ additionalDetails });

  const closeModal = (): void => {
    setShow(false);
  };

  return (
    <Modal show={show} customStyleClass={styles.modal}>
      <Modal.Header title={'Email Sent'} onClose={closeModal} />
      <Modal.Body customStyleClass={styles.modal_body}>
        {isLoading ? (
          <div className={styles.spinner}>
            <Spinner />
          </div>
        ) : (
          <div style={{ maxHeight: '50vh', overflow: 'scroll', padding: '20px' }}>
            <EmailHeader data={augmentEmailData} />
            <Suspense fallback={<></>}>
              <EmailAttachment attachments={augmentEmailData?.campaignAttachments} />
            </Suspense>
            <EmailBody data={augmentEmailData} />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={Variant.Secondary}
          text={'Close'}
          onClick={closeModal}
          dataTestId="close-preview-modal"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default PreviewModal;
