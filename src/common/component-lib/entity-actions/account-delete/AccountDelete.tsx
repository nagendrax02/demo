import withSuspense from '@lsq/nextgen-preact/suspense';
import { useEffect, useRef, useState, lazy } from 'react';
import { getButtonConfig, getRepName, handleDelete, hasAssociatedLeads } from './utils';
import { IDelete } from './delete.type';
import styles from './style.module.css';
import Description from './Description';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

const AccountDelete = ({
  handleClose,
  entityIds,
  onSuccess,
  repName,
  companyTypeId,
  gridConfig,
  searchParams,
  customConfig
}: IDelete): JSX.Element => {
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteAll, setDeleteAll] = useState(false);
  const [showAsyncRegMsg, setShowAsyncReqMessage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const entityConfig = useRef({
    entityIds: customConfig?.CompanyId ? [customConfig?.CompanyId] : entityIds,
    companyTypeId: customConfig?.entityCode || companyTypeId
  });

  useEffect((): void => {
    (async (): Promise<void> => {
      setIsLoading(true);
      const isDisabled = await hasAssociatedLeads(entityConfig?.current?.entityIds);
      setIsDeleteDisabled(isDisabled);
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuccess = (isAsyncReq = false): void => {
    setShowAsyncReqMessage(isAsyncReq);

    if (!isAsyncReq) {
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    }
  };

  const onDelete = async (): Promise<void> => {
    if (!entityConfig?.current?.entityIds?.length || !entityConfig?.current?.companyTypeId) return;

    await handleDelete(handleSuccess, setIsDeleting, {
      repName,
      entityIds: entityConfig?.current?.entityIds,
      companyTypeId: entityConfig?.current?.companyTypeId,
      searchParams,
      canDeleteAll: deleteAll
    });
  };
  return (
    <>
      <ConfirmationModal
        onClose={handleClose}
        show
        title={`Delete ${getRepName(repName, entityConfig?.current?.entityIds?.length)}`}
        description={
          <Description
            entityIds={entityConfig?.current?.entityIds}
            repName={repName}
            isDeleteDisabled={isDeleteDisabled}
            isLoading={isLoading}
            setDeleteAll={setDeleteAll}
            deleteAll={deleteAll}
            gridConfig={gridConfig}
            showAsyncRegMsg={showAsyncRegMsg}
          />
        }
        customStyleClass={styles.custom_body}
        buttonConfig={getButtonConfig({
          handleClose,
          isDeleteDisabled,
          isLoading,
          showAsyncRegMsg,
          isDeleting,
          onDelete
        })}
      />
    </>
  );
};

AccountDelete.defaultProps = {
  onSuccess: undefined,
  entityIds: undefined
};
export default AccountDelete;
