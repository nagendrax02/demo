import { useState } from 'react';
import Icon from '@lsq/nextgen-preact/icon';
import styles from '../quick-action.module.css';
import useEntityDetailStore, { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { getEntityId } from 'common/utils/helpers';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import Spinner from '@lsq/nextgen-preact/spinner';

enum Status {
  Error = 'Error',
  Success = 'Success'
}

interface IResponse {
  Status: Status;
}

const LeadStarred = (): JSX.Element => {
  const isStarred = useEntityDetailStore((state) => state.isStarred);

  const leadType = useEntityDetailStore((state) => state?.augmentedEntityData?.properties?.fields)
    ?.LeadType;

  const setIsStarred = useEntityDetailStore((state) => state.setIsStarred);

  const leadRepresentationName = useLeadRepName();

  const { showAlert } = useNotification();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const leadId = getEntityId();

  const HandleToggle = async (): Promise<void> => {
    try {
      setIsLoading(true);

      let path = !isStarred
        ? `${API_ROUTES.leadStarred}?leadId=${leadId}`
        : `${API_ROUTES.leadUnstarred}?leadId=${leadId}`;

      if (leadType) {
        path = `${path}&leadType=${leadType}`;
      }

      const response = (await httpGet({
        path,
        module: Module.LeadManagement,
        callerSource: CallerSource.LeadDetailsVCard
      })) as IResponse;

      if (response.Status === Status.Success) {
        setIsStarred(!isStarred);
      }

      if (response.Status === Status.Error) {
        showAlert({
          type: Type.ERROR,
          message: ERROR_MSG.generic
        });
      }
    } catch (error) {
      showAlert({
        type: Type.ERROR,
        message: ERROR_MSG.generic
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = (): string => {
    if (isStarred) return `Unstar ${leadRepresentationName?.SingularName}`;
    return `Star ${leadRepresentationName?.SingularName}`;
  };

  return (
    <div
      data-testid="lead-starred-icon-container"
      onClick={HandleToggle}
      className={styles.lead_starred_container}
      title={getTitle()}>
      {isLoading ? (
        <Spinner />
      ) : (
        <Icon
          dataTestId={isStarred ? 'lead-starred-filled' : 'lead-starred'}
          name={isStarred ? 'star' : 'star_outline'}
          customStyleClass={isStarred ? styles.starred_icon : styles.icon}
        />
      )}
    </div>
  );
};

export default LeadStarred;
