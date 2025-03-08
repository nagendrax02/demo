import { getFormattedDateTime } from 'common/utils/date';
import styles from './task-meta-info.module.css';

const DateTime = ({ date, label }: { date: string; label: string }): JSX.Element => {
  return (
    <div>
      <span className={styles.task_info_title}>{label}</span>
      {getFormattedDateTime({ date, timeFormat: 'hh:mm a' })}
    </div>
  );
};

export default DateTime;
