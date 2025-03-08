import { trackError } from 'common/utils/experience/utils/track-error';
import { IOpportunity } from 'common/types';
import { IDeleteActionHandler } from '../../../../../types/action-handler.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { getOpportunityId, isMiP } from 'common/utils/helpers';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { setLocation } from 'router/utils/helper';
import {
  getIsFullScreenEnabled,
  setFullScreenDeleteId
} from 'common/component-lib/full-screen-header/full-screen.store';

export interface IOpportunityDeleteResponse {
  Id: string;
  IsSuccess: boolean;
  Message: string;
}

const getDeleteTitle = (entityData: IOpportunity): string => {
  const oppRepName = entityData?.details?.OppRepresentationName?.Singular;
  return `Delete ${oppRepName}`;
};

const getDeleteDescription = async (entityData: IOpportunity): Promise<string> => {
  const oppRepName = entityData?.details?.OppRepresentationName?.Singular;
  const description = `Are you sure you want to delete the selected ${oppRepName}? All the activities, 
  tasks and notes related to this ${oppRepName} will also be deleted. This action cannot be undone.`;
  return description;
};

const handleSuccess = (oppName: string, oppId: string): void => {
  showNotification({
    type: Type.SUCCESS,
    message: `${oppName} deleted successfully`
  });

  if (getIsFullScreenEnabled()) {
    setFullScreenDeleteId(oppId);
    return;
  }
  if (!isMiP()) {
    setLocation('/');
  }
};

const handleDelete = async (entityData: IOpportunity): Promise<void> => {
  try {
    const oppId = getOpportunityId();
    const oppName =
      // eslint-disable-next-line @typescript-eslint/dot-notation
      entityData?.details?.Fields?.['mx_Custom_1'] ||
      entityData?.details?.OppRepresentationName?.Singular;
    const response: IOpportunityDeleteResponse = await httpPost({
      path: `${API_ROUTES.activityDelete}${oppId}`,
      module: Module.Marvin,
      body: {
        id: oppId
      },
      callerSource: CallerSource.LeadDetailsVCard
    });
    if (response && response?.IsSuccess) {
      handleSuccess(oppName, oppId);
    } else {
      showNotification({
        type: Type.ERROR,
        message: response?.Message
      });
    }
  } catch (err) {
    trackError(err);
    showNotification({
      type: Type.ERROR,
      message: `${err?.response?.ExceptionMessage || err?.message}`
    });
  }
};

export const deleteActionHandler = (entityData: IOpportunity): IDeleteActionHandler => {
  return {
    getTitle: () => getDeleteTitle(entityData),
    getDescription: () => getDeleteDescription(entityData),
    handleDelete: () => handleDelete(entityData)
  };
};
