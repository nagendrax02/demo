import { IOpportunity } from 'common/types';
import {
  IActionConfig,
  IActionMenuItem,
  IAugmentedAction
} from '../../../../types/entity-data.types';
import { getActionConfig } from './action-utils';
import { ACTION } from '../../../../constants';
import { ActionRenderType, IQuickActionConfig } from '../../../../types';
import getActionHandler from './action-handler';
import {
  OPP_PROCESS_ACTION_CONFIG,
  OPP_QUICK_ACTION_CONFIG,
  opportunityFeatureRestrictionConfigMap
} from '../constants';
import { isOppActionRestricted } from '../utils';

const handleSendEmailDisabledState = (
  action: IActionConfig,
  entityData: IOpportunity
): IActionConfig => {
  //TODO: Locale
  const associatedLeadData = entityData?.details?.AssociatedLeadData;
  const isSendEmailDisabled = associatedLeadData?.details?.Fields?.DoNotEmail === '1';
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

const handleCallDisabledState = (
  action: IActionConfig,
  entityData: IOpportunity
): IActionConfig => {
  const associatedLeadData = entityData?.details?.AssociatedLeadData?.details;
  if (associatedLeadData?.Fields?.DoNotCall === '1') {
    action.disabled = true;
    action.toolTip = 'Cannot initiate the call as the Lead has opted for DoNotCall';
  }

  if (!associatedLeadData?.Fields?.Phone) {
    action.disabled = true;
    action.toolTip = 'Number is not present';
  }

  return action;
};

const getEditOppFormTitle = (entityData: IOpportunity): string => {
  const oppFields = entityData?.details?.Fields;
  return `Edit ${
    // eslint-disable-next-line @typescript-eslint/dot-notation
    oppFields?.['mx_Custom_1'] || entityData?.details?.OppRepresentationName?.Singular
  }`;
};

const handleActionHelper = (
  entityData: IOpportunity,
  actions: IActionConfig[],
  isUpdateRestricted?: boolean
): IActionConfig[] => {
  actions = actions?.reduce((prev: IActionConfig[], action: IActionConfig) => {
    let updatedAction = action;
    if (action?.id === ACTION.Call) {
      updatedAction = handleCallDisabledState(action, entityData);
    }

    if (action?.id === ACTION.SendEmail) {
      updatedAction = handleSendEmailDisabledState(action, entityData);
    }

    if (OPP_PROCESS_ACTION_CONFIG?.[action?.id]) {
      updatedAction = { ...action, ...OPP_PROCESS_ACTION_CONFIG?.[action?.id] };
    }

    if (updatedAction?.id === ACTION.OpportunityDetailEditVCard || ACTION.Edit) {
      updatedAction.formTitle = getEditOppFormTitle(entityData);
    }

    updatedAction.actionHandler = getActionHandler(action?.id, entityData);

    if (isOppActionRestricted(entityData, action, isUpdateRestricted)) return prev;

    prev.push(updatedAction);

    return prev;
  }, [] as IActionConfig[]);

  return actions;
};

const getVcardActions = (
  entityData: IOpportunity,
  isUpdateRestricted?: boolean
): IAugmentedAction => {
  let actions = getActionConfig(
    entityData?.details?.ActionsConfiguration,
    entityData?.details?.ConnectorConfiguration
  );

  if (actions?.length) {
    actions = handleActionHelper(entityData, actions, isUpdateRestricted);
  }

  return { actions, featureRestrictionConfigMap: opportunityFeatureRestrictionConfigMap };
};

const getVcardQuickActions = (
  entityData: IOpportunity,
  isUpdateRestricted?: boolean
): IQuickActionConfig[] => {
  const augmentedQuickActions: IQuickActionConfig[] = [];

  const oppVcardEdit: IQuickActionConfig = {
    ...OPP_QUICK_ACTION_CONFIG.opportunityEdit,
    formTitle: getEditOppFormTitle(entityData)
  };
  // Edit
  if (!isUpdateRestricted) {
    augmentedQuickActions.push(oppVcardEdit);
  }

  return augmentedQuickActions;
};

export { getVcardActions, getVcardQuickActions };
