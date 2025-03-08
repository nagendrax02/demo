import Icon from '@lsq/nextgen-preact/icon';
import { CONSTANTS, DEFAULT_LEAD_REPRESENTATION_NAME } from '../../constants';
import useSendEmailStore from '../../send-email.store';
import styles from './email-fields.module.css';
import GroupedOptionDropdown, { IGroupedOption } from '../../../grouped-option-dropdown';
import { fetchCcBccOptions, getOptionGroupConfig } from '../../utils/fetch-data';
import { getCreateNewOptionConfig } from '../../utils/field-config';
import { CallerSource } from 'src/common/utils/rest-client';

const Cc = ({ callerSource }: { callerSource: CallerSource }): JSX.Element => {
  const { fields, setFields, setOptions, fieldError, emailConfig } = useSendEmailStore();

  const getHideCcButton = (): JSX.Element => {
    return (
      <div
        className={styles.cc_bcc_hide_button_wrapper}
        data-testid="cc-field-hide-button"
        onClick={() => {
          setOptions({ showCc: false });
          setFields({ cc: [] });
        }}>
        <Icon name="clear" customStyleClass={styles.cc_bcc_hide_button} />
      </div>
    );
  };

  const handleFetchOption = async (searchText: string): Promise<IGroupedOption[]> => {
    const response = await fetchCcBccOptions({
      searchText: searchText,
      leadRepresentationName:
        emailConfig?.leadRepresentationName || DEFAULT_LEAD_REPRESENTATION_NAME,
      callerSource: callerSource,
      toFieldData: fields?.to
    });
    return response;
  };

  const handleOptionSelect = (selectedOption: IGroupedOption): void => {
    if (fields.cc.findIndex((option) => option.value === selectedOption.value) < 0) {
      const temp = [...fields.cc];
      temp.push(selectedOption);
      setFields({ cc: temp });
    }
  };

  const handleOptionClear = (selectedOption: IGroupedOption): void => {
    const selectedOptionIndex = fields.cc.findIndex(
      (option) => option.value === selectedOption.value
    );
    if (selectedOptionIndex > -1) {
      const temp = [...fields.cc];
      temp.splice(selectedOptionIndex, 1);
      setFields({ cc: temp });
    }
  };

  return (
    <div className={`${styles.field}`} data-testid="cc-field">
      <div className={`${styles.field_name}`}>{CONSTANTS.CC}</div>
      <div>
        <GroupedOptionDropdown
          placeholder={CONSTANTS.TYPE_TO_SEARCH}
          selectedOptions={fields?.cc}
          swapOrientation={false}
          fetchOptions={handleFetchOption}
          onOptionSelect={handleOptionSelect}
          onOptionClear={handleOptionClear}
          groupConfig={getOptionGroupConfig(fields?.to, emailConfig?.leadRepresentationName)}
          customStyleClass={`${styles.option_input} ${fieldError?.Cc ? styles.input_error : ''}`}
          createNewOptionConfig={getCreateNewOptionConfig(emailConfig)}
        />
        {fieldError?.Cc ? <div className={styles.field_error}>{fieldError?.Cc}</div> : null}
      </div>
      {getHideCcButton()}
    </div>
  );
};

export default Cc;
