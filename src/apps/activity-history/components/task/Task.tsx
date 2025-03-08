import RenderTask from 'apps/tasks/components/tasks-timeline/RenderTask';
import { ITimeline } from '../../types';
import { convertToTaskItem } from './utils';
import { TAB_ID } from 'common/component-lib/entity-tabs/constants/tab-id';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';
import { EntityType } from 'common/types';

const Task = (props: ITimeline): JSX.Element => {
  const { data, entityDetailsCoreData } = props;

  const tabId =
    entityDetailsCoreData?.entityDetailsType === EntityType.Opportunity
      ? TAB_ID.Tasks
      : TAB_ID.LeadTasks;

  return (
    <RenderTask
      taskItem={convertToTaskItem(data)}
      tabId={tabId}
      coreData={entityDetailsCoreData || MOCK_ENTITY_DETAILS_CORE_DATA}
    />
  );
};

export default Task;
