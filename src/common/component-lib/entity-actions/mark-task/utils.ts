import { trackError } from 'common/utils/experience/utils/track-error';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';
import { MXOpportunityRestrictedException, TASK_ERR_MESSAGES, MARK_FAILURE } from './constants';
import { IMarkOpenResponse, TaskActionType } from './mark-task.type';
import { httpPost, Module, CallerSource } from 'common/utils/rest-client';
import { IProcessResponse, IProcessActionOutput } from 'common/utils/process/process.types';
import { API_ROUTES } from 'common/constants';
import { DefaultFormEntity } from 'apps/entity-details/types/entity-data.types';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

interface IHandleMarkTaskResponse {
  apiResponses: IMarkOpenResponse[] | PromiseSettledResult<IMarkOpenResponse>[];
  onSuccess?: () => void;
  showAlert: (notification: INotification) => void;
  taskActionType: TaskActionType;
}

interface IGetResponseDetails {
  successCount: number;
  failureCount: number;
  errorMessages: Record<string, number>;
}

const showSuccessMessage = (
  showAlert: (notification: INotification) => void,
  successCount: number
): void => {
  showAlert({
    type: Type.SUCCESS,
    message: `${
      successCount > 1 ? `${successCount} ` : ''
    }${TASK_ERR_MESSAGES.MARK_TASK_SUCCESS.replace(
      '{{MESSAGE_POSTFIX}}',
      successCount > 1 ? 's' : ''
    )}`
  });
};

const showFailureMessage = (
  showAlert: (notification: INotification) => void,
  errorMessages: Record<string, number>,
  taskActionType: TaskActionType
): void => {
  Object.keys(errorMessages).forEach((err) => {
    showAlert({
      type: Type.ERROR,
      message: `${errorMessages[err]} ${MARK_FAILURE[taskActionType]} ${err}`
    });
  });
};

const getResponseDetails = (
  apiResponses: IMarkOpenResponse[] | PromiseSettledResult<IMarkOpenResponse>[]
): IGetResponseDetails => {
  let successCount = 0;
  let failureCount = 0;
  const errorMessages: Record<string, number> = {};
  apiResponses.forEach((apiResponse) => {
    if (apiResponse?.status && apiResponse?.status === 'rejected') {
      if (apiResponse?.reason?.response?.ExceptionType === MXOpportunityRestrictedException) {
        errorMessages.MARK_OPEN_EXCEPTION = (errorMessages?.MARK_OPEN_EXCEPTION || 0) + 1;
      } else {
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

export const handleMarkTaskResponse = (data: IHandleMarkTaskResponse): void => {
  const { apiResponses, onSuccess, showAlert, taskActionType } = data;

  // eslint-disable-next-line prefer-const
  let { successCount, failureCount, errorMessages } = getResponseDetails(apiResponses);

  if (successCount > 0 && failureCount === 0) {
    showSuccessMessage(showAlert, successCount);
  } else if (successCount === 0 && failureCount > 0) {
    showFailureMessage(showAlert, errorMessages, taskActionType);
  } else if (successCount && failureCount) {
    showSuccessMessage(showAlert, successCount);
    showFailureMessage(showAlert, errorMessages, taskActionType);
  }
  handleSuccess(successCount, onSuccess);
};

const fetchMarkCompleteProcessResponse = async (
  task: Record<string, string | null>
): Promise<IProcessResponse[]> => {
  try {
    return await httpPost({
      path: API_ROUTES.process,
      module: Module.Process,
      body: {
        triggerType: 2,
        applicationType: 1,
        Events: [
          {
            taskTypeId: task?.TaskTypeId,
            AdditionalData: task?.Id || task?.id || ''
          }
        ]
      },
      callerSource: CallerSource.SmartViews
    });
  } catch (error) {
    trackError('Error in makeAPICall', error);
    throw error;
  }
};

const handleShowForm = ({
  formConfig,
  task,
  onShowFormChange,
  onSuccess
}: {
  formConfig: IProcessActionOutput;
  task: Record<string, string | null>;
  onShowFormChange: (showForm: boolean) => void;
  onSuccess?: () => void;
}): void => {
  useFormRenderer.getState().setFormConfig({
    OnSuccess: onSuccess,
    OnShowFormChange: onShowFormChange,
    Config: {
      Name: formConfig?.Entity?.FormName,
      FormId: formConfig?.Entity?.FormId,
      Entity: DefaultFormEntity.TASK,
      LeadId: task?.RelatedEntityId || '',
      TaskId: task?.Id || '',
      OpportunityId: task?.RelatedActivityId || '',
      ProcessAutoId: formConfig.ProcessAutoId,
      ActionId: formConfig.ActionId,
      IsFromMarkTaskComplete: true,
      ...task
    }
  });
};

const handleAPIResponse = ({
  response,
  task,
  handleMarkTask,
  onShowFormChange,
  onSuccess
}: {
  response: IProcessResponse;
  task: Record<string, string | null>;
  handleMarkTask: () => void;
  onShowFormChange: (showForm: boolean) => void;
  onSuccess?: () => void;
}): void => {
  if (response?.ActionOutputs?.length) {
    const formConfig = response.ActionOutputs[0];
    if (formConfig.ActionType === 'MarkTaskComplete') {
      handleMarkTask();
    } else if (formConfig.ActionType === 'ShowForm') {
      handleShowForm({
        formConfig,
        task,
        onShowFormChange,
        onSuccess
      });
    }
  } else {
    handleMarkTask();
  }
};

export const handleMarkTaskComplete = async ({
  task,
  handleMarkTask,
  onShowFormChange,
  onSuccess
}: {
  task: Record<string, string | null>;
  handleMarkTask: () => void;
  onShowFormChange: (showForm: boolean) => void;
  onSuccess?: () => void;
}): Promise<void> => {
  try {
    const [response] = await fetchMarkCompleteProcessResponse(task);
    handleAPIResponse({
      response,
      task,
      handleMarkTask,
      onShowFormChange,
      onSuccess
    });
  } catch (error) {
    trackError('Error in handleMarkTaskComplete', error);
  }
};
