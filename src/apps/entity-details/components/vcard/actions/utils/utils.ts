import { trackError } from 'common/utils/experience/utils/track-error';
import { ACTION } from 'apps/entity-details/constants';
import {
  IActionConfig,
  IActionMenuItem,
  IAugmentedAction,
  IAugmentedEntity,
  IButtonAction,
  IEntityDetailsCoreData,
  IProcessConfig,
  ISegregatedActions
} from 'apps/entity-details/types/entity-data.types';
import { handleActionSegregation } from 'apps/entity-details/utils/augment-entity-data/lead/action-utils/action';
import { ISettingConfiguration } from 'common/types/entity/lead';
import { IProcessFormsData, IWorkAreaConfig } from 'common/utils/process/process.types';
import { getProcessActionConfig, isThereFormsToProcess, workAreaIds } from 'common/utils/process';
import useEntityDetailStore from 'src/apps/entity-details/entitydetail.store';
import { EntityType } from 'src/common/types';
import { CallerSource } from 'common/utils/rest-client';
import { OPPORTUNITY } from '../constant';
import { getLeadName } from '../../../../utils';
import { IOpportunity } from 'common/component-lib/send-email/send-email.types';
import { TABS_DEFAULT_ID } from 'src/apps/smart-views/constants/constants';

const updateSalesActivity = (
  actions: IActionConfig[],
  salesActivityDisplayName: string
): IActionConfig[] => {
  const saleActivityConfig = actions?.find((action) => action?.id === ACTION.SalesActivity);
  if (saleActivityConfig) saleActivityConfig.title = salesActivityDisplayName;

  return actions;
};

const updateOpportunity = (actions: IActionConfig[], oppDisplayName: string): IActionConfig[] => {
  const oppConfig = actions?.find((action) => action?.id === ACTION.Opportunity);
  if (oppConfig) oppConfig.title = oppDisplayName;

  return actions;
};

const updateFeatureRestriction = (
  actions: IActionConfig[],
  restrictionMap: Record<string, boolean>
): IActionConfig[] => {
  const filteredActions = actions?.filter((action) => !restrictionMap?.[action?.id]);

  return filteredActions;
};

const handleProcessActionRenaming = (
  title: string,
  segregatedActions: ISegregatedActions
): void => {
  const processAction = segregatedActions?.buttonActions?.find(
    (action) => action?.id === ACTION?.Processes
  );
  if (processAction) processAction.title = title || ACTION?.Processes;
};

const handleProcessAndActivityInclusion = ({
  actions,
  segregatedActions,
  processConfig,
  settingConfig
}: {
  actions: IActionConfig[];
  segregatedActions: ISegregatedActions;
  processConfig: IProcessConfig;
  settingConfig?: ISettingConfiguration;
}): ISegregatedActions => {
  const { title, isProcessPresent } = processConfig;

  const processAction = actions?.find((action) => action?.id === ACTION?.Processes);

  if (!processAction) return segregatedActions;

  if (!processConfig?.isProcessPresent) {
    const disableQuickAddActivityBtn = settingConfig?.DisableQuickAddActivityBtn;
    if (
      (disableQuickAddActivityBtn === '1' || disableQuickAddActivityBtn === 'true') &&
      !isProcessPresent
    ) {
      actions = actions?.filter((action) => action.id !== ACTION.Activity);
      segregatedActions = handleActionSegregation(actions);
    }
  } else {
    handleProcessActionRenaming(title, segregatedActions);
  }

  return segregatedActions;
};

