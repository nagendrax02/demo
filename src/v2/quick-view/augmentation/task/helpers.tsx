import { CSSProperties } from 'react';
import {
  IGetFieldConfig,
  IGetTaskProperties,
  ITaskAdditionalData,
  ITaskDetails
} from './task.types';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { trackError } from 'common/utils/experience';
import { formatDateTime } from 'common/utils/helpers/helpers';
import { convertToISO } from '@lsq/nextgen-preact/date/utils';
import {
  ITaskAttribute,
  TaskAttributeRenderType,
  TaskTypeCategory,
  TaskAttributeDataType
} from 'common/types/entity/task/metadata.types';
import { INVALID_DATE_VALUE } from './constant';
import { DataType, RenderType } from 'common/types/entity/lead';
import {
  CUSTOM_TASK_METADATA_FIELD,
  TASK_SCHEMA
} from 'common/utils/entity-data-manager/task/constant';
import { IActionConfig } from 'apps/entity-details/types';
import { ACTION } from 'apps/entity-details/constants';
import getCustomComponent from './TaskMarkActions';
import { getTaskStatus } from 'apps/smart-views/components/cell-renderers/task-status/helpers';
import { colorGroupMapper } from 'common/utils/color-group-mapper/colorGroupMapper';

const formatReminderTime = (time: string | number): string => {
  const reminderTime = `${time}`;
  const today = new Date();
  const dd = `${today.getDate()}`.padStart(2, '0');
  const mm = `${today.getMonth() + 1}`.padStart(2, '0');
  const yyyy = today.getFullYear();

  const reminderTimeInUTC = new Date(`${mm}/${dd}/${yyyy} ${reminderTime} UTC`);
  const utcDate = new Date(reminderTimeInUTC);
  const hours = String(utcDate.getHours()).padStart(2, '0');
  const minutes = String(utcDate.getMinutes()).padStart(2, '0');
  const seconds = String(utcDate.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const canReturnNone = (record: ITaskAdditionalData): boolean => {
  const { Category, NotifyBy, ReminderBeforeDays, ReminderTime } = record;
  return (
    NotifyBy === '1000' ||
    (parseInt(Category) === TaskTypeCategory.Todo &&
      Number(ReminderBeforeDays) === 0 &&
      !ReminderTime)
  );
};

const getToDoReminderText = (record: ITaskAdditionalData): string => {
  const { Reminder, ReminderBeforeDays, ReminderTime = '' } = record;

  const reminderText =
    ReminderBeforeDays && Number(ReminderBeforeDays) !== 0
      ? `${Number(ReminderBeforeDays)} day(s) before`
      : 'On Due Date';

  return ReminderTime && Number(Reminder) >= 0
    ? `${reminderText} at ${formatReminderTime(Number(ReminderTime))} `
    : reminderText;
};

const getReminderText = (record: ITaskAdditionalData): string => {
  const { Reminder, Category } = record || {};

  if (canReturnNone(record)) {
    return 'None';
  }

  if (Number(Category) === TaskTypeCategory.Appointment) {
    getToDoReminderText(record);
  }

  if (Number(Category) === TaskTypeCategory.Appointment && Reminder) {
    return `${Number(Reminder)} mins`;
  }

  return '';
};

const isInValidDateFormat = (date: string): boolean => {
  try {
    const newDateArr = date.split(' ');
    const dateRegexPattern = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegexPattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (dateRegexPattern.exec(newDateArr?.[0]) && timeRegexPattern.exec(newDateArr?.[1])) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    trackError(err);
    return false;
  }
};

const canRenderField = ({
  schemaName,
  field,
  value
}: {
  schemaName: string;
  field?: ITaskAttribute;
  value: string;
}): boolean => {
  if (schemaName === TASK_SCHEMA.EndDate) return false;

  if (!field?.DisplayName) return false;

  if (field?.RenderType === TaskAttributeRenderType.Datetime && value === INVALID_DATE_VALUE) {
    return false;
  }
  return true;
};

const getDisplayName = (field: ITaskAttribute): string => {
  const displayNameMap: Record<string, string> = {
    [TASK_SCHEMA.CreatedBy]: 'Organizer',
    [TASK_SCHEMA.OwnerId]: 'Owner',
    [TASK_SCHEMA.CreatedOn]: 'Created On'
  };

  const schemaName = field.SchemaName;
  return displayNameMap[schemaName] ?? field.DisplayName;
};

export const getRenderType = (field: ITaskAttribute): RenderType => {
  if (field.DataType === TaskAttributeDataType.Date) {
    return RenderType.DateTime;
  }

  const renderTypeMap: Record<string, RenderType> = {
    Textbox: RenderType.Text,
    Text: RenderType.Text,
    Datetime: RenderType.DateTime,
    Date: RenderType.Datetime
  };

  const renderType = field?.RenderType;
  return renderTypeMap[renderType] ?? RenderType.Text;
};

const getReminderProperty = (
  entityRecord: ITaskAdditionalData,
  field: ITaskAttribute,
  taskTypeCategory: TaskTypeCategory
): IEntityProperty => {
  let reminderValue = getReminderText(entityRecord);
  if (taskTypeCategory === TaskTypeCategory.Appointment)
    if (reminderValue === 'None') reminderValue = '0 min before the task';
    else reminderValue = `${reminderValue} before the task`;
  return {
    id: field.SchemaName,
    value: reminderValue,
    name: field.DisplayName,
    fieldRenderType: RenderType.Text,
    dataType: DataType.Text,
    schemaName: field.SchemaName,
    showAll: true,
    preventAlignment: true
  };
};

const getDueDateProperty = (
  taskDetails: ITaskDetails,
  field: ITaskAttribute,
  taskTypeCategory: TaskTypeCategory
): IEntityProperty => {
  const isToDoTask = taskTypeCategory === TaskTypeCategory.Todo;
  const timeFormat = isToDoTask ? ' ' : 'hh:mm a';
  return {
    id: field.SchemaName,
    name: 'Schedule',
    value: `${taskDetails.DueDate}Z$${taskDetails.EndDate}Z`,
    fieldRenderType: RenderType.DueDate,
    dataType: DataType.DueDate,
    schemaName: field.SchemaName,
    timeFormat: timeFormat,
    showAll: true,
    preventAlignment: true
  };
};

const getCreatedOnProperty = (
  taskDetails: ITaskDetails,
  field: ITaskAttribute
): IEntityProperty => {
  return {
    id: field.SchemaName,
    name: getDisplayName(field),
    value: taskDetails.CreatedOn,
    fieldRenderType: RenderType.DateTime,
    dataType: DataType.DateTime,
    schemaName: field.SchemaName,
    timeFormat: `hh:mm:ss a`,
    showAll: true,
    preventAlignment: true
  };
};

const getRelatedEntityId = ({
  schemaName,
  taskDetails,
  entityRecord,
  field,
  leadSingularName
}: {
  schemaName: string;
  taskDetails: ITaskDetails;
  entityRecord: ITaskAdditionalData;
  field: ITaskAttribute;
  leadSingularName: string;
}): IEntityProperty => {
  return {
    id: field.SchemaName,
    name: field.DisplayName.replace('Lead', leadSingularName),
    value: taskDetails[schemaName] as string,
    fieldRenderType: RenderType.AssociatedLead,
    dataType: DataType.Lead,
    schemaName: field.SchemaName,
    entityId: entityRecord.RelatedEntityId,
    showAll: true,
    preventAlignment: true
  };
};

const getRelatedOpportunityField = ({
  schemaName,
  taskDetails,
  entityRecord,
  field,
  oppSingularName
}: {
  schemaName: string;
  taskDetails: ITaskDetails;
  entityRecord: ITaskAdditionalData;
  field: ITaskAttribute;
  oppSingularName: string;
}): IEntityProperty => {
  const name = oppSingularName ? `Associated ${oppSingularName}` : field?.DisplayName || '';
  return {
    id: schemaName,
    name: name,
    value: taskDetails.RelatedOpportunityId,
    fieldRenderType: RenderType.OpportunityName,
    dataType: DataType.Text,
    schemaName: schemaName,
    entityId: entityRecord.RelatedActivityId,
    eventCode: entityRecord.ActivityEvent ?? entityRecord.O_ActivityEvent,
    showAll: true,
    preventAlignment: true
  };
};

const getFieldConfig = ({
  schemaName,
  taskTypeCategory,
  entityRecord,
  leadSingularName,
  oppSingularName,
  taskDetails,
  field
}: IGetFieldConfig): IEntityProperty => {
  const augmentedEntityProperties: Record<string, () => IEntityProperty> = {
    Reminder: () => getReminderProperty(entityRecord, field, taskTypeCategory),
    DueDate: () => getDueDateProperty(taskDetails, field, taskTypeCategory),
    RelatedEntityId: () =>
      getRelatedEntityId({ schemaName, taskDetails, entityRecord, field, leadSingularName }),
    CreatedOn: () => getCreatedOnProperty(taskDetails, field),
    RelatedOpportunityId: () =>
      getRelatedOpportunityField({
        schemaName,
        taskDetails,
        entityRecord,
        field,
        oppSingularName
      })
  };

  if (augmentedEntityProperties[schemaName]) {
    return augmentedEntityProperties[schemaName]();
  }

  return {
    id: field.SchemaName,
    name: getDisplayName(field),
    value: taskDetails[schemaName] as string,
    fieldRenderType: getRenderType(field),
    dataType: DataType.Text,
    schemaName: field.SchemaName,
    timeFormat: `hh:mm a`,
    showAll: true,
    preventAlignment: true
  };
};

const processDateFields = (schemaName: string, date: string, taskDetails: ITaskDetails): void => {
  if (isInValidDateFormat(date) || schemaName === TASK_SCHEMA.DueDate) {
    taskDetails[schemaName] = formatDateTime(new Date(date));
  }

  //Value for CompletedOn from backend is ex 4/5/2024 7:14:04 AM, we have to convert this to iso
  if (schemaName === TASK_SCHEMA.CompletedOn) {
    taskDetails[schemaName] = convertToISO(date);
  }
};

const isValidReminderText = (
  schemaName: string,
  entityRecord: ITaskAdditionalData,
  isReminderConfigEnabled?: boolean
): boolean => {
  if (schemaName !== TASK_SCHEMA.Reminder) return true;

  const reminder = getReminderText(entityRecord);
  return reminder && isReminderConfigEnabled ? true : false;
};

export const fetchTaskProperties = ({
  taskDetails,
  taskMetaData,
  entityRecord,
  leadSingularName = 'Lead',
  oppSingularName
}: IGetTaskProperties): IEntityProperty[] => {
  const metadataFields = { ...taskMetaData.fields, ...CUSTOM_TASK_METADATA_FIELD };

  return Object.keys(taskDetails).reduce((acc: IEntityProperty[], schemaName: string) => {
    const field = metadataFields[schemaName];
    const value = taskDetails[schemaName] as string;

    processDateFields(schemaName, value, taskDetails);

    if (!isValidReminderText(schemaName, entityRecord, taskMetaData.reminderConfig?.IsEnable)) {
      return acc;
    }

    if (
      canRenderField({
        schemaName,
        field,
        value
      })
    ) {
      acc.push(
        getFieldConfig({
          entityRecord,
          leadSingularName,
          oppSingularName,
          schemaName,
          taskDetails,
          field,
          taskTypeCategory: taskMetaData.category as TaskTypeCategory
        })
      );
    }
    return acc;
  }, [] as IEntityProperty[]);
};

export const fetchTaskDetails = async (taskId: string): Promise<ITaskDetails> => {
  const responseData = await httpGet<ITaskDetails>({
    path: `${API_ROUTES.taskDetailsGet}?id=${taskId}`,
    module: Module.Marvin,
    callerSource: CallerSource.SmartViews
  });

  return responseData;
};

const getTaskBadgeActions = (
  actions: Record<string, IActionConfig>,
  entityRecords: ITaskAdditionalData
): IActionConfig[] => {
  const taskStatus = getTaskStatus(entityRecords);
  const markCompletedAction = actions[ACTION.MarkComplete];
  const markOpenAction = actions[ACTION.MarkOpen];
  const taskCancel = actions[ACTION.TaskCancel];

  if (taskStatus === 'Cancelled' && taskCancel) {
    taskCancel.toolTip = '';
    taskCancel.title = 'Cancelled';
    taskCancel.customComponent = getCustomComponent('cancelled', taskCancel);
    return [taskCancel];
  }

  if (taskStatus === 'Completed' && markOpenAction) {
    markOpenAction.customComponent = getCustomComponent('markOpen', markOpenAction);
    return [markOpenAction];
  }

  if (markCompletedAction) {
    markCompletedAction.customComponent = getCustomComponent('markComplete', markCompletedAction);
    return [markCompletedAction];
  }

  return [];
};

const getTaskButtonActions = (actions: Record<string, IActionConfig>): IActionConfig[] => {
  const editTaskAction = actions[ACTION.EditTask];
  const deleteTaskAction = actions[ACTION.TaskDelete];

  return [editTaskAction, deleteTaskAction]?.filter((action) => action);
};

export const getTaskActionActions = (
  actions: IActionConfig[],
  entityRecords: ITaskAdditionalData
): { badgeActions?: IActionConfig[]; buttonActions?: IActionConfig[] } => {
  const actionsMap = {};

  actions?.forEach((action) => {
    if (
      [
        ACTION.EditTask,
        ACTION.TaskCancel,
        ACTION.MarkComplete,
        ACTION.MarkOpen,
        ACTION.TaskDelete
      ]?.includes(action?.id)
    ) {
      if (!actionsMap[action?.id]) {
        actionsMap[action?.id] = action;
      }
    }
  });

  return {
    badgeActions: getTaskBadgeActions(actionsMap, entityRecords),
    buttonActions: getTaskButtonActions(actionsMap)
  };
};

export const getGradientColorSchema = (hexColor: string): CSSProperties => {
  const colorGroup = colorGroupMapper(hexColor?.replace('#', ''));

  if (!colorGroup)
    return {
      background: `var(--ng-neutral-gradient)`
    };

  return {
    background: `var(${colorGroup}-gradient)`
  };
};
