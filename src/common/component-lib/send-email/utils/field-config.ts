import { IAugmentedEmailConfig, OptionCategory } from '../send-email.types';
import {
  ICreateNewOptionConfig,
  IGroupedOption
} from '../../grouped-option-dropdown/grouped-option-dropdown.types';
import styles from '../send-email.module.css';
import { isEmailValid } from '../../../utils/helpers';

const canCreateNewOption = (inputText: string, searchedOptions: IGroupedOption[]): boolean => {
  if (searchedOptions?.length) {
    const duplicateOptionIndex = searchedOptions?.findIndex((opt) => opt?.value === inputText);
    if (duplicateOptionIndex === -1 && isEmailValid(inputText)) return true;
  }
  return false;
};

const getNewlyCreatedOption = (inputText: string): IGroupedOption => {
  return {
    label: inputText,
    value: inputText,
    group: OptionCategory.Lead,
    inputCustomStyleClass: styles.lead_selected_option,
    newlyCreatedOption: true
  };
};

const getCreateNewOptionConfig = (
  emailConfig?: IAugmentedEmailConfig
): ICreateNewOptionConfig | undefined => {
  if (emailConfig?.allowNewEmailsInCC) {
    return {
      optionPlaceholder: emailConfig?.leadRepresentationName?.SingularName || OptionCategory.Lead,
      group: OptionCategory.Lead,
      canCreateNewOption: canCreateNewOption,
      getNewlyCreatedOption: getNewlyCreatedOption
    };
  }
  return undefined;
};

export { getCreateNewOptionConfig };
