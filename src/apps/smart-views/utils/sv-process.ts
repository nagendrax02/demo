/* eslint-disable complexity */
import {
  IActionConfig,
  IActionMenuItem,
  IButtonAction,
  IEntityRepresentationName,
  IGetProcessActionConfig
} from 'apps/entity-details/types/entity-data.types';
import { TASK_ACTION_CATEGORY } from 'apps/smart-views/augment-tab-data/task/constants';
import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { getWorkAreaProcessForms, workAreaIds } from 'common/utils/process';
import {
  IProcessFormsData,
  IProcessMenuItem,
  IProcessResponse,
  IUpdateActionList,
  IWorkAreaConfig
} from 'common/utils/process/process.types';
import { IRecordType, IRowActionConfig } from '../components/smartview-tab/smartview-tab.types';
import {
  isCallActionDisabled,
  isManageTab as isManageEntityTab,
  isSendEmailActionDisabled
} from 'apps/smart-views/utils/utils';
import { getArgumentTaskRowActions } from 'apps/smart-views/augment-tab-data/task/utils';
import { ACTION } from 'apps/entity-details/constants';
import { CallerSource } from 'common/utils/rest-client';
import { findProcessActionOutput } from 'apps/forms/forms-process-integration';
import { getProcessKey, isThereFormsToProcess } from 'common/utils/process/process';
import { EntityType } from 'common/types';
import { ALL, CUSTOM_ACTIONS, TABS_DEFAULT_ID } from '../constants/constants';
import { removeDuplicateObjects } from 'common/utils/helpers/helpers';
import { LEAD_OPPORTUNITY_TAB_ID } from '../components/custom-tabs/lead-opportunity-tab/constants';
import { TABS_CACHE_KEYS } from '../components/custom-tabs/constants';
import { LEAD_TYPE_ADDITIONAL_DATA_SEP } from 'common/constants';
import { getStringifiedLeadType } from '../augment-tab-data/common-utilities/utils';
import { isLeadTypeEnabledForProcess } from 'common/utils/lead-type/settings';
import { trackError } from 'common/utils/experience';
import { getTabData } from '../components/smartview-tab/smartview-tab.store';
import { sendEmailDisableMessageForManageList } from '../components/custom-tabs/manage-lists/utils';
import getSectionHeader from './get-section-header';
import { DO_NOT_CONTACT_MSG } from 'v2/component-lib/entity-fields/constant';
import { PERMISSION_ERROR_MSG } from 'common/utils/permission-manager/constant';

export interface IAugmentRowActions {
  record: IRecordType & Record<string, string>;
  repName?: IEntityRepresentationName;
  actionsList?: (IActionConfig | IActionMenuItem)[];
  tabId?: string;
  leadTypeInternalNameForProcess?: string;
  isEssTenantEnabled?: boolean;
}

export const getUpdatedProcessKey = (workAreaConfig: IWorkAreaConfig): string => {
  let key = getProcessKey(workAreaConfig);
  if (workAreaConfig.fallbackAdditionalData && !isThereFormsToProcess(workAreaConfig)) {
    key = getProcessKey({ ...workAreaConfig, additionalData: TABS_DEFAULT_ID });
  }
  return key;
};

const getAdditionalData = (
  additionalData?: string,
  leadTypeInternalName?: string
): string | undefined => {
  if (!leadTypeInternalName?.length) return additionalData;

  if (additionalData?.length) {
    return `${additionalData}${LEAD_TYPE_ADDITIONAL_DATA_SEP}${leadTypeInternalName}`;
  }

  return leadTypeInternalName;
};

export const getUpdatedWorkAreaConfig = (
  workAreaConfig?: IWorkAreaConfig,
  record?: Record<string, string>,
  leadTypeInternalName?: string
): IWorkAreaConfig | undefined => {
  if (!workAreaConfig) return workAreaConfig;
  if (workAreaConfig.workAreaId === workAreaIds.SMART_VIEWS.TASK_TAB.EDIT) {
    return {
      ...workAreaConfig,
      additionalData: `${workAreaConfig?.additionalData}${
        record?.TaskTypeId ? `$${record?.TaskTypeId}` : ''
      }`
    };
  }
  if (workAreaConfig.workAreaId === workAreaIds.MANAGE_TASKS.EDIT) {
    const additionalData = getAdditionalData(
      `${record?.TaskTypeId ? record?.TaskTypeId : ''}`,
      leadTypeInternalName
    );

    return {
      ...workAreaConfig,
      additionalData
    };
  }

  return {
    ...workAreaConfig,
    additionalData: getAdditionalData(workAreaConfig.additionalData, leadTypeInternalName)
  };
};

