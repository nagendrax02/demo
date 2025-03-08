/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { IEntityRepresentationName } from 'src/apps/entity-details/types/entity-data.types';
import {
  IActivity,
  IAugmentedEmailConfig,
  IOpportunity,
  IOption,
  ISendEmailFields,
  ISendEmailOptions
} from '../send-email.types';
import {
  getAdvancedConfigSettings,
  getContentHtml,
  getEmailConfig,
  getEmailData,
  getEmailDataFromLeads,
  getFromUser,
  getSubject,
  getToFields
} from './fetch-config';
import { getAugmentedEmailConfig } from './augment-config';
import { getToField, getIsReplyToEnabled, getSelectedEmailFields } from './augment-data';
import { INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { CallerSource } from 'common/utils/rest-client';
import { trackError } from 'common/utils/experience';

interface IInitializeSendEmail {
  to: IOption[];
  fromId: string;
  leadRepresentationName: IEntityRepresentationName;
  setEmailConfig: (value: IAugmentedEmailConfig) => void;
  setFields: (value: Partial<ISendEmailFields>) => void;
  setOptions: (value: Partial<ISendEmailOptions>) => void;
  callerSource: CallerSource;
  activity?: IActivity;
  opportunity?: IOpportunity;
  showAlert: (notification: INotification) => void;
  leadTypeInternalName?: string;
  enableTestEmailFeature?: boolean;
}

interface IUpdateToField {
  to: IOption[];
  fields: ISendEmailFields;
  emailConfig?: IAugmentedEmailConfig;
  callerSource: CallerSource;
  showAlert: (notification: INotification) => void;
  setFields: (value: Partial<ISendEmailFields>) => void;
  setOptions: (value: Partial<ISendEmailOptions>) => void;
}

const initializeSendEmail = async ({
  to,
  fromId,
  setFields,
  leadRepresentationName,
  setEmailConfig,
  setOptions,
  activity,
  opportunity,
  showAlert,
  callerSource,
  leadTypeInternalName,
  enableTestEmailFeature
}: IInitializeSendEmail): Promise<void> => {
  const [emailConfig, advancedConfigSettings, emailDataFromLeads, fromUser, emailData] =
    await Promise.all([
      getEmailConfig(callerSource),
      getAdvancedConfigSettings(callerSource),
      getEmailDataFromLeads(callerSource, leadTypeInternalName),
      getFromUser(fromId, callerSource),
      getEmailData({
        activity,
        opportunity: opportunity,
        toLead: to,
        callerSource
      })
    ]);

  const augmentedEmailConfig = getAugmentedEmailConfig({
    emailConfig: emailConfig,
    advancedConfigSettings: advancedConfigSettings,
    emailDataFromLeads: emailDataFromLeads,
    leadRepresentationName: leadRepresentationName
  });

  const selectedEmailField = getSelectedEmailFields(
    augmentedEmailConfig?.entityEmailFields,
    augmentedEmailConfig?.selectedEmailFields
  );

  setFields({ emailFields: selectedEmailField });
  setEmailConfig(augmentedEmailConfig);

  if (augmentedEmailConfig.emailCategories.length) {
    setFields({ emailCategory: augmentedEmailConfig.emailCategories?.[0] });
  }
  const toOptions = await getToField({
    toField: to,
    emailFields: selectedEmailField,
    selectedEmailCategory: augmentedEmailConfig.emailCategories?.[0],
    showAlert,
    leadRepName: augmentedEmailConfig?.leadRepresentationName,
    callerSource
  });
  setFields({ to: toOptions });

  if (augmentedEmailConfig?.settings) {
    setOptions({ showReplyTo: getIsReplyToEnabled(toOptions, augmentedEmailConfig.settings) });
  }

  if (fromUser) {
    setFields({ from: fromUser, replyTo: fromUser });
  }

  if (emailData?.EmailData) {
    const toField = getToFields({ emailData, toLead: to });
    const subject = getSubject({ emailData });
    const htmlContent = getContentHtml({ emailData });
    if (toField?.length) setFields({ to: toField });
    if (subject) {
      setFields({ subject: subject });
    }
    if (htmlContent) {
      setFields({ contentHTML: htmlContent });
    }
  }

  if (enableTestEmailFeature) {
    setOptions({ enableTestEmailFeature: enableTestEmailFeature });
  }
};

const updateToField = async ({
  to,
  fields,
  emailConfig,
  callerSource,
  showAlert,
  setFields,
  setOptions
}: IUpdateToField): Promise<void> => {
  try {
    const toOptions = await getToField({
      toField: to,
      emailFields: fields?.emailFields,
      selectedEmailCategory: emailConfig?.emailCategories?.[0],
      showAlert,
      leadRepName: emailConfig?.leadRepresentationName,
      callerSource
    });

    setFields({ to: toOptions });

    if (emailConfig?.settings) {
      setOptions({ showReplyTo: getIsReplyToEnabled(toOptions, emailConfig.settings) });
    }
  } catch (err) {
    trackError(err);
  }
};

export { initializeSendEmail, updateToField };
