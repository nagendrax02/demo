/* eslint-disable complexity */
import { trackError } from 'common/utils/experience/utils/track-error';
import { lazy, Suspense, useEffect, useState } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import {
  useActivityHistoryActionsStore,
  useSelectedDetails,
  useSelectedIdToPerformAction,
  useSetSelectedDetails,
  useSetShowModal,
  useShowModal
} from 'apps/activity-history/activity-history.store';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { EntityType, Variant } from 'common/types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { getOpportunityRepresentationName } from 'common/utils/helpers';
import { IOppRepresentationName } from 'apps/entity-details/types/entity-data.types';
import Spinner from '@lsq/nextgen-preact/spinner';
import { IDeleteResponse } from './delete.types';
import styles from '../actions.module.css';
import useEntityTabsStore from 'common/component-lib/entity-tabs/store';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface IDelete {
  type: EntityType;
}

const Delete = (props: IDelete): JSX.Element | null => {
  const { type } = props;
  const [oppRepName, setOppRepName] = useState<IOppRepresentationName>();
  const [isLoading, setIsLoading] = useState(true);
  const { setRefreshTab } = useEntityTabsStore();

  const showModal = useShowModal();
  const setShowModal = useSetShowModal();
  const id = useSelectedIdToPerformAction();
  const selectedDetails = useSelectedDetails();
  const setSelectedDetails = useSetSelectedDetails();
  const { showAlert } = useNotification();

  const isActivity = selectedDetails?.ActivityEvent && selectedDetails?.ActivityEvent < 12000;

  useEffect(() => {
    try {
      if (!isActivity) {
        setIsLoading(true);
        (async function getOppName(): Promise<void> {
          const oppName = await getOpportunityRepresentationName(
            useActivityHistoryActionsStore.getState().actionCallerSource
          );
          setOppRepName(oppName);
          setIsLoading(false);
        })();
      }
    } catch (error) {
      trackError(error);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteActivityRoutes = {
    [EntityType.Account]: API_ROUTES.AccountActivityHistoryActivityDelete,
    [EntityType.Lead]: API_ROUTES.activityDelete,
    [EntityType.Opportunity]: API_ROUTES.activityDelete
  };

  const handleDelete = async (): Promise<void> => {
    try {
      if (selectedDetails?.RestrictOperationsOnOpportunity) {
        showAlert({
          type: Type.SUCCESS,
          message: ERROR_MSG.permission
        });
        return;
      }

      const path = `${deleteActivityRoutes[type]}${id}` as string;

      const response = (await httpPost({
        path,
        module: Module.Marvin,
        body: {
          id: id
        },
        callerSource: useActivityHistoryActionsStore.getState().actionCallerSource
      })) as IDeleteResponse;

      if (
        response?.IsSuccess ||
        (typeof response?.Message !== 'string' && response?.Message?.IsSuccessful)
      ) {
        showAlert({
          type: Type.SUCCESS,
          message: `${
            selectedDetails?.ActivityName || selectedDetails?.ActivityDisplayName
          } deleted successfully.`
        });
        setSelectedDetails(null);
      }
      setShowModal('delete', false, CallerSource.NA);
      setRefreshTab();
    } catch (error) {
      trackError(error);
      showAlert({
        type: Type.ERROR,
        message: ERROR_MSG.generic
      });
    }
  };

  const getDescription = (): string => {
    if (isActivity) {
      return 'Are you sure you want to delete selected Activity?';
    } else if (!isActivity) {
      return `Are you sure you want to delete the selected ${
        selectedDetails?.ActivityName || oppRepName?.OpportunityRepresentationSingularName
      }? All the activities, tasks and notes related to this ${
        selectedDetails?.ActivityName || oppRepName?.OpportunityRepresentationSingularName
      } will also be deleted. This action cannot be undone.`;
    }
    return '';
  };

  const getTitle = (): string => {
    if (isActivity) {
      return 'Delete Activity';
    }
    return `Delete ${selectedDetails?.ActivityName}`;
  };

  return (
    <Suspense>
      <ConfirmationModal
        onClose={() => {
          setShowModal('delete', false, CallerSource.NA);
        }}
        show={showModal.delete}
        title={getTitle()}
        description={
          !isActivity && isLoading ? (
            <Spinner customStyleClass={styles.spinner_style} />
          ) : (
            getDescription()
          )
        }
        buttonConfig={[
          {
            id: 1,
            name: 'No',
            variant: Variant.Primary,
            onClick: (): void => {
              setShowModal('delete', false, CallerSource.NA);
            }
          },
          {
            id: 2,
            name: <span className={styles.delete}>Yes, Delete</span>,
            variant: Variant.Secondary,
            onClick: handleDelete,
            showSpinnerOnClick: true
          }
        ]}
      />
    </Suspense>
  );
};

export default Delete;
