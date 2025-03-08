import NextGenDatePicker from '@lsq/nextgen-preact/date/date-picker';
import { IDatePicker } from '@lsq/nextgen-preact/date/date.types';
import { getPersistedAuthConfig } from 'common/utils/authentication';

const DatePicker = (props: IDatePicker): JSX.Element => {
  return (
    <NextGenDatePicker
      {...props}
      dateFormat={getPersistedAuthConfig()?.User?.DateFormat?.replace('mm', 'MM')}
    />
  );
};

export default DatePicker;
