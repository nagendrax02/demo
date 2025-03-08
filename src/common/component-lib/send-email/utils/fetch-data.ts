import { trackError } from 'common/utils/experience/utils/track-error';
import { isEmailValid } from 'common/utils/helpers';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { GroupConfig, IGroupedOption } from '../../grouped-option-dropdown';
import { API_URL, CONSTANTS, OPTION_GROUP_CONFIG } from '../constants';
import { ICcBccOption, IOption, OptionCategory } from '../send-email.types';
import styles from '../send-email.module.css';
import { IEntityRepresentationName } from 'src/apps/entity-details/types/entity-data.types';
import { getAugmentedDisplayText, getFormatedValues } from './augment-data';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';

const getIsOptionDisabled = (option: ICcBccOption): boolean => {
  if (option?.category === OptionCategory.MailMergeField) {
    return false;
  }
  let disabled = false;
  if (!option?.Data || !isEmailValid(option?.Data)) {
    disabled = true;
  } else if (
    option?.HtmlAttributes?.[0]?.Value === '1' ||
    option?.HtmlAttributes?.DoNotEmail === '1'
  ) {
    disabled = true;
  }

  return disabled;
};

const getSecondaryLabel = (option: ICcBccOption): string | undefined => {
  let secondaryLabel: string | undefined = undefined;

  if (option?.category !== OptionCategory.MailMergeField) {
    if (option?.Data && isEmailValid(option?.Data)) {
      secondaryLabel = `(${option?.Data})`;
    } else {
      secondaryLabel = '[No Email]';
    }
  }
  return secondaryLabel;
};

const getMenuTooltipMessage = (
  option: ICcBccOption,
  leadRepresentationName: IEntityRepresentationName
): string | undefined => {
  let message: string | undefined = undefined;
  const leadRepName = leadRepresentationName?.SingularName || 'Lead';
  if (option?.category === OptionCategory.MailMergeField) {
    return message;
  }
  if (!option?.Data || !isEmailValid(option?.Data)) {
    message = `${leadRepName} without email cannot be added`;
  } else if (
    option?.HtmlAttributes?.[0]?.Value === '1' ||
    option?.HtmlAttributes?.DoNotEmail === '1'
  ) {
    message = `${leadRepName} has opted out from email communication`;
  }
  return message;
};

const getInputTooltipMessage = (
  option: ICcBccOption,
  leadRepresentationName: IEntityRepresentationName
): string | undefined => {
  let message: string | undefined = undefined;
  if (option?.category === OptionCategory.MailMergeField) {
    message = option?.category;
  } else if (option?.Data) {
    message = option?.Data ? option?.Data : option?.category;
  } else {
    if (option?.category === OptionCategory.Lead) {
      message = leadRepresentationName.SingularName;
    } else {
      message = option?.category;
    }
  }
  return message;
};

const getInputCustomStyleClass = (option: ICcBccOption): string | undefined => {
  let menuCustomStyleClass: string | undefined = undefined;
  if (option?.category === OptionCategory.Lead) {
    menuCustomStyleClass = styles.lead_selected_option;
  } else {
    menuCustomStyleClass = styles.user_selected_option;
  }
  return menuCustomStyleClass;
};

const getAugmentedLabel = (
  option: ICcBccOption,
  leadRepresentationName?: IEntityRepresentationName
): string => {
  let augmentedLabel = option?.Label || '[No Name]';
  if (option?.category === OptionCategory.MailMergeField && leadRepresentationName?.SingularName) {
    augmentedLabel = augmentedLabel?.replace(CONSTANTS.LEAD, leadRepresentationName?.SingularName);
  }
  augmentedLabel = getAugmentedDisplayText(augmentedLabel);
  return augmentedLabel;
};

const getAugmentedOption = (
  option: ICcBccOption,
  leadRepresentationName: IEntityRepresentationName,
  toFieldData: IGroupedOption[]
): IGroupedOption | undefined => {
  let augmentedOption: IGroupedOption | undefined = undefined;
  if (option?.category === OptionCategory.MailMergeField && toFieldData?.length > 1)
    return undefined;
  if (option?.Value) {
    augmentedOption = {
      label: getAugmentedLabel(option, leadRepresentationName),
      value: option?.Value,
      group: option?.category,
      disabled: getIsOptionDisabled(option),
      secondaryLabel: getSecondaryLabel(option),
      menuTooltipMessage: getMenuTooltipMessage(option, leadRepresentationName),
      inputTooltipMessage: getInputTooltipMessage(option, leadRepresentationName),
      inputCustomStyleClass: getInputCustomStyleClass(option)
    } as IGroupedOption;
  }
  return augmentedOption;
};

