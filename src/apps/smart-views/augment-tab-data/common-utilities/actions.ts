import { IActionConfig } from 'apps/entity-details/types';
import {
  IEntityRepresentationName,
  IOppRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import {
  IDeleteActionHandler,
  ILeadDeleteResponse
} from 'apps/entity-details/types/action-handler.types';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { API_ROUTES } from 'common/constants';
import { updateGridDataAfterPause } from '../../utils/utils';
import { trackError } from 'common/utils/experience';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { Variant } from '@lsq/nextgen-preact/button/button.types';

export const filterActionById = (
  actions: IActionConfig[],
  allowedActions?: string
): IActionConfig[] => {
  if (!allowedActions) return actions;

  return actions?.filter((action) => allowedActions.includes(action?.id));
};

const isDeleteSuccess = (response: ILeadDeleteResponse): boolean | number => {
  return (
    response?.SuccessCount &&
    response?.FailureCount === 0 &&
    (!response?.RefrencedLeadIds ||
      (response?.RefrencedLeadIds && response?.RefrencedLeadIds?.length === 0))
  );
};

const handleDeleteLead = async (
  customConfig?: Record<string, string>,
  leadRepName?: IEntityRepresentationName
): Promise<void> => {
  const getLeadId = (): string => {
    return customConfig?.ProspectID ?? customConfig?.P_ProspectID ?? '';
  };
  try {
    const response: ILeadDeleteResponse = await httpPost({
      path: API_ROUTES.leadDelete,
      module: Module.Marvin,
      body: {
        ids: [getLeadId()]
      },
      callerSource: CallerSource.SmartViews
    });

    if (isDeleteSuccess(response)) {
      showNotification({
        type: Type.SUCCESS,
        message: `1 ${leadRepName?.PluralName ?? 'Leads'} deleted successfully.`
      });
      updateGridDataAfterPause();
    } else {
      showNotification({
        type: Type.ERROR,
        message: response?.ErrorMessage ?? ERROR_MSG.permission
      });
    }
  } catch (err) {
    trackError(err);
    showNotification({
      type: Type.ERROR,
      message: `${err?.response?.ExceptionMessage ?? err?.message ?? ERROR_MSG.generic}`
    });
  }
};

export const getLeadDeleteActionConfig = (
  leadRepName?: IEntityRepresentationName,
  oppRepName?: IOppRepresentationName
): IDeleteActionHandler => {
  return {
    variant: Variant.Error,
    getTitle: () => `Delete ${leadRepName?.SingularName ?? 'Lead'}`,
    getDescription: async () =>
      `Are you sure you want to delete selected ${leadRepName?.SingularName ?? 'Lead'}? All the ${
        oppRepName?.OpportunityRepresentationPluralName ?? 'opportunities'
      } and activities and files related to this ${
        leadRepName?.SingularName ?? 'Lead'
      } will also be deleted. This action cannot be undone.`,
    handleDelete: async (customConfig?: Record<string, string>): Promise<void> => {
      await handleDeleteLead(customConfig, leadRepName);
    }
  };
};
