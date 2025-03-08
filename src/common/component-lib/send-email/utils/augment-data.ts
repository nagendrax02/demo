import { trackError } from 'common/utils/experience/utils/track-error';
import { IGroupedOption } from '../../grouped-option-dropdown';
import { IEmailSettings, IOption, OptionCategory } from '../send-email.types';
import styles from '../send-email.module.css';
import { MAX_LABEL_CHAR_LIMIT } from '../constants';
import { getUnblockedLeads } from './fetch-data';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { CallerSource } from 'src/common/utils/rest-client';

const getFormatedValues = (values: IOption[], separator: string): string => {
  let formatedValues = '';
  if (values) {
    values.forEach((field, index) => {
      const newField = { ...field };
      if (separator === '[{MXSeparator}]' && newField.label === '') {
        const newValue = `[LSQ_NewEmailAddress]<${newField.value}>`;
        newField.value = newValue;
      }
      if (index === 0) formatedValues = `${newField.value}`;
      else formatedValues += `${separator}${newField.value}`;
    });
  }
  return formatedValues;
};

const getAugmentedDisplayText = (label: string, isMobile = false): string => {
  try {
    const maxCharLength = isMobile ? MAX_LABEL_CHAR_LIMIT.mobile : MAX_LABEL_CHAR_LIMIT.web;
    return label.length > maxCharLength ? label.substring(0, maxCharLength) + '...' : label;
  } catch (error) {
    trackError(error);
    return label;
  }
};

const getToField = async ({
  toField,
  emailFields,
  selectedEmailCategory,
  showAlert,
  leadRepName,
  callerSource
}: {
  toField: IOption[];
  emailFields: IOption[];
  selectedEmailCategory?: IOption;
  showAlert: (notification: INotification) => void;
  callerSource: CallerSource;
  leadRepName?: IEntityRepresentationName;
}): Promise<IGroupedOption[]> => {
  const augmentedToField: IGroupedOption[] = [];

  const response = await getUnblockedLeads({
    toLeads: toField,
    emailFields,
    selectedEmailCategory,
    showAlert,
    leadRepName,
    callerSource
  });

  response.forEach((field) => {
    if (field?.value) {
      augmentedToField.push({
        label: field.label ? getAugmentedDisplayText(field.label) : `${field.value}`,
        value: `${field.value}`,
        group: OptionCategory.Lead,
        inputCustomStyleClass: styles.lead_selected_option,
        inputTooltipMessage: leadRepName?.SingularName || OptionCategory.Lead
      });
    }
  });

  return augmentedToField;
};

const getCcBccFormattedList = (options: IGroupedOption[], separator: string): string => {
  let formatedValues = '';
  try {
    if (options) {
      options.forEach((field) => {
        const newField = { ...field };
        if (separator === '[{MXSeparator}]' && newField?.newlyCreatedOption) {
          const newValue = `[LSQ_NewEmailAddress]<${newField?.value}>`;
          newField.value = newValue;
        }

        formatedValues += `${newField.value}${separator}`;
      });
    }
    return formatedValues;
  } catch (error) {
    return formatedValues;
  }
};

const getSelectedEmailFields = (
  emailFieldsOptions: IOption[],
  selectedEmailFields: string
): IOption[] => {
  if (selectedEmailFields && emailFieldsOptions.length > 0) {
    const selectedEmailFieldsArray = selectedEmailFields.split(',');
    const selectedEmailFieldsOptions = emailFieldsOptions.filter(
      (option) => selectedEmailFieldsArray?.includes(`${option.value}`)
    );
    return selectedEmailFieldsOptions;
  }
  return emailFieldsOptions && emailFieldsOptions.length > 0 ? [emailFieldsOptions[0]] : [];
};

const getIsReplyToEnabled = (to: IGroupedOption[], settings: IEmailSettings): boolean => {
  // if isReplyToFieldEnabledOneToOne is true, show replyTo for single and multiple leads(SV)
  // if isReplyToFieldEnabledBulkEmail is true, show replyTo for list(to be added later)
  if (to?.length > 0 && settings?.ReplyToEnabledInOneToOneEmail) {
    return true;
  }
  return false;
};

const getLeadOwnerOption = (
  leadRepName?: IEntityRepresentationName
): {
  value: string;
  label: string;
} => {
  return {
    value: 'LeadOwner',
    label: `${leadRepName?.SingularName ? leadRepName?.SingularName : 'Lead'} Owner`
  };
};

export {
  getToField,
  getFormatedValues,
  getCcBccFormattedList,
  getSelectedEmailFields,
  getAugmentedDisplayText,
  getIsReplyToEnabled,
  getLeadOwnerOption
};
