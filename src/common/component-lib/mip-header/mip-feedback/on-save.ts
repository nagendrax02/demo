import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { useMiPHeader } from '../mip-header.store';
import { FeedbackError, IOnSubmit, InputId } from './MiPFeedback.types';
import { handleError, useMiPFeedBack } from './mip-feedback.store';
import { API_ROUTES } from 'common/constants';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { successMessage } from './constant';
import { showNotification } from '@lsq/nextgen-preact/notification';

const isValid = (): boolean => {
  const { feedbackDescription, reason, workArea } = useMiPFeedBack.getState();
  if (!reason?.value) {
    handleError(FeedbackError.Reason);
    return false;
  }
  if (!reason?.hideWorkArea) {
    if (!workArea) {
      handleError(FeedbackError.WorkArea);
      return false;
    }
  }
  if (!feedbackDescription) {
    document?.getElementById(InputId.FeedbackDescription)?.focus();
    handleError(FeedbackError.FeedBackDesc);
    return false;
  }
  return true;
};

export const handleFeedbackSave = async (
  onSubmit: IOnSubmit,
  callerSource: CallerSource
): Promise<void> => {
  try {
    const { feedbackDescription, reason, workArea } = useMiPFeedBack.getState();

    if (!isValid()) {
      return;
    }

    const module = useMiPHeader.getState().module;
    await httpPost({
      path: API_ROUTES.mipFeedback,
      body: {
        Module: module,
        Reason: reason.value || 'NA',
        WorkArea: workArea || 'NA',
        Feedback: feedbackDescription
      },
      module: Module.Marvin,
      callerSource
    });

    const actionClicked = useMiPHeader.getState().clickedAction;
    showNotification({
      type: Type.SUCCESS,
      message: successMessage[actionClicked || ''] as string
    });
    onSubmit({ module, reason: reason.value, workArea, feedbackDescription });
  } catch (error) {
    trackError(error);
  }
};
