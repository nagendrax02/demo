import { ERROR_MSG } from '../../../utils/rest-client/constant';
import { IGroupedOption } from '../../grouped-option-dropdown';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';
import { FieldTypes, IOption, ISendEmailFields } from '../send-email.types';

enum ErrorType {
  FieldError,
  Notification
}

interface IIsValidEmailData {
  fields: ISendEmailFields;
  fieldError: Record<FieldTypes, string | undefined>;
  setFieldError: (value: Record<FieldTypes, string | undefined>) => void;
  showAlert: (notification: INotification) => void;
}

class ValidationError extends Error {
  type: ErrorType;

  fieldType: FieldTypes;

  constructor(message: string, type: ErrorType, fieldType: FieldTypes) {
    super(message);
    this.name = 'ValidationError';
    this.type = type;
    this.fieldType = fieldType;
  }
}

const validateToField = (to: IGroupedOption[]): void => {
  if (to.length < 1) {
    throw new ValidationError(
      'Lead cannot be removed. At least one recipient must be present in the email.',
      ErrorType.Notification,
      FieldTypes.To
    );
  }
};

const validateFromField = (from: IOption | undefined): void => {
  if (!from) {
    throw new ValidationError('From is required', ErrorType.FieldError, FieldTypes.From);
  }
};

const validateSubjectField = (subject: string): void => {
  if (!subject.length) {
    throw new ValidationError('Subject is required', ErrorType.FieldError, FieldTypes.Subject);
  }
};

const validateContentHTML = (contentHTML: string): void => {
  if (!contentHTML.length) {
    throw new ValidationError('Body is required', ErrorType.Notification, FieldTypes.Body);
  }
};

const isValidEmailData = ({
  fields,
  fieldError,
  setFieldError,
  showAlert
}: IIsValidEmailData): void => {
  try {
    validateToField(fields.to);
    validateFromField(fields.from);
    validateSubjectField(fields.subject);
    validateContentHTML(fields.contentHTML);
  } catch (err) {
    if (err?.type === ErrorType.Notification) {
      showAlert({
        type: Type.ERROR,
        message: err?.message ? `${err?.message}` : ERROR_MSG.generic,
        parentElement: document.getElementsByClassName('send-email-modal')?.[0]
      });
    } else if (err?.type === ErrorType.FieldError) {
      setFieldError({ ...fieldError, [err?.fieldType]: `${err?.message}` });
    }
    throw err;
  }
};

export { isValidEmailData };
