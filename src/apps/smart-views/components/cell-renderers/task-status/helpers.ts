import { IRecordType } from '../../smartview-tab/smartview-tab.types';

export enum TaskStatusCode {
  Completed = 0,
  Pending = 1,
  Overdue = -1,
  Cancelled = 2
}

const formatNumber = (number: number): string => {
  return number < 10 ? `0${number}` : `${number}`;
};

export const getCurrentUTCDate = (): string => {
  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();
  const month = formatNumber(currentDate.getUTCMonth() + 1);
  const day = formatNumber(currentDate.getUTCDate());
  const hour = formatNumber(currentDate.getUTCHours());
  const minutes = formatNumber(currentDate.getUTCMinutes());
  const seconds = formatNumber(currentDate.getUTCSeconds());

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

const isCompletedTask = (statusCode: TaskStatusCode, dueDate: string, endDate: string): boolean => {
  return !!(statusCode === TaskStatusCode.Completed && dueDate && endDate);
};
const getStatus = (
  statusCode: TaskStatusCode,
  dueDate: string,
  endDate: string
): TaskStatusCode => {
  let taskStatus = statusCode;
  const currentUTCDate = getCurrentUTCDate();

  if (statusCode === TaskStatusCode.Pending) {
    taskStatus = TaskStatusCode.Completed;
  }

  if (isCompletedTask(statusCode, dueDate, endDate)) {
    taskStatus =
      dueDate < currentUTCDate && endDate && endDate < currentUTCDate
        ? TaskStatusCode.Overdue
        : TaskStatusCode.Pending;
  }

  return taskStatus;
};

const getStatusCodeAndState = (record: IRecordType): TaskStatusCode => {
  const { DueDate, EndDate } = record;

  const statusCodeFromResponse = parseInt(record?.StatusCode as string);

  const calculatedStatusCode = getStatus(statusCodeFromResponse, DueDate ?? '', EndDate ?? '');

  return statusCodeFromResponse === TaskStatusCode.Pending
    ? TaskStatusCode.Completed
    : calculatedStatusCode;
};

export const getTaskStatus = (
  record: IRecordType
): 'Completed' | 'Pending' | 'Overdue' | 'Cancelled' | '' => {
  const taskStatus = getStatusCodeAndState(record);

  switch (taskStatus) {
    case TaskStatusCode.Completed:
      return 'Completed';
    case TaskStatusCode.Pending:
      return 'Pending';
    case TaskStatusCode.Overdue:
      return 'Overdue';
    case TaskStatusCode.Cancelled:
      return 'Cancelled';
    default:
      return '';
  }
};
