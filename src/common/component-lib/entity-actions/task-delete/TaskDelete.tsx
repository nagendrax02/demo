import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { Variant } from 'common/types';
import styles from './TaskDelete.module.css';
import { API_ROUTES } from 'common/constants';
import { batchGet, IGet, Module, CallerSource } from 'common/utils/rest-client';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { handleTaskActionResponse } from '../common/handle-task-action-response';
import { EXCEPTION_MESSAGE } from 'common/constants';
import { IMarkOpenResponse as ITaskDeleteResponse } from '../mark-task/mark-task.type';
import { TASK_DELETE_MESSAGES } from './constants';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface ITaskDelete {
  taskIds: string[];
  handleClose: () => void;
  onSuccess?: () => void;
}

const TaskDelete = (props: ITaskDelete): JSX.Element => {
  const { taskIds, handleClose, onSuccess } = props;

  const { showAlert } = useNotification();

  const getBatchGetDetails = (): IGet[] => {
    const batchGetDetails = taskIds.map((taskId) => ({
      path: `${API_ROUTES.deleteTask}?id=${taskId}`,
      module: Module.Marvin,
      callerSource: CallerSource.SmartViews
    }));
    return batchGetDetails;
  };

  const handleDelete = async (): Promise<void> => {
    try {
      const requests = getBatchGetDetails();
      const response = (await batchGet(requests)) as
        | ITaskDeleteResponse[]
        | PromiseSettledResult<ITaskDeleteResponse>[];
      handleTaskActionResponse({
        apiResponses: response,
        onSuccess,
        showAlert: showAlert,
        statusMessage: TASK_DELETE_MESSAGES
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
        title="Delete Task"
        description="Are you sure you want to delete selected Task?"
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
            name: 'Yes, Delete',
            variant: Variant.Secondary,
            onClick: handleDelete,
            showSpinnerOnClick: true,
            customStyleClass: styles.task_delete_button
          }
        ]}
      />
    </>
  );
};

TaskDelete.defaultProps = {
  onSuccess: (): void => {}
};

export default TaskDelete;
