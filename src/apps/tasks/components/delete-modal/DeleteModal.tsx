import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { trackError } from 'common/utils/experience/utils/track-error';
import { Variant } from 'common/types';
import styles from '../task-actions/task-actions.module.css';
import { useNotification } from '@lsq/nextgen-preact/notification';
import useTasksStore from '../../tasks.store';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { ITaskItem } from '../../tasks.types';
import { removeTaskFromList } from '../../utils/tasks';
import { alertConfig } from '../../constants';
import { API_ROUTES } from 'common/constants';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { RecordType, useTabRecordCounter } from 'common/component-lib/tab-record-counter';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface IDeleteModal {
  taskItem: ITaskItem;
  showModal: boolean;
  setShowModal: (value: React.SetStateAction<boolean>) => void;
  coreData: IEntityDetailsCoreData;
}

const DeleteModal = (props: IDeleteModal): JSX.Element => {
  const { showModal, setShowModal, taskItem, coreData } = props;
  const { showAlert } = useNotification();
  const { setTasksList, tasksList, totalTasks } = useTasksStore();
  const { updateTabRecordCount } = useTabRecordCounter();

  const getDescription = (): JSX.Element => {
    return <div>Are you sure you want to delete selected Task?</div>;
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await httpGet({
        path: `${API_ROUTES.deleteTask}?id=${taskItem?.ID}`,
        module: Module.Marvin,
        callerSource: CallerSource.Tasks
      });
      removeTaskFromList({ tasksList, setTasksList, taskId: taskItem?.ID, totalTasks });
      updateLeadAndLeadTabs();
      updateTabRecordCount(coreData?.entityIds?.lead, RecordType.Task);
      showAlert(alertConfig.DELETE_SUCCESS);
    } catch (error) {
      trackError(error);
      showAlert(alertConfig.DELETE_FAIL);
    }
    setShowModal(false);
  };

  return (
    <ConfirmationModal
      show={showModal}
      onClose={(): void => {
        setShowModal(false);
      }}
      title="Delete Task"
      description={getDescription()}
      customStyleClass={styles.task_delete_modal}
      buttonConfig={[
        {
          id: 1,
          name: 'No',
          customStyleClass: styles.no_btn,
          variant: Variant.Primary,
          onClick: (): void => {
            setShowModal(false);
          },
          dataTestId: 'no-delete-tasks'
        },
        {
          id: 2,
          name: 'Yes, Delete',
          customStyleClass: styles.delete_btn,
          variant: Variant.Secondary,
          onClick: handleDelete,
          showSpinnerOnClick: true,
          dataTestId: 'yes-delete-tasks'
        }
      ]}
    />
  );
};

export default DeleteModal;
