/* eslint-disable max-lines-per-function */
import { create } from 'zustand';
import {
  FieldTypes,
  IAugmentedEmailConfig,
  ISendEmailFields,
  ISendEmailOptions,
  ISendEmailStore
} from './send-email.types';

const initialState = {
  fields: {
    to: [],
    from: undefined,
    subject: '',
    replyTo: undefined,
    cc: [],
    bcc: [],
    emailCategory: undefined,
    contentHTML: '',
    template: undefined,
    emailFields: [],
    attachments: []
  },
  options: {
    showCc: false,
    showBcc: false,
    showReplyTo: false,
    matchFromAndReplyTo: true,
    showSuccessMessage: false,
    enableTestEmailFeature: false
  },
  isLoading: true,
  sendingEmail: false,
  updateScheduleEmailCount: {},
  fieldError: {
    [FieldTypes.To]: undefined,
    [FieldTypes.From]: undefined,
    [FieldTypes.Cc]: undefined,
    [FieldTypes.Bcc]: undefined,
    [FieldTypes.EmailCategories]: undefined,
    [FieldTypes.ReplyTo]: undefined,
    [FieldTypes.Subject]: undefined,
    [FieldTypes.Body]: undefined,
    [FieldTypes.EmailFields]: undefined
  }
};

const useSendEmailStore = create<ISendEmailStore>((set) => ({
  ...initialState,
  setFields: (value: Partial<ISendEmailFields>): void => {
    set((prevData) => {
      return { ...prevData, fields: { ...prevData.fields, ...value } };
    });
  },
  setOptions: (value: Partial<ISendEmailOptions>): void => {
    set((prevData) => {
      return { ...prevData, options: { ...prevData.options, ...value } };
    });
  },
  setIsLoading: (value: boolean): void => {
    set((prevData) => {
      return { ...prevData, isLoading: value };
    });
  },
  setEmailConfig: (value: IAugmentedEmailConfig): void => {
    set((prevData) => {
      return { ...prevData, emailConfig: value };
    });
  },
  setSendingEmail: (value: boolean): void => {
    set((prevData) => {
      return { ...prevData, sendingEmail: value };
    });
  },
  setUpdateScheduleEmail: (value: unknown): void => {
    set((prevData) => {
      return { ...prevData, updateScheduleEmailCount: value };
    });
  },
  setFieldError: (value: Record<FieldTypes, string | undefined>): void => {
    set((prevData) => {
      return { ...prevData, fieldError: value };
    });
  },
  reset: (): void => {
    set((prevData) => {
      return { ...prevData, ...initialState };
    });
  }
}));

export default useSendEmailStore;
