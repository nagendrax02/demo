import { convertDateToTargetOffset } from '@lsq/nextgen-preact/v2/date';
import { getPersistedAuthConfig } from '../authentication';

/* The timezone offset by JS Date object is always returned in minutes.
    e.g: For Asia/Calcutta(GMT+05:30), timezone offset is -330.
    This function (convertTimeZoneOffsetToMinutes) calculates this timezone offset for any custom timezone passed from AuthToken.
    e.g: For US/Eastern(GMT-05:00), timezone offset is returned as +300.
 */
const convertTimeZoneOffsetToMinutes = (offset: string): number => {
  const [sign, hours, minutes] = /([+-]?)(\d{2}):(\d{2})/.exec(offset)?.slice(1) ?? [];
  const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
  return sign === '-' ? totalMinutes : -totalMinutes;
};

/* When there is no timezone information available from Auth for a user, considering his machine timezone for user timezone */
const getUserTimeZoneInMinutes = (): number => {
  const userDetails = getPersistedAuthConfig();
  return userDetails?.User?.TimeZoneOffset
    ? convertTimeZoneOffsetToMinutes(userDetails.User.TimeZoneOffset)
    : new Date().getTimezoneOffset();
};

const offsetUtcDateToLocalDate = (date: Date | null): Date | null => {
  if (!date) return null;
  return convertDateToTargetOffset(date, 0, new Date().getTimezoneOffset());
};

const offsetLocalDateToUtcDate = (date: Date | null): Date | null => {
  if (!date) return null;
  return convertDateToTargetOffset(date, new Date().getTimezoneOffset(), 0);
};

const offsetUtcDateToUserDate = (date: Date | null): Date | null => {
  if (!date) return null;

  const userTimeZoneOffsetInMinutes = getUserTimeZoneInMinutes();
  return convertDateToTargetOffset(date, 0, userTimeZoneOffsetInMinutes);
};

const offsetUserDateToUtcDate = (date: Date | null): Date | null => {
  if (!date) return null;

  const userTimeZoneOffsetInMinutes = getUserTimeZoneInMinutes();
  return convertDateToTargetOffset(date, userTimeZoneOffsetInMinutes, 0);
};

const offsetLocalDateToUserDate = (date: Date | null): Date | null => {
  if (!date) return null;

  const userTimeZoneOffsetInMinutes = getUserTimeZoneInMinutes();
  return convertDateToTargetOffset(
    date,
    new Date().getTimezoneOffset(),
    userTimeZoneOffsetInMinutes
  );
};

const offsetUserDateToLocalDate = (date: Date | null): Date | null => {
  if (!date) return null;

  const userTimeZoneOffsetInMinutes = getUserTimeZoneInMinutes();
  return convertDateToTargetOffset(
    date,
    userTimeZoneOffsetInMinutes,
    new Date().getTimezoneOffset()
  );
};

export {
  offsetUtcDateToLocalDate,
  offsetLocalDateToUtcDate,
  offsetUtcDateToUserDate,
  offsetUserDateToUtcDate,
  offsetLocalDateToUserDate,
  offsetUserDateToLocalDate
};
