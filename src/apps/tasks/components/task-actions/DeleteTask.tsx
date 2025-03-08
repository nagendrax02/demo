import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from './task-actions.module.css';
import { isRestricted } from 'common/utils/permission-manager';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import { ITaskItem } from '../../tasks.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { alertConfig } from '../../constants';
import { CallerSource } from 'common/utils/rest-client';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const DeleteTask = ({
  onDeleteTask,
  taskItem
}: {
  onDeleteTask: () => void;
  taskItem: ITaskItem;
}): JSX.Element => {
  const { showAlert } = useNotification();
  const getIcon = (): JSX.Element => {
    return <Icon name="delete" variant={IconVariant.Filled} />;
  };

  const handleDeleteTask = async (): Promise<void> => {
    const restriction = await isRestricted({
      entity: PermissionEntityType.Task,
      action: ActionType.Delete,
      entityId: taskItem?.TaskType,
      additionalData: { ownerId: taskItem?.OwnerID, createdById: taskItem?.CreatedBy },
      callerSource: CallerSource.Tasks
    });
    if (restriction) {
      showAlert(alertConfig.ACCESS_DENIED);
    } else {
      onDeleteTask();
    }
  };

  return (
    <>
      <Button
        text=""
        onClick={handleDeleteTask}
        icon={getIcon()}
        customStyleClass={styles.task_edit_delete}
        dataTestId="tasks-delete-action"
      />
    </>
  );
};

export default DeleteTask;
