import { IFileInfo } from 'common/utils/files';
import { IDocument, IFileConfig } from '../../../documents.types';
import { IPreviewData } from 'common/component-lib/file-preview';
import { fetchNotesPresignedURL } from 'common/utils/helpers/notes-presigned-urls';
import { getEntityId } from 'common/utils/helpers';
import { isPreSignedUrl } from '../utils';

interface IGetPreviewData {
  record: IDocument;
  leadId: string;
  getDocumentPreviewFileUrl: (data: IDocument) => string;
  getFileData: (
    cfsConfigs: IFileConfig[],
    leadId: string,
    opportunityId?: string
  ) => Promise<IFileInfo | undefined>;
  attachmentName: string;
}

const getFileConfig = (data: IGetPreviewData): IFileConfig => {
  const { record, getDocumentPreviewFileUrl, attachmentName } = data;
  const config: IFileConfig = {
    DataSource: record.Type,
    EntityId: record.Id,
    FileName: attachmentName,
    FileUrl: getDocumentPreviewFileUrl(record),
    UsePreSignedUrl: true
  };

  return config;
};

export const isExternalLeadActivityAttachment = (record: IDocument): boolean => {
  // Checks if the attachment is from an activity created from external apps like converse or connector
  return record?.Type === 2 && !record?.AttachmentFileURL?.includes('/content/module/lead/');
};

export const isLeadNoteAttachment = (record: IDocument): boolean => {
  return record?.Type === 3 || record?.DocumentType?.toLowerCase() === 'note';
};

export const getPreviewData = async (data: IGetPreviewData): Promise<IPreviewData[]> => {
  const { record, getFileData, leadId, attachmentName } = data;

  if (isPreSignedUrl(record?.AttachmentFileURL) || isExternalLeadActivityAttachment(record)) {
    return [
      {
        previewUrl: record?.AttachmentFileURL,
        description: record.Description,
        name: attachmentName,
        restrictDownload: record.RestrictDownload
      }
    ];
  } else if (isLeadNoteAttachment(record)) {
    return [
      {
        previewUrl: (await fetchNotesPresignedURL(record.AttachmentName, leadId)) || '',
        description: record.Description,
        name: attachmentName,
        restrictDownload: record.RestrictDownload
      }
    ];
  } else {
    const config = getFileConfig(data);
    const fileData = (await getFileData([config], leadId)) as IFileInfo;
    if (fileData) {
      return [
        {
          previewUrl: fileData.Files[0].FileUrl || '',
          description: record.Description,
          name: attachmentName,
          fileData,
          restrictDownload: record.RestrictDownload
        }
      ];
    }
  }

  return [];
};

interface IGetFileDownloadData {
  record: IDocument;
  getFileData: (
    cfsConfigs: IFileConfig[],
    leadId: string,
    opportunityId?: string
  ) => Promise<IFileInfo | undefined>;
  getDocumentPreviewFileUrl: (data: IDocument) => string;
  getFileName: (record: IDocument) => string;
  leadId?: string;
  opportunityId?: string;
}

export const getFileDownloadData = async (data: IGetFileDownloadData): Promise<IFileInfo> => {
  const { record, getFileData, getDocumentPreviewFileUrl, getFileName, leadId, opportunityId } =
    data;
  const validLeadId = leadId || getEntityId();
  if (
    record?.AttachmentFileURL &&
    (isPreSignedUrl(record?.AttachmentFileURL) || isExternalLeadActivityAttachment(record))
  ) {
    return {
      Files: [
        {
          FileUrl: record?.AttachmentFileURL,
          FileName: record.AttachmentName
        }
      ],
      ZipFolderName: ''
    };
  } else if (isLeadNoteAttachment(record)) {
    return {
      Files: [
        {
          FileUrl: (await fetchNotesPresignedURL(record.AttachmentName, validLeadId)) || '',
          FileName: record.AttachmentName
        }
      ],
      ZipFolderName: ''
    };
  } else {
    const downloadConfig: IFileConfig = {
      DataSource: record.Type,
      EntityId: record.Id,
      FileName: getFileName(record),
      FileUrl: getDocumentPreviewFileUrl(record),
      UsePreSignedUrl: true
    };
    return (await getFileData([downloadConfig], validLeadId, opportunityId)) as IFileInfo;
  }
};
