import { DateRenderType } from 'apps/entity-details/types/entity-data.types';
import { classNames } from 'common/utils/helpers/helpers';
import { ReactNode } from 'react';
import styles from './date-time.module.css';

const splitByFirstWhitespace = (input: string): string[] => {
  const [date, ...rest] = input.split(' ');
  return [date, rest.join(' ')];
};

const DateTimeContent = ({
  formattedDate,
  renderType
}: {
  formattedDate: string;
  renderType: DateRenderType;
}): ReactNode => {
  const canShowWithSeparator =
    formattedDate?.trim()?.length &&
    (renderType === DateRenderType.Datetime || renderType === DateRenderType.DateWithTimezone);

  if (canShowWithSeparator) {
    const [dateString, timeString] = splitByFirstWhitespace(formattedDate);

    if (dateString?.trim() && timeString?.trim()) {
      return (
        <div className={styles.date_time_container} title={formattedDate}>
          <span>{dateString}</span>
          <span
            data-testid="date-time-separator"
            className={classNames(styles.separator, 'ng_p_2_m')}
          />
          <span>{timeString}</span>
        </div>
      );
    }
  }

  return <span title={formattedDate}>{formattedDate}</span>;
};

export default DateTimeContent;
