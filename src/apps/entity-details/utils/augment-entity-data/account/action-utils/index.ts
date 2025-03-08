import { deleteActionHandler } from './delete-action';
import { IActionHandler } from 'apps/entity-details/types/action-handler.types';
import { ACTION } from 'apps/entity-details/constants';
import { IAccount } from 'common/types';

const actionHandlerMap: Record<string, (entityData: IAccount) => IActionHandler> = {
  [ACTION.Delete]: deleteActionHandler
};

const getActionHandler = (type: string, entityData: IAccount): IActionHandler => {
  if (actionHandlerMap?.[type]) {
    return actionHandlerMap?.[type]?.(entityData);
  }
  return {};
};

export default getActionHandler;