const handleDisplayNameAndProcess = ({
  config,
  salesActivityDisplayName,
  processConfig,
  oppDisplayName,
  buttonActionsLimit,
  restrictionMap
}: {
  config: IAugmentedAction;
  salesActivityDisplayName: string | null;
  processConfig: IProcessConfig | null;
  oppDisplayName: string | null;
  buttonActionsLimit?: number;
  restrictionMap: Record<string, boolean> | null;
}): ISegregatedActions => {
  const { actions, settingConfig } = config;
  let updatedActions = actions;
  let filteredActions = actions;
  if (salesActivityDisplayName) {
    updatedActions = updateSalesActivity(actions, salesActivityDisplayName);
  }

  if (oppDisplayName) {
    updatedActions = updateOpportunity(updatedActions, oppDisplayName);
  }

  if (restrictionMap) {
    filteredActions = updateFeatureRestriction(updatedActions, restrictionMap);
  }

  let updatedSegregation = handleActionSegregation(filteredActions, [], buttonActionsLimit);

  if (processConfig) {
    updatedSegregation = handleProcessAndActivityInclusion({
      actions: updatedActions,
      processConfig: processConfig,
      segregatedActions: updatedSegregation,
      settingConfig
    });
  }

  return updatedSegregation;
};

const getSegregatedActions = (
  actions: IActionConfig[],
  buttonActionsLimit?: number
): ISegregatedActions => {
  const loadingActions = [ACTION.Processes, ACTION.SalesActivity];
  const segregatedActions = handleActionSegregation(actions, loadingActions, buttonActionsLimit);
  return segregatedActions;
};

const getConvertedButtonActions = (
  actions: IButtonAction[],
  processFormsData: IProcessFormsData | null,
  isLoading: boolean
): IButtonAction[] => {
  const convertedActions: IButtonAction[] = [];
  actions?.map((action) => {
    const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
      action,
      processFormsData
    );
    // Remove process button when no forms are configured for activity
    if (action?.id === ACTION.Processes && !totalForms && !isLoading) {
      return;
    }
    const hasSingleForm = totalForms === 1;
    convertedActions.push({
      ...convertedAction,
      subMenu: hasSingleForm ? [] : convertedAction?.subMenu,
      isLoading: action?.workAreaConfig ? isLoading : false,
      title: hasSingleForm ? (firstFormName as string) : action?.title
    });
  });
  return convertedActions;
};

// eslint-disable-next-line complexity
const getConvertedAction = (
  action: IActionMenuItem,
  processFormsData: IProcessFormsData | null,
  isLoading: boolean
): IActionMenuItem => {
  const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
    action,
    processFormsData
  );
  const hasSingleForm = totalForms === 1;
  return {
    ...convertedAction,
    value: hasSingleForm ? convertedAction?.subMenu?.[0]?.value ?? action?.value : action?.value,
    subMenu: hasSingleForm || action.disabled ? [] : convertedAction?.subMenu,
    isLoading: isLoading,
    toolTip: hasSingleForm ? (firstFormName as string) : action.toolTip || action?.label,
    label: hasSingleForm ? (firstFormName as string) : action?.label
  };
};

/* eslint-disable max-lines-per-function, complexity */
const getConvertedMoreActions = (
  actions: IActionMenuItem[],
  processFormsData: IProcessFormsData | null,
  isLoading: boolean
): IActionMenuItem[] => {
  const convertedActions: IActionMenuItem[] = [];

  actions?.map((action) => {
    const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
      action,
      processFormsData
    );

    // Remove process button when no forms are configured for activity
    if (action?.id === ACTION.Processes && !totalForms && !isLoading) {
      return;
    }

    const hasSingleForm = totalForms === 1;
    const updatedAction: IActionMenuItem = {
      ...convertedAction,
      subMenu: hasSingleForm ? [] : convertedAction?.subMenu,
      isLoading: action?.workAreaConfig ? isLoading : false,
      title: hasSingleForm ? firstFormName : action?.title
    };

    // If there are children, map through them recursively
    if (updatedAction.children) {
      updatedAction.children = updatedAction.children.map((childAction) => {
        if (childAction?.workAreaConfig) {
          return getConvertedAction(childAction as IActionMenuItem, processFormsData, isLoading);
        } else {
          return childAction;
        }
      }) as IActionMenuItem[];
    }

    convertedActions.push(updatedAction);
  });

  return convertedActions;
};

