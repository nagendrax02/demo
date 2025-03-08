import NextGenDateTimePicker from '@lsq/nextgen-preact/date/date-time-picker';
import { IDateTimePicker } from '@lsq/nextgen-preact/date/date.types';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { DEFAULT_TIME_FORMAT } from './constant';

const DateTimePicker = (props: IDateTimePicker): JSX.Element => {
  return (
    <NextGenDateTimePicker
      {...props}
      dateFormat={getPersistedAuthConfig()?.User?.DateFormat?.replace('mm', 'MM')}
      timeFormat={DEFAULT_TIME_FORMAT}
    />
  );
};

export default DateTimePicker;
