import { CallerSource, Module, httpGet, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { INotesItem, INotesResponse } from '../notes.types';
import { INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { alertConfig } from '../constants';
import { EntityType } from 'common/types';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { getActiveEntityType } from 'common/utils/entity-action/entity-action';

const createNotesApiRouteMap: Record<string, string> = {
  [EntityType.Lead]: API_ROUTES.createNotes,
  [EntityType.Opportunity]: API_ROUTES.opportunityNoteCreate
};

const getNotesApiRouteMap: Record<string, string> = {
  [EntityType.Lead]: API_ROUTES.getNotes,
  [EntityType.Opportunity]: API_ROUTES.opportunityNoteGet
};

const updateNotesApiRouteMap: Record<string, string> = {
  [EntityType.Lead]: API_ROUTES.updateNotes,
  [EntityType.Opportunity]: API_ROUTES.opportunityNoteUpdate
};

const deleteNotesApiRouteMap: Record<string, string> = {
  [EntityType.Lead]: API_ROUTES.deleteNotes,
  [EntityType.Opportunity]: API_ROUTES.opportunityNoteDelete
};

export const saveNotes = async (
  entityIds: IEntityIds,
  notes: string,
  attachmentName: string | undefined
): Promise<void> => {
  const activeEntityType = getActiveEntityType(entityIds);
  const payload = {
    RelatedProspectId: entityIds?.lead,
    Note: notes,
    Description: notes,
    AttachmentName: attachmentName,
    RelatedActivityId: entityIds?.opportunity
  };

  await httpPost({
    path: createNotesApiRouteMap?.[activeEntityType] || '',
    module: Module.Marvin,
    body: payload,
    callerSource: CallerSource.Notes
  });
};

export const fetchNotes = async (config: {
  page: number | undefined;
  entityIds: IEntityIds;
  startDate: string | undefined;
  endDate: string | undefined;
}): Promise<INotesResponse> => {
  const { page, entityIds, startDate, endDate } = config;

  const activeEntityType = getActiveEntityType(entityIds);

  const body = {
    Parameter: {
      RelatedId: entityIds?.[activeEntityType],
      FromDate: startDate,
      ToDate: endDate
    },
    Sorting: {
      ColumnName: 'CreatedOn',
      Direction: 1
    },
    Paging: {
      PageIndex: page,
      PageSize: 25
    }
  };

  const response = (await httpPost({
    path: getNotesApiRouteMap?.[activeEntityType] || '',
    module: Module.Marvin,
    body: body,
    callerSource: CallerSource.Notes
  })) as INotesResponse;

  return response;
};

export const fetchNextPage = async (config: {
  pageNumber: number | undefined;
  setNotesList: (data: INotesItem[]) => void;
  notesList: INotesItem[];
  startDate: string | undefined;
  endDate: string | undefined;
  entityIds: IEntityIds;
}): Promise<number> => {
  const { pageNumber, setNotesList, notesList, startDate, endDate, entityIds } = config;
  let length = 0;
  try {
    const response = await fetchNotes({
      page: pageNumber,
      entityIds: entityIds,
      startDate,
      endDate
    });
    if (response?.List?.length) {
      setNotesList([...notesList, ...(response?.List || [])]);
      length = response?.List?.length;
    }
  } catch (error) {
    console.log(error);
  }
  return length;
};

export const deleteNotes = async (
  noteProspectId: string,
  notesId: string,
  entityIds: IEntityIds
): Promise<void> => {
  const activeEntityType = getActiveEntityType(entityIds);
  const route = deleteNotesApiRouteMap?.[activeEntityType];

  if (activeEntityType === EntityType.Opportunity) {
    await httpPost({
      path: route,
      module: Module.Marvin,
      body: {
        LeadId: noteProspectId,
        NoteId: notesId
      },
      callerSource: CallerSource.Notes
    });
  } else {
    const urlParams = `?prospectId=${noteProspectId}&noteId=${notesId}`;
    await httpGet({
      path: route + urlParams,
      module: Module.Marvin,
      callerSource: CallerSource.Notes
    });
  }
};

export const removeAttachmentOfNote = (noteItem: INotesItem): INotesItem => {
  return {
    ...noteItem,
    AttachmentName: ''
  };
};

export const updateNotes = async ({
  entityIds,
  notes,
  editorInput,
  customBody
}: {
  entityIds: IEntityIds;
  notes: INotesItem;
  editorInput: string;
  customBody?: Record<string, string | boolean | undefined>;
}): Promise<void> => {
  const activeEntityType = getActiveEntityType(entityIds);

  const body = {
    ProspectNoteId: notes?.ProspectNoteId,
    RelatedProspectId: notes?.RelatedProspectId,
    RelatedActivityId: entityIds?.opportunity,
    Note: editorInput,
    AttachmentURL: '',
    Description: editorInput,
    Id: notes?.Id,
    ...(customBody || {})
  };

  await httpPost({
    path: updateNotesApiRouteMap?.[activeEntityType] || '',
    module: Module.Marvin,
    body: body,
    callerSource: CallerSource.Notes
  });
};

export const showNotesAlert = (
  showAlert: (notification: INotification) => void,
  isSuccess: boolean,
  isEdit?: boolean
): void => {
  if (isEdit) {
    if (isSuccess) {
      showAlert(alertConfig.UPDATE_NOTE_SUCCESS);
    } else {
      showAlert(alertConfig.UPDATE_NOTE_FAIL);
    }
    return;
  }
  if (isSuccess) {
    showAlert(alertConfig.ADD_NOTE_SUCCESS);
  } else {
    showAlert(alertConfig.ADD_NOTE_FAIL);
  }
};
