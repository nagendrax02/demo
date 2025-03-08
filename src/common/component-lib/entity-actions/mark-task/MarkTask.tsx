/* eslint-disable max-lines-per-function */
import withSuspense from '@lsq/nextgen-preact/suspense';
import { useState, useEffect, lazy } from 'react';
import Icon from '@lsq/nextgen-preact/icon';
import { Module, CallerSource, IGet, batchGet } from 'common/utils/rest-client';
import { Variant } from 'common/types';
import { IMarkOpenResponse, IMarkTaskProps, TaskActionType } from './mark-task.type';
import styles from './mark-task.module.css';
import { API_ROUTES, EXCEPTION_MESSAGE } from 'common/constants';
import { handleMarkTaskResponse, handleMarkTaskComplete } from './utils';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

const MarkTask = (props: IMarkTaskProps): JSX.Element => {
  const { taskIds, taskActionType, setGridMask, onSuccess, handleClose, task } = props;
  const [responseError, setResponseError] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  const { showAlert } = useNotification();

  const apiRoutes = {
    [TaskActionType.COMPLETE]: API_ROUTES.markTaskComplete,
    [TaskActionType.OPEN]: API_ROUTES.markTaskOpen
  };

  const getBatchGetDetails = (): IGet[] => {
    const batchGetDetails = taskIds.map((taskId) => ({
      path: `${apiRoutes[taskActionType]}?throwNotifyError=true&id=${taskId}`,
      module: Module.Marvin,
      callerSource: CallerSource.SmartViews
    }));
    return batchGetDetails;
  };

  // eslint-disable-next-line complexity
  const handleApiCall = async (): Promise<void> => {
    try {
      if (setGridMask) setGridMask(true);
      const requests = getBatchGetDetails();
      const response = (await batchGet(requests)) as
        | IMarkOpenResponse[]
        | PromiseSettledResult<IMarkOpenResponse>[];
      handleMarkTaskResponse({
        apiResponses: response,
        onSuccess,
        showAlert: showAlert,
        taskActionType
      });
    } catch (err) {
      setResponseError(err?.response?.data?.ExceptionMessage || EXCEPTION_MESSAGE);
      setShowErrorModal(true);
    }
    if (setGridMask) setGridMask(false);
    handleClose();
  };

  const handleErrorModalClose = (): void => {
    setShowErrorModal(false);
  };

  useEffect(() => {
    if (taskIds.length > 0 && !useFormRenderer.getState()?.formConfig) {
      if (task && taskActionType === TaskActionType.COMPLETE) {
        handleMarkTaskComplete({
          task,
          handleMarkTask: handleApiCall,
          onShowFormChange: (showForm: boolean) => {
            if (!showForm) {
              useFormRenderer.getState().setFormConfig(null);
              handleClose();
            }
          },
          onSuccess: handleApiCall
        });
      } else {
        handleApiCall();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIds]);

  const getDescription = (): JSX.Element => (
    <div className={styles.description}>
      <Icon name="warning" />
      {responseError}
    </div>
  );

  return (
    <ConfirmationModal
      onClose={handleErrorModalClose}
      show={showErrorModal}
      title="Warning"
      description={getDescription()}
      buttonConfig={[
        {
          id: 1,
          name: 'Close',
          variant: Variant.Primary,
          onClick: handleClose
        }
      ]}
    />
  );
};

MarkTask.defaultProps = {
  onSuccess: undefined,
  showLoading: undefined
};

export default MarkTask;
