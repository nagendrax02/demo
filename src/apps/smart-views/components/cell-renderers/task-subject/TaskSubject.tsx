import { getTaskStatus } from '../task-status/helpers';
import { IRecordType, IColumn } from '../../smartview-tab/smartview-tab.types';
import styles from './task-subject.module.css';
import Appointment from 'assets/custom-icon/v2/Appointment';
import { getTaskColorGroup } from 'common/utils/color-group-mapper/colorGroupMapper';
import RecurringSchedule from 'assets/custom-icon/v2/RecurringSchedule';
import ToDo from 'assets/custom-icon/v2/Todo';
import SuccessTick from 'assets/custom-icon/v2/SuccessTick';
import { classNames } from 'common/utils/helpers/helpers';
import { ReactNode } from 'react';
import { TaskTypeCategory } from 'common/types/entity/task/metadata.types';
import Tooltip from '@lsq/nextgen-preact/tooltip';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from 'common/types';

export interface ITaskSubject {
  record: IRecordType;
  columnDef: IColumn;
}

const getClassName = (baseClass: string, isCancelledTask: boolean): string => {
  return classNames(baseClass, isCancelledTask ? styles.cancelled_task : '');
};

const TaskSubjectIcon = ({
  isCancelled,
  isCompleted,
  record
}: {
  isCancelled: boolean;
  isCompleted: boolean;
  record: IRecordType;
}): ReactNode => {
  const colorGroup = getTaskColorGroup(record?.Color ?? '');
  return (
    <Tooltip
      content={record?.TaskName ?? 'Task'}
      placement={Placement.Vertical}
      theme={Theme.Dark}
      trigger={[Trigger.Hover]}>
      <div className={getClassName(styles.icon_wrapper, isCancelled)} style={colorGroup}>
        {parseInt(record?.Category || '') === TaskTypeCategory.Todo ? (
          <ToDo className={styles.task_icon} style={colorGroup} type={'outline'} />
        ) : (
          <Appointment className={styles.task_icon} style={colorGroup} type={'filled'} />
        )}
        {isCompleted ? <SuccessTick className={styles.success_task_icon} type={'filled'} /> : null}
      </div>
    </Tooltip>
  );
};

const TaskSubject = (props: ITaskSubject): JSX.Element => {
  const { record, columnDef } = props;

  const taskStatus = getTaskStatus(record);
  const isCancelled = taskStatus === 'Cancelled';
  return (
    <div className={styles.subject_wrapper}>
      <TaskSubjectIcon
        isCancelled={isCancelled}
        isCompleted={taskStatus === 'Completed'}
        record={record}
      />
      <div className={styles.content_wrapper}>
        <div
          className={getClassName(styles.subject, isCancelled)}
          title={record?.[columnDef.id] ?? ''}>
          {record?.[columnDef.id]}
        </div>
      </div>

      {record?.IsRecurring ? (
        <RecurringSchedule className={styles.recurring_icon} type={'outline'} />
      ) : null}
    </div>
  );
};

export default TaskSubject;
