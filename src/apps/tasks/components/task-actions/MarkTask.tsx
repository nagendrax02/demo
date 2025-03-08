import { alertConfig, taskStatus } from '../../constants';
import { ITaskItem } from '../../tasks.types';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { Variant } from 'common/types';
import styles from './task-actions.module.css';
import { useState, lazy } from 'react';
import { useNotification } from '@lsq/nextgen-preact/notification';
import Spinner from '@lsq/nextgen-preact/spinner';
import useTasksStore from '../../tasks.store';
import { handleMarkTask } from '../../utils/tasks';
import { isRestricted } from 'common/utils/permission-manager';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import { getMarkTaskProcess } from '../../utils';
import { CallerSource } from 'common/utils/rest-client';
import { IEntityDetailsCoreData } from '../../../entity-details/types/entity-data.types';
import { RecordType, useTabRecordCounter } from 'common/component-lib/tab-record-counter';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IMarkTask {
  taskItem: ITaskItem;
  coreData: IEntityDetailsCoreData;
}

const MarkTask = (props: IMarkTask): JSX.Element => {
  const { taskItem, coreData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useNotification();
  const { setTasksList, tasksList, totalTasks } = useTasksStore();
  const isCompleted = taskItem?.Status === taskStatus.COMPLETED;
  const { updateTabRecordCount } = useTabRecordCounter();

  const onMarkTaskClick = async (): Promise<void> => {
    const restriction = await isRestricted({
      entity: PermissionEntityType.Task,
      action: ActionType.MarkComplete,
      entityId: taskItem?.TaskType,
      additionalData: { ownerId: taskItem?.OwnerID, createdById: taskItem?.CreatedBy },
      callerSource: CallerSource.Tasks
    });

    if (restriction) {
      showAlert(alertConfig.ACCESS_DENIED);
      return;
    }
    if (!isCompleted) {
      const formConfig = await getMarkTaskProcess({
        task: taskItem,
        setIsLoading,
        coreData
      });
      if (formConfig) {
        useFormRenderer.getState().setFormConfig(formConfig);
        setIsLoading(false);
        return;
      }
    }
    await handleMarkTask({
      setIsLoading,
      taskItem,
      showAlert,
      setTasksList,
      tasksList,
      totalTasks,
      onSuccess: () => updateTabRecordCount(coreData?.entityIds?.lead, RecordType.Task)
    });
  };

  const getText = (): string => {
    return isCompleted ? 'Mark Open' : 'Mark Complete';
  };

  const getButtonVariant = (): Variant => {
    return isCompleted ? Variant.Secondary : Variant.Primary;
  };

  const getIcon = (): JSX.Element => {
    const name = isCompleted ? 'assignment' : 'task_alt';
    return isLoading ? (
      <Spinner customStyleClass={styles.spinner} />
    ) : (
      <Icon name={name} variant={IconVariant.Outlined} customStyleClass={styles.mark_task_icon} />
    );
  };

  return !taskItem?.OpenCompletedTasks && isCompleted ? (
    <></>
  ) : (
    <Button
      text={getText()}
      onClick={onMarkTaskClick}
      icon={getIcon()}
      variant={getButtonVariant()}
      customStyleClass={styles.mark_task_button}
      dataTestId="tasks-mark-task"
    />
  );
};

export default MarkTask;
