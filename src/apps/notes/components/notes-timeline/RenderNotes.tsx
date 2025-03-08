import Timeline from 'common/component-lib/timeline';
import { INotesItem } from '../../notes.types';
import Body from './Body';
import { lazy, useState } from 'react';
import DeleteModal from '../delete-modal';
import DateTime from './DateTime';
import withSuspense from '@lsq/nextgen-preact/suspense';
import NotesIcon from './NotesIcon';
import useNotesStore from '../../notes.store';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { EntityType } from 'common/types';

interface IRenderNotes {
  data: INotesItem;
  entityIds: IEntityIds;
  entityType?: EntityType;
  onNoteChange?: (noteItem: INotesItem) => void;
}

const Actions = withSuspense(lazy(() => import('./Actions')));
const AddNotes = withSuspense(lazy(() => import('../add-notes')));

const RenderNotes = (props: IRenderNotes): JSX.Element => {
  const { data, entityIds, onNoteChange } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteItem, setNoteItem] = useState<INotesItem>(data);
  const updateNotesItem = useNotesStore((state) => state.updateNotesItem);

  const handleEdit = (): void => {
    setShowEditModal(true);
  };

  const handleDelete = (): void => {
    setShowDeleteModal(true);
  };

  const syncStores = (updatedNotes: INotesItem): void => {
    // keeps notes store in sync with noteItem
    updateNotesItem(updatedNotes);

    // keeps AH store in sync with noteItem
    onNoteChange?.(updatedNotes);
  };

  return (
    <>
      <Timeline
        timeline={{
          data: noteItem,
          entityId: entityIds?.lead,
          handleEdit,
          handleDelete
        }}
        components={{
          Icon: NotesIcon,
          DateTime,
          Body,
          Actions
        }}
      />
      {showEditModal ? (
        <AddNotes
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          noteItem={noteItem}
          entityIds={entityIds}
          setNoteItem={setNoteItem}
          isEdit
          syncStores={syncStores}
        />
      ) : (
        <></>
      )}
      {showDeleteModal ? (
        <DeleteModal
          entityIds={entityIds}
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          noteItem={noteItem}
        />
      ) : (
        <></>
      )}
    </>
  );
};

RenderNotes.defaultProps = {
  onNoteChange: undefined,
  entityType: EntityType.Lead
};

export default RenderNotes;