const updateActionList = ({
  item,
  record,
  leadTypeInternalNameForProcess
}: IUpdateActionList): IActionConfig => {
  let action: IActionConfig = {
    ...item,
    workAreaConfig: getUpdatedWorkAreaConfig(
      item?.workAreaConfig,
      record,
      leadTypeInternalNameForProcess
    )
  };
  if (item.id === ACTION.SendEmailAction && isSendEmailActionDisabled(record)) {
    action.disabled = true;
    action.toolTip = !(record?.EmailAddress || record?.P_EmailAddress)
      ? 'Email not found'
      : DO_NOT_CONTACT_MSG.DoNotEmail;
  }
  if (item.id === ACTION.Call && isCallActionDisabled(record)) {
    action.disabled = true;
    action.toolTip = !(record?.Phone || record?.P_Phone)
      ? 'Number not found'
      : DO_NOT_CONTACT_MSG.DoNotCall;
  }
  action = record?.TaskTypeId
    ? (getArgumentTaskRowActions(action, record) as IActionConfig)
    : action;

  if (
    [ACTION.ChangeOwner, ACTION.ChangeStage, ACTION.Delete].includes(item.id) &&
    record?.CanUpdate === 'false'
  ) {
    action.disabled = true;
    action.toolTip = PERMISSION_ERROR_MSG;
  }

  return action;
};

const updateActionListForManageLists = ({
  item,
  record,
  repName,
  isEssTenantEnabled
}: IUpdateActionList): IActionConfig => {
  const action: IActionConfig = {
    ...item
  };
  if (item.id === ACTION.SendEmailAction) {
    const sendEmailDisableMessage = sendEmailDisableMessageForManageList(
      record,
      repName,
      isEssTenantEnabled || false
    );
    if (sendEmailDisableMessage) {
      action.disabled = true;
      action.toolTip = sendEmailDisableMessage;
    }
  }

  return action;
};

const updateActionWorkArea = (
  action: IActionConfig,
  record: IRecordType & Record<string, string>
): IActionConfig => {
  if (action?.workAreaConfig) {
    return {
      ...action,
      workAreaConfig: {
        ...action?.workAreaConfig,
        additionalData: record?.ActivityEvent
      }
    };
  }
  return action;
};

const disableTaskCustomAction = (
  action: IActionConfig,
  record: IRecordType & Record<string, string>
): IActionConfig => {
  const updatedAction = { ...action };
  if (action?.id === CUSTOM_ACTIONS) {
    const subMenu: IActionMenuItem[] = [];
    action?.subMenu?.forEach((item: IActionMenuItem) => {
      subMenu.push({
        ...item,
        disabled: !(item?.taskType === record?.TaskTypeId || item?.taskType?.toLowerCase() === ALL)
      });
    });
    updatedAction.subMenu = subMenu;
  }
  return updatedAction;
};

