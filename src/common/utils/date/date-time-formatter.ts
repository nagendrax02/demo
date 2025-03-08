import {
  getFormattedDateTime as nextgenFormattedDateTime,
  getFormattedDate as nextgenGetFormattedDate,
  getFormattedTime as nextgenGetFormattedTime
} from '@lsq/nextgen-preact/date/utils';
import { DATE_AND_TIME_CONFIG, FormattedDate } from 'apps/entity-details/types/entity-data.types';
import { getPersistedAuthConfig } from '../authentication';

const getFormattedDateTime = ({
  date,
  timeFormat,
  dateTimeFormat,
  timeZone,
  customOptions
}: FormattedDate): string => {
  if (!date) return '';

  const userDetails = getPersistedAuthConfig();
  const userTimeZone = timeZone ?? userDetails?.User?.TimeZone ?? '';
  const formatToApply = timeFormat ?? DATE_AND_TIME_CONFIG.FORMAT;
  const dateTimeFormatToApply =
    dateTimeFormat || `${userDetails?.User?.DateFormat} ${formatToApply}`?.replace('mm', 'MM');
  return nextgenFormattedDateTime({
    date,
    timeZone: userTimeZone,
    dateTimeFormat: dateTimeFormatToApply,
    customOptions
  });
};

const getFormattedDate = (
  date: string,
  userFormat: string | undefined,
  ignoreSystemTimeValue: boolean = true //default value is true as no need to consider time in this method (use case: date data type )
): string => {
  if (!date) return '';
  const userDetails = getPersistedAuthConfig();

  const formatToApply = (userFormat ?? userDetails?.User?.DateFormat)?.replace('mm', 'MM');

  if (!formatToApply) return '';

  return nextgenGetFormattedDate(date, formatToApply, ignoreSystemTimeValue);
};

const getFormattedTime = (date: string, timeZone?: string): string => {
  if (!date) return '';
  const userDetails = getPersistedAuthConfig();
  const userTimeZone = timeZone || userDetails?.User?.TimeZone;

  if (!userTimeZone) return date;

  return nextgenGetFormattedTime(date, userTimeZone);
};

export { getFormattedDateTime, getFormattedDate, getFormattedTime };
