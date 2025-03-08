import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';
import { IMarkOpenResponse as ITaskActionResponse } from '../mark-task/mark-task.type';

interface IHandleTaskActionResponse {
  apiResponses: ITaskActionResponse[] | PromiseSettledResult<ITaskActionResponse>[];
  onSuccess?: () => void;
  showAlert: (notification: INotification) => void;
  statusMessage: {
    Success: string;
    Failure: string;
  };
}

interface IGetResponseDetails {
  successCount: number;
  failureCount: number;
  errorMessages: Record<string, number>;
}

const showSuccessMessage = (
  showAlert: (notification: INotification) => void,
  successCount: number,
  message: string
): void => {
  showAlert({
    type: Type.SUCCESS,
    message: `${successCount > 1 ? `${successCount} ` : ''}${message.replace(
      '{{MESSAGE_POSTFIX}}',
      successCount > 1 ? 's' : ''
    )}`
  });
};

const showFailureMessage = ({
  showAlert,
  errorMessages,
  failureCount,
  message
}: {
  showAlert: (notification: INotification) => void;
  errorMessages: Record<string, number>;
  failureCount: number;
  message: string;
}): void => {
  Object.keys(errorMessages).forEach((err) => {
    showAlert({
      type: Type.ERROR,
      message: `${errorMessages[err]} ${message.replace(
        '{{MESSAGE_POSTFIX}}',
        failureCount > 1 ? 's' : ''
      )} ${err}`
    });
  });
};

const getResponseDetails = (
  apiResponses: ITaskActionResponse[] | PromiseSettledResult<ITaskActionResponse>[]
): IGetResponseDetails => {
  let successCount = 0;
  let failureCount = 0;
  const errorMessages: Record<string, number> = {};
  apiResponses.forEach((apiResponse) => {
    if (apiResponse?.status && apiResponse?.status === 'rejected') {
      if (apiResponse?.reason?.response?.ExceptionType) {
        errorMessages[`${apiResponse?.reason?.response?.ExceptionMessage}`] =
          (errorMessages[`${apiResponse?.reason?.response?.ExceptionMessage}`] || 0) + 1;
      }
      failureCount += 1;
    } else {
      if (apiResponse?.value?.Status === 'Success') {
        successCount += 1;
      } else {
        failureCount += 1;
      }
    }
  });
  return { successCount, failureCount, errorMessages };
};

const handleSuccess = (successCount: number, onSuccess?: () => void): void => {
  if (onSuccess && successCount) {
    onSuccess();
  }
};

export const handleTaskActionResponse = (data: IHandleTaskActionResponse): void => {
  const { apiResponses, onSuccess, showAlert, statusMessage } = data;

  const { successCount, failureCount, errorMessages } = getResponseDetails(apiResponses);

  if (successCount > 0 && failureCount === 0) {
    showSuccessMessage(showAlert, successCount, statusMessage.Success);
  } else if (successCount === 0 && failureCount > 0) {
    showFailureMessage({ showAlert, errorMessages, failureCount, message: statusMessage.Failure });
  } else if (successCount && failureCount) {
    showSuccessMessage(showAlert, successCount, statusMessage.Success);
    showFailureMessage({ showAlert, errorMessages, failureCount, message: statusMessage.Failure });
  }
  handleSuccess(successCount, onSuccess);
};
