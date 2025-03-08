import { Variant } from 'common/types';
import styles from './file-delete-modal.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface IFileDeleteModal {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  fileName: string;
  onDelete: () => void;
}

const FileDeleteModal = ({
  showModal,
  setShowModal,
  fileName,
  onDelete
}: IFileDeleteModal): JSX.Element => {
  return (
    <ConfirmationModal
      show={showModal}
      onClose={(): void => {
        setShowModal(false);
      }}
      title="Delete File"
      description={`Are you sure you want to delete file: ${fileName}?`}
      customStyleClass={styles.delete_modal}
      buttonConfig={[
        {
          id: 1,
          name: 'No',
          variant: Variant.Primary,
          onClick: (): void => {
            setShowModal(false);
          },
          dataTestId: 'no-delete-file'
        },
        {
          id: 2,
          name: 'Yes, Delete',
          variant: Variant.Secondary,
          onClick: onDelete,
          showSpinnerOnClick: true,
          customStyleClass: styles.delete_button,
          dataTestId: 'yes-delete-file'
        }
      ]}
    />
  );
};

export default FileDeleteModal;
