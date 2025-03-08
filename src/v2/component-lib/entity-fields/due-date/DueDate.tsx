import { getFormattedDateTime } from 'common/utils/date';
import styles from './duedate.module.css';
import commonStyles from '../common-style.module.css';
import { getPersistedAuthConfig } from 'src/common/utils/authentication';

export interface IDueDate {
  value: string;
  timeFormat?: string;
}
const DueDate = ({ value = '', timeFormat = '' }: IDueDate): JSX.Element => {
  const [fromDate = '', toDate = '', timeStandard = ''] = value.split('$');

  const dateFormat =
    getPersistedAuthConfig()?.User?.DateFormat?.replace('mm', 'MM') || 'dd/MM/yyyy';
  const dateTimeFormat = `${dateFormat} ${timeFormat ? timeFormat : 'hh:mm:ss a'}`;

  return (
    <div className={commonStyles.ellipsis}>
      <span className={styles.margin_bottom}>
        {getFormattedDateTime({ date: fromDate, dateTimeFormat })} to{' '}
      </span>
      <span className={styles.margin_bottom}>
        {getFormattedDateTime({ date: toDate, dateTimeFormat })}
      </span>
      {timeStandard ? <div>({timeStandard})</div> : null}
    </div>
  );
};

DueDate.defaultProps = {
  timeFormat: undefined
};

export default DueDate;
