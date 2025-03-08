import { IBody } from './delete.type';
import { getRepName } from './utils';
import DeleteAllCheckbox from './DeleteAllCheckbox';
import PartialSuccess from './PartialSuccess';

const DeleteBody = ({
  deleteAll,
  repName,
  setDeleteAll,
  entityIds,
  gridConfig,
  isAsyncReq,
  partialMessage
}: IBody): JSX.Element => {
  if (isAsyncReq) {
    return (
      <>
        Your bulk delete request has been queued. You will be notified when the process is complete.
      </>
    );
  }

  if (partialMessage?.failureCount || partialMessage?.successCount) {
    return <PartialSuccess partialMessage={partialMessage} repName={repName} />;
  }

  return (
    <div>
      <div>
        {`Are you sure you want to delete the selected ${getRepName(
          repName,
          entityIds?.length
        )} ? All the activities, tasks and
      notes related to these ${getRepName(
        repName,
        entityIds?.length
      )} will also be deleted. This action cannot be undone.`}
      </div>
      {gridConfig?.isSelectAll ? (
        <DeleteAllCheckbox
          deleteAll={deleteAll}
          gridConfig={gridConfig}
          repName={repName}
          setDeleteAll={setDeleteAll}
        />
      ) : null}
    </div>
  );
};

export default DeleteBody;
