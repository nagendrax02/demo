import { useState } from 'react';
import { useBulkUpdate } from '../bulk-update.store';
import { getUTCDateTimeValue } from '../utils/common';
import { LazyDateTimePicker } from 'common/component-lib/date-time';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const BulkUpdateDateTime = (): JSX.Element => {
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);

  const [value, setValue] = useState('');

  const handleChange = (dateString: string, data: { date: string; time: string }): void => {
    setValue(dateString);
    setUpdateTo({
      value: dateString?.trim() ? getUTCDateTimeValue(dateString) : '',
      date: data.date,
      time: data?.time
    });
  };

  return (
    <LazyDateTimePicker
      value={value ? new Date(value) : undefined}
      onChange={handleChange}
      suspenseFallback={<Shimmer height="32px" width="100%" />}
    />
  );
};

export default BulkUpdateDateTime;
