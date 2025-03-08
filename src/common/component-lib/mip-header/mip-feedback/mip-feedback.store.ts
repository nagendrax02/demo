import { create } from 'zustand';
import { FeedbackError, IReason } from './MiPFeedback.types';

interface IMiPFeedBack {
  reason: IReason;
  workArea: string;
  error: FeedbackError;
  feedbackDescription: string;
}

const initialState: IMiPFeedBack = {
  reason: {} as IReason,
  workArea: '',
  error: FeedbackError.NA,
  feedbackDescription: ''
};

export const useMiPFeedBack = create<IMiPFeedBack>(() => ({
  ...initialState
}));

const getUpdatedError = (compareTo: FeedbackError): FeedbackError => {
  const error = useMiPFeedBack.getState().error;
  return error === compareTo ? FeedbackError.NA : error;
};

export const handleReasonClick = (reason: IReason): void => {
  useMiPFeedBack.setState(() => ({ reason, error: getUpdatedError(FeedbackError.Reason) }));
};

export const handleWorkAreaClick = (workArea: string): void => {
  useMiPFeedBack.setState(() => ({ workArea, error: getUpdatedError(FeedbackError.WorkArea) }));
};

export const handleFeedbackDescription = (feedbackDescription: string): void => {
  useMiPFeedBack.setState(() => ({
    feedbackDescription,
    error: getUpdatedError(FeedbackError.FeedBackDesc)
  }));
};

export const handleError = (error: FeedbackError): void => {
  useMiPFeedBack.setState(() => ({ error }));
};

export const onFeedbackModalClose = (): void => {
  useMiPFeedBack.setState(() => initialState);
};
