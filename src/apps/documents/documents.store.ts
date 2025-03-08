import { trackError } from 'common/utils/experience/utils/track-error';
import { create } from 'zustand';
import { DocumentType, IDocument, IDocumentStore } from './documents.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants/api-routes';
import { fetchDocumentsEntityMap, filterSearchedDocuments, getDocumentType } from './utils';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { EntityType } from '../../common/types';
import { IEntityIds, IEntityRepNames } from '../entity-details/types/entity-store.types';
import { fileTypeFilterMap } from './constants';

const initialState = {
  search: '',
  records: [],
  isLoading: true,
  searchedRecords: [],
  source: { label: 'Attachments', value: 'attachment' },
  fileTypeFilter: { label: 'All', value: 'all' },
  isDataLoaded: false
};

const useDocumentStore = create<IDocumentStore>(() => {
  const filterCache = getItem(StorageKey.LeadDocumentsFilter) as Record<string, string | IOption>;
  if (filterCache?.search) {
    initialState.search = filterCache.search as string;
  }
  if (filterCache?.source) {
    initialState.source = filterCache.source as IOption;
  }
  return {
    ...initialState
  };
});

interface IHandleFetchDocumentAPICall {
  source: IOption;
  entityIds: IEntityIds;
  entityType: EntityType;
  fileTypeFilter?: string[] | string;
}

export const handleFetchDocumentAPICall = async ({
  source,
  entityIds,
  entityType,
  fileTypeFilter
}: IHandleFetchDocumentAPICall): Promise<IDocument[]> => {
  const response: IDocument[] = await fetchDocumentsEntityMap?.[entityType](
    entityIds,
    source,
    fileTypeFilter
  );
  return response;
};

interface IFetchDocuments {
  source: IOption;
  entityRepNames: IEntityRepNames;
  entityIds: IEntityIds;
  entityType: EntityType;
  fileTypeFilter: IOption;
}

export const fetchDocuments = async ({
  source,
  entityRepNames,
  entityIds,
  entityType,
  fileTypeFilter
}: IFetchDocuments): Promise<void> => {
  try {
    useDocumentStore.setState({ isLoading: true });
    const fileTypeFilterArray = fileTypeFilterMap?.[fileTypeFilter?.value];
    const response: IDocument[] = await handleFetchDocumentAPICall({
      source,
      entityIds,
      entityType,
      fileTypeFilter: fileTypeFilterArray
    });
    const records =
      response?.map((item) => ({
        ...item,
        id: item.Id,
        AttachmentTo: getDocumentType(item, entityRepNames?.lead?.SingularName)
      })) || [];
    useDocumentStore.setState(({ search }) => ({
      records,
      isLoading: false,
      searchedRecords: search ? filterSearchedDocuments(records, search) : []
    }));
  } catch (err) {
    trackError(err);
    useDocumentStore.setState({ records: [], isLoading: false });
  }
};

export const deleteDocument = async (record: IDocument): Promise<void> => {
  const payload = {
    path:
      record.Type === DocumentType.ProspectNote
        ? API_ROUTES.deleteNoteAttachment
        : API_ROUTES.deleteActivityAttachment,
    module: Module.Marvin,
    body:
      record.Type === DocumentType.ProspectNote
        ? { ProspectNoteId: record.Id, RelatedProspectId: record?.RelatedObjectId }
        : { ActivityId: record.RelatedObjectId, AttachmentId: record.Id },
    callerSource: CallerSource.Document
  };

  const response = await httpPost(payload);
  // @ts-ignore TODO later
  if (response?.Status === 'Success') {
    useDocumentStore.setState(({ records }) => ({
      records: records?.filter((document) => document?.Id !== record?.Id)
    }));
  }
};

export const setSource = (source: IOption): void => {
  useDocumentStore.setState(({ search }) => {
    setItem(StorageKey.LeadDocumentsFilter, { source, search });
    return { source };
  });
};

export const setIsDataLoaded = (isLoaded: boolean): void => {
  useDocumentStore.setState({ isDataLoaded: isLoaded });
};

export const setFileTypeFilter = (option: IOption): void => {
  useDocumentStore.setState({ fileTypeFilter: option });
};

export const setSearch = (search: string): void => {
  if (!search) {
    useDocumentStore.setState({ search: '', searchedRecords: [] });
  } else {
    useDocumentStore.setState(({ records }) => ({
      search,
      searchedRecords: filterSearchedDocuments(records, search)
    }));
  }
  const { source } = useDocumentStore.getState();
  setItem(StorageKey.LeadDocumentsFilter, { source, search: search || '' });
};

export default useDocumentStore;
