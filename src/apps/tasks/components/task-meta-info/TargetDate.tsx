import { taskStatus } from '../../constants';
import { ITaskItem } from '../../tasks.types';
import DateTime from './DateTime';
import TaskDueOn from './TaskDueOn';

interface ITaskMetaInfo {
  taskItem: ITaskItem;
}

const TargetDate = (props: ITaskMetaInfo): JSX.Element => {
  const { taskItem } = props;
  const { Status, EndDateString, CompletedOnString, DateString } = taskItem;

  const renderTargetDate = (): JSX.Element => {
    if (Status === taskStatus.COMPLETED && CompletedOnString) {
      return <DateTime date={CompletedOnString} label="Completed on: " />;
    } else if (Status !== taskStatus.COMPLETED && EndDateString) {
      return <TaskDueOn startTime={DateString} endTime={EndDateString} />;
    }
    return <></>;
  };

  return renderTargetDate();
};

export default TargetDate;
