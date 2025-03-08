import withSuspense from '@lsq/nextgen-preact/suspense';
import { trackError } from 'common/utils/experience/utils/track-error';
import { createPortal } from 'react-dom';
import Modal from '@lsq/nextgen-preact/modal';
import { Footer } from './components';
import SortableList, { ISortableItem } from 'common/component-lib/sortable-list';
import useSmartViewStore, {
  setAllTabIds,
  setDefaultTabId
} from 'apps/smart-views/smartviews-store';
import {
  generateSortableList,
  getUpdatedDefaultTab,
  saveDefaultTab,
  saveDeletedTabs,
  saveTabOrder
} from './utils';
import { useMemo, useRef, useState, lazy } from 'react';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import styles from './manage-tabs.module.css';
import useManageSVTabsStore, { setSortableList } from './manage-tabs.store';
import { Variant } from 'common/types';
import ManageTabShimmer from './components/ManageTabsShimmer';
import { DeleteModal, ManageModal, alertConfig } from 'apps/smart-views/components/panel/constants';
import { IManageTabsRef } from './manage-tabs.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { clearSVMetadataCache } from 'apps/smart-views/utils/utils';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface IManageTabs {
  show: boolean;
  onClose: () => void;
}

const ManageTabs = (props: IManageTabs): JSX.Element => {
  const { show, onClose } = props;
  const allTabIds = useSmartViewStore((state) => state.allTabIds);
  const rawTabData = useSmartViewStore((state) => state.rawTabData);
  const sortableList = useManageSVTabsStore((state) => state.sortableList);
  const defaultTabId = useManageSVTabsStore((state) => state.defaultTabId);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const manageTabsRef = useRef<IManageTabsRef>({
    isListOrderChanged: false,
    currentDefaultTabId: '',
    deleteTabIds: [],
    removeCallback: () => {},
    currentRemoveTabName: ''
  });
  const { showAlert } = useNotification();

  useMemo(() => {
    const sortableTabsList = generateSortableList(allTabIds, rawTabData, manageTabsRef);
    setSortableList(sortableTabsList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = async (): Promise<void> => {
    try {
      const deleteTabIds = manageTabsRef.current.deleteTabIds;
      const isListOrderChanged = manageTabsRef.current.isListOrderChanged;
      const updatedTabIds = sortableList.map((tab) => tab.id);

      // order
      if (isListOrderChanged) {
        await saveTabOrder(updatedTabIds);
      }

      // default
      const updatedDefaultTabId = getUpdatedDefaultTab(defaultTabId, deleteTabIds, allTabIds);
      const currentDefaultTabId = manageTabsRef.current.currentDefaultTabId;
      if (currentDefaultTabId !== updatedDefaultTabId) {
        await saveDefaultTab(updatedDefaultTabId);
      }

      // delete
      if (deleteTabIds?.length) {
        await saveDeletedTabs(deleteTabIds);
      }

      // updating tab order and deleting tabs from store will be taken care by below function
      setAllTabIds(updatedTabIds);
      // updating default tabId in smartviews store
      setDefaultTabId({ currentDefaultTabId, newDefaultTabId: updatedDefaultTabId });

      if (deleteTabIds.length) {
        showAlert(alertConfig.TAB_DELETE_SUCCESS);
      } else {
        showAlert(alertConfig.TAB_UPDATE_SUCCESS);
      }
      clearSVMetadataCache();
    } catch (error) {
      showAlert(alertConfig.TAB_UPDATE_FAIL);
      trackError(error);
    }
    onClose();
  };

  const handleRemove = (
    tabId: string,
    onRemove: () => void,
    item: ISortableItem<ITabResponse>
  ): void => {
    manageTabsRef.current.deleteTabIds.push(tabId);
    manageTabsRef.current.removeCallback = onRemove;
    manageTabsRef.current.currentRemoveTabName = item.config?.TabConfiguration.Title || '';
    setShowRemoveModal(true);
  };

  const handleDelete = (): void => {
    manageTabsRef.current.removeCallback();
    setShowRemoveModal(false);
  };

  const handleClose = (): void => {
    manageTabsRef.current.deleteTabIds.pop();
    setShowRemoveModal(false);
  };

  return createPortal(
    <>
      <Modal show={show}>
        <Modal.Header
          title={ManageModal.title}
          description={ManageModal.description}
          onClose={onClose}
        />
        <Modal.Body customStyleClass={styles.modal_body}>
          <SortableList
            sortableList={sortableList}
            onChange={(sortedList: ISortableItem<ITabResponse>[]) => {
              manageTabsRef.current.isListOrderChanged = true;
              setSortableList(sortedList);
            }}
            onRemove={handleRemove}
            suspenseFallback={<ManageTabShimmer />}
          />
        </Modal.Body>
        <Modal.Footer>
          <Footer onCancel={onClose} onSave={onSave} />
        </Modal.Footer>
      </Modal>
      {showRemoveModal ? (
        <ConfirmationModal
          show={showRemoveModal}
          title={DeleteModal.title}
          description={DeleteModal.description.replace(
            '{TAB_NAME}',
            manageTabsRef.current.currentRemoveTabName
          )}
          onClose={handleClose}
          buttonConfig={[
            {
              id: 1,
              name: 'No',
              variant: Variant.Primary,
              onClick: handleClose
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
      ) : null}
    </>,
    document.body
  );
};

export default ManageTabs;
