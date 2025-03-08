import { useState } from 'react';
import { useBulkUpdate } from '../bulk-update.store';
import { getCurrentTime, getUTCDateTimeValue, getUtcTime } from '../utils/common';
import { LazyDatePicker, LazyTimePicker } from 'common/component-lib/date-time';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const BulkUpdateDate = ({ isTimePicker }: { isTimePicker?: boolean }): JSX.Element => {
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const [value, setValue] = useState('');

  const handleChange = (dateString: string): void => {
    setValue(dateString);
    setUpdateTo({
      value: dateString?.trim()
        ? isTimePicker
          ? getUtcTime(dateString?.trim())
          : getUTCDateTimeValue(`${dateString?.split(' ')[0]} ${getCurrentTime()}`)
        : ''
    });
  };

  if (isTimePicker)
    return (
      <LazyTimePicker
        value={value ? new Date(value) : undefined}
        onChange={handleChange}
        suspenseFallback={<Shimmer height="32px" width="100%" />}
        isTwelveHoursFormat
      />
    );
  return (
    <LazyDatePicker
      value={value ? new Date(value) : undefined}
      onChange={handleChange}
      suspenseFallback={<Shimmer height="32px" width="100%" />}
    />
  );
};

BulkUpdateDate.defaultProps = {
  isTimePicker: false
};
export default BulkUpdateDate;
