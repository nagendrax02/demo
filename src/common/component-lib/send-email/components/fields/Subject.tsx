import { CONSTANTS } from '../../constants';
import useSendEmailStore from '../../send-email.store';
import styles from './email-fields.module.css';
import TemplateSelector from './TemplateSelector';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const BaseInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/base-input')));

const Subject = (): JSX.Element => {
  const { fields, setFields, fieldError, setFieldError } = useSendEmailStore();

  return (
    <div className={styles.field}>
      <div className={`${styles.field_name} ${styles.mandatory}`}>{CONSTANTS.SUBJECT}</div>
      <div>
        <BaseInput
          value={fields?.subject}
          setValue={(newVal) => {
            if (fieldError?.Subject) {
              setFieldError({ ...fieldError, Subject: undefined });
            }
            setFields({ subject: newVal });
          }}
          customStyleClass={`${styles.field_value} ${styles.subject_input} ${
            fieldError?.Subject ? styles.input_error : ''
          }`}
        />
        {fieldError?.Subject ? (
          <div className={styles.field_error}>{fieldError?.Subject}</div>
        ) : null}
      </div>
      <TemplateSelector />
    </div>
  );
};

export default Subject;