// eslint-disable-next-line max-lines-per-function
const augmentRowActions = (data: IAugmentRowActions): IActionConfig[] | undefined => {
  const {
    record,
    repName,
    actionsList,
    tabId,
    leadTypeInternalNameForProcess,
    isEssTenantEnabled
  } = data;
  // eslint-disable-next-line max-lines-per-function
  return actionsList?.reduce((acc: IActionConfig[], item) => {
    if (item.id === ACTION.SetAsPrimaryContact && parseInt(record.IsPrimaryContact ?? '')) {
      return acc;
    }
    if (
      record?.TaskTypeId &&
      (item.id === TASK_ACTION_CATEGORY.TASK_ACTION || item.id === TASK_ACTION_CATEGORY.LEAD_ACTION)
    ) {
      const action = { ...item } as unknown as IMenuItem;
      const childrenActions = action.children?.map((childAction) => {
        const childActionItem = childAction as unknown as IActionConfig;
        return updateActionList({
          item:
            item.id === TASK_ACTION_CATEGORY.TASK_ACTION
              ? disableTaskCustomAction(childActionItem, record)
              : childActionItem,
          record
        });
      });
      return [
        ...acc,
        {
          ...action,
          children: childrenActions
        }
      ];
    }
    if (tabId === LEAD_OPPORTUNITY_TAB_ID) {
      return [
        ...acc,
        updateActionList({
          item: updateActionWorkArea(item as IActionConfig, record),
          record
        })
      ];
    }
    if (tabId === TABS_CACHE_KEYS.MANAGE_TASKS_TAB) {
      return [
        ...acc,
        updateActionList({
          item: disableTaskCustomAction(item as IActionConfig, record),
          record,
          leadTypeInternalNameForProcess
        })
      ];
    }

    if (tabId === TABS_CACHE_KEYS.MANAGE_LEADS_TAB) {
      return [
        ...acc,
        updateActionList({
          item: item as IActionConfig,
          record,
          leadTypeInternalNameForProcess
        })
      ];
    }
    if (tabId === TABS_CACHE_KEYS.MANAGE_LISTS_TAB) {
      return [
        ...acc,
        updateActionListForManageLists({
          item: item as IActionConfig,
          record,
          repName,
          isEssTenantEnabled
        })
      ];
    }

    return [
      ...acc,
      updateActionList({
        item: item as IActionConfig,
        record
      })
    ];
  }, []) as IActionConfig[] | undefined;
};
export const removeHiddenActions = (
  processConfig: IProcessResponse,
  hiddenActions?: Record<string, boolean>
): IProcessResponse => {
  if (processConfig && hiddenActions && Object.keys(hiddenActions)) {
    const { Event, ActionOutputs } = processConfig;
    const filteredActionOutputs = ActionOutputs?.filter((item) => {
      const hiddenKey =
        `${Event?.WorkAreaId}_${item.ProcessId}_${item.Entity.FormId}_${item.ActionId}`.replaceAll(
          '-',
          ''
        );
      return !hiddenActions[hiddenKey];
    });
    processConfig.ActionOutputs = filteredActionOutputs;
  }
  return processConfig;
};

export const processFormsToSubMenu = (config: {
  workAreaConfig: IWorkAreaConfig;
  processFormsData: IProcessResponse | null;
}): IProcessMenuItem[] | undefined => {
  const { workAreaConfig, processFormsData } = config || {};
  const subMenu = processFormsData?.ActionOutputs?.map((item) => ({
    label: item?.Entity?.DisplayProperty?.DisplayName,
    value: item?.ProcessId,
    formId: item?.Entity?.FormId,
    workAreaConfig
  }));
  const subMenuWithoutDuplicates = removeDuplicateObjects(subMenu || []);
  return subMenuWithoutDuplicates?.sort((a, b) => a.label?.localeCompare(b.label));
};

export const convertToProcessAction = <T>({
  action,
  processFormsData,
  isFormsEmpty
}: {
  action: T & IActionWrapperItem;
  processFormsData: IProcessResponse;
  isFormsEmpty?: boolean;
}): T & IActionWrapperItem => {
  const workAreaConfig = action?.workAreaConfig;
  if (!workAreaConfig || !processFormsData?.ActionOutputs?.length) {
    if (isFormsEmpty) {
      return {
        ...action,
        subMenu: [{ label: ' No Forms Found', value: '' }]
      };
    }
    return action;
  }
  const config = { workAreaConfig, processFormsData };
  const subMenu = processFormsToSubMenu(config);
  if (subMenu?.length === 1) {
    const actionData = subMenu[0];
    return {
      ...action,
      ...actionData,
      title: actionData.label,
      toolTip: actionData.label,
      value: actionData.value
    };
  }
  return {
    ...action,
    subMenu
  };
};

