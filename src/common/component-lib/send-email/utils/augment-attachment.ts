import { trackError } from 'common/utils/experience/utils/track-error';
import { IFile } from '../../file-library/file-library.types';
import { IAttachedFilePayload } from '../send-email.types';

const getAttachmentSource = (attachmentTab: string | undefined): string | undefined => {
  if (attachmentTab) {
    switch (attachmentTab) {
      case 'Document': {
        return '3';
      }
      case 'Image': {
        return '2';
      }
    }
  }
};

const toAscii = (str: string): number => {
  return str.charCodeAt(0);
};

const stringToAscii = (str: string): string => {
  return str.split('').map(toAscii).join('');
};

const getTemporaryAttachmentFileId = (
  dateProperty: string | undefined,
  nameProperty: string | null
): string => {
  let uniqueId = '';
  try {
    if (dateProperty && nameProperty)
      uniqueId = Date.parse(dateProperty) + stringToAscii(nameProperty);
  } catch (error) {
    trackError(error);
  }
  return uniqueId;
};

const getStructuredDataForLibraryDocumentsAndImages = (file: IFile): IAttachedFilePayload => {
  const fileProperty: IAttachedFilePayload = {
    CampaignAttachmentId: getTemporaryAttachmentFileId(file?.ModifiedOn, file?.Name),
    AttachmentFileName: file?.Name,
    FileName: file?.Name,
    AttachmentSource: getAttachmentSource(file?.FileType),
    Filesize: file?.Size,
    FileUrl: file?.Path,
    CanPreview: true
  };

  return fileProperty;
};

export const handleFileAttached = (selectedFiles: IFile[] | undefined): IAttachedFilePayload[] => {
  const structuredAttachedData: IAttachedFilePayload[] = [];
  if (selectedFiles && Array.isArray(selectedFiles)) {
    selectedFiles.forEach((file) => {
      if (file?.Name && file?.Path) {
        const structuredDataForLibraryDocumentsAndImages =
          getStructuredDataForLibraryDocumentsAndImages(file);
        structuredAttachedData.push(structuredDataForLibraryDocumentsAndImages);
      }
    });
  }
  return structuredAttachedData;
};
