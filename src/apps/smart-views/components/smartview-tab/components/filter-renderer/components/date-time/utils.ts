import { getFormattedDateTime, offsetLocalDateToUserDate } from 'src/common/utils/date';

export const getDateDisplayLabel = (
  date: string,
  enableDateTimePicker: boolean,
  avoidUTCFormatting: boolean
): string => {
  if (!date || isNaN(new Date(date).getTime())) return '';
  const localDate = avoidUTCFormatting
    ? new Date(date)
    : (offsetLocalDateToUserDate(new Date(date + ' UTC')) as Date);
  return getFormattedDateTime({
    date: localDate.toISOString(),
    dateTimeFormat: enableDateTimePicker ? 'dd MMM yyyy | hh:mm a' : 'dd MMM yyyy',
    customOptions: {
      years: 'numeric',
      months: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  });
};
