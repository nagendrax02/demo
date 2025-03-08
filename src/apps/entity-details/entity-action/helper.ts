import { EntityType } from 'common/types';
import { ACTION } from '../constants';
import { API_ROUTES } from 'common/constants';
import { getLeadStageApiRoute } from 'common/utils/helpers/helpers';

export const getSelectedSchemaName = (
  entityDetailsType: EntityType | undefined,
  actionType: string
): string => {
  switch (entityDetailsType) {
    case EntityType.Account:
      return actionType === ACTION.ChangeOwner ? 'OwnerId' : 'Stage';
    default:
      return actionType === ACTION.ChangeOwner || actionType === ACTION.ChangeTaskOwner
        ? 'OwnerId'
        : 'ProspectStage';
  }
};

export const getAPI = (entityDetailsType: EntityType | undefined, leadType?: string): string => {
  const api = {
    [EntityType.Lead]: getLeadStageApiRoute(leadType ?? ''),
    [EntityType.Account]: API_ROUTES.accountDropdownOption
  };

  if (entityDetailsType && api[entityDetailsType]) {
    return api[entityDetailsType] as string;
  }
  return API_ROUTES.leadDropdownOption;
};
