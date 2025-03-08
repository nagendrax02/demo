import { ITaskItem } from '../../tasks.types';
import { getOverDueText } from '../../utils';
import styles from './task-body.module.css';

const OverdueText = ({ taskItem }: { taskItem: ITaskItem }): JSX.Element => {
  const overdueText = getOverDueText(taskItem);

  return overdueText ? (
    <div className={styles.overdue}>
      <span className={styles.overdue_circle} />
      <span>{overdueText}</span>
    </div>
  ) : (
    <></>
  );
};

export default OverdueText;
