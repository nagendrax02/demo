import { ReactNode } from 'react';
import { ITaskAdditionalData } from './task.types';
import { getTaskStatus } from 'apps/smart-views/components/cell-renderers/task-status/helpers';
import TaskStatus from 'apps/smart-views/components/cell-renderers/task-status/TaskStatus';

const TaskStatusBadge = ({ entityRecord }: { entityRecord: ITaskAdditionalData }): ReactNode => {
  const taskStatus = getTaskStatus(entityRecord);

  return taskStatus !== 'Cancelled' && taskStatus != 'Completed' ? (
    <TaskStatus record={entityRecord} />
  ) : null;
};

export default TaskStatusBadge;
