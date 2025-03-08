import { ITaskItem } from '../../tasks.types';
import DateTime from './DateTime';
import TargetDate from './TargetDate';
import User from './User';
import styles from './task-meta-info.module.css';

interface ITaskMetaInfo {
  taskItem: ITaskItem;
}

const TaskMetaInfo = (props: ITaskMetaInfo): JSX.Element => {
  const { taskItem } = props;

  return (
    <div className={styles.task_meta_info}>
      <TargetDate taskItem={taskItem} />
      <User name={taskItem?.OwnerName} label="Owner: " />
      <DateTime date={taskItem?.CreatedOnString} label="Created on: " />
      {taskItem?.CompletedByName?.trim() || taskItem?.CreatedByName ? (
        <User
          name={
            taskItem?.CompletedByName?.trim()
              ? taskItem.CompletedByName.trim()
              : taskItem?.CreatedByName
          }
          label="By: "
        />
      ) : null}
    </div>
  );
};

export default TaskMetaInfo;
