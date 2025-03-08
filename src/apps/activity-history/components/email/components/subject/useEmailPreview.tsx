import { useEffect, useState } from 'react';
import { IAdditionalDetails } from 'apps/activity-history/types';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { API_ROUTES, EXCEPTION_MESSAGE } from 'common/constants';
import {
  CampaignAttachments,
  IAugmentedEmailPreviewData,
  ICcBccData,
  IEmailResponse,
  IReplyToData
} from './subject.type';
import { getBodyAndSubject, getCcBccData, getReplyToUserInfo, getSubjectExist } from './utils';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';

interface IUseEmailPreview {
  additionalDetails: IAdditionalDetails | null;
}

interface IGetAugmentedEmailData {
  subject: string | undefined;
  body: string;
  category: string;
  ccBccData: ICcBccData;
  campaignAttachments: CampaignAttachments;
  fromUsername: string;
  fromUserId: string;
  replyTo: IReplyToData;
}

// eslint-disable-next-line complexity
const getAugmentedEmailData = (
  emailData: IEmailResponse,
  emailSubject: string | undefined
): IGetAugmentedEmailData => {
  /* istanbul ignore next */
  return {
    subject: emailData?.Subject || emailSubject,
    body: emailData?.ContentHtml,
    category: emailData?.EmailCategoryName || '',
    ccBccData: emailData?.MailMergeData ? getCcBccData(emailData?.MailMergeData) : {},
    campaignAttachments: emailData?.CampaignAttachments || [],
    fromUsername: emailData.FromUserName || '',
    fromUserId: emailData.FromUser || '',
    replyTo: getReplyToUserInfo(emailData?.MailMergeData || '') || {}
  };
};

const useEmailPreview = ({ additionalDetails }: IUseEmailPreview): IAugmentedEmailPreviewData => {
  const [emailData, setEmailData] = useState<IEmailResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showAlert } = useNotification();

  const campaignActivityRecordId = additionalDetails?.CampaignActivityRecordId;
  const activityEventNote = additionalDetails?.ActivityEvent_Note;
  const emailSubject = additionalDetails?.EmailSubject;

  let augmentEmailData = {
    subject: additionalDetails?.EmailSubject,
    body: '',
    category: '',
    ccBccData: {},
    campaignAttachments: [] as CampaignAttachments,
    fromUsername: '',
    fromUserId: '',
    replyTo: { name: '', email: '' }
  };

  const isSubjectExistInActivityEventNote = getSubjectExist(activityEventNote);

  useEffect(() => {
    /* istanbul ignore next */
    const getEmailData = async (): Promise<void> => {
      try {
        if (!isSubjectExistInActivityEventNote && !emailData) {
          setIsLoading(true);
          const emailResponse: IEmailResponse = await httpGet({
            path: `${API_ROUTES.emailCampaignRetrieve}${campaignActivityRecordId}`,
            module: Module.Marvin,
            callerSource: CallerSource.ActivityHistory
          });
          setEmailData(emailResponse);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        showAlert({ type: Type.ERROR, message: EXCEPTION_MESSAGE });
      }
    };
    getEmailData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignActivityRecordId]);

  /* istanbul ignore next */
  if (isSubjectExistInActivityEventNote) {
    const [subject, body] = getBodyAndSubject(activityEventNote || '');
    augmentEmailData.subject = subject;
    augmentEmailData.body = body;
    augmentEmailData.replyTo = getReplyToUserInfo(additionalDetails?.MailMergeData || '') || {};
  }

  /* istanbul ignore next */
  if (emailData) {
    augmentEmailData = getAugmentedEmailData(emailData, emailSubject);
  }

  return { augmentEmailData: augmentEmailData, isLoading };
};

export default useEmailPreview;
