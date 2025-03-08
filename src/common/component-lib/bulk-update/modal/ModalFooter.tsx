import { trackError } from 'common/utils/experience/utils/track-error';
import Modal from '@lsq/nextgen-preact/modal';
import styles from './modal.module.css';
import { Variant } from 'common/types';
import { useBulkUpdate } from '../bulk-update.store';

import { useState, lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const ModalFooter = ({
  isLoading,
  onClose,
  onSuccess
}: {
  isLoading: boolean;
  onClose: () => void;
  onSuccess: (triggerReload?: boolean) => void;
}): JSX.Element => {
  const [isSaving, setIsSaving] = useState(false);
  const isAsyncRequest = useBulkUpdate((state) => state.isAsyncRequest);
  const partialSuccess = useBulkUpdate((state) => state.partialSuccess);

  const handleSave = async (): Promise<void> => {
    try {
      setIsSaving(true);
      const saveUtil = await import('../utils/save/handleSaveClick');
      await saveUtil?.handleSaveClick(onSuccess);
    } catch (error) {
      trackError(error);
    }
    setIsSaving(false);
  };

  return (
    <Modal.Footer>
      <>
        <div className={styles.footer}>
          <Button
            text={isAsyncRequest || partialSuccess?.showCount ? 'Close' : 'Cancel'}
            onClick={(): void => {
              onClose();
            }}
            disabled={isSaving}
            variant={Variant.Secondary}
            dataTestId="bulk-update-cancel"
          />
          {isAsyncRequest || partialSuccess?.showCount ? null : (
            <Button
              text="Save"
              onClick={(): void => {
                handleSave();
              }}
              disabled={isLoading || isSaving}
              variant={Variant.Primary}
              isLoading={isSaving}
              dataTestId="bulk-update-save"
            />
          )}
        </div>
      </>
    </Modal.Footer>
  );
};

export default ModalFooter;
