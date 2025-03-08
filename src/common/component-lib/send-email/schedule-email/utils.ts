import { trackError } from 'common/utils/experience/utils/track-error';
import { IEmailCols } from './schdeule-email.types';

const parseScheduledDate = (dateString: string): Date => {
  const [datePart, timePart, timeMeridiem] = dateString.split(' ');
  const [day, month, year] = datePart ? datePart.split('/').map(Number) : [0, 0, 0];
  const [hoursStr, minutes] = timePart ? timePart.split(':').map(Number) : [0, 0];
  let hours = hoursStr;

  if (timeMeridiem === 'PM' && hours !== 12) {
    hours += 12;
  } else if (timeMeridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return new Date(year, month - 1, day, hours, minutes);
};

const handleSort = (record: IEmailCols[] | undefined, sortOrder: number): IEmailCols[] => {
  if (!record?.length) return [];
  if (sortOrder === 0 || sortOrder === 2) {
    return [...record].sort((a, b) => {
      const dateA = parseScheduledDate(a.scheduledOn);
      const dateB = parseScheduledDate(b.scheduledOn);
      return dateA.getTime() - dateB.getTime();
    });
  } else if (sortOrder === 1) {
    return [...record].sort((a, b) => {
      const dateA = parseScheduledDate(a.scheduledOn);
      const dateB = parseScheduledDate(b.scheduledOn);
      return dateB.getTime() - dateA.getTime();
    });
  }
  return [...record];
};

const formatDate = (date: string): string => {
  if (!date) return '';
  try {
    const [datePart, timePart, DayFormat] = date.split(' ');

    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');

    return `${day}/${month}/${year} ${hours}:${minutes} ${DayFormat}`;
  } catch (error) {
    trackError(error);
    return date;
  }
};

const filterRecord = (record: IEmailCols[] | undefined, id: string): IEmailCols[] => {
  if (!record?.length) return [];
  const filteredRecord = record.filter((rec) => rec.id !== id);
  return filteredRecord || [];
};

export { handleSort, formatDate, filterRecord };
