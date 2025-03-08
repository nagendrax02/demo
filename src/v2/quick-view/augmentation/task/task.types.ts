import { ITaskAttribute, ITaskMetadata } from 'common/types/entity/task';
import { TaskTypeCategory } from 'common/types/entity/task/metadata.types';

export interface ITaskAdditionalData {
  id: string;
  [key: string]: string;
}
export interface ITaskDetails {
  CreatedBy: string;
  RelatedEntityId: string;
  Name: string;
  DueDate: string;
  EndDate: string;
  OwnerId: string;
  CreatedOn: string;
  CompletedOn: string;
  Reminder: string;
  RelatedOpportunityId: string;
}

export interface IGetFieldConfig {
  schemaName: string;
  field: ITaskAttribute;
  taskDetails: ITaskDetails;
  entityRecord: ITaskAdditionalData;
  taskTypeCategory: TaskTypeCategory;
  leadSingularName: string;
  oppSingularName: string;
}

export interface IGetTaskProperties {
  taskMetaData: ITaskMetadata;
  taskDetails: ITaskDetails;
  entityRecord: ITaskAdditionalData;
  leadSingularName?: string;
  oppSingularName: string;
}
