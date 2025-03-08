import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { IFileStorageConfig, INotesItem, IUploadFileResponse } from '../notes.types';
import { IPreviewData } from '../../../common/component-lib/file-preview';
import { API_ROUTES } from 'common/constants';
import { INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { alertConfig } from '../constants';
import { fetchNotesPresignedURL } from 'common/utils/helpers/notes-presigned-urls';

export const uploadFile = async (file: File, entityId: string): Promise<IUploadFileResponse> => {
  const formData = new FormData();
  formData.append('FileType', 'LeadAttachment');
  formData.append('LeadId', entityId);
  formData.append('uploadFiles', file);
  formData.append('Overwrite', 'false');

  let response: IUploadFileResponse = await httpPost({
    path: API_ROUTES.fileUpload,
    module: Module.FileUpload,
    body: formData,
    callerSource: CallerSource.Notes
  });

  const presignedUrl = await httpPost({
    path: API_ROUTES.getPresignedUrl,
    module: Module.Marvin,
    body: {
      FileName: response?.uploadedFile as string,
      LeadId: entityId
    },
    callerSource: CallerSource.Notes
  });

  response = { ...(response || {}), relativeFilePath: presignedUrl as string };
  return response;
};

export const deleteFile = async (fileName: string, entityId: string): Promise<void> => {
  const formData = new FormData();
  formData.append('FileType', 'LeadAttachment');
  formData.append('LeadId', entityId);
  formData.append('FileName', fileName);

  await httpPost({
    path: API_ROUTES.fileDelete,
    module: Module.FileUpload,
    body: formData,
    callerSource: CallerSource.Notes
  });
};

export const generatePreviewData = (
  file: File,
  response: IUploadFileResponse
): Record<string, IPreviewData> => {
  if (!file) {
    return {};
  }
  return {
    [file?.name]: {
      previewUrl: (response?.relativeFilePath || '') as string,
      name: (response?.uploadedFile || '') as string
    } as IPreviewData
  };
};

export const getNotesAttachmentName = (name: string): string => {
  try {
    return decodeURIComponent(name);
  } catch (ex) {
    trackError(ex);
  }
  return name;
};

export const handleFileUpload = async (config: {
  file: File;
  setIsDisabled: (value: React.SetStateAction<boolean>) => void;
  setPreviewData: (value: React.SetStateAction<Record<string, IPreviewData>>) => void;
  attachmentName: React.MutableRefObject<string | undefined>;
  entityId: string;
}): Promise<void> => {
  const { file, setIsDisabled, setPreviewData, attachmentName, entityId } = config;
  try {
    setIsDisabled(true);
    const response = await uploadFile(file, entityId);
    attachmentName.current = response?.uploadedFile || '';
    setPreviewData(generatePreviewData(file, response));
  } catch (err) {
    trackError(err);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    throw { message: err?.type } as unknown;
  } finally {
    setIsDisabled(false);
  }
};

export const handleFileDelete = async (config: {
  file: File;
  setIsDisabled: (value: React.SetStateAction<boolean>) => void;
  setPreviewData: (value: React.SetStateAction<Record<string, IPreviewData>>) => void;
  previewData: Record<string, IPreviewData>;
  entityId: string;
  showAlert: (notification: INotification) => void;
}): Promise<void> => {
  const { file, setIsDisabled, setPreviewData, previewData, entityId, showAlert } = config;
  try {
    setIsDisabled(true);
    const tempRecord = { ...previewData };
    await deleteFile(previewData[file?.name]?.name || file?.name, entityId);
    delete tempRecord[file?.name];
    setPreviewData(tempRecord);
  } catch (err) {
    trackError(err);
    showAlert(alertConfig.GENERIC);
  } finally {
    setIsDisabled(false);
  }
};

export const getNotesFileStorageConfig = async (
  setFileStorageConfig: (data: IFileStorageConfig) => void,
  fileStorageConfig: IFileStorageConfig | undefined
): Promise<void> => {
  if (fileStorageConfig) {
    setFileStorageConfig(fileStorageConfig);
    return;
  }
  const body = { FileType: 3 };
  const response = (await httpPost({
    path: API_ROUTES.fileStorageConfig,
    module: Module.Marvin,
    body,
    callerSource: CallerSource.Notes
  })) as { BlockedExtensions: string[]; AllowedMaxSize: string; AllowedExtensions: string[] };
  setFileStorageConfig({
    blockedExtensions: response?.BlockedExtensions,
    allowedMaxSize: response?.AllowedMaxSize,
    allowedExtensions: response?.AllowedExtensions
  });
};

export const populateEditCaseData = async (config: {
  noteItem: INotesItem | undefined;
  entityId: string;
  setPreviewData: (value: React.SetStateAction<Record<string, IPreviewData>>) => void;
}): Promise<void> => {
  const { noteItem, entityId, setPreviewData } = config;
  const fileName = getNotesAttachmentName(noteItem?.AttachmentName || '');
  if (fileName) {
    const presignedUrl = await fetchNotesPresignedURL(fileName, entityId);
    const preview = {
      [fileName]: {
        name: fileName,
        previewUrl: presignedUrl
      }
    };
    setPreviewData(preview);
  }
};
