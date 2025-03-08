import { Variant } from 'common/types';
import styles from '../../notes.module.css';
import { deleteNotes } from '../../utils';
import { INotesItem } from '../../notes.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { alertConfig } from '../../constants';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { IEntityIds } from '../../../entity-details/types/entity-store.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface IDeleteModal {
  showModal: boolean;
  setShowModal: (value: React.SetStateAction<boolean>) => void;
  noteItem: INotesItem;
  entityIds: IEntityIds;
}

const DeleteModal = (props: IDeleteModal): JSX.Element => {
  const { showModal, setShowModal, noteItem, entityIds } = props;
  const { showAlert } = useNotification();

  const getDescription = (): JSX.Element => {
    return (
      <div>
        <div>Are you sure you want to delete this note?</div>
        <div>Deleting will remove all attachments of the notes if any.</div>
      </div>
    );
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteNotes(
        noteItem?.RelatedProspectId,
        noteItem.ProspectNoteId || noteItem?.Id || '',
        entityIds
      );
      updateLeadAndLeadTabs(true);
      showAlert(alertConfig.DELETE_NOTE_SUCCESS);
    } catch (error) {
      console.log(error);
      showAlert(alertConfig.DELETE_NOTE_FAIL);
    }
    setShowModal(false);
  };

  return (
    <ConfirmationModal
      show={showModal}
      onClose={(): void => {
        setShowModal(false);
      }}
      title="Delete Notes"
      description={getDescription()}
      customStyleClass={styles.delete_modal}
      buttonConfig={[
        {
          id: 1,
          name: 'No',
          variant: Variant.Primary,
          onClick: (): void => {
            setShowModal(false);
          },
          dataTestId: 'no-delete-notes'
        },
        {
          id: 2,
          name: 'Yes, Delete',
          customStyleClass: styles.delete_btn,
          variant: Variant.Secondary,
          onClick: handleDelete,
          showSpinnerOnClick: true,
          dataTestId: 'yes-delete-notes'
        }
      ]}
    />
  );
};

export default DeleteModal;
