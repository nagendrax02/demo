import { INotesItem } from 'apps/notes/notes.types';
import { ActivityRenderType, IAugmentedAHDetail } from '../../types';

export const convertToNotesItem = (activityTask: IAugmentedAHDetail): INotesItem => {
  const taskAdditionalDetails = activityTask.AdditionalDetails;

  const relatedProspectId = (activityTask.LeadId ||
    taskAdditionalDetails?.RelatedProspectId) as string;

  return {
    ProspectNoteId: activityTask.Id as string,
    RelatedProspectId: relatedProspectId,
    Note: taskAdditionalDetails?.Note as string,
    AttachmentName: taskAdditionalDetails?.NoteAttachment as string,
    CreatedBy: taskAdditionalDetails?.NoteCreatedBy as string,
    CreatedByName: taskAdditionalDetails?.CreatedByName as string,
    CreatedOn: activityTask.ActivityDateTime as string,
    ModifiedBy: '',
    ModifiedByName: '',
    ModifiedOn: '',
    Id: activityTask.Id as string
  };
};

export const convertToAHRecord = (noteItem: INotesItem): IAugmentedAHDetail => {
  return {
    Id: noteItem?.ProspectNoteId,
    LeadId: noteItem?.RelatedProspectId,
    AdditionalDetails: {
      Note: noteItem?.Note,
      NoteAttachment: noteItem?.AttachmentName,
      NoteCreatedBy: noteItem?.CreatedBy,
      CreatedByName: noteItem?.CreatedByName,
      ActivityDateTime: noteItem?.CreatedOn
    },
    ActivityRenderType: ActivityRenderType.Note
  };
};
