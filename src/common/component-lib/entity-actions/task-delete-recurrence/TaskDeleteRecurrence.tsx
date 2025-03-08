import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { Variant } from 'common/types';
import { Module, httpPost, CallerSource } from 'common/utils/rest-client';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { API_ROUTES, EXCEPTION_MESSAGE } from 'src/common/constants';
import styles from './task-delete-recurrence.module.css';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface ILSQMarvinTaskDeleteRecurrenceProps {
  recurringTaskToDelete: string;
  handleClose: () => void;
  onSuccess?: () => void;
}

const TaskDeleteRecurrence = (props: ILSQMarvinTaskDeleteRecurrenceProps): JSX.Element => {
  const { recurringTaskToDelete, handleClose, onSuccess } = props;

  const { showAlert } = useNotification();

  const handleDeleteRecurrence = async ({ deleteAll }: { deleteAll: boolean }): Promise<void> => {
    try {
      await httpPost({
        path: `${API_ROUTES.taskRecurringDelete}/?userTaskId=${recurringTaskToDelete}&deleteAll=${deleteAll}`,
        module: Module.Marvin,
        callerSource: CallerSource.SmartViews,
        body: {
          TaskEventNote: ''
        }
      });
      if (onSuccess) {
        onSuccess();
      }
      showAlert({
        type: Type.SUCCESS,
        message: 'Recurring tasks deleted successfully'
      });
    } catch (error) {
      showAlert({
        type: Type.ERROR,
        message: (error?.response?.ExceptionMessage as string) || EXCEPTION_MESSAGE
      });
    }
    handleClose();
  };

  return (
    <>
      <ConfirmationModal
        onClose={handleClose}
        show
        title="Deleting recurrence"
        description="This action will delete all the tasks which are part of the series. Do you want to delete all the tasks or this and the following tasks?"
        buttonConfig={[
          {
            id: 1,
            name: 'This and following tasks',
            variant: Variant.Primary,
            onClick: () =>
              handleDeleteRecurrence({
                deleteAll: false
              }),
            customStyleClass: styles.task_delete_primary_button
          },
          {
            id: 2,
            name: 'All',
            variant: Variant.Secondary,
            onClick: () =>
              handleDeleteRecurrence({
                deleteAll: true
              }),
            customStyleClass: styles.task_delete_secondary_button
          }
        ]}
      />
    </>
  );
};

TaskDeleteRecurrence.defaultProps = {
  onSuccess: undefined
};

export default TaskDeleteRecurrence;
