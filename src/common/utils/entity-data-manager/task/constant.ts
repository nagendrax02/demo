import {
  ITaskMetadataMap,
  TaskAttributeDataType,
  TaskAttributeRenderType
} from 'common/types/entity/task/metadata.types';

export const CUSTOM_TASK_METADATA_FIELD: ITaskMetadataMap = {
  StatusCode: {
    DisplayName: 'Status',
    SchemaName: 'StatusCode',
    DataType: TaskAttributeDataType.Text,
    RenderType: TaskAttributeRenderType.TextArea
  },
  UserTaskAutoId: {
    DisplayName: 'Task Id',
    SchemaName: 'UserTaskAutoId',
    DataType: TaskAttributeDataType.Text,
    RenderType: TaskAttributeRenderType.TextArea
  },
  CompletedOn: {
    DisplayName: 'Completed On',
    SchemaName: 'CompletedOn',
    DataType: TaskAttributeDataType.Text,
    RenderType: TaskAttributeRenderType.Datetime
  },
  CreatedOn: {
    DisplayName: 'Created On',
    SchemaName: 'CreatedOn',
    DataType: TaskAttributeDataType.Date,
    RenderType: TaskAttributeRenderType.Datetime
  },
  ModifiedBy: {
    DisplayName: 'Modified By',
    SchemaName: 'ModifiedBy',
    DataType: TaskAttributeDataType.Text,
    RenderType: TaskAttributeRenderType.TextArea
  },
  ModifiedOn: {
    DisplayName: 'Modified On',
    SchemaName: 'ModifiedOn',
    DataType: TaskAttributeDataType.Date,
    RenderType: TaskAttributeRenderType.Datetime
  }
};

export const TASK_SCHEMA = {
  CompletedOn: 'CompletedOn',
  Reminder: 'Reminder',
  DueDate: 'DueDate',
  CreatedBy: 'CreatedBy',
  OwnerId: 'OwnerId',
  EndDate: 'EndDate',
  CreatedOn: 'CreatedOn'
};
