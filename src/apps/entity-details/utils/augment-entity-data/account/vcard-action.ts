import { ACCOUNT_QUICK_ACTION_CONFIG, ACTION } from 'apps/entity-details/constants';
import { ActionRenderType, IQuickActionConfig } from 'apps/entity-details/types';
import {
  IActionConfig,
  IActionMenuItem,
  IAugmentedAction
} from 'apps/entity-details/types/entity-data.types';
import { IAccount, IEntity } from 'common/types';
import { getAugmentedActions } from './action-utils/action';
import getActionHandler from './action-utils';

const handleSendEmailDisabledState = (
  action: IActionConfig,
  fields: Record<string, string | null>
): IActionConfig => {
  const isSendEmailDisabled = fields?.DoNotEmail === '1';
  const subMenu = [
    {
      id: 'SendEmailAction',
      label: 'Send Email',
      value: ACTION.SendEmailAction,
      disabled: isSendEmailDisabled,
      toolTip: isSendEmailDisabled ? 'Lead opted out from email communication' : undefined
    },
    {
      id: 'ViewScheduledEmail',
      label: 'View Scheduled Email',
      value: 'ViewScheduledEmail'
    }
  ] as IActionMenuItem[];

  action = {
    ...action,
    title: action?.type === ActionRenderType.Button ? 'Email' : 'Send Email',
    subMenu
  };

  return action;
};

const handleActionHelper = (
  fields: Record<string, string | null>,
  actions: IActionConfig[],
  entityData: IAccount
): IActionConfig[] => {
  actions = actions?.reduce((prev: IActionConfig[], action: IActionConfig) => {
    let updatedAction = action;
    if (action?.id === ACTION.SendEmail) {
      updatedAction = handleSendEmailDisabledState(action, fields);
    }
    prev.push(updatedAction);
    updatedAction.actionHandler = getActionHandler(action?.id, entityData);

    return prev;
  }, [] as IActionConfig[]);

  return actions;
};

const getActions = (entityData: IEntity): IAugmentedAction => {
  const actionConfig = getAugmentedActions(entityData as IAccount);
  if (actionConfig?.actions?.length) {
    actionConfig.actions = handleActionHelper(
      entityData?.details?.Fields,
      actionConfig?.actions,
      entityData as IAccount
    );
  }
  return actionConfig;
};

const getAugmentedQuickActions = (
  entityData: IEntity,
  isUpdateRestricted?: boolean
): IQuickActionConfig[] => {
  const augmentedQuickActions: IQuickActionConfig[] = [];

  if (!isUpdateRestricted) {
    augmentedQuickActions.push(ACCOUNT_QUICK_ACTION_CONFIG.accountEdit);
  }

  return augmentedQuickActions;
};

export { getAugmentedQuickActions, getActions };
