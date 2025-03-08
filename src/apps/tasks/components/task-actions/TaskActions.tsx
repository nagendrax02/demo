import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { ITaskItem } from '../../tasks.types';
import DeleteTask from './DeleteTask';
import EditTask from './EditTask';
import MarkTask from './MarkTask';

export interface ITaskActions {
  data: ITaskItem;
  onDeleteIconClick: () => void;
  tabId: string;
  coreData: IEntityDetailsCoreData;
}

const TaskActions = (props: ITaskActions): JSX.Element => {
  const { data, onDeleteIconClick, tabId, coreData } = props;

  return (
    <>
      <MarkTask taskItem={data} coreData={coreData} />
      <EditTask tabId={tabId} taskItem={data} coreData={coreData} />
      <DeleteTask onDeleteTask={onDeleteIconClick} taskItem={data} />
    </>
  );
};

export default TaskActions;
