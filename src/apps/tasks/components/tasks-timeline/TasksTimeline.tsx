import { TimelineGroup } from 'common/component-lib/timeline';
import { ITaskItem } from '../../tasks.types';
import RenderTask from './RenderTask';
import { IEntityDetailsCoreData } from '../../../entity-details/types/entity-data.types';

interface ITasksTimeline {
  tasksList: ITaskItem[];
  intersectionRef: React.RefObject<HTMLDivElement>;
  isLoadingNextPage: boolean;
  tabId: string;
  coreData: IEntityDetailsCoreData;
}

const TasksTimeline = (props: ITasksTimeline): JSX.Element => {
  const { tasksList, intersectionRef, isLoadingNextPage, tabId, coreData } = props;

  const itemContent = (data: ITaskItem): JSX.Element => {
    return <RenderTask taskItem={data} tabId={tabId} coreData={coreData} />;
  };

  return (
    <>
      <TimelineGroup<ITaskItem>
        records={tasksList}
        recordIdentifierPropKey="ID"
        groupPropKey="DateString"
        itemContent={itemContent}
        isLoading={isLoadingNextPage}
      />
      <div ref={intersectionRef} />
    </>
  );
};

export default TasksTimeline;
