import Header from 'common/component-lib/entity-tabs-header';
import useTasks from './utils';
import { DefaultTaskPage, Filters } from './components';
import { TimelineGroupShimmer } from '@lsq/nextgen-preact/timeline/timeline-group';
import styles from './tasks.module.css';
import TasksTimeline from './components/tasks-timeline';
import { IEntityDetailsCoreData } from '../entity-details/types/entity-data.types';

const Tasks = ({
  tabId,
  getData
}: {
  tabId: string;
  getData: () => {
    coreData: IEntityDetailsCoreData;
  };
}): JSX.Element => {
  const { coreData } = getData();
  const { entityIds, entityRepNames, entityDetailsType } = coreData;
  const { isLoading, tasksList, intersectionRef, isLoadingNextPage } = useTasks({ entityIds });

  const repName = entityRepNames?.[entityDetailsType];

  const renderTasks = (): JSX.Element => {
    return tasksList?.length ? (
      <TasksTimeline
        tasksList={tasksList}
        intersectionRef={intersectionRef}
        isLoadingNextPage={isLoadingNextPage}
        tabId={tabId}
        coreData={coreData}
      />
    ) : (
      <DefaultTaskPage tabId={tabId} entityRepName={repName} coreData={coreData} />
    );
  };

  return (
    <>
      <Header>
        <Filters />
      </Header>
      <div className={styles.tasks_layout}>
        {isLoading ? <TimelineGroupShimmer /> : renderTasks()}
      </div>
    </>
  );
};

export default Tasks;
