import { IOpportunity } from 'common/types';
import { ACTION } from 'apps/entity-details/constants';
import { IActionHandler } from '../../../../../types/action-handler.types';
import { deleteActionHandler } from './delete-action';

const actionHandlerMap: Record<string, (entityData: IOpportunity) => IActionHandler> = {
  [ACTION.Delete]: deleteActionHandler
};

const getActionHandler = (type: string, entityData: IOpportunity): IActionHandler => {
  if (actionHandlerMap?.[type]) {
    return actionHandlerMap?.[type]?.(entityData);
  }
  return {};
};

export default getActionHandler;
