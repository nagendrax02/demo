import { getTaskStatus } from './helpers';
import { IRecordType } from '../../smartview-tab/smartview-tab.types';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { BadgeStatus } from '@lsq/nextgen-preact/v2/badge/badge.types';

export interface ITaskStatus {
  record: IRecordType;
}

const TaskStatus = ({ record }: ITaskStatus): JSX.Element => {
  const statusName: string = getTaskStatus(record);

  return (
    <Badge size="sm" status={statusName?.toLowerCase() as BadgeStatus}>
      <span title={statusName}>{statusName}</span>
    </Badge>
  );
};

export default TaskStatus;
