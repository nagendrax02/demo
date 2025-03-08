import { EntityType } from 'common/types';
import {
  useActivityHistoryActionsStore,
  useSelectedIdToPerformAction,
  useSetShowModal,
  useShowModal
} from './activity-history.store';
import Cancel from './components/custom/actions/cancel';
import Delete from './components/custom/actions/delete/Delete';
import useEntityTabsStore from 'common/component-lib/entity-tabs/store';

interface IActivityHistoryActions {
  type: EntityType;
}

const ActivityHistoryActions = (props: IActivityHistoryActions): JSX.Element => {
  const { type } = props;
  const showModal = useShowModal();
  const setShowModal = useSetShowModal();
  const id = useSelectedIdToPerformAction();
  const callerSource = useActivityHistoryActionsStore.getState().actionCallerSource;
  const { setRefreshTab } = useEntityTabsStore();
  return (
    <div>
      {showModal.delete ? <Delete type={type} /> : null}
      {showModal.cancel ? (
        <Cancel
          onSuccess={setRefreshTab}
          show={showModal.cancel}
          setShowModal={setShowModal}
          entityId={id}
          callerSource={callerSource}
        />
      ) : null}
    </div>
  );
};

export default ActivityHistoryActions;
