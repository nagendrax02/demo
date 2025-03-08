import { trackError } from 'common/utils/experience/utils/track-error';
import React, { lazy, useState } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import styles from '../add-new-tab.module.css';
import { Variant } from 'common/types';
import useAddNewTab from '../add-new-tab-store';
import { IHandleManageTabs } from '../../../../types/entitytabs.types';
import useEntityTabsStore from '../../../../store';
import { useNotification } from '@lsq/nextgen-preact/notification';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IFooter {
  closeModal: () => void;
  handleManageTab: IHandleManageTabs;
}
const Footer = ({ closeModal, handleManageTab }: IFooter): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const { tabName, events, isDefault, setError } = useAddNewTab();
  const tabConfig = useEntityTabsStore((state) => state.tabConfig) || [];
  const { showAlert } = useNotification();

  const handleSave = async (): Promise<void> => {
    try {
      const module = await import('../utils/handle-save');
      await module?.handleTabAddition({
        tabConfig,
        closeModal,
        handleManageTab,
        setError,
        setIsLoading,
        showAlert,
        newTab: {
          isDefault,
          activities: events?.map((event) => event?.value),
          tabName
        }
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
          dataTestId="add-new-tab-cancel"
        />

        <Button
          text="Save"
          onClick={(): void => {
            handleSave();
          }}
          disabled={isLoading}
          variant={Variant.Primary}
          isLoading={isLoading}
          dataTestId="add-new-tab-save"
        />
      </div>
    </Modal.Footer>
  );
};

export default React.memo(Footer);
