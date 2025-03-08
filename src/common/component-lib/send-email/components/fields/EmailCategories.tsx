import styles from './email-fields.module.css';
import { CONSTANTS } from '../../constants';
import useSendEmailStore from '../../send-email.store';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const EmailCategories = (): JSX.Element => {
  const { fields, setFields, emailConfig, fieldError } = useSendEmailStore();

  const fetchOptions = (): IOption[] => {
    const options: IOption[] = [];
    emailConfig?.emailCategories?.forEach((category) => {
      options.push({
        label: category.label,
        value: `${category.value}`
      });
    });
    return options;
  };

  const handleCategorySelect = (category: IOption[]): void => {
    setFields({ emailCategory: category[0] });
  };

  return (
    <div className={styles.field}>
      <div className={`${styles.field_name}`}>{CONSTANTS.EMAIL_CATEGORIES}</div>
      <div>
        <Dropdown
          fetchOptions={fetchOptions}
          selectedValues={[fields.emailCategory as IOption]}
          disableSearch
          setSelectedValues={handleCategorySelect}
          customStyleClass={`${styles.field_value} ${styles.dropdown_value} ${
            fieldError?.EmailCategories ? styles.input_error : ''
          }`}
          hideClearButton
          showCheckIcon
        />
        {fieldError?.EmailCategories ? (
          <div className={styles.field_error}>{fieldError?.EmailCategories}</div>
        ) : null}
      </div>
    </div>
  );
};

export default EmailCategories;