const getCallerSource = (): CallerSource => {
  const entityType = useEntityDetailStore.getState().entityType;
  switch (entityType) {
    case EntityType.Lead:
      return CallerSource.LeadDetails;
    case EntityType.Account:
      return CallerSource.AccountDetails;
    default:
      return CallerSource.NA;
  }
};

export const handleOpportunityButton = async (actions: IActionConfig[]): Promise<string | null> => {
  const oppConfig = actions?.find((action) => action?.id === ACTION.Opportunity);
  try {
    if (!oppConfig) return null;

    const module = await import('common/utils/helpers');
    const opportunityRep = await module.getOpportunityRepresentationName(
      CallerSource.LeadDetailsVCard
    );
    return opportunityRep.OpportunityRepresentationSingularName;
  } catch (error) {
    trackError(error);
    return oppConfig?.title || OPPORTUNITY;
  }
};

const getFieldValues = (source: Record<string, string | null> | undefined): string => {
  return source?.Name ?? source?.content ?? '';
};

export const getSendEmailToFieldName = (
  entityType: EntityType,
  entityData: IAugmentedEntity | null,
  fieldValues: Record<string, string | null>
): string => {
  switch (entityType) {
    case EntityType.Lead:
    case EntityType.Task:
      return getLeadName(fieldValues ?? entityData?.attributes?.fields);
    case EntityType.Opportunity:
      return getLeadName(entityData?.associatedEntityProperties?.fields);
    case EntityType.Lists:
      return getLeadName({
        FirstName: getFieldValues(
          fieldValues ?? entityData?.vcard?.body?.primarySection?.components?.[0]?.config
        )
      });
  }
  return '';
};

export const getOpporunityEmailConfig = (
  entityCoreData: IEntityDetailsCoreData
): IOpportunity | undefined => {
  const { entityDetailsType, entityIds, entityRepNames, eventCode } = entityCoreData;
  if (entityDetailsType === EntityType.Opportunity) {
    return {
      ProspectOpportunityId: entityIds?.opportunity,
      OpportunityEventId: eventCode || -1,
      OpportunityName: entityRepNames?.opportunity?.SingularName,
      IsEmailFromOpportunity: !!(entityIds?.opportunity && `${eventCode || -1}`)
    };
  }
  return undefined;
};

const getFilteredProcessActions = (
  actions: IButtonAction[] | IActionMenuItem[]
): IWorkAreaConfig[] => {
  const filteredActions: IWorkAreaConfig[] = [];
  actions.forEach((action) => {
    if (action.workAreaConfig) {
      filteredActions.push(action.workAreaConfig);
    }
    if (action.workAreaConfig?.fallbackAdditionalData) {
      filteredActions.push({
        ...action.workAreaConfig,
        additionalData: action.workAreaConfig.fallbackAdditionalData as string
      });
    }
  });

  return filteredActions;
};

const getUpdatedAdditionalData = (workAreaConfig?: IWorkAreaConfig): string => {
  if (!workAreaConfig) return '';
  let additionalData = workAreaConfig.additionalData;
  if (!isThereFormsToProcess(workAreaConfig)) {
    additionalData = TABS_DEFAULT_ID;
  }
  return (additionalData as string) || '';
};

const getCustomConfig = (
  customConfig: Record<string, string>,
  workAreaConfig?: IWorkAreaConfig
): Record<string, string> => {
  if (
    [
      workAreaIds.SMART_VIEWS.TASK_TAB.ADD_TASK_FOR_LEAD,
      workAreaIds.SMART_VIEWS.TASK_TAB.ADD_ACTIVITY_FOR_LEAD,
      workAreaIds.SMART_VIEWS.TASK_TAB.EDIT_LEAD
    ].includes(workAreaConfig?.workAreaId || -1)
  ) {
    return {
      ...customConfig,
      OpportunityId: '',
      TaskId: ''
    };
  }
  return customConfig;
};

export {
  getSegregatedActions,
  handleDisplayNameAndProcess,
  getConvertedButtonActions,
  getConvertedMoreActions,
  getCallerSource,
  getFilteredProcessActions,
  getUpdatedAdditionalData,
  getCustomConfig
};
