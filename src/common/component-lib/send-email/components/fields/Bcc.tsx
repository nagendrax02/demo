import Icon from '@lsq/nextgen-preact/icon';
import { CONSTANTS, DEFAULT_LEAD_REPRESENTATION_NAME } from '../../constants';
import useSendEmailStore from '../../send-email.store';
import styles from './email-fields.module.css';
import GroupedOptionDropdown, { IGroupedOption } from '../../../grouped-option-dropdown';
import { fetchCcBccOptions, getOptionGroupConfig } from '../../utils/fetch-data';
import { CallerSource } from 'src/common/utils/rest-client';

const Bcc = ({ callerSource }: { callerSource: CallerSource }): JSX.Element => {
  const { fields, setFields, options, setOptions, fieldError, emailConfig } = useSendEmailStore();

  const getHideBccButton = (): JSX.Element => {
    return (
      <div
        className={styles.cc_bcc_hide_button_wrapper}
        onClick={() => {
          setOptions({ ...options, showBcc: false });
          setFields({ ...fields, bcc: [] });
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
      callerSource,
      toFieldData: fields?.to
    });
    return response;
  };

  const handleOptionSelect = (selectedOption: IGroupedOption): void => {
    if (fields.bcc.findIndex((option) => option.value === selectedOption.value) < 0) {
      const temp = [...fields.bcc];
      temp.push(selectedOption);
      setFields({ bcc: temp });
    }
  };

  const handleOptionClear = (selectedOption: IGroupedOption): void => {
    const selectedOptionIndex = fields.bcc.findIndex(
      (option) => option?.value === selectedOption?.value
    );
    if (selectedOptionIndex > -1) {
      const temp = [...fields.bcc];
      temp.splice(selectedOptionIndex, 1);
      setFields({ bcc: temp });
    }
  };

  return (
    <div className={styles.field} data-testid="bcc-field">
      <div className={`${styles.field_name}`}>{CONSTANTS.BCC}</div>
      <div>
        <GroupedOptionDropdown
          placeholder={CONSTANTS.TYPE_TO_SEARCH}
          selectedOptions={fields?.bcc}
          swapOrientation={false}
          fetchOptions={handleFetchOption}
          onOptionSelect={handleOptionSelect}
          onOptionClear={handleOptionClear}
          groupConfig={getOptionGroupConfig(fields?.to, emailConfig?.leadRepresentationName)}
          customStyleClass={`${styles.option_input} ${fieldError?.Bcc ? styles.input_error : ''}`}
        />
        {fieldError?.Bcc ? <div className={styles.field_error}>{fieldError?.Bcc}</div> : null}
      </div>
      {getHideBccButton()}
    </div>
  );
};

export default Bcc;
