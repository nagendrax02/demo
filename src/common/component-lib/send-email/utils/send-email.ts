/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
import { CallerSource, Module, httpPost } from '../../../utils/rest-client';
import { IFile } from '../../file-library/file-library.types';
import { IGroupedOption } from '../../grouped-option-dropdown';
import { IOpportunity, IOption } from '../send-email.types';
import { handleFileAttached } from './augment-attachment';
import { getCcBccFormattedList, getFormatedValues } from './augment-data';
import { getContextText, getFormattedContentHTML } from './editor';

interface ISendEmail {
  to: IOption[];
  from: IOption;
  subject: string;
  emailFields: IOption[];
  contentHtml: string;
  schedule: string;
  selectedEmailCategory: IOption;
  trackEmail: boolean;
  replyTo: IOption;
  cc: IGroupedOption[];
  bcc: IGroupedOption[];
  attachedFiles: IFile[];
  opportunity?: IOpportunity;
  leadTypeInternalName?: string;
  enableTestEmailFeature?: boolean;
  apiUrl: string;
}

const getOpportunityEmailBody = (opportunity?: IOpportunity): Record<string, unknown> => {
  return {
    ProspectOpportunityId: opportunity?.ProspectOpportunityId
      ? opportunity?.ProspectOpportunityId
      : '',
    OpportunityEventId: opportunity?.OpportunityEventId ? opportunity?.OpportunityEventId : '',
    OpportunityName: opportunity?.OpportunityName ? opportunity?.OpportunityName : '',
    IsEmailFromOpportunity: (opportunity?.ProspectOpportunityId && true) || false
  };
};

// eslint-disable-next-line max-lines-per-function
const getEmailBody = (props: ISendEmail): Record<string, unknown> => {
  const {
    from,
    subject,
    to,
    schedule,
    trackEmail,
    contentHtml,
    emailFields,
    selectedEmailCategory,
    enableTestEmailFeature,
    cc,
    bcc,
    attachedFiles,
    opportunity,
    leadTypeInternalName,
    replyTo
  } = props;
  const commanBody = {
    From: from?.value,
    Category: selectedEmailCategory?.value ? selectedEmailCategory?.value : null,
    ContentHTML: getFormattedContentHTML(contentHtml),
    ContentText: getContextText(contentHtml),
    EmailContentType: 2,
    RecipientEmailFields: getFormatedValues(emailFields, ','),
    ReplyTo_UserId: replyTo?.value || from?.value,
    Schedule: schedule,
    SendTrackableEmail: trackEmail,
    Subject: subject,
    LeadType: leadTypeInternalName
  };

  if (enableTestEmailFeature) {
    return commanBody;
  }

  return {
    To: getFormatedValues(to, ','),
    CCEmailAddress: getFormatedValues(cc, '[{MXSeparator}]'),
    BCCEmailAddress: getFormatedValues(bcc, '[{MXSeparator}]'),
    CampaignAttachments: handleFileAttached(attachedFiles),
    CcList: getCcBccFormattedList(cc, '[{MXSeparator}]'),
    BccList: getCcBccFormattedList(bcc, '[{MXSeparator}]'),
    ...commanBody,
    ...getOpportunityEmailBody(opportunity)
  };
};

const sendEmail = async (props: ISendEmail, callerSource: CallerSource): Promise<unknown> => {
  const response = await httpPost({
    path: props.apiUrl,
    module: Module.Marvin,
    body: getEmailBody(props),
    callerSource
  });
  return response;
};

export { sendEmail };
