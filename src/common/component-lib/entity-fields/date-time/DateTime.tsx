import {
  getFormattedDate,
  getFormattedDateTime,
  getFormattedTime
} from 'common/utils/date/date-time-formatter';
import { IDateTime } from './date-time.types';
import { DateRenderType } from 'apps/entity-details/types/entity-data.types';
import { getFormattedDateTimeForAmPmValue } from '@lsq/nextgen-preact/date/utils';

const DateTime = (props: IDateTime): JSX.Element => {
  const {
    date,
    renderType,
    dateTimeFormat,
    timeFormat,
    timeZone,
    schemaName,
    ignoreSystemTimeValue
  } = props;
  let formattedDate = date;

  if (renderType === DateRenderType.Datetime) {
    formattedDate = getFormattedDateTime({
      date: getFormattedDateTimeForAmPmValue(date),
      timeFormat,
      dateTimeFormat,
      timeZone
    });
  }
  if (renderType === DateRenderType.DateWithTimezone) {
    formattedDate = getFormattedDateTime({
      date: getFormattedDateTimeForAmPmValue(date),
      timeFormat,
      dateTimeFormat,
      timeZone
    });
  }
  if (renderType === DateRenderType.Date) {
    formattedDate = getFormattedDate(date, dateTimeFormat, ignoreSystemTimeValue);
  }
  if (renderType === DateRenderType.Time) {
    formattedDate = getFormattedTime(date, timeZone);
  }

  return (
    <div
      data-testid={schemaName ? `date-time-component-${schemaName}` : 'date-time-component'}
      className="date-time">
      {formattedDate}
    </div>
  );
};

DateTime.defaultProps = {
  schemaName: ''
};

export default DateTime;
