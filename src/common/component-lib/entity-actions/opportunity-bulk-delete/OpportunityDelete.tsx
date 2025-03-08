import { trackError } from 'common/utils/experience/utils/track-error';
import { lazy, useEffect, useState } from 'react';
import { IDelete } from './delete.type';
import { IEntityRepresentationName } from 'src/apps/entity-details/types/entity-data.types';
import { getOpportunityRepresentationName } from 'src/common/utils/helpers';
import { CallerSource } from 'src/common/utils/rest-client';
import { getButtonConfig, getRepName } from './utils';
import styles from './style.module.css';
import DeleteBody from './DeleteBody';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

const OpportunityDelete = ({
  handleClose,
  entityIds,
  gridConfig,
  onSuccess,
  searchParams,
  eventCode
}: IDelete): JSX.Element => {
  const [oppRepName, setOppRepName] = useState<IEntityRepresentationName>({
    PluralName: 'Opportunities',
    SingularName: 'Opportunity'
  });
  const [deleteAll, setDeleteAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAsyncReq, setIsAsyncReq] = useState(false);
  const [partialMessage, setPartialMessage] = useState({
    successCount: 0,
    failureCount: 0
  });

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const repName = await getOpportunityRepresentationName(CallerSource.OpportunityDelete);
        setOppRepName({
          PluralName: repName.OpportunityRepresentationPluralName,
          SingularName: repName.OpportunityRepresentationSingularName
        });
      } catch (error) {
        trackError(error);
      }
    })();
  }, []);

  const handleSuccess = (): void => {
    if (onSuccess) {
      onSuccess();
    }
    handleClose();
  };

  const onDelete = async (): Promise<void> => {
    try {
      const utils = await import('./on-delete-opportunity');
      utils.onOpportunityDelete({
        entityIds,
        eventCode,
        onSuccess: handleSuccess,
        repName: oppRepName,
        setIsAsyncReq,
        setIsDeleting,
        setPartialMessage,
        gridConfig,
        searchParams,
        deleteAll
      });
    } catch (error) {
      trackError(error);
    }
  };

  return (
    <ConfirmationModal
      onClose={handleClose}
      show
      title={`Delete ${getRepName(oppRepName, entityIds?.length)}`}
      description={
        <DeleteBody
          repName={oppRepName}
          deleteAll={deleteAll}
          setDeleteAll={setDeleteAll}
          entityIds={entityIds}
          gridConfig={gridConfig}
          isAsyncReq={isAsyncReq}
          partialMessage={partialMessage}
        />
      }
      customStyleClass={styles.custom_body}
      buttonConfig={getButtonConfig({
        handleClose,
        isAsyncReq,
        isDeleting,
        onDelete,
        partialMessage
      })}
    />
  );
};

export default OpportunityDelete;
