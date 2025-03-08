import { TimelineGroup } from 'common/component-lib/timeline';
import { INotesItem } from '../../notes.types';
import RenderNotes from './RenderNotes';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { EntityType } from 'common/types';

interface INotesTimeline {
  notes: INotesItem[];
  intersectionRef: React.RefObject<HTMLDivElement>;
  isLoadingNextPage: boolean;
  entityIds: IEntityIds;
  entityType: EntityType;
}

const NotesTimeline = (props: INotesTimeline): JSX.Element => {
  const { notes, intersectionRef, isLoadingNextPage, entityIds, entityType } = props;

  const itemContent = (data: INotesItem): JSX.Element => {
    return <RenderNotes data={data} entityIds={entityIds} entityType={entityType} />;
  };

  return (
    <>
      <TimelineGroup<INotesItem>
        records={notes || []}
        recordIdentifierPropKey="ProspectNoteId"
        groupPropKey="CreatedOn"
        itemContent={itemContent}
        isLoading={isLoadingNextPage}
      />
      <div ref={intersectionRef} />
    </>
  );
};

export default NotesTimeline;
