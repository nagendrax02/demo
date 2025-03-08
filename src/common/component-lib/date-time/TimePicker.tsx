import NextGenTimePicker from '@lsq/nextgen-preact/date/time-picker';
import { ITimePIcker } from '@lsq/nextgen-preact/date/date.types';
import { DEFAULT_TIME_FORMAT } from './constant';

const TimePicker = (props: ITimePIcker): JSX.Element => {
  return <NextGenTimePicker {...props} timeFormat={DEFAULT_TIME_FORMAT} />;
};

export default TimePicker;
