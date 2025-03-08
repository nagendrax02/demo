import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { Variant } from 'common/types';
import { batchGet, IGet, Module, CallerSource } from 'common/utils/rest-client';
import styles from './TaskCancel.module.css';
import { API_ROUTES } from 'common/constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { handleTaskActionResponse } from '../common/handle-task-action-response';
import { EXCEPTION_MESSAGE } from 'common/constants';
import { IMarkOpenResponse as ITaskCancelResponse } from '../mark-task/mark-task.type';
import { TASK_CANCEL_MESSAGES } from './constants';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface ITaskCancel {
  taskIds: string[];
  handleClose: () => void;
  onSuccess?: () => void;
}

const TaskCancel = (props: ITaskCancel): JSX.Element => {
  const { taskIds, handleClose, onSuccess } = props;

  const { showAlert } = useNotification();

  const getBatchGetDetails = (): IGet[] => {
    const batchGetDetails = taskIds.map((taskId) => ({
      path: `${API_ROUTES.cancelTask}?id=${taskId}`,
      module: Module.Marvin,
      callerSource: CallerSource.SmartViews
    }));
    return batchGetDetails;
  };

  const handleCancel = async (): Promise<void> => {
    try {
      const requests = getBatchGetDetails();
      const response = (await batchGet(requests)) as
        | ITaskCancelResponse[]
        | PromiseSettledResult<ITaskCancelResponse>[];
      handleTaskActionResponse({
        apiResponses: response,
        onSuccess,
        showAlert: showAlert,
        statusMessage: TASK_CANCEL_MESSAGES
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      showAlert({
        type: Type.ERROR,
        message: (err?.response?.data?.ExceptionMessage as string) || EXCEPTION_MESSAGE
      });
    }
    handleClose();
  };

  return (
    <>
      <ConfirmationModal
        onClose={handleClose}
        show
        title="Confirm Cancel Task"
        description="Are you sure you want to Cancel selected Task?"
        customStyleClass={styles.custom_body}
        buttonConfig={[
          {
            id: 1,
            name: 'No',
            variant: Variant.Primary,
            onClick: handleClose
          },
          {
            id: 2,
            name: 'Yes',
            variant: Variant.Secondary,
            onClick: handleCancel,
            showSpinnerOnClick: true,
            customStyleClass: styles.task_delete_button
          }
        ]}
      />
    </>
  );
};

TaskCancel.defaultProps = {
  onSuccess: (): void => {}
};

export default TaskCancel;
