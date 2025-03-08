import { getFormattedDateTime } from 'common/utils/date';
import styles from '../vcard-config.module.css';

interface IDateInfoProps {
  label: string;
  date: string;
  user: string;
  timeFormat: string;
}

const DateInfo = ({ label, date, user, timeFormat }: IDateInfoProps): JSX.Element => (
  <div>
    <span className={styles.list_label}>{label} :</span>
    <span className={styles.list_value}>
      {getFormattedDateTime({
        date: date,
        timeFormat: timeFormat
      })}
    </span>
    <span className={styles.list_label}>By :</span>
    <span className={styles.list_value}>{user}</span>
  </div>
);

export default DateInfo;
