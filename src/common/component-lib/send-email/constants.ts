import { IEntityRepresentationName } from 'src/apps/entity-details/types/entity-data.types';
import { GroupConfig } from '../grouped-option-dropdown';
import { IMailMergeOption, OptionCategory } from './send-email.types';
import styles from './send-email.module.css';

const CONSTANTS = {
  SEND_EMAIL: 'Send Email',
  TEST_EMAIL: 'Test Email',
  TO: 'To',
  FROM: 'From',
  SUBJECT: 'Subject',
  CC: 'CC',
  BCC: 'BCC',
  SEND: 'Send',
  SENDING: 'Sending',
  SCHEDULE_EMAIL: 'Schedule Email',
  TEST_EMAIL_CONTENT: 'Test Email Content',
  SEND_EMAIL_BUTTON_TOOLTIP_MESSAGE: 'Test your mail content to enable',
  TEST_EMAIL_HEADER_DESCRIPTION:
    'Send this email to yourself or others to make sure your content renders correctly.',
  EDITOR_PLACEHOLDER: 'Write your email here. Tip - type “@” to add mail merge values.',
  LEADS: 'LEADS',
  USERS: 'USERS',
  EMAIL_CATEGORIES: 'Email Categories',
  MAIL_MERGE_FIELDS: 'MAIL MERGE FIELDS',
  REPLY_TO: 'Reply To',
  LEAD: 'Lead',
  SAVE_AS_TEMPLATE: 'Save as template',
  SAVE: 'Save',
  SCHEDULE: 'Schedule',
  SEND_TEST_EMAIL: 'Send Test Email',
  CANCEL: 'Cancel',
  SAVE_AND_PUBLISH: 'Save & Publish',
  TEMPLATE_UPDATE_MSG: 'Email {{name}} updated successfully.',
  TEMPLATE_ADDED_MSG: '{{name}} successfully added to the Email Library.',
  ENTRY_EXCEPTION_MESSAGE: 'An email library with given name already exists.',
  INPUT_EXCEPTION_MESSAGE: 'Invalid input data',
  NAME_REQUIRED: 'Name is required',
  RENAME_FILE: 'Rename File',
  RENAME: 'Rename',
  TYPE_TO_SEARCH: 'Type to search...',
  EMAIL_CONFIRMATION_TITLE: 'Email Sending Confirmation',
  EMAIL_CONFIRMATION_DESCRIPTION:
    'Are you sure you want to send this email to the Lead Plural? The email cannot be cancelled once it is sent',
  DO_NOT_SHOW_TEXT: 'Do not show this message again',
  YES_SEND: 'Yes, Send',
  CANCEL_REVIEW: 'Cancel and Review',
  DO_NOT_SHOW_LIST_SEND_EMAIL_CONFIRMATION: 'DO_NOT_SHOW_LIST_SEND_EMAIL_CONFIRMATION'
};

const INVALID_NAME_CHARS = ['<', '>', '*', '/', '\\', '|', '"', '?'];

const ICONS = {
  LEAD: 'person',
  USER: 'assignment_ind',
  MAIL_MERGE_FIELD: 'alternate_email'
};

const API_URL = {
  SETTING_GET: '/Setting/Get',
  CC_BCC: '/Email/Users/DropDownOptions/Get',
  MODAL_CONFIG: '/EmailCampaign/EmailModel/Get',
  USER_GET: '/User/Get',
  SEND_EMAIL: '/EmailCampaign/SendToLeads',
  TEMPLATE_GET: '/EmailCampaign/RetrieveEmailTemplates',
  TEMPLATE_SAVE: '/EmailCampaign/SaveTemplate',
  RETRIEVE_BLOCKED_LEADS: '/EmailCampaign/RetrieveBlockedLeads'
};

const EMAIL_SETTINGS = {
  REPLY_TO_ENABLED_IN_ONE_TO_TO_EMAIL: 'ReplyToEnabledInOneToOneEmail',
  REPLY_TO_ENABLED_IN_BULK_EMAIL: 'ReplyToEnabledInBulkEmail'
};

const OPTION_GROUP_CONFIG: GroupConfig = {
  [OptionCategory.Lead]: {
    displayName: CONSTANTS.LEADS,
    icon: ICONS.LEAD,
    customStyleClass: styles.lead_group,
    displayOrder: 1
  },
  [OptionCategory.User]: {
    displayName: CONSTANTS.USERS,
    icon: ICONS.USER,
    customStyleClass: styles.user_group,
    displayOrder: 2,
    emptyGroupMessage: 'No Users found'
  },
  [OptionCategory.MailMergeField]: {
    displayName: CONSTANTS.MAIL_MERGE_FIELDS,
    icon: ICONS.MAIL_MERGE_FIELD,
    customStyleClass: styles.user_group,
    displayOrder: 3,
    emptyGroupMessage: 'No Mail Merge Fields found'
  }
};

