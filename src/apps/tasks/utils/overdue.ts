import { ITaskItem } from '../tasks.types';

const getDueMinutesText = (minutes: number): string => {
  return `${minutes > 1 ? 'Minutes' : 'Minute'} Overdue ${minutes}`;
};

const getDueDaysText = (days: number): string => {
  return `${days > 1 ? 'Days' : 'Day'} Overdue ${days}`;
};

const getDueHoursText = (hours: number): string => {
  return `${hours > 1 ? 'Hours' : 'Hour'} Overdue ${hours}`;
};

export const differenceInMinutes = (dateTimeValue2: Date, dateTimeValue1: Date): number => {
  let differenceValue = (dateTimeValue2?.getTime() - dateTimeValue1?.getTime()) / 1000;
  differenceValue /= 60;
  return Math.round(differenceValue);
};

export const getOverDueText = (task: ITaskItem): string | null => {
  let overdueText: string | null = null;
  const dueDateString =
    task.EndDateString === '01-01-0001 12:00:00' ? task.DateString : task.EndDateString;
  const dueDate = new Date(`${dueDateString?.split(' ')?.join('T')}Z`);
  const currentDate = new Date();

  // get the difference in minutes
  const totalMinutes = differenceInMinutes(currentDate, dueDate);

  if (totalMinutes > 0) {
    if (totalMinutes >= 60) {
      const totalHours = Math.floor(totalMinutes / 60);
      if (totalHours >= 24) {
        const dueDays = Math.floor(totalHours / 24);
        overdueText = getDueDaysText(dueDays);
      } else {
        overdueText = getDueHoursText(totalHours);
      }
    } else {
      overdueText = getDueMinutesText(totalMinutes);
    }
  }

  return overdueText;
};
