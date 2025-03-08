import { FormEntityType } from './common.types';

export interface IPrepopulateFieldConfig {
  entityType: FormEntityType;
  schemaName: string;
  entityCode?: string;
  activityCode?: number | string;
  value: string;
}

export interface IPrepopulateFieldConfigValue {
  value: string;
  isAllType: boolean;
}
