import { taskStatus } from '../../constants';
import styles from './task-body.module.css';

interface ITaskTitle {
  name: string;
  status: number | undefined;
}

const TaskTitle = (props: ITaskTitle): JSX.Element => {
  const { name, status } = props;

  return (
    <div
      data-testid="task-title"
      className={status === taskStatus.COMPLETED ? styles.tasks_complete_title : ''}>
      {name}
    </div>
  );
};

export default TaskTitle;
