import RenderNotes from 'apps/notes/components/notes-timeline/RenderNotes';
import { ITimeline } from '../../types';
import { convertToAHRecord, convertToNotesItem } from './utils';
import useActivityHistoryStore from '../../activity-history.store';
import { INotesItem } from 'apps/notes/notes.types';
import { DEFAULT_ENTITY_IDS } from 'common/constants';
import { EntityType } from 'common/types';

const Notes = (props: ITimeline): JSX.Element => {
  const { data, entityIds, entityType } = props;
  const updateAHRecord = useActivityHistoryStore((state) => state.updateAHRecord);

  const syncAHStore = (noteItem: INotesItem): void => {
    updateAHRecord(convertToAHRecord(noteItem));
  };

  return (
    <RenderNotes
      data={convertToNotesItem(data)}
      entityIds={entityIds || DEFAULT_ENTITY_IDS}
      onNoteChange={syncAHStore}
      entityType={entityType || EntityType.Lead}
    />
  );
};

export default Notes;
