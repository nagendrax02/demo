/* eslint-disable max-lines-per-function */
import { useEffect } from 'react';
import useSendEmailStore from './send-email.store';
import { IActivity, IOpportunity, IOption } from './send-email.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from '../../utils/rest-client/constant';
import { sendEmail } from './utils/send-email';
import { isValidEmailData } from './utils/validate-data';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { initializeSendEmail, updateToField } from './utils/hook-utils';
import { saveTemplate } from './utils/save-template';
import { API_URL } from './constants';
import { CallerSource } from 'common/utils/rest-client';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { handleEmailError } from './SendEmailException';
import { getSendEmailSuccessMessage } from './utils/common';
interface IUseSendEmailUtils {
  toField: IOption[];
  fromId: string;
  leadRepresentationName: IEntityRepresentationName;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  callerSource: CallerSource;
  activity?: IActivity;
  opportunity?: IOpportunity;
  handleSuccess?: () => void;
  isModalLoading?: boolean;
  leadTypeInternalName?: string;
  enableTestEmailFeature?: boolean;
}
const useSendEmailUtils = (
  props: IUseSendEmailUtils
): {
  handleEmailSend: (dateTime?: string) => Promise<void>;
  handleTemplateSave: (templateName: string) => Promise<void>;
  validateEmailData: () => void;
} => {
  const {
    toField,
    fromId,
    leadRepresentationName,
    setShow,
    activity,
    opportunity,
    handleSuccess,
    callerSource,
    isModalLoading,
    leadTypeInternalName,
    enableTestEmailFeature
  } = props;
  const {
    fields,
    setFields,
    setOptions,
    emailConfig,
    setEmailConfig,
    setSendingEmail,
    setIsLoading,
    fieldError,
    setFieldError,
    reset,
    isLoading,
    setUpdateScheduleEmail
  } = useSendEmailStore();
  const { showAlert } = useNotification();

  let leadType = leadTypeInternalName;
  if (!leadType && toField.length == 1) {
    leadType = (window[`lead_type_data_${toField[0]?.value}`] as string) ?? '';
  }

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        await initializeSendEmail({
          to: toField,
          fromId: fromId,
          leadRepresentationName: leadRepresentationName,
          setFields: setFields,
          setEmailConfig: setEmailConfig,
          setOptions: setOptions,
          activity: activity,
          opportunity: opportunity,
          showAlert,
          callerSource,
          leadTypeInternalName: leadType,
          enableTestEmailFeature: enableTestEmailFeature
        });
      } catch (error) {
        showAlert({
          type: Type.ERROR,
          message: error?.message ? `${error?.message}` : ERROR_MSG.generic
        });
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalLoading]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (!isLoading) {
        updateToField({
          to: toField,
          setFields: setFields,
          setOptions: setOptions,
          showAlert,
          callerSource,
          fields,
          emailConfig
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields?.emailFields]);

  const validateEmailData = (): void => {
    isValidEmailData({
      fields: fields,
      fieldError: fieldError,
      setFieldError: setFieldError,
      showAlert: showAlert
    });
  };

  const handleEmailSend = async (dateTime?: string): Promise<void> => {
    try {
      setSendingEmail(true);
      validateEmailData();
      const response = await sendEmail(
        {
          to: fields?.to,
          from: fields?.from as IOption,
          schedule: dateTime || '',
          subject: fields.subject,
          selectedEmailCategory: fields.emailCategory as IOption,
          trackEmail: emailConfig?.isTrackableEmail as boolean,
          replyTo: fields.replyTo as IOption,
          cc: fields.cc,
          bcc: fields.bcc,
          emailFields: fields?.emailFields,
          contentHtml: fields.contentHTML,
          attachedFiles: fields?.attachments,
          opportunity: opportunity,
          leadTypeInternalName: leadType,
          enableTestEmailFeature: enableTestEmailFeature,
          apiUrl: !props?.enableTestEmailFeature // to-do: this should be handled from core data or from augmentation SW-5649
            ? API_URL.SEND_EMAIL
            : `${API_URL.SEND_EMAIL}?listId=${fields?.to?.[0]?.value}`
        },
        callerSource
      );

      if (enableTestEmailFeature) {
        setUpdateScheduleEmail(response);
      }

      setOptions({
        showSuccessMessage: true,
        successMessage: getSendEmailSuccessMessage({
          response: response as Record<string, string>,
          toField,
          enableTestEmailFeature,
          dateTime
        })
      });

      updateLeadAndLeadTabs();

      setTimeout(() => {
        setShow(false);
        reset();
        if (handleSuccess) handleSuccess();
      }, 3000);
    } catch (err) {
      handleEmailError(err, leadType);
    }
    setSendingEmail(false);
  };

  const handleTemplateSave = async (
    templateName: string,
    publish: boolean = false
  ): Promise<void> => {
    await saveTemplate({ fields, showAlert, setFields, templateName, publish, callerSource });
  };

  return {
    handleEmailSend: handleEmailSend,
    handleTemplateSave: handleTemplateSave,
    validateEmailData: validateEmailData
  };
};

export default useSendEmailUtils;
