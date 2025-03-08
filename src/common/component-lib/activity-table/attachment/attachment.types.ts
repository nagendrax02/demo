import { CallerSource } from 'common/utils/rest-client';

export interface IAttachment {
  activityId: string;
  callerSource: CallerSource;
  leadId?: string;
}

export interface IAttachmentInfo {
  Name: string;
  AttachmentFile: string;
  AttachmentId: string;
  ShowPlayIcon?: boolean;
  RestrictDownload?: boolean;
  UsePreSignedURL?: boolean;
  Description?: string;
}

export interface IPreSignedUrl {
  id: string;
  url: string;
}
export interface IAttachmentFile {
  name: string;
  previewUrl: string;
  key: string;
  type: string;
  restrictDownload: boolean;
  description?: string;
}
