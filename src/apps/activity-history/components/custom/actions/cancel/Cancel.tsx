import { trackError } from 'common/utils/experience/utils/track-error';
import Modal from '@lsq/nextgen-preact/modal';
import { Variant } from 'common/types';
import styles from '../actions.module.css';
import { useRef, useState, lazy } from 'react';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { ICancelResponse, OperationStatus } from './cancel.types';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));
const TextArea = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/text-area')));

export interface ICancel {
  entityId: string;
  show: boolean;
  callerSource: CallerSource;
  onSuccess: () => void;
  setShowModal: (key: string, val: boolean, callerSource: CallerSource) => void;
}

const Cancel = ({
  entityId,
  show,
  setShowModal,
  callerSource,
  onSuccess
}: ICancel): JSX.Element => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState({
    message: 'Required Field',
    show: false
  });

  const { showAlert } = useNotification();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
    setError({ show: false, message: '' });
  };

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    try {
      if (!message) {
        setError({ show: true, message: 'Required Field' });
        textAreaRef.current?.focus();
        setLoading(false);
        return;
      }

      const path = `${API_ROUTES.salesActivityCancel}${entityId}`;

      const response = (await httpPost({
        path,
        module: Module.Platform,
        body: {
          ActivityEventNote: message
        },
        callerSource: callerSource
      })) as ICancelResponse;

      if (response.Status === OperationStatus.ERROR) {
        showAlert({
          type: Type.ERROR,
          message: ERROR_MSG.generic
        });
      }
      if (response.Status === OperationStatus.SUCCESS) {
        updateLeadAndLeadTabs();
        showAlert({
          type: Type.SUCCESS,
          message: 'Sales Activity cancelled successfully'
        });
      }
      setLoading(true);
      setShowModal('cancel', false, CallerSource.NA);
      onSuccess();
    } catch (ex) {
      trackError(ex);
      showAlert({
        type: Type.ERROR,
        message: ERROR_MSG.generic
      });
    }
  };

  return (
    <Modal show={show} customStyleClass={styles.cancel_modal}>
      <Modal.Header
        title="Cancel Sales Activity"
        onClose={() => {
          setShowModal('cancel', false, CallerSource.NA);
        }}
      />
      <Modal.Body customStyleClass={styles.custom_body_container}>
        <div>
          <div className={styles.title}>Cancellation Notes</div>
          <TextArea
            handleMessageChange={handleMessageChange}
            message={message}
            placeholder="Enter notes"
            innerRef={textAreaRef}
            maxLength={200}
            focusOnMount
            error={error.show}
          />
          <div className={styles.cancel_error_style}>{error?.show ? error?.message : null}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <>
          <Button
            text="Save"
            onClick={handleSave}
            variant={Variant.Primary}
            isLoading={loading}
            disabled={loading}
          />
          <Button
            text="Cancel"
            onClick={(): void => {
              setShowModal('cancel', false, CallerSource.NA);
            }}
            variant={Variant.Secondary}
          />
        </>
      </Modal.Footer>
    </Modal>
  );
};

export default Cancel;
