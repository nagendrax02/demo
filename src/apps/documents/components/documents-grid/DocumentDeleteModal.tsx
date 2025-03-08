import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { Variant } from 'common/types';
import styles from '../../documents.module.css';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

interface IDocumentDeleteModal {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => void;
}

const DocumentDeleteModal = ({
  showModal,
  setShowModal,
  onDelete
}: IDocumentDeleteModal): JSX.Element => {
  return (
    <ConfirmationModal
      show={showModal}
      onClose={(): void => {
        setShowModal(false);
      }}
      title="Delete Document"
      description={'Are you sure you want to delete document?'}
      customStyleClass={styles.delete_modal}
      buttonConfig={[
        {
          id: 1,
          name: 'No',
          variant: Variant.Primary,
          onClick: (): void => {
            setShowModal(false);
          }
        },
        {
          id: 2,
          name: 'Yes, Delete',
          customStyleClass: styles.delete_btn,
          variant: Variant.Secondary,
          onClick: onDelete,
          showSpinnerOnClick: true
        }
      ]}
    />
  );
};

export default DocumentDeleteModal;
