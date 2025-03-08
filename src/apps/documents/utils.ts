import { trackError } from 'common/utils/experience/utils/track-error';
import { documentTypes, sourceFilterOptionMap } from './constants';
import {
  IDocument,
  DocumentType,
  IFileConfig,
  IChildProspectDetailsDocumentsList
} from './documents.types';
import { API_ROUTES } from 'common/constants';
import { httpPost, CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { Type, INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { IFileInfo } from 'common/utils/files';
import { getNotesAttachmentName } from 'common/utils/helpers/notes-presigned-urls';
import { IEntityIds, IEntityRepNames } from '../entity-details/types/entity-store.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { EntityType } from 'common/types';

type Alert = (notification: INotification) => void;
export const getDocumentType = (record: IDocument, leadRepName?: string): string => {
  if (record.Type === DocumentType.ProspectCustomAcivity) {
    return record.DocumentType;
  }
  if (record.Type === DocumentType.Prospect) {
    return leadRepName || 'Lead';
  }
  return documentTypes[record.Type] || '';
};

export const getDocumentPreviewFileUrl = (data: IDocument): string => {
  /*    If tenant is preSignedUrl enabled, youll need to convert the fileurl for it to work.
  The following conditons below use the AttachmentFileURL and data Type to form a new file url.
  These condition are the same conditions used in backend as well. 
  
  Conditions explained:

	1. Condition1: If the attachment url contains '/content/module/lead/' , we find the index of that search string 
  in the main string and add 58(length of '/content/module/lead/' + length of uuid+/). The remaining string starting from the new 
  index value will be the new file url.
	For eg: attachmentURL = https://testingleadsquaredpages.s3.amazonaws.com/t/S_mainak/content/module/lead/
  66758af9-9447-4e52-bd12-e01a7a888002/SalesActivity//big-buck-bunny_trailer.webm
  
  AttachmentFileURL.indexOf('/content/module/lead/') is 59, plus 58 = 117
	AttachmentFileURL.substring(117) is 'SalesActivity//big-buck-bunny_trailer.webm'. Which is the new file url.
	
	2. Condition 2: Similar to the first condition, find the index of the last '/'. The after that position is the new file url. 
	For eg:
	AttachmentURL = 
	https://testingleadsquaredpages.s3.amazonaws.com/t/S_mainak/content/module/lead/66758af9-9447-4e52-bd12-e01a7a888002/sample-5s.mp4
	
	AttachmentURL.lastIndexOf('/') + 1 is 117
  AttachmentFileURL.substring(117) is sample-5s.mp4. Which the new file url.
  
  */

  let fileUrl = '';

  if (data?.AttachmentFileURL?.includes('/content/module/lead/')) {
    // Custom, sales and other activities
    fileUrl = data?.AttachmentFileURL.substring(
      data?.AttachmentFileURL.indexOf('/content/module/lead/') + 58
    );
  } else if (data?.Type === 3) {
    if (data?.AttachmentFileURL?.includes('/')) {
      fileUrl = data?.AttachmentFileURL.substring(data?.AttachmentFileURL.lastIndexOf('/') + 1);
    } else {
      fileUrl = getNotesAttachmentName(data.AttachmentName);
    }
  } else {
    fileUrl = data?.AttachmentFileURL || '';
  }
  return fileUrl;
};

export const getFileData = async (
  cfsConfigs: IFileConfig[],
  leadId: string,
  opportunityId?: string
): Promise<IFileInfo | undefined> => {
  try {
    const response = (await httpPost({
      path: API_ROUTES.getFileUrl,
      module: Module.Marvin,
      body: {
        LeadId: leadId,
        DocumentsToFetch: cfsConfigs,
        EntityId: opportunityId ? opportunityId : null
      },
      callerSource: CallerSource.Document
    })) as IFileInfo;

    return response;
  } catch (err) {
    trackError(err);
    return;
  }
};

export const getFileName = (record: IDocument): string => {
  const fileName =
    record.Type === 3 || record.DocumentType?.toLowerCase() === 'note'
      ? getNotesAttachmentName(record.AttachmentName)
      : record.AttachmentName;
  const lastIndex = fileName.lastIndexOf('.');
  if (lastIndex !== -1) {
    return fileName.substring(0, lastIndex);
  }
  return fileName;
};

export const getBulkDownloadConfig = async ({
  records,
  entityId,
  showAlert,
  opportunityId
}: {
  records: IDocument[];
  entityId: string;
  showAlert?: Alert;
  opportunityId?: string;
}): Promise<IFileInfo | undefined> => {
  const config = records.reduce((acc: IFileConfig[], record) => {
    if (record.RestrictDownload) {
      return acc;
    }
    acc.push({
      DataSource: record.Type,
      EntityId: record.Id,
      FileName: getFileName(record),
      FileUrl: getDocumentPreviewFileUrl(record),
      UsePreSignedUrl: true
    });
    return acc;
  }, []);
  if (config.length !== records.length) {
    showAlert?.({
      type: Type.ERROR,
      message: 'Download for some files was restricted.'
    });
  }
  return getFileData(config, entityId, opportunityId);
};

export const getCFSBulkDownloadConfig = async (
  records: IDocument[],
  entityId: string,
  opportunityId?: string
): Promise<IFileInfo | undefined> => {
  const config = records.reduce((acc: IFileConfig[], record) => {
    if (record.ChildProspectDetailsDocumentsList?.length) {
      const itemsConfig = record.ChildProspectDetailsDocumentsList.map((item) => ({
        DataSource: 6,
        EntityId: item.ParentId,
        FieldSchema: item.FieldSchema,
        CFSSchema: item.CFSSchema
      }));
      acc = [...acc, ...itemsConfig];
    }
    return acc;
  }, []);
  return getFileData(config, entityId, opportunityId);
};

export const getCFSPreviewConfig = async (
  records: IChildProspectDetailsDocumentsList[],
  entityId: string,
  opportunityId?: string
): Promise<IFileInfo | undefined> => {
  const config = records.map((item) => ({
    DataSource: 6,
    EntityId: item.ParentId,
    FieldSchema: item.FieldSchema,
    CFSSchema: item.CFSSchema
  }));
  return getFileData(config, entityId, opportunityId);
};

export const filterSearchedDocuments = (records: IDocument[], search: string): IDocument[] => {
  return records.reduce((acc: IDocument[], record) => {
    if (record.AttachmentName.toLowerCase().includes(search.toLowerCase())) {
      acc.push(record);
      return acc;
    }
    if (record?.ChildProspectDetailsDocumentsList?.length) {
      const filteredList = record?.ChildProspectDetailsDocumentsList.reduce(
        (list: IChildProspectDetailsDocumentsList[], item) => {
          if (item.AttachmentName.toLowerCase().includes(search.toLowerCase())) {
            list.push(item);
          }
          return list;
        },
        []
      );
      if (filteredList.length) {
        acc.push({ ...record, ChildProspectDetailsDocumentsList: filteredList });
      }
    }
    return acc;
  }, []);
};

interface IOppDocumentResponse {
  Documents: IDocument[] | null;
  TotalRecords: number;
}

export const fetchOpportunityDocuments = async (
  entityIds: IEntityIds,
  source: IOption,
  fileTypeFilter?: string[] | string
): Promise<IDocument[]> => {
  const body = {
    LeadId: entityIds?.lead,
    EntityId: entityIds?.opportunity,
    DocumentSource: source?.value,
    FileTypeFilter: fileTypeFilter || ''
  };

  const response: IOppDocumentResponse = await httpPost({
    path: API_ROUTES.opportunityDocumentGet,
    module: Module.Marvin,
    body: body,
    callerSource: CallerSource.Document
  });

  return response?.Documents || [];
};

export const fetchLeadDocuments = async (
  entityIds: IEntityIds,
  source: IOption
): Promise<IDocument[]> => {
  const response: IDocument[] = await httpGet({
    path:
      API_ROUTES.leadDocuments +
      `?leadId=${entityIds?.lead}&formatDate=true&source=${source.value}`,
    module: Module.Marvin,
    callerSource: CallerSource.Document
  });
  return response;
};

export const fetchDocumentsEntityMap: Record<
  string,
  (
    entityIds: IEntityIds,
    source: IOption,
    fileTypeFilter?: string[] | string
  ) => Promise<IDocument[]>
> = {
  [EntityType.Lead]: fetchLeadDocuments,
  [EntityType.Opportunity]: fetchOpportunityDocuments
};

export const getSourceFilterOptions = (
  entityType: EntityType,
  entityRepNames: IEntityRepNames,
  entityTypeRepName?: string
): IOption[] => {
  const options = sourceFilterOptionMap?.[entityType];

  const labelReplacements: Record<string, string> = {
    Opportunity: entityTypeRepName || 'Opportunity',
    Lead: entityRepNames?.lead?.SingularName || 'Lead'
  };

  options.forEach((option) => {
    option.label = labelReplacements[option.label] || option.label;
  });

  return options;
};

export const getAugmentedRecords = (records: IDocument[], entityIds: IEntityIds): IDocument[] => {
  const augmentedRecords: IDocument[] = [];
  const restrictDelete = !!entityIds?.opportunity;
  records.forEach((record) => {
    augmentedRecords.push({ ...record, EntityIds: entityIds, RestrictDelete: restrictDelete });
  });
  return augmentedRecords;
};
