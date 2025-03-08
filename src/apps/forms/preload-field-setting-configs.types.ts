import { FormEntityType } from './common.types';

export interface IPreLoadFieldSettings {
  IsReadOnly?: boolean;
  IsAllType?: boolean;
}

export interface IPreLoadFieldSettingsConfig {
  EntityType: FormEntityType;
  SchemaName: string;
  EntityCode?: string;
  ActivityCode?: number | string;
  Settings: IPreLoadFieldSettings;
}
