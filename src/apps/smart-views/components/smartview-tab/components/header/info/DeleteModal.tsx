import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { trackError } from 'common/utils/experience/utils/track-error';
import { Variant } from 'common/types';
import styles from './info.module.css';
import { useActiveTab } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { clearSVMetadataCache } from 'apps/smart-views/utils/utils';
import { IPrimaryHeader } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

interface IDeleteModal {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  primaryHeaderConfig: IPrimaryHeader;
}

const DeleteModal = (props: IDeleteModal): JSX.Element => {
  const { show, setShow, primaryHeaderConfig } = props;
  const tabId = useActiveTab();
  const { showAlert } = useNotification();

  const handleDelete = async (): Promise<void> => {
    try {
      const isSuccessful = await primaryHeaderConfig?.onTabDelete?.(tabId);
      if (isSuccessful) {
        clearSVMetadataCache();
        showAlert({ type: Type.SUCCESS, message: 'Tab Deleted Successfully' });
      }
      setShow(false);
    } catch (error) {
      trackError(error);
    }
  };

  const getDescription = (): string => {
    return `Are you sure you want to delete ${
      primaryHeaderConfig?.title || ''
    } tab? You can not restore the tab once it is deleted.`;
  };

  return (
    <ConfirmationModal
      show={show}
      onClose={() => {
        setShow(false);
      }}
      title={'Delete Tab'}
      description={getDescription()}
      buttonConfig={[
        {
          id: 1,
          name: 'No',
          variant: Variant.Primary,
          onClick: (): void => {
            setShow(false);
          }
        },
        {
          id: 2,
          name: <span className={styles.delete}>Yes, Delete</span>,
          variant: Variant.Secondary,
          onClick: handleDelete,
          showSpinnerOnClick: true
        }
      ]}
    />
  );
};

export default DeleteModal;
