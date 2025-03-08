import Modal from '@lsq/nextgen-preact/modal';
import styles from './checkin-checkout.module.css';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { useCICOStore } from './checkin-checkout.store';
import { Variant } from 'common/types';
import { useEffect, useState, lazy } from 'react';
import { isMiP } from 'common/utils/helpers';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import { IHeaderInfo } from 'apps/header/header.types';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { handleCheckoutAndLogout } from './utils';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const CheckOutModal = ({ close }: { close: () => void }): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useNotification();
  const [show, setShow] = useState(false);
  let isCheckedIn = useCICOStore((state) => state.isCheckedIn);
  if (!isMiP()) {
    const headerInfo = getItem(StorageKey.HeaderInfo) as IHeaderInfo;
    isCheckedIn = headerInfo?.IsCheckedIn || false;
  }

  const isAutoCheckOutOnSignOutEnabled = getPersistedAuthConfig()?.User?.AutoCheckOutOnSignOut;

  const handleClick = async (checkout?: boolean): Promise<void> => {
    setIsLoading(true);
    handleCheckoutAndLogout({ checkout, showAlert });
    setIsLoading(false);
    setShow(false);
  };

  const handleSignedInClicked = async (): Promise<void> => {
    setShow(false);
    close();
  };

  useEffect(() => {
    if (isCheckedIn) {
      setShow(true);
    } else {
      handleClick();
    }
  }, [isCheckedIn]);

  return (
    <>
      {show ? (
        <Modal show customStyleClass={styles.checkout_modal}>
          <Modal.Header
            title={'Check-Out'}
            customStyleClass={styles.modal_header}
            onClose={() => {
              setShow(false);
              close();
            }}
          />
          <Modal.Body customStyleClass={styles.modal_body}>
            <div className={styles.description}>
              You are Checked-In. Would you like to Check-Out before Signing Out?
            </div>
          </Modal.Body>
          <Modal.Footer customStyleClass={styles.modal_footer}>
            <>
              <Button
                variant={Variant.Primary}
                onClick={() => handleClick(true)}
                text={'Check-Out & Sign Out'}
                customStyleClass={styles.check_out_button_custom_style}
                isLoading={isLoading}
                disabled={isLoading}
              />
              <Button
                customStyleClass={!isAutoCheckOutOnSignOutEnabled ? styles.signout_btn : ''}
                onClick={() =>
                  isAutoCheckOutOnSignOutEnabled ? handleSignedInClicked() : handleClick(false)
                }
                text={isAutoCheckOutOnSignOutEnabled ? 'Stay Signed In' : 'Sign Out'}
              />
            </>
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
};

export default CheckOutModal;