const getAugmentedDropdownData = (
  data: ICcBccOption[],
  leadRepresentationName: IEntityRepresentationName,
  toFieldData: IGroupedOption[]
): IGroupedOption[] => {
  const augmentedData: IGroupedOption[] = [];
  data.forEach((option) => {
    const augmentedOption = getAugmentedOption(option, leadRepresentationName, toFieldData);
    if (augmentedOption) {
      augmentedData.push(augmentedOption);
    }
  });
  return augmentedData;
};

const getOptionGroupConfig = (
  toLeads: IGroupedOption[],
  leadRepresentationName?: IEntityRepresentationName
): GroupConfig => {
  if (leadRepresentationName?.PluralName) {
    return {
      ...OPTION_GROUP_CONFIG,
      [OptionCategory.Lead]: {
        ...OPTION_GROUP_CONFIG[OptionCategory.Lead],
        displayName: leadRepresentationName?.PluralName.toUpperCase(),
        emptyGroupMessage: `No ${leadRepresentationName?.PluralName} found`
      },
      [OptionCategory.MailMergeField]: {
        ...OPTION_GROUP_CONFIG[OptionCategory.MailMergeField],
        hideGroup: toLeads?.length > 1
      }
    };
  }
  return OPTION_GROUP_CONFIG;
};

const fetchCcBccOptions = async ({
  searchText = '',
  pageSize = 10,
  isOpportunity = false,
  leadRepresentationName,
  callerSource,
  toFieldData
}: {
  searchText?: string;
  pageSize?: number;
  isOpportunity?: boolean;
  leadRepresentationName: IEntityRepresentationName;
  callerSource: CallerSource;
  toFieldData: IGroupedOption[];
}): Promise<IGroupedOption[]> => {
  try {
    const searchBody = {
      SearchText: searchText,
      PageSize: pageSize,
      IsOpportunity: isOpportunity
    };

    const response = (await httpPost({
      path: API_URL.CC_BCC,
      module: Module.LeadManagement,
      body: searchBody,
      callerSource
    })) as ICcBccOption[];

    const augmentedData = getAugmentedDropdownData(response, leadRepresentationName, toFieldData);
    return augmentedData;
  } catch (error) {
    trackError('Failed to fetch cc/bcc options', error);
  }
  return [];
};

interface IGetUnblockedLeads {
  toLeads: IOption[];
  emailFields: IOption[];
  selectedEmailCategory?: IOption;
  showAlert: (notification: INotification) => void;
  callerSource: CallerSource;
  leadRepName?: IEntityRepresentationName;
}

const getUnblockedLeads = async ({
  toLeads,
  emailFields,
  selectedEmailCategory,
  showAlert,
  leadRepName,
  callerSource
}: IGetUnblockedLeads): Promise<IOption[]> => {
  const body = {
    LeadIdCSV: getFormatedValues(toLeads, ','),
    RecipientEmailFields: getFormatedValues(emailFields, ','),
    SelectedCategory: `${selectedEmailCategory?.value !== '0' ? selectedEmailCategory?.value : ''}`
  };

  const response = (await httpPost({
    path: API_URL.RETRIEVE_BLOCKED_LEADS,
    module: Module.Marvin,
    body: body,
    callerSource
  })) as string[] | undefined;

  if (response && response?.length) {
    const [unblockedLeads, blockedLeads] = [
      toLeads.filter((lead) => !response.includes(`${lead?.value}`)),
      toLeads.filter((lead) => response.includes(`${lead?.value}`))
    ];
    if (blockedLeads?.length) {
      const blockedLeadNames = blockedLeads.map((option) => option.label)?.join(', ');
      showAlert({
        type: Type.ERROR,
        message: `You cannot send ${selectedEmailCategory?.label ?? ''} mails to the following ${
          leadRepName?.PluralName || 'Leads'
        } - ${blockedLeadNames}`
      });
    }
    return unblockedLeads;
  }

  return toLeads;
};

export { fetchCcBccOptions, getOptionGroupConfig, getUnblockedLeads };