const findFormDataInProcess = <T>({
  workAreaProcessDetails,
  action
}: {
  workAreaProcessDetails?: IProcessResponse;
  action: T & IActionWrapperItem;
}): IProcessResponse => {
  let processForWorkArea = { ...(workAreaProcessDetails || {}) };
  const processId = action.value;
  const formId = action.formId;
  if (workAreaProcessDetails?.ActionOutputs?.length && processId) {
    const processActionOutput = findProcessActionOutput({
      workAreaProcessDetails: processForWorkArea,
      processId,
      formId
    });
    if (processActionOutput) {
      processForWorkArea = { ...processForWorkArea, ActionOutputs: [processActionOutput] };
    } else if (!processActionOutput && action.id === ACTION.Form) {
      processForWorkArea = { ...processForWorkArea, ActionOutputs: [] };
    }
  }
  return processForWorkArea;
};

export const getProcessActionConfig = <T>(
  action: T & IActionWrapperItem,
  processFormsData: IProcessFormsData | null
): IGetProcessActionConfig<T> => {
  if (!action?.workAreaConfig || !processFormsData) {
    return { convertedAction: action, firstFormName: '', totalForms: 0 };
  }
  const key = getUpdatedProcessKey(action.workAreaConfig);
  const processesForWorkArea = getWorkAreaProcessForms(processFormsData, key);

  // Remove actions hidden from SV admin settings.
  let processForWorkArea = removeHiddenActions({ ...processesForWorkArea }, action.hiddenActions);

  // Find the Process Form data in cached processes based on "action.value" (or processId)
  processForWorkArea = findFormDataInProcess({
    workAreaProcessDetails: processForWorkArea,
    action
  });

  const initialTotalForms = processesForWorkArea?.ActionOutputs?.length || 0;
  const totalForms = processForWorkArea?.ActionOutputs?.length || 0;

  // isFormsEmpty is used to decide whether all the Forms are hidden from SV settings
  const isFormsEmpty = totalForms === 0 && initialTotalForms > 0;
  const actionOutput = processForWorkArea?.ActionOutputs?.[0];
  const firstFormName = actionOutput?.Entity?.DisplayProperty?.DisplayName || '';
  const convertedAction = convertToProcessAction({
    action,
    processFormsData: processForWorkArea,
    isFormsEmpty
  });

  // for single Process Form update static action.value (like for Edit action) with form's ProcessId. Will be used to open forms.
  if (firstFormName && actionOutput?.ProcessId) {
    convertedAction.value = actionOutput.ProcessId;
  }
  return { convertedAction, firstFormName, totalForms };
};

const getConvertedButtonActions = (
  actions: IButtonAction[],
  processFormsData: IProcessFormsData | null
): IButtonAction[] => {
  const convertedActions: IButtonAction[] = [];
  actions?.map((action) => {
    const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
      action,
      processFormsData
    );
    if (action?.id === ACTION.Form && !totalForms) {
      return;
    }
    const hasSingleForm = totalForms === 1;
    convertedActions.push({
      ...convertedAction,
      subMenu: hasSingleForm ? [] : convertedAction?.subMenu,
      title: hasSingleForm ? (firstFormName as string) : action?.title
    });
  });
  return convertedActions;
};

const getConvertedAction = (
  action: IActionMenuItem,
  processFormsData: IProcessFormsData | null
): IActionMenuItem => {
  const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
    action,
    processFormsData
  );
  const hasSingleForm = totalForms === 1;
  return {
    ...convertedAction,
    subMenu: hasSingleForm || action.disabled ? [] : convertedAction?.subMenu,
    isLoading: false,
    toolTip: hasSingleForm ? (firstFormName as string) : action.toolTip || action?.label,
    label: hasSingleForm ? (firstFormName as string) : action?.label
  };
};

const getConvertedMoreActions = (
  actions: IActionMenuItem[],
  processFormsData: IProcessFormsData | null
): IActionMenuItem[] => {
  return actions?.reduce((acc: IActionMenuItem[], action, index) => {
    if (action.children) {
      acc.push({
        ...action,
        customComponent: getSectionHeader({ title: action.label, addSeparator: index !== 0 })
      });
      action.children.forEach((childAction) => {
        if (childAction?.workAreaConfig) {
          acc.push(getConvertedAction(childAction as IActionMenuItem, processFormsData));
        } else {
          acc.push(childAction as IActionMenuItem);
        }
      });
      return acc;
    }
    if (action?.workAreaConfig) {
      const convertedAction = getConvertedAction(action, processFormsData);
      if (convertedAction.title) acc.push(convertedAction);
    } else {
      acc.push(action);
    }
    return acc;
  }, []);
};

