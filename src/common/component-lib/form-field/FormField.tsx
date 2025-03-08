import React from 'react';
import styles from './form-field.module.css';
export interface IFormField {
  title: string;
  children: React.ReactNode;
  errorMessage?: string;
  dataTestId?: string;
  required?: boolean;
}

const FormField = ({
  title,
  children,
  errorMessage,
  dataTestId,
  required
}: IFormField): JSX.Element => {
  return (
    <div data-testId={dataTestId}>
      <div className={`${styles.label} form-field-title`}>
        {title}
        {required ? <span className={styles.required}>*</span> : null}{' '}
      </div>
      <div>{children}</div>
      <div className={styles.error} data-testid={`${dataTestId}-error`}>
        {errorMessage}
      </div>
    </div>
  );
};

FormField.defaultProps = {
  errorMessage: undefined,
  dataTestId: '',
  required: false
};

export default FormField;
