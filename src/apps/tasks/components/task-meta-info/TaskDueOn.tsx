import { getFormattedDateTime } from 'common/utils/date';
import Icon from '@lsq/nextgen-preact/icon';
import style from './task-meta-info.module.css';

interface ITaskDueOn {
  startTime: string;
  endTime: string;
}

const TaskDueOn = ({ startTime, endTime }: ITaskDueOn): JSX.Element => {
  const formattedStartTime = getFormattedDateTime({ date: startTime, timeFormat: 'hh:mm a' });
  const formattedEndTime = getFormattedDateTime({ date: endTime, timeFormat: 'hh:mm a' });

  const [stDate] = (formattedStartTime || '').split(' ');
  const [edDate, edTime, edAmPM] = (formattedEndTime || '').split(' ');

  return (
    <div className={style.task_due_on}>
      <Icon name="schedule" customStyleClass={style.task_due_on_icon} />
      <span>
        {formattedStartTime} - {stDate === edDate ? `${edTime} ${edAmPM}` : `${formattedEndTime}`}
      </span>
    </div>
  );
};

export default TaskDueOn;
