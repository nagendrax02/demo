import { IConnectorActionConfig } from 'common/types/entity/lead';

export interface IConfig {
  actionConfig?: IConnectorActionConfig;
  leadIds?: string[];
  activityIds?: string[];
  taskIds?: string[];
  opportunityIds?: string[];
  userIds?: string[];
  userAutoIds?: string[];
  userAdvancedSearch?: string;
  listId?: string;
}

export interface IAPIResponse {
  //Response can be start with small or capital letter, so handled for both
  status: string;
  message: string;
  Status?: string;
  Message?: string;
}

export interface IEntitySchema {
  lead?: string;
  opportunity?: string;
  activity?: string;
  task?: string;
}