const DEFAULT_LEAD_REPRESENTATION_NAME: IEntityRepresentationName = {
  SingularName: 'Lead',
  PluralName: 'Leads'
};

const DEFAULT_EMAIL_CATEGORY = [
  {
    value: '0',
    label: ' '
  }
];

const MAX_LABEL_CHAR_LIMIT = {
  mobile: 16,
  web: 24
};

const DO_NOT_SHOW_SEND_EMAIL_CONFIRMATION_MODAL = {
  EXPIRY_TYPE: 3,
  EXPIRE_IN: 3650
};

const DEFAULT_SUCCESS_MESSAGE = 'Email sent successfully!';
const SCHEDULE_SUCCESS_MESSAGE = 'Email scheduled successfully!';
const LIST_SEND_EMAIL_SUCCESS_MESSAGE =
  'Email is successfully scheduled for {totalRecepeirnts} of {memberCount} members of list {name}';

const MIN_ONE_LEAD_REQUIRED_MESSAGE =
  'Lead cannot be removed. At least one recipient must be present in the email.';

const mockRepresentationName: IEntityRepresentationName = {
  SingularName: 'test',
  PluralName: 'tests'
};

export const accountMailMergeOptions: IMailMergeOption = {
  options: [
    { value: '{Account:City,}', label: 'City' },
    {
      value: '{Account:CompanyName,}',
      label: 'Company Name'
    },
    { value: '{Account:Country,}', label: 'Country' },
    { value: '{Account:Fax,}', label: 'Fax' },
    { value: '{Account:Phone,}', label: 'Phone' },
    { value: '{Account:State,}', label: 'State' },
    { value: '{Account:Street1,}', label: 'Street1' },
    { value: '{Account:Street2,}', label: 'Street2' },
    { value: '{Account:TimeZone,}', label: 'TimeZone' },
    { value: '{Account:Website,}', label: 'Website' },
    { value: '{Account:Zip,}', label: 'Zip' }
  ],
  label: 'Account Fields'
};

export const senderMailMergeOptions: IMailMergeOption = {
  options: [
    {
      value: '{Sender:EmailAddress,}',
      label: 'Email Address'
    },
    {
      value: '{Sender:FirstName,}',
      label: 'First Name'
    },
    {
      value: '{Sender:FullName,}',
      label: 'Full Name'
    },
    {
      value: '{Sender:LastName,}',
      label: 'Last Name'
    },
    {
      value: '{Sender:MiddleName,}',
      label: 'Middle Name'
    },
    {
      value: '{Sender:Signature,}',
      label: 'Signature'
    },
    {
      value: '{Sender:TimeZone,}',
      label: 'Time Zone'
    },
    {
      value: '{Sender:AssociatedPhoneNumbers,}',
      label: 'Phone Number'
    }
  ],
  label: 'Sender Fields'
};

export const ownerMailMergeOptions: IMailMergeOption = {
  options: [
    {
      value: '{Owner:EmailAddress,}',
      label: 'Email Address'
    },
    {
      value: '{Owner:FirstName,}',
      label: 'First Name'
    },
    {
      value: '{Owner:FullName,}',
      label: 'Full Name'
    },
    {
      value: '{Owner:LastName,}',
      label: 'Last Name'
    },
    {
      value: '{Owner:MiddleName,}',
      label: 'Middle Name'
    },
    {
      value: '{Owner:TimeZone,}',
      label: 'Time Zone'
    },
    {
      value: '{Owner:AssociatedPhoneNumbers,}',
      label: 'Phone Number'
    }
  ],
  label: 'Owner Fields'
};

export {
  CONSTANTS,
  API_URL,
  OPTION_GROUP_CONFIG,
  DEFAULT_EMAIL_CATEGORY,
  EMAIL_SETTINGS,
  DEFAULT_LEAD_REPRESENTATION_NAME,
  MAX_LABEL_CHAR_LIMIT,
  DEFAULT_SUCCESS_MESSAGE,
  mockRepresentationName,
  SCHEDULE_SUCCESS_MESSAGE,
  DO_NOT_SHOW_SEND_EMAIL_CONFIRMATION_MODAL,
  MIN_ONE_LEAD_REQUIRED_MESSAGE,
  INVALID_NAME_CHARS,
  LIST_SEND_EMAIL_SUCCESS_MESSAGE
};
