import { ILead } from 'common/types';
import { ACTION } from '../../../../../constants';
import { IActionHandler } from '../../../../../types/action-handler.types';
import { deleteActionHandler } from './delete-action';

const actionHandlerMap: Record<string, (entityData: ILead) => IActionHandler> = {
  [ACTION.Delete]: deleteActionHandler
};

const getActionHandler = (type: string, entityData: ILead): IActionHandler => {
  if (actionHandlerMap?.[type]) {
    return actionHandlerMap?.[type]?.(entityData);
  }
  return {};
};

export default getActionHandler;
