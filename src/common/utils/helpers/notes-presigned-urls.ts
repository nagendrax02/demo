import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants';
import { CallerSource, HttpMethod, Module, httpPost, httpRequest } from '../rest-client';

const getNotesAttachmentName = (name: string): string => {
  try {
    return decodeURIComponent(name);
  } catch (ex) {
    return name;
  }
};

const isValidURL = async (url: string): Promise<boolean> => {
  let isValid = true;
  try {
    await httpRequest({ url, method: HttpMethod.Get, callerSource: CallerSource.Notes });
  } catch (ex) {
    trackError(ex);
    isValid = false;
  }
  return isValid;
};

const getFileNameForPresignedURL = (fileName: string): string => {
  //file uploaded in platform will have space as + in file name
  // convert it to %20 before requesting presignedURL
  if (fileName?.includes('+')) {
    fileName = fileName.replace(/\+/g, '%20');
  }
  return getNotesAttachmentName(fileName);
};

const getPresignedUrl = async (
  fileName: string,
  entityId: string,
  decode: boolean = true
): Promise<string> => {
  const presignedUrl: string = await httpPost({
    path: API_ROUTES.getPresignedUrl,
    module: Module.Marvin,
    body: {
      FileName: decode ? getFileNameForPresignedURL(fileName) : fileName,
      LeadId: entityId
    },
    callerSource: CallerSource.Notes
  });
  return presignedUrl;
};

export const fetchNotesPresignedURL = async (
  attachmentName: string,
  leadId: string
): Promise<string> => {
  try {
    let fileName = getFileNameForPresignedURL(attachmentName);
    let presignedURL = await getPresignedUrl(fileName, leadId);
    // check if the url is accessible and if not change the fileName
    if (!(await isValidURL(presignedURL))) {
      // change the fileName and request presigned again
      fileName = getNotesAttachmentName(attachmentName);
      presignedURL = await getPresignedUrl(fileName, leadId, false);
    }
    return presignedURL;
  } catch (ex) {
    trackError(ex);
    throw ex;
  }
};

export { getNotesAttachmentName };
