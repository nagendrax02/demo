import { trackError } from 'common/utils/experience/utils/track-error';
import { RenderType } from 'common/types/entity/lead';
import { formatDateTime } from 'common/utils/helpers/helpers';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import InlineEntityDetails from '../../components/inline-entity-details';
import { IRecordType } from '../../components/smartview-tab/smartview-tab.types';
import { getReminderText } from '../../components/cell-renderers/TaskReminder';
import { DataType, IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { INVALID_DATE_VALUE, TASK_RENDER_TYPE_MAP } from './constants';
import { API_ROUTES } from 'common/constants';
import fetchTaskMetaData from 'common/utils/entity-data-manager/task';
import { ITaskAttribute } from 'common/types/entity';
import {
  ITaskMetadata,
  TaskAttributeRenderType,
  TaskTypeCategory
} from 'common/types/entity/task/metadata.types';
import { replaceWithLeadRepresentationName } from '../common-utilities/utils';
import { convertToISO } from '@lsq/nextgen-preact/date/utils';
import { CUSTOM_TASK_METADATA_FIELD } from 'common/utils/entity-data-manager/task/constant';

interface ITaskDetails {
  CreatedBy: string;
  RelatedEntityId: string;
  Name: string;
  DueDate: string;
  EndDate: string;
  OwnerId: string;
  CreatedOn: string;
  CompletedOn: string;
  Reminder: string;
}

export const getTaskFieldRenderType = (field?: ITaskAttribute): RenderType => {
  if (field?.DataType === 'Date') {
    return RenderType.DateTime;
  }

  if (TASK_RENDER_TYPE_MAP?.[field?.RenderType || '']) {
    return TASK_RENDER_TYPE_MAP?.[field?.RenderType || ''];
  }
  return RenderType.Text;
};

export const isInValidDateFormat = (date: string): boolean => {
  try {
    const newDateArr = date.split(' ');
    const dateRegexPattern = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegexPattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (newDateArr?.[0]?.match(dateRegexPattern) && newDateArr?.[1]?.match(timeRegexPattern)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    trackError(err);
    return false;
  }
};

const getTaskDetails = async (taskId: string): Promise<ITaskDetails | undefined> => {
  let reponseData;
  try {
    if (taskId) {
      reponseData = await httpGet({
        path: `${API_ROUTES.taskDetailsGet}?id=${taskId}`,
        module: Module.Marvin,
        callerSource: CallerSource.SmartViews
      });
    }
    return reponseData as ITaskDetails;
  } catch (error) {
    trackError(error);
  }
};

const updatedTaskFieldDisplayNameMap: Record<string, string> = {
  ['CreatedBy']: 'Organizer',
  ['OwnerId']: 'Owner'
};

const getUpdatedTaskFieldDisplayNames = (field?: ITaskAttribute): string => {
  if (updatedTaskFieldDisplayNameMap?.[field?.SchemaName || '']) {
    return updatedTaskFieldDisplayNameMap?.[field?.SchemaName || ''];
  }
  return field?.DisplayName || '';
};

const getReminderProperty = (
  reminder: string,
  field?: ITaskAttribute,
  taskMetaData?: ITaskMetadata
): IEntityProperty => {
  let reminderValue = reminder;
  if (taskMetaData?.category === TaskTypeCategory.Appointment)
    if (reminder === 'None') reminderValue = '0 min before the task';
    else reminderValue = `${reminder} before the task`;
  return {
    id: field?.SchemaName || '',
    value: reminderValue,
    name: field?.DisplayName || '',
    fieldRenderType: RenderType.Text,
    dataType: DataType.Text,
    schemaName: field?.SchemaName || '',
    showAll: true,
    preventAlignment: true
  };
};

const getDueDateProperty = (
  taskDetails: ITaskDetails,
  field?: ITaskAttribute,
  taskMetaData?: ITaskMetadata
): IEntityProperty => {
  const isToDoTask = taskMetaData?.category === TaskTypeCategory.Todo;
  const timeFormat = isToDoTask ? ' ' : 'hh:mm a';
  return {
    id: field?.SchemaName || '',
    name: 'Schedule',
    value: `${taskDetails?.DueDate}Z$${taskDetails?.EndDate}Z`,
    fieldRenderType: RenderType.DueDate,
    dataType: DataType.DueDate,
    schemaName: field?.SchemaName || '',
    timeFormat: timeFormat,
    showAll: true,
    preventAlignment: true
  };
};

const getCreatedOnProperty = (
  taskDetails: ITaskDetails,
  field?: ITaskAttribute
): IEntityProperty => {
  return {
    id: field?.SchemaName || '',
    name: 'Created On',
    value: taskDetails?.CreatedOn,
    fieldRenderType: RenderType.DateTime,
    dataType: DataType.DateTime,
    schemaName: field?.SchemaName || '',
    timeFormat: `hh:mm:ss a`,
    showAll: true,
    preventAlignment: true
  };
};

const getRelatedEntityId = ({
  key,
  taskDetails,
  taskItem,
  field,
  leadRepName
}: {
  key: string;
  taskDetails: ITaskDetails;
  taskItem: IRecordType;
  field?: ITaskAttribute;
  leadRepName: string;
}): IEntityProperty => {
  const name = replaceWithLeadRepresentationName(field?.DisplayName || '', leadRepName || 'Lead');
  return {
    id: field?.SchemaName || '',
    name,
    value: (taskDetails?.[key] as string) || '',
    fieldRenderType: RenderType.AssociatedLead,
    dataType: DataType.Lead,
    schemaName: field?.SchemaName || '',
    entityId: taskItem?.RelatedEntityId || '',
    showAll: true,
    preventAlignment: true
  };
};

const getRelatedOpportunityField = ({
  key,
  taskDetails,
  taskItem,
  field,
  oppRepName
}: {
  key: string;
  taskDetails: ITaskDetails;
  taskItem: IRecordType;
  field?: ITaskAttribute;
  oppRepName: string;
}): IEntityProperty => {
  const name = oppRepName ? `Associated ${oppRepName}` : field?.DisplayName || '';
  const schemaName = field?.SchemaName || '';
  return {
    id: schemaName,
    name: name,
    value: taskDetails?.[key] as string,
    fieldRenderType: RenderType.OpportunityName,
    dataType: DataType.Text,
    schemaName: schemaName,
    entityId: taskItem?.RelatedActivityId || '',
    eventCode: taskItem?.ActivityEvent || taskItem?.O_ActivityEvent || '',
    showAll: true,
    preventAlignment: true
  };
};

const getAugmentedTaskData = ({
  key,
  field,
  reminder,
  taskDetails,
  taskItem,
  taskMetaData,
  leadRepName,
  oppRepName
}: {
  key: string;
  field?: ITaskAttribute;
  reminder: string;
  taskDetails: ITaskDetails;
  taskItem: IRecordType;
  taskMetaData?: ITaskMetadata;
  leadRepName: string;
  oppRepName: string;
}): IEntityProperty => {
  const augmentedEntityProperties: Record<string, () => IEntityProperty> = {
    Reminder: () => getReminderProperty(reminder, field, taskMetaData),
    DueDate: () => getDueDateProperty(taskDetails, field, taskMetaData),
    RelatedEntityId: () => getRelatedEntityId({ key, taskDetails, taskItem, field, leadRepName }),
    CreatedOn: () => getCreatedOnProperty(taskDetails, field),
    RelatedOpportunityId: () =>
      getRelatedOpportunityField({ key, taskDetails, taskItem, field, oppRepName })
  };

  if (augmentedEntityProperties?.[key]) {
    return augmentedEntityProperties?.[key]();
  }

  return {
    id: field?.SchemaName || '',
    name: getUpdatedTaskFieldDisplayNames(field),
    value: taskDetails[key] as string,
    fieldRenderType: getTaskFieldRenderType(field),
    dataType: DataType.Text,
    schemaName: field?.SchemaName || '',
    timeFormat: `hh:mm a`,
    showAll: true,
    preventAlignment: true
  };
};

const isValidReminderField = (reminder: string, metaData?: ITaskMetadata): boolean => {
  if (reminder && metaData?.reminderConfig?.IsEnable) {
    return true;
  }
  return false;
};

interface IIsValidField {
  key: string;
  field: ITaskAttribute | undefined;
  value: string;
}

const isValidField = ({ key, field, value }: IIsValidField): boolean => {
  const invalidFields = ['EndDate'];
  if (invalidFields?.includes(key)) return false;
  if (field && field?.DisplayName) {
    if (
      (field?.RenderType as string) === TaskAttributeRenderType.Datetime &&
      value === INVALID_DATE_VALUE
    ) {
      return false;
    }
    return true;
  }
  return false;
};

export const fetchTaskData = async (
  taskItem: IRecordType,
  leadRepName: string,
  oppRepName: string
): Promise<IEntityProperty[]> => {
  const reminder = getReminderText(taskItem);

  const { id, TaskTypeId } = taskItem;

  const taskDetails = await getTaskDetails(id);
  const taskMetaData = await fetchTaskMetaData(TaskTypeId || '-1', CallerSource.SmartViews);

  if (taskMetaData)
    taskMetaData.fields = { ...taskMetaData?.fields, ...CUSTOM_TASK_METADATA_FIELD };

  if (taskDetails) {
    const rows: IEntityProperty[] = [];

    Object.entries(taskDetails).forEach(([key, date]) => {
      const field = taskMetaData?.fields?.[key];
      const value = taskDetails[key] as string;

      if (isInValidDateFormat(date) || key === 'DueDate') {
        taskDetails[key] = formatDateTime(new Date(date as string));
      }

      //Value for CompletedOn from backend is ex 4/5/2024 7:14:04 AM, we have to convert this to iso
      if (key === 'CompletedOn') {
        taskDetails[key] = convertToISO(date);
      }

      if (key === 'Reminder' && !isValidReminderField(reminder, taskMetaData)) return;

      if (isValidField({ key, field, value })) {
        rows.push(
          getAugmentedTaskData({
            key,
            field,
            reminder,
            taskDetails,
            taskItem,
            taskMetaData,
            leadRepName,
            oppRepName
          })
        );
      }
    });

    return rows;
  }

  return [];
};

export const getTaskExpandableConfig = (
  leadRepName: string,
  oppRepName: string,
  tabId: string
): ((props: { item: IRecordType }) => JSX.Element) => {
  return function taskInlineDetails(props) {
    return (
      <InlineEntityDetails
        fetchData={() => fetchTaskData(props?.item, leadRepName, oppRepName)}
        title="Task Details"
        tabId={tabId}
      />
    );
  };
};
