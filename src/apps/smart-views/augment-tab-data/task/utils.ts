import { trackError } from 'common/utils/experience/utils/track-error';
import { IActionConfig, IActionSubMenu } from 'apps/entity-details/types/entity-data.types';
import { ACTION } from 'apps/entity-details/constants';
import { IRecordType } from '../../components/smartview-tab/smartview-tab.types';
import { STATUS_CODE } from './constants';
import { getTooltipContent } from '../../utils/utils';
import { workAreaIds } from 'common/utils/process';
import { IWorkAreaConfig } from 'common/utils/process/process.types';
import { SCHEMA_NAMES, TABS_DEFAULT_ID } from '../../constants/constants';
import { CallerSource } from 'common/utils/rest-client';

const getNumberStatusCode = (statusCode: string | null): number => {
  return statusCode as unknown as number;
};

const isEditTaskActionDisabled = (record: IRecordType): boolean => {
  return getNumberStatusCode(record?.StatusCode) === STATUS_CODE.Cancelled;
};

const isMarkOpenActionDisabled = (record: IRecordType): boolean => {
  const canUpdate = record?.CanUpdate;
  const hasMarkCompletePermission = record?.HasMarkCompletePermission;
  const isOpenCompletedTasks =
    record?.OpenCompletedTasks === '1' || parseInt(record?.OpenCompletedTasks || '') === 1;

  return !(
    getNumberStatusCode(record?.StatusCode) === STATUS_CODE.Complete &&
    canUpdate &&
    hasMarkCompletePermission &&
    isOpenCompletedTasks
  );
};

const isMarkCompleteActionDisabled = (record: IRecordType): boolean => {
  const canUpdate = record?.CanUpdate;
  const hasMarkCompletePermission = record?.HasMarkCompletePermission;
  return !(
    getNumberStatusCode(record?.StatusCode) === STATUS_CODE.Pending &&
    canUpdate &&
    hasMarkCompletePermission
  );
};

const isCancelActionDisabled = (record: IRecordType): boolean => {
  const canUpdate = record?.CanUpdate;
  const hasUpdatePermission = record?.HasUpdatePermission;
  return !(
    getNumberStatusCode(record?.StatusCode) === STATUS_CODE.Pending &&
    canUpdate &&
    hasUpdatePermission
  );
};

const isDeleteRecurrenceActionDisabled = (record: IRecordType): boolean => {
  const isRecurring = record?.IsRecurring;
  const hasDeletePermission = record?.HasDeletePermission;
  return !(isRecurring && hasDeletePermission);
};

export const isTaskUpdatePermissionRestricted = (record: IRecordType): boolean => {
  const canUpdate = record?.CanUpdate;
  const hasUpdatePermission = record?.HasUpdatePermission;
  return !(canUpdate && hasUpdatePermission);
};

export const isChangeTaskOwnerDisabled = (record: IRecordType): boolean => {
  if (isTaskUpdatePermissionRestricted(record)) return true;
  return !(getNumberStatusCode(record?.StatusCode) === STATUS_CODE.Pending);
};

export const isMarkCompletePermissionRestricted = (record: IRecordType): boolean => {
  const canUpdate = record?.CanUpdate;
  const hasMarkCompletePermission = record?.HasMarkCompletePermission;
  return !(canUpdate && hasMarkCompletePermission);
};

export const isTaskDeletePermissionRestricted = (record: IRecordType): boolean => {
  return !record?.HasDeletePermission;
};

export const isTaskDoesNotHaveLead = (record: IRecordType): boolean => {
  return (record?.RelatedEntity as unknown as number) === 0;
};

const canUpdateLead = (record: IRecordType): boolean => {
  return record?.P_CanUpdate === 'true';
};
const isLeadUpdateActionDisabled = (record: IRecordType): boolean => {
  return !(!isTaskDoesNotHaveLead(record) && canUpdateLead(record));
};

const getDisableActionTooltip = (action: IActionConfig): string => {
  // do not use ?? here
  return `${action.title || action.toolTip} cannot be performed`;
};

const disableEditTaskAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.EditTask && isEditTaskActionDisabled(record)) {
    action.disabled = true;
    action.toolTip = getDisableActionTooltip(action);
    return true;
  }
  return false;
};

const disabledMarkCompleteAndMarkOpen = (
  action: IActionConfig,
  isDisabled: boolean,
  record: IRecordType
): boolean => {
  if (isMarkCompletePermissionRestricted(record) || isDisabled) {
    action.disabled = true;
    action.toolTip = isMarkCompletePermissionRestricted(record)
      ? getTooltipContent(true)
      : getDisableActionTooltip(action);
    return true;
  }
  return false;
};

const disableMarkOpenAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.MarkOpen) {
    return disabledMarkCompleteAndMarkOpen(action, isMarkOpenActionDisabled(record), record);
  }
  return false;
};

const disableMarkCompleteAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.MarkComplete) {
    return disabledMarkCompleteAndMarkOpen(action, isMarkCompleteActionDisabled(record), record);
  }
  return false;
};

const disableCancelAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.TaskCancel && isCancelActionDisabled(record)) {
    if (isCancelActionDisabled(record) || isTaskUpdatePermissionRestricted(record)) {
      action.disabled = true;
      action.toolTip = isTaskUpdatePermissionRestricted(record)
        ? getTooltipContent(true)
        : getDisableActionTooltip(action);
      return true;
    }
  }
  return false;
};

const disableTaskDeleteAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.TaskDelete && isTaskDeletePermissionRestricted(record)) {
    action.disabled = true;
    action.toolTip = getTooltipContent(isTaskDeletePermissionRestricted(record));
    return true;
  }
  return false;
};

const disableDeleteRecurrenceAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.DeleteRecurrence && isDeleteRecurrenceActionDisabled(record)) {
    action.disabled = true;
    action.toolTip = !record?.IsRecurring
      ? getDisableActionTooltip(action)
      : getTooltipContent(isTaskDeletePermissionRestricted(record));
    return true;
  }
  return false;
};

const disableChangeTaskOwnerAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.ChangeTaskOwner) {
    if (isChangeTaskOwnerDisabled(record) || isTaskUpdatePermissionRestricted(record)) {
      action.disabled = true;
      action.toolTip = isTaskUpdatePermissionRestricted(record)
        ? getTooltipContent(true)
        : getDisableActionTooltip(action);
      return true;
    }
  }
  return false;
};

const disableChangeOwnerAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.ChangeOwner && isLeadUpdateActionDisabled(record)) {
    action.disabled = true;
    action.toolTip = canUpdateLead(record)
      ? getDisableActionTooltip(action)
      : getTooltipContent(true);
    return true;
  }
  return false;
};

const disableChangeStageAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.ChangeStage && isLeadUpdateActionDisabled(record)) {
    action.disabled = true;
    action.toolTip = canUpdateLead(record)
      ? getDisableActionTooltip(action)
      : getTooltipContent(true);
    return true;
  }
  return false;
};

const disableLeadDeleteAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.Delete && isLeadUpdateActionDisabled(record)) {
    action.disabled = true;
    action.toolTip = canUpdateLead(record)
      ? getDisableActionTooltip(action)
      : getTooltipContent(true);
    return true;
  }
  return false;
};

const disableLeadEditAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.Edit && isTaskDoesNotHaveLead(record)) {
    action.disabled = true;
    action.toolTip = getDisableActionTooltip(action);
    return true;
  }
  return false;
};

const disableAddTaskForLeadAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.AddTaskForLead && isTaskDoesNotHaveLead(record)) {
    action.disabled = true;
    action.toolTip = getDisableActionTooltip(action);
    return true;
  }
  return false;
};

const disableAddActivityForLeadAction = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.AddActivityForLead && isTaskDoesNotHaveLead(record)) {
    action.disabled = true;
    action.toolTip = getDisableActionTooltip(action);
    return true;
  }
  return false;
};

const disableConverse = (action: IActionConfig, record: IRecordType): boolean => {
  if (action.id === ACTION.Converse && isTaskDoesNotHaveLead(record)) {
    action.disabled = true;
    action.toolTip = getDisableActionTooltip(action);
    return true;
  }
  return false;
};

const disableCustomAction = (action: IActionConfig, record: IRecordType): boolean => {
  if ((action.connectorConfig || action.isConnectorAction) && isTaskDoesNotHaveLead(record)) {
    if (action?.subMenu?.length) {
      action.subMenu = action.subMenu.map((subAction: IActionSubMenu) => {
        return { ...subAction, disabled: true, toolTip: getDisableActionTooltip(action) };
      });
      return true;
    }
    action.disabled = true;
    action.toolTip = getDisableActionTooltip(action);
    return true;
  }
  return false;
};

export const getArgumentTaskRowActions = (
  item: IActionConfig,
  record: IRecordType
): IActionConfig => {
  const action = { ...item };
  if (
    [
      disableEditTaskAction,
      disableMarkOpenAction,
      disableMarkCompleteAction,
      disableCancelAction,
      disableTaskDeleteAction,
      disableDeleteRecurrenceAction,
      disableChangeTaskOwnerAction,
      disableChangeOwnerAction,
      disableChangeStageAction,
      disableLeadDeleteAction,
      disableLeadEditAction,
      disableAddTaskForLeadAction,
      disableAddActivityForLeadAction,
      disableCustomAction,
      disableConverse
    ].some((disableAction) => disableAction(action, record))
  ) {
    return action;
  }
  return action;
};

export const fetchTaskProcessData = async (
  workAreas: Record<string, number>,
  tabId: string,
  taskTypeIds: string[]
): Promise<void> => {
  try {
    const workAreasIds = [...Object.values(workAreas), workAreaIds.NA];
    const workAreaConfig: IWorkAreaConfig[] = [];
    workAreasIds.forEach((workAreaId) => {
      workAreaConfig.push({
        workAreaId,
        additionalData: TABS_DEFAULT_ID
      });
      if (workAreaId === workAreaIds.SMART_VIEWS.TASK_TAB.EDIT) {
        return;
      }
      workAreaConfig.push({
        workAreaId,
        additionalData: tabId
      });
    });

    taskTypeIds.forEach((taskTypeId) =>
      workAreaConfig.push({
        workAreaId: workAreaIds.SMART_VIEWS.TASK_TAB.EDIT,
        additionalData: `${tabId}${taskTypeId ? `$${taskTypeId}` : ''}`
      })
    );

    const fetchData = (await import('common/utils/process/process'))
      .fetchMultipleWorkAreaProcessForms;
    await fetchData(workAreaConfig, CallerSource.SmartViews);
  } catch (err) {
    trackError(err);
  }
};

export const canEnableDateTimePicker = (schemaName: string): boolean => {
  const validSchemaNames = [SCHEMA_NAMES.CREATED_ON, SCHEMA_NAMES.COMPLETED_ON];
  return validSchemaNames.includes(schemaName);
};

export const canIncludeSecondsForEndDate = (schemaName: string): boolean => {
  const validSchemaNames = [SCHEMA_NAMES.CREATED_ON];
  return validSchemaNames.includes(schemaName);
};
