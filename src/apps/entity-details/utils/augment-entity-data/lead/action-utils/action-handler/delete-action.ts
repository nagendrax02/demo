import { trackError } from 'common/utils/experience/utils/track-error';
import { ILead } from 'common/types';
import { IDeleteActionHandler } from '../../../../../types/action-handler.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { showNotification } from '@lsq/nextgen-preact/notification';
import {
  getEntityId,
  getOpportunityRepresentationName,
  isMiP,
  isOpportunityEnabled
} from 'common/utils/helpers';
import { getCallerSource } from '../../../../../components/vcard/actions/utils/utils';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { setLocation } from 'router/utils/helper';
import {
  getIsFullScreenEnabled,
  setFullScreenDeleteId
} from 'common/component-lib/full-screen-header/full-screen.store';

export interface IDeleteResponse {
  RefrencedLeadIds?: string[];
  SuccessCount: number;
  FailureCount: number;
  ErrorMessage?: string;
}
const getDeleteTitle = (entityData: ILead): string => {
  const leadRepName = entityData?.metaData?.LeadRepresentationConfig?.SingularName;
  return `Delete ${leadRepName}`;
};

const getDeleteDescription = async (entityData: ILead): Promise<string> => {
  const oppName = await getOpportunityRepresentationName(CallerSource.LeadDetails);
  const isOppEnabled = await isOpportunityEnabled(getCallerSource());
  const leadRepName = entityData?.metaData?.LeadRepresentationConfig?.SingularName;

  let description = `Are you sure you want to delete selected ${leadRepName}? All the related task`;
  if (oppName?.OpportunityRepresentationPluralName && isOppEnabled) {
    description += `, ${oppName.OpportunityRepresentationPluralName} and `;
  }
  description += `${
    !isOppEnabled ? ' and' : ''
  } activities related to this ${leadRepName} will also be deleted. This action cannot be undone.`;

  return description;
};

const isDeleteSuccess = (response: IDeleteResponse): boolean | number => {
  return (
    response &&
    response.SuccessCount &&
    response.FailureCount === 0 &&
    (!response.RefrencedLeadIds ||
      (response.RefrencedLeadIds && response.RefrencedLeadIds.length === 0))
  );
};

const handleSuccess = (
  response: IDeleteResponse,
  leadRepName: string | undefined,
  leadId: string
): void => {
  showNotification({
    type: Type.SUCCESS,
    message: `${response?.SuccessCount} ${leadRepName}(s) deleted successfully.`
  });

  if (getIsFullScreenEnabled()) {
    setFullScreenDeleteId(leadId);
    return;
  }
  if (isMiP()) {
    const redirectLocation = `${window.parent.location.origin}${window.parent.location.pathname}`;
    window.open(redirectLocation, '_self');
  } else {
    setLocation('/');
  }
};

const handleDelete = async (entityData: ILead): Promise<void> => {
  const leadId = getEntityId();
  const leadRepName = entityData?.metaData?.LeadRepresentationConfig?.SingularName;
  try {
    const response: IDeleteResponse = await httpPost({
      path: API_ROUTES.leadDelete,
      module: Module.Marvin,
      body: {
        Ids: [leadId]
      },
      callerSource: CallerSource.LeadDetailsVCard
    });
    if (isDeleteSuccess(response)) {
      handleSuccess(response, leadRepName, leadId);
    } else {
      showNotification({
        type: Type.ERROR,
        message: response?.ErrorMessage || ERROR_MSG.permission
      });
    }
  } catch (err) {
    trackError(err);
    showNotification({
      type: Type.ERROR,
      message: ERROR_MSG.permission
    });
  }
};

export const deleteActionHandler = (entityData: ILead): IDeleteActionHandler => {
  return {
    getTitle: () => getDeleteTitle(entityData),
    getDescription: () => getDeleteDescription(entityData),
    handleDelete: () => handleDelete(entityData)
  };
};
