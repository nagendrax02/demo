import { IEntityRepresentationName } from 'src/apps/entity-details/types/entity-data.types';
import { IGroupedOption } from '../grouped-option-dropdown';
import { IFile } from '../file-library/file-library.types';
import { CallerSource } from 'src/common/utils/rest-client';

interface IHtmlAttributes {
  DoNotEmail: string;
}

interface IOption {
  value: string | number;
  label: string;
}

enum OptionCategory {
  Lead = 'Lead',
  User = 'User',
  MailMergeField = 'Mail Merge Field'
}

enum FieldTypes {
  To = 'To',
  From = 'From',
  Cc = 'Cc',
  Bcc = 'Bcc',
  ReplyTo = 'ReplyTo',
  EmailCategories = 'EmailCategories',
  Subject = 'Subject',
  Body = 'Body',
  EmailFields = 'EmailFields'
}

interface ICcBccOption {
  Data: string | null;
  HtmlAttributes: IHtmlAttributes | null;
  Label: string | null;
  Value: string | null;
  category: OptionCategory;
}

interface ISendEmailFields {
  emailCategory: IOption | undefined;
  to: IGroupedOption[];
  from: IOption | undefined;
  cc: IGroupedOption[];
  bcc: IGroupedOption[];
  replyTo: IOption | undefined;
  subject: string;
  contentHTML: string;
  template: IOption | undefined;
  emailFields: IOption[];
  attachments: IFile[];
  leadTypeInternalName?: string;
}

interface ISendEmailOptions {
  showCc: boolean;
  showBcc: boolean;
  showReplyTo: boolean;
  matchFromAndReplyTo: boolean;
  showSuccessMessage: boolean;
  successMessage?: string;
  enableTestEmailFeature?: boolean;
}

interface ISendEmailStore {
  fields: ISendEmailFields;
  setFields: (value: Partial<ISendEmailFields>) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  options: ISendEmailOptions;
  setOptions: (value: Partial<ISendEmailOptions>) => void;
  emailConfig?: IAugmentedEmailConfig;
  setEmailConfig: (value: IAugmentedEmailConfig) => void;
  sendingEmail: boolean;
  setSendingEmail: (value: boolean) => void;
  fieldError: Record<FieldTypes, string | undefined>;
  setFieldError: (value: Record<FieldTypes, string | undefined>) => void;
  reset: () => void;
  leadTypeInternalName?: string;
  updateScheduleEmailCount: unknown;
  setUpdateScheduleEmail: (value: unknown) => void;
}

interface IAttachmentSettings {
  AllowedMaxFiles: string;
  AllowedMaxSize: string;
}

interface IEmailCategory {
  Code: number;
  CreatedBy: string;
  CreatedOn: string;
  Description: string;
  Id: string;
  ModifiedBy: string;
  ModifiedOn: string;
  Name: string;
  Status: number;
  SubscribeCode: number;
  SubscribeScore: number;
  UnsubscribeCode: number;
  UnsubscribeScore: number;
}

interface IEmailRecipientsSetting {
  AllowNewEmailsInCC: number;
  Limit: number;
}

interface IEmailSettings {
  ChooseSpecificEmailSenders?: string;
  RestrictAllMobileUsersAsEmailSenders?: boolean | string;
  ReplyToEnabledInOneToOneEmail?: boolean;
  ReplyToEnabledInBulkEmail?: boolean;
}

interface IEmailConfigResponse {
  AttachmentSettings: IAttachmentSettings;
  EmailCategories: IEmailCategory[];
  EmailRecipientsSetting: IEmailRecipientsSetting;
  HasCreateTemplateAccess: boolean;
  IsTrackableEmail: boolean;
  SelectedEmailFields: string;
  Settings: IEmailSettings;
  IsCategoryMandatory?: boolean;
}

interface IMailMergeOption {
  label: string;
  options: IOption[];
}

interface IAugmentedEmailConfig {
  leadRepresentationName: IEntityRepresentationName;
  emailCategories: IOption[];
  allowNewEmailsInCC: boolean;
  isTrackableEmail: boolean;
  selectedEmailFields: string;
  mailMergeOptions: IMailMergeOption[];
  entityEmailFields: IOption[];
  settings?: IEmailSettings;
}

interface ITemplate {
  ContentTemplateAutoId: number;
  ContentTemplateId: string;
  Name: string;
  StatusReason: number;
  Category: number;
  ContentFooter: string;
  ContentSetting: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Content_Html_Published: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Content_Text_Published: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Layout_Published: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Subject_Published: string;
  Total: number;
}
interface ITemplateResponse {
  List: ITemplate[];
  RecordCount: number;
}

interface ISaveTemplateResponse {
  IsCreated: boolean;
  TemplateId: string;
}

interface IActivity {
  ActivityEvent?: number;
  ActivityType?: number;
  ActivityId?: string;
}

interface IOpportunity {
  ProspectOpportunityId: string;
  OpportunityEventId: number;
  OpportunityName: string;
  IsEmailFromOpportunity?: boolean;
}

interface IGetEmailData {
  callerSource: CallerSource;
  activity?: IActivity;
  opportunity?: IOpportunity;
  toLead?: IOption[];
}

export interface IRetrieveEmailData {
  SelectedEmailFields?: string;
  EmailData?: IEmailData;
  LeadData?: ILeadData;
}

export interface IEmailData {
  From?: string;
  ToProspectId?: null | string;
  FromType?: number;
  Subject?: string;
  ContentHTML?: string;
  PublishedSubject?: null | string;
  ContentText?: null | string;
  ContentType?: number;
  IncludeViewInBrowserMarkup?: boolean;
  IncludeUnSubscribeMarkup?: boolean;
  CustomSenderName?: null | string;
  IncludeCanSpamMarkup?: boolean;
  RelatedObjectId?: null | string;
  RelatedObjectType?: null | string;
  CampaignType?: number;
  SendNow?: boolean;
  To?: string;
  SentOn?: Date;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ReplyTo_UserId: null | string;
}

export interface ILeadData {
  FirstName?: string;
  LastName?: string;
  EmailAddress?: string;
  DoNotEmail?: string;
  CanUpdate?: string;
}

interface IGetToFields {
  emailData: IRetrieveEmailData;
  toLead?: IOption[];
}

interface IGetSubject {
  emailData: IRetrieveEmailData;
}

interface IGetContentHtml {
  emailData: IRetrieveEmailData;
}

interface IAttachedFilePayload {
  CampaignAttachmentId: string;
  AttachmentFileName: string;
  FileName: string;
  AttachmentSource: string | undefined;
  Filesize: number;
  FileUrl: string;
  CanPreview: boolean;
}

export type {
  ICcBccOption,
  IHtmlAttributes,
  ISendEmailStore,
  IOption,
  IEmailConfigResponse,
  IAugmentedEmailConfig,
  IEmailCategory,
  IEmailSettings,
  IMailMergeOption,
  ITemplateResponse,
  ITemplate,
  ISendEmailFields,
  ISendEmailOptions,
  ISaveTemplateResponse,
  IActivity,
  IOpportunity,
  IGetEmailData,
  IGetToFields,
  IGetSubject,
  IGetContentHtml,
  IAttachedFilePayload
};
export { OptionCategory, FieldTypes };
