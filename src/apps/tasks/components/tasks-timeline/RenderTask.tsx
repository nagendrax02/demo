import Timeline from 'common/component-lib/timeline';
import { ITaskItem } from '../../tasks.types';
import DateTime from './DateTime';
import RenderIcon from './RenderIcon';
import Body from '../task-body';
import TaskActions from '../task-actions';
import { useState } from 'react';
import DeleteModal from '../delete-modal';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

interface IRenderTask {
  taskItem: ITaskItem;
  tabId: string;
  coreData: IEntityDetailsCoreData;
}

const RenderTask = (props: IRenderTask): JSX.Element => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { taskItem, tabId, coreData } = props;

  const onDeleteIconClick = (): void => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <Timeline
        timeline={{
          data: taskItem,
          onDeleteIconClick,
          tabId,
          coreData
        }}
        components={{
          Icon: RenderIcon,
          DateTime,
          Body,
          Actions: TaskActions
        }}
      />
      {showDeleteModal ? (
        <DeleteModal
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          taskItem={taskItem}
          coreData={coreData}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default RenderTask;
