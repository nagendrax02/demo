import { useEffect } from 'react';
import { AugmentedRenderType, IBulkUpdate } from './bulk-update.types';
import Modal from '@lsq/nextgen-preact/modal';
import styles from './bulk-update.module.css';
import useBulkUpdateConfig from './use-bulk-update-config';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import ModalBody from './modal/ModalBody';
import ModalFooter from './modal/ModalFooter';
import { setGridConfig, resetBulkUpdateStore, useBulkUpdate } from './bulk-update.store';

const BulkUpdate = (props: IBulkUpdate): JSX.Element => {
  const {
    searchParams,
    entityType,
    setShow,
    show,
    eventCode,
    callerSource,
    gridConfig,
    entityIds,
    onSuccess,
    successModal
  } = props;

  const selectedField = useBulkUpdate((state) => state.selectedField);
  const { PluralName } = useBulkUpdate((state) => state.representationName);

  const { isLoading } = useBulkUpdateConfig({
    eventCode,
    callerSource,
    entityType,
    leadTypeConfiguration: gridConfig.leadTypeConfiguration
  });

  const handleClose = (): void => {
    setShow(false);
  };

  const handleOnSuccess = (triggerRefresh = true): void => {
    if (triggerRefresh) {
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    }
  };

  useEffect(() => {
    setGridConfig({
      searchParams,
      callerSource,
      entityIds,
      entityType,
      gridConfig,
      eventCode
    });

    return () => {
      resetBulkUpdateStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTitle = (): string => {
    if (gridConfig?.updateAll) {
      return `Update All ${PluralName}`;
    }
    return 'Bulk Update';
  };

  return (
    <Modal
      show={show || true}
      customStyleClass={`${styles.modal} ${
        selectedField?.augmentedRenderType === AugmentedRenderType.Editor ? styles.custom_style : ''
      }`}>
      <Modal.Header
        title={isLoading ? <Shimmer height="24px" width="100%" /> : getTitle()}
        onClose={() => {
          if (isLoading) return;
          handleClose();
        }}
      />

      <ModalBody isLoading={isLoading} handleClose={handleClose} successModal={successModal} />
      <ModalFooter isLoading={isLoading} onClose={handleClose} onSuccess={handleOnSuccess} />
    </Modal>
  );
};

export default BulkUpdate;
