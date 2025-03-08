import styles from '../list-details-info.module.css';
import { Time, DateAndTimeFilled } from 'assets/custom-icon/v2';
import { classNames as cn, getWithZValue } from 'common/utils/helpers/helpers';
import { format } from '@lsq/nextgen-preact/date/utils';
import { getPersistedAuthConfig } from 'common/utils/authentication';

interface IInfoBox {
  label: string;
  date: string;
  user: string;
}

const getPattern = (timeFormat: string): string => {
  const userDetails = getPersistedAuthConfig();
  const formatToApply = timeFormat;
  const dateTimeFormatToApply = `${userDetails?.User?.DateFormat} ${formatToApply}`?.replace(
    'mm',
    'MM'
  );
  return dateTimeFormatToApply;
};

const InfoBox = ({ label, date, user }: IInfoBox): JSX.Element => {
  const [formattedDate, time, timeMeridiem] = format({
    originalDate: getWithZValue(date),
    pattern: getPattern('hh:mm a')
  }).split(' ');

  return (
    <div className={styles.infobox_container}>
      <div className={styles.infobox_wrapper}>
        <div className={cn(styles.infobox_label, 'ng_h_5_b')}>{label}</div>
        <div className={cn(styles.by_user, styles.ellipsis, 'ng_p_1_sb')} title={user}>
          {user}
        </div>
        <div className={styles.date_container}>
          <div className={styles.date_wrapper}>
            <DateAndTimeFilled type="outline" className={styles.icon_size} />
            <span className={cn(styles.date_time, 'ng_p_1_m')}>{formattedDate}</span>
          </div>
          <span className={styles.date_tite_separator}></span>
          <div className={styles.date_wrapper}>
            <Time type="outline" className={styles.icon_size} />
            <span className={cn(styles.date_time, 'ng_p_1_m')}>{`${time} ${timeMeridiem}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
