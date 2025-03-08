import { API_ROUTES } from 'common/constants';
import { trackError } from 'common/utils/experience';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { ISendEmailFields } from '../../send-email.types';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';

export const validateEmails = (emails: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emails
    ?.split(',')
    ?.map((email) => email.trim())
    ?.every((email) => emailRegex.test(email));
};

export const validateInput = ({
  testEmailIds,
  setErr
}: {
  testEmailIds: string;
  setErr: React.Dispatch<React.SetStateAction<string>>;
}): boolean => {
  if (testEmailIds.length < 1) {
    setErr('Please enter recipients');
    return false;
  }
  if (!validateEmails(testEmailIds)) {
    setErr('One or more email addresses you have entered is invalid. Please correct and try again');
    return false;
  }

  return true;
};

const errorMessage = (error: Record<string, Record<string, string>>): string => {
  return error?.response?.ExceptionMessage ?? 'Failed to send test email. Please try again';
};

export const testEmails = async ({
  fields,
  testEmailIds,
  callerSource,
  setNotification,
  leadTypeInternalName
}: {
  fields: ISendEmailFields;
  callerSource: CallerSource;
  testEmailIds: string;
  leadTypeInternalName?: string;
  setNotification: (notification: INotification) => void;
}): Promise<void> => {
  try {
    await httpPost({
      path: API_ROUTES.testEmails,
      module: Module.Marvin,
      body: {
        ContentHTML: fields?.contentHTML,
        From: fields?.from?.value,
        ['ReplyTo_UserId']: fields?.replyTo?.value,
        Subject: fields?.subject,
        TestEmailIds: testEmailIds?.replaceAll(' ', '')?.replaceAll(',', ';'),
        LeadType: leadTypeInternalName
      },
      callerSource: callerSource
    });
    setNotification({
      type: Type.SUCCESS,
      message: 'Test email sent successfully. Please check your inbox'
    });
  } catch (error) {
    trackError(error);
    setNotification({
      type: Type.ERROR,
      message: errorMessage(error)
    });
    throw error;
  }
};
