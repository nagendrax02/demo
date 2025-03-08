import { trackError } from 'common/utils/experience/utils/track-error';
import { useState, lazy } from 'react';
import { IHandleManageTabs } from 'common/component-lib/entity-tabs/types/entitytabs.types';
import Modal from '@lsq/nextgen-preact/modal';
import { Variant } from 'common/types';
import styles from '../manage-tabs.module.css';
import { useNotification } from '@lsq/nextgen-preact/notification';
import useManageTabs from '../manage-tab.store';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IFooter {
  closeModal: () => void;
  handleManageTab: IHandleManageTabs;
}

const Footer = ({ closeModal, handleManageTab }: IFooter): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const sortedTabConfig = useManageTabs((state) => state.sortedTabConfig);
  const defaultTabId = useManageTabs((state) => state.defaultTabId);

  const { showAlert } = useNotification();

  const handleSave = async (): Promise<void> => {
    try {
      const module = await import('../utils/handleSave');
      await module?.handleSave({
        closeModal,
        handleManageTab,
        setIsLoading,
        showAlert,
        sortedTabConfig,
        defaultTabId
      });
    } catch (error) {
      trackError(error);
    }
  };
  return (
    <Modal.Footer>
      <div className={styles.footer}>
        <Button
          text="Cancel"
          onClick={(): void => {
            closeModal();
          }}
          disabled={isLoading}
          variant={Variant.Secondary}
          customStyleClass={styles.button}
          dataTestId="manage-tab-cancel"
        />

        <Button
          text="Save"
          onClick={(): void => {
            handleSave();
          }}
          disabled={isLoading}
          variant={Variant.Primary}
          isLoading={isLoading}
          customStyleClass={styles.button}
          dataTestId="manage-tab-save"
        />
      </div>
    </Modal.Footer>
  );
};

export default Footer;
