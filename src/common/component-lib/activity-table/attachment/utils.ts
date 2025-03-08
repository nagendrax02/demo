import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { getEntityId } from 'common/utils/helpers';
import { IAttachmentInfo, IAttachmentFile, IPreSignedUrl } from './attachment.types';
import { API_ROUTES } from 'src/common/constants';

const getPreviewUrlFromApi = async (
  info: IAttachmentInfo,
  callerSource: CallerSource,
  leadId?: string
): Promise<IPreSignedUrl | null> => {
  try {
    const body = {
      FileName: info.AttachmentFile,
      LeadId: getEntityId() || leadId || ''
    };

    const response: string = await httpPost({
      path: API_ROUTES.getPresignedUrl,
      module: Module.Marvin,
      body,
      callerSource: callerSource
    });

    return { url: response, id: info.AttachmentId };
  } catch (error) {
    trackError('error in PreviewUrl api', error);
  }
  return null;
};

const getUrlDict = async (
  preSignedUrl: Promise<IPreSignedUrl>[],
  preSignedDict: Record<string, IPreSignedUrl>
): Promise<void> => {
  try {
    const urls: IPreSignedUrl[] = await Promise.all(preSignedUrl);
    urls.forEach((item: IPreSignedUrl) => {
      preSignedDict[item.id] = item;
    });
  } catch (error) {
    trackError('error in getUrlDict', error);
  }
};

const getPreviewUrl = (
  item: IAttachmentInfo,
  preSignedDict: Record<string, IPreSignedUrl>
): string => {
  if (item.UsePreSignedURL) return preSignedDict[item.AttachmentId]?.url || '';
  return item.AttachmentFile || '';
};

const processAttachmentInfo = (
  attachmentInfo: IAttachmentInfo[],
  augmentedAttachmentInfo: IAttachmentFile[],
  preSignedDict: Record<string, IPreSignedUrl>
): void => {
  const updatedAttachmentInfo = attachmentInfo.map((item) => ({
    name: item.Name || '',
    previewUrl: getPreviewUrl(item, preSignedDict),
    key: item.AttachmentId || '',
    type: item.ShowPlayIcon ? 'audio' : '',
    restrictDownload: !!item.RestrictDownload,
    description: item?.Description
  }));

  augmentedAttachmentInfo.push(...updatedAttachmentInfo);
};

export const getAttachmentFiles = async (
  attachmentInfo: IAttachmentInfo[],
  callerSource: CallerSource,
  leadId?: string
): Promise<IAttachmentFile[] | null> => {
  const augmentedAttachmentInfo: IAttachmentFile[] = [];
  const preSignedDict: Record<string, IPreSignedUrl> = {};

  if (!attachmentInfo.length) {
    return null;
  }

  const preSignedUrl: Promise<IPreSignedUrl>[] = attachmentInfo
    .filter((info) => info.UsePreSignedURL)
    .map((info) => getPreviewUrlFromApi(info, callerSource, leadId))
    .filter(Boolean) as Promise<IPreSignedUrl>[];

  await getUrlDict(preSignedUrl, preSignedDict);
  processAttachmentInfo(attachmentInfo, augmentedAttachmentInfo, preSignedDict);

  return augmentedAttachmentInfo;
};
