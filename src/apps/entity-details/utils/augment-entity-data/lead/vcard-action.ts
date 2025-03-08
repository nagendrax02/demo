import {
  LEAD_QUICK_ACTION_CONFIG,
  ACTION,
  actionToWorkAreaMap
} from 'apps/entity-details/constants';
import { ActionRenderType, IQuickActionConfig } from '../../../types';
import { getAugmentedActions } from './action-utils/action';
import {
  IActionConfig,
  IActionMenuItem,
  IAugmentedAction
} from 'apps/entity-details/types/entity-data.types';
import { PROCESS_BUTTON } from 'apps/entity-details/components/vcard/actions/constant';
import { ILead, ISettingConfiguration } from 'common/types/entity/lead';
import getActionHandler from './action-utils/action-handler';
import { leadFeatureRestrictionConfigMap } from './constants';
import { workAreaIds } from 'common/utils/process';

const handleCallDisabledState = (
  action: IActionConfig,
  fields: Record<string, string | null>
): IActionConfig => {
  //TODO: Locale
  if (fields?.DoNotCall === '1') {
    action.disabled = true;
    action.toolTip = 'Cannot initiate the call as the Lead has opted for DoNotCall';
  }

  if (!fields?.Phone) {
    action.disabled = true;
    action.toolTip = 'Number is not present';
  }

  return action;
};

const handleSendEmailDisabledState = (
  action: IActionConfig,
  fields: Record<string, string | null>
): IActionConfig => {
  //TODO: Locale
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

const addWorkAreaToAction = (action: IActionConfig): IActionConfig => {
  return {
    ...action,
    workAreaConfig: { workAreaId: actionToWorkAreaMap.lead[action?.id] }
  };
};

const isConverseEnabled = (settingConfiguration?: ISettingConfiguration): boolean => {
  return settingConfiguration?.IsConverseLeadWidgetEnabled?.toLowerCase() === 'true';
};

const isAddActivityActionDisabled = (settingConfiguration?: ISettingConfiguration): boolean => {
  if (
    settingConfiguration?.DisableQuickAddActivityBtn === '1' ||
    settingConfiguration?.DisableQuickAddActivityBtn?.toLowerCase() === 'true'
  ) {
    return true;
  }
  return false;
};

const updatedActionMap: Record<
  string,
  (action: IActionConfig, fields: Record<string, string | null>) => IActionConfig
> = {
  [ACTION.Call]: handleCallDisabledState,
  [ACTION.SendEmail]: handleSendEmailDisabledState
};

const handleActionHelper = ({
  entityData,
  fields,
  actions,
  settingConfiguration
}: {
  entityData: ILead;
  fields: Record<string, string | null>;
  actions: IActionConfig[];
  settingConfiguration?: ISettingConfiguration;
}): IActionConfig[] => {
  actions = actions?.reduce((prev: IActionConfig[], action: IActionConfig) => {
    let updatedAction = action;
    if (updatedActionMap?.[action?.id]) {
      updatedAction = updatedActionMap?.[action?.id](action, fields);
    }

    if (Object.keys(actionToWorkAreaMap.lead).includes(action?.id)) {
      updatedAction = addWorkAreaToAction(updatedAction);
    }

    if (action?.id === ACTION.Activity && isAddActivityActionDisabled(settingConfiguration)) {
      return prev;
    }

    updatedAction.actionHandler = getActionHandler(action?.id, entityData);

    if (action?.id === ACTION.Converse && !isConverseEnabled(settingConfiguration)) {
      return prev;
    } else {
      prev.push(updatedAction);
    }

    return prev;
  }, [] as IActionConfig[]);

  return actions;
};

const addLeadTypeToWorkArea = (
  actions: IActionConfig[],
  leadType: string | null
): IActionConfig[] => {
  if (!leadType) {
    return actions;
  }
  return actions.map((action) => {
    if (
      action?.workAreaConfig?.workAreaId &&
      Object.values(workAreaIds.LEAD_DETAILS).includes(action?.workAreaConfig?.workAreaId)
    ) {
      return {
        ...action,
        workAreaConfig: { ...action.workAreaConfig, additionalData: leadType }
      };
    }
    return action;
  });
};

const getActions = (entityData: ILead): IAugmentedAction => {
  const actionConfig = getAugmentedActions(entityData);
  if (actionConfig?.actions?.length) {
    actionConfig.actions = handleActionHelper({
      entityData,
      fields: entityData?.details?.Fields,
      actions: actionConfig?.actions,
      settingConfiguration: entityData?.details?.SettingConfiguration
    });
    actionConfig?.actions?.push(PROCESS_BUTTON);
    actionConfig.actions = addLeadTypeToWorkArea(
      actionConfig.actions,
      entityData?.details?.Fields?.LeadType
    );
  }
  actionConfig.featureRestrictionConfigMap = leadFeatureRestrictionConfigMap;
  return actionConfig;
};

const getLeadEditQuickAction = (entityData: ILead): IQuickActionConfig => {
  const leadType = entityData?.details?.Fields?.LeadType;
  const leadEditAction = LEAD_QUICK_ACTION_CONFIG.leadEdit;
  if (leadType && leadEditAction?.workAreaConfig) {
    return {
      ...leadEditAction,
      workAreaConfig: {
        ...leadEditAction.workAreaConfig,
        additionalData: leadType
      }
    };
  }
  return leadEditAction;
};

const getAugmentedQuickActions = (
  entityData: ILead,
  isUpdateRestricted?: boolean
): IQuickActionConfig[] => {
  const augmentedQuickActions: IQuickActionConfig[] = [];

  // LeadStar
  augmentedQuickActions.push(LEAD_QUICK_ACTION_CONFIG.leadStar);

  // LeadShare
  augmentedQuickActions.push(LEAD_QUICK_ACTION_CONFIG.leadShare);

  // Converse
  if (isConverseEnabled(entityData?.details?.SettingConfiguration)) {
    augmentedQuickActions.push(LEAD_QUICK_ACTION_CONFIG.converse);
  }

  // LeadEdit
  if (!isUpdateRestricted) {
    augmentedQuickActions.push(getLeadEditQuickAction(entityData));
  }

  return augmentedQuickActions;
};

export { getActions, getAugmentedQuickActions };