const replaceHiddenQuickActions = (actions: IRowActionConfig): IRowActionConfig => {
  let { quickActions } = actions;
  const { moreActions } = actions;

  // if 0 index of moreActions is not overflowed quickAction then there is no need to go further and return actions.
  if (
    quickActions?.length === 3 ||
    (!moreActions?.[0]?.isQuickAction && !moreActions?.[0]?.children)
  )
    return actions;
  const updatedMoreActions = moreActions.reduce((acc: IActionMenuItem[], item) => {
    if (quickActions.length < 3) {
      if (item.isQuickAction) quickActions.push(item as IActionConfig);
      else if (item?.children?.length) {
        const updatedActions = replaceHiddenQuickActions({
          quickActions: [...quickActions],
          moreActions: [...item.children] as IActionMenuItem[]
        });
        quickActions = updatedActions.quickActions;
        item.children = [...updatedActions.moreActions];
      }
      if (!item?.hiddenActions?.[`${item.key}`]) {
        acc.push(item);
      }
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
  return { quickActions, moreActions: updatedMoreActions };
};

export const getLeadTypeForManageTabsProcess = async (
  tabId: string
): Promise<string | undefined> => {
  try {
    if (!isManageEntityTab(tabId)) return;

    const [leadTypeInternalName, isProcessEnabledForLeadType] = await Promise.all([
      getStringifiedLeadType(tabId),
      isLeadTypeEnabledForProcess(CallerSource.SmartViews)
    ]);

    if (isProcessEnabledForLeadType) {
      return leadTypeInternalName;
    }
  } catch (error) {
    trackError(error);
  }
};

// eslint-disable-next-line max-lines-per-function
export const getAugmentedRowActions = async ({
  record,
  repName,
  entityType,
  rowActions,
  tabId,
  isManageTab,
  isEssTenantEnabled
}: {
  record: IRecordType & Record<string, string>;
  repName?: IEntityRepresentationName;
  rowActions: IRowActionConfig;
  entityType: EntityType;
  tabId: string;
  isManageTab: boolean;
  isEssTenantEnabled: boolean;
}): Promise<IRowActionConfig> => {
  const { quickActions, moreActions } = rowActions;
  const leadTypeInternalNameForProcess = getTabData(tabId)?.processConfig?.leadTypeNameForProcess;
  let augmentedQuickActions = augmentRowActions({
    record,
    actionsList: quickActions,
    repName: repName,
    tabId,
    leadTypeInternalNameForProcess,
    isEssTenantEnabled
  }) as IActionConfig[];
  let augmentedMoreActions = augmentRowActions({
    record,
    actionsList: moreActions,
    repName: repName,
    tabId,
    leadTypeInternalNameForProcess
  }) as IActionMenuItem[];
  const updatedMoreActions = (
    entityType === EntityType.Task && !isManageTab
      ? augmentedMoreActions.flatMap((action) => action.children)
      : augmentedMoreActions
  ) as IActionMenuItem[];
  const fetchData = (await import('common/utils/process/process'))
    .fetchMultipleWorkAreaProcessForms;
  const getFilteredProcessActions = (
    await import('apps/entity-details/components/vcard/actions/utils/utils')
  ).getFilteredProcessActions;
  const processFormsData =
    (await fetchData(
      getFilteredProcessActions([...augmentedQuickActions, ...updatedMoreActions]),
      CallerSource.SmartViews
    )) ?? null;
  augmentedQuickActions = getConvertedButtonActions([...augmentedQuickActions], processFormsData);
  augmentedMoreActions = getConvertedMoreActions([...augmentedMoreActions], processFormsData);

  return replaceHiddenQuickActions({
    quickActions: augmentedQuickActions,
    moreActions: augmentedMoreActions
  });
};
