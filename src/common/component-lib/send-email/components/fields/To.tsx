import GroupedOptionDropdown, { IGroupedOption } from '../../../grouped-option-dropdown';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { CONSTANTS, MIN_ONE_LEAD_REQUIRED_MESSAGE, OPTION_GROUP_CONFIG } from '../../constants';
import useSendEmailStore from '../../send-email.store';
import EmailFieldSelector from './EmailFieldSelector';
import styles from './email-fields.module.css';

const To = (): JSX.Element => {
  const { fields, setFields, options, setOptions, fieldError, emailConfig } = useSendEmailStore();
  const { showAlert } = useNotification();

  const getCcBccToggle = (): JSX.Element => {
    return (
      <div className={styles.cc_bcc_toggle_wrapper}>
        {!options.showCc && !options?.enableTestEmailFeature ? (
          <div
            className={styles.cc_bcc_toggle}
            onClick={() => {
              setOptions({ showCc: true });
            }}>
            {CONSTANTS.CC}
          </div>
        ) : null}
        {!options.showBcc && !options?.enableTestEmailFeature ? (
          <div
            className={styles.cc_bcc_toggle}
            onClick={() => {
              setOptions({ showBcc: true });
            }}>
            {CONSTANTS.BCC}
          </div>
        ) : null}
      </div>
    );
  };

  const handleOptionClear = (selectedOption: IGroupedOption): void => {
    const selectedOptionIndex = fields.to.findIndex(
      (option) => option.value === selectedOption.value
    );
    if (selectedOptionIndex > -1 && fields.to.length > 1) {
      const temp = [...fields.to];
      temp.splice(selectedOptionIndex, 1);
      setFields({ to: temp });
    } else {
      showAlert({
        type: Type.ERROR,
        message: emailConfig?.leadRepresentationName?.SingularName
          ? MIN_ONE_LEAD_REQUIRED_MESSAGE.replace(
              CONSTANTS.LEAD,
              emailConfig?.leadRepresentationName?.SingularName
            )
          : MIN_ONE_LEAD_REQUIRED_MESSAGE
      });
      throw new Error();
    }
  };

  return (
    <div className={styles.field}>
      <div className={`${styles.field_name}`}>
        <div className={`${styles.mandatory}`}>{CONSTANTS.TO}</div>
        <EmailFieldSelector />
      </div>
      <div>
        <GroupedOptionDropdown
          selectedOptions={fields.to}
          onOptionClear={handleOptionClear}
          groupConfig={OPTION_GROUP_CONFIG}
          customStyleClass={`${styles.option_input} ${fieldError?.To ? styles.input_error : ''} ${
            options?.enableTestEmailFeature ? styles.disable_box : ''
          }`}
          editable={false}
        />
        {fieldError?.To ? <div className={styles.field_error}>{fieldError?.To}</div> : null}
      </div>
      {getCcBccToggle()}
    </div>
  );
};

export default To;
