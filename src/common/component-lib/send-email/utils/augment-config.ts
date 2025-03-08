import { IEntityRepresentationName } from 'src/apps/entity-details/types/entity-data.types';
import {
  accountMailMergeOptions,
  DEFAULT_EMAIL_CATEGORY,
  ownerMailMergeOptions,
  senderMailMergeOptions
} from '../constants';
import {
  IAugmentedEmailConfig,
  IEmailCategory,
  IEmailConfigResponse,
  IEmailSettings,
  IMailMergeOption,
  IOption
} from '../send-email.types';

export const getMappedEmailCategoriesOptions = (emailCategories: IEmailCategory[]): IOption[] => {
  const mappedEmailCategories = emailCategories.map((category) => {
    return {
      value: category.Code,
      label: category.Name
    };
  });
  return mappedEmailCategories;
};

const getAugmentedEmailCategories = (emailConfig: IEmailConfigResponse): IOption[] => {
  let augmentedEmailCategories: IOption[] = [];
  if (emailConfig.EmailCategories && emailConfig.EmailCategories.length !== 0) {
    augmentedEmailCategories = [
      ...DEFAULT_EMAIL_CATEGORY,
      ...getMappedEmailCategoriesOptions(emailConfig.EmailCategories)
    ];
  } else if (emailConfig.IsCategoryMandatory) {
    augmentedEmailCategories = DEFAULT_EMAIL_CATEGORY;
  }
  return augmentedEmailCategories;
};

const getAllowNewEmailsInCC = (emailConfig: IEmailConfigResponse): boolean => {
  let allowNewEmailsInCC = false;
  if (
    emailConfig.EmailRecipientsSetting &&
    emailConfig.EmailRecipientsSetting.AllowNewEmailsInCC === 1
  ) {
    allowNewEmailsInCC = true;
  }
  return allowNewEmailsInCC;
};

const getIsTrackableEmail = (emailConfig: IEmailConfigResponse): boolean => {
  return emailConfig?.IsTrackableEmail || false;
};

const getSelectedEmailFields = (emailConfig: IEmailConfigResponse): string => {
  return emailConfig?.SelectedEmailFields || '';
};

const getEmailSettings = (
  emailConfig: IEmailConfigResponse,
  advancedConfigSettings: Record<string, boolean>
): IEmailSettings => {
  let settings: Record<string, string | boolean> = {
    ChooseSpecificEmailSenders: '',
    RestrictAllMobileUsersAsEmailSenders: false
  };

  if (emailConfig?.Settings) {
    settings = { ...settings, ...emailConfig.Settings };
  }
  if (advancedConfigSettings) {
    settings = { ...settings, ...advancedConfigSettings };
  }

  return settings;
};

const getMailMergeOptions = (
  rawData: Record<string, IOption[]>,
  leadRepresentationName: string
): IMailMergeOption[] => {
  const mailMergeFields: IMailMergeOption[] = [];
  Object.keys(rawData)?.forEach((group) => {
    if (rawData?.[group]?.length) {
      mailMergeFields.push({
        label: leadRepresentationName,
        options: rawData?.[group]
      });
    }
  });
  mailMergeFields.push(accountMailMergeOptions);
  mailMergeFields.push(ownerMailMergeOptions);
  mailMergeFields.push(senderMailMergeOptions);

  return mailMergeFields;
};

const getAugmentedEmailConfig = ({
  emailConfig,
  advancedConfigSettings,
  emailDataFromLeads,
  leadRepresentationName
}: {
  emailConfig: IEmailConfigResponse;
  advancedConfigSettings: Record<string, boolean>;
  emailDataFromLeads: Record<string, IOption[] | Record<string, IOption[]>>;
  leadRepresentationName: IEntityRepresentationName;
}): IAugmentedEmailConfig => {
  const augmentedEmailConfig: IAugmentedEmailConfig = {
    emailCategories: getAugmentedEmailCategories(emailConfig),
    allowNewEmailsInCC: getAllowNewEmailsInCC(emailConfig),
    isTrackableEmail: getIsTrackableEmail(emailConfig),
    selectedEmailFields: getSelectedEmailFields(emailConfig),
    mailMergeOptions: getMailMergeOptions(
      emailDataFromLeads?.mailMergeValues as Record<string, IOption[]>,
      leadRepresentationName.SingularName
    ),
    entityEmailFields: emailDataFromLeads?.emailFieldsValues as IOption[],
    settings: getEmailSettings(emailConfig, advancedConfigSettings),
    leadRepresentationName: leadRepresentationName
  };

  return augmentedEmailConfig;
};

export { getAugmentedEmailConfig };
