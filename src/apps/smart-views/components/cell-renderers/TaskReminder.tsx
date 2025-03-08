import { IRecordType } from '../smartview-tab/smartview-tab.types';

const formatReminderTime = (time: string | number): string => {
  const reminderTime = `${time}`;
  const today = new Date();
  const dd = `${today.getDate()}`.padStart(2, '0');
  const mm = `${today.getMonth() + 1}`.padStart(2, '0');
  const yyyy = today.getFullYear();

  const reminderTimeInUTC = new Date(`${mm}/${dd}/${yyyy} ${reminderTime} UTC`);
  const utcDate = new Date(reminderTimeInUTC);
  return `${`${utcDate.getHours()}`.padStart(2, '0')}:${`${utcDate.getMinutes()}`.padStart(
    2,
    '0'
  )}:${`${utcDate.getSeconds()}`.padStart(2, '0')}`;
};

// eslint-disable-next-line complexity
export const getReminderText = (record: IRecordType): string => {
  const {
    Reminder,
    Category,
    NotifyBy: notifyBy,
    ReminderBeforeDays,
    ReminderTime: reminderTime
  } = record || {};

  const reminder = Reminder as unknown as number;
  const category = Category as unknown as number;
  const reminderBeforeDays = ReminderBeforeDays as unknown as number;

  if (notifyBy === '1000' || (category === 1 && reminderBeforeDays === 0 && !reminderTime)) {
    return 'None';
  }

  if (category === 1) {
    const reminderText =
      reminderBeforeDays && reminderBeforeDays !== 0
        ? `${reminderBeforeDays} day(s) before`
        : 'On Due Date';
    return reminderTime && reminder >= 0
      ? `${reminderText} at ${formatReminderTime(reminderTime)} `
      : reminderText;
  }

  if (category === 0 && reminder) {
    return `${reminder} mins`;
  }

  return '';
};

const TaskReminder = ({ record }: { record: IRecordType }): JSX.Element => {
  const text = getReminderText(record);
  return <>{text}</>;
};

export default TaskReminder;
