import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { DataType, RenderType } from '../lead';

export interface IAccountMetaDataMap {
  [key: string]: IAccountAttribute;
}

export interface IFetchAccountMetaData {
  metaData: IAccountMetaDataMap;
  representationName: IEntityRepresentationName | undefined;
}

export interface IAccountMetaData {
  LeadRepresentationConfig?: IEntityRepresentationName;
  CompanyTypeName?: string;
  PluralName?: string;
  Fields?: IAccountAttribute[];
  AccountRepresentationConfig?: IEntityRepresentationName;
}

export interface IAugmentedMetaData {
  RenderType: RenderType;
  DataType: DataType;
  DisplayName: string;
}

interface IConfig {
  [key: string]: Record<string, string | null> | string;
}

interface IEntityFieldConfig {
  config: IConfig;
}

export interface IEntityProperty {
  id: string;
  name: string;
  value: string;
  fieldRenderType: RenderType;
  schemaName: string;
  dataType: DataType;
  colSpan?: string;
  isClickableField?: boolean;
  internalSchemaName?: string;
  config?: IEntityFieldConfig;
}

export interface IProperty {
  entityProperty: IEntityProperty[];
  fields: Record<string, string | null>;
  entityConfig: { [key: string]: string | null };
  title?: string;
}

export interface IAccountAttribute {
  DataType: DataType;
  DisplayName: string;
  IsSearchable: boolean;
  IsSortable: boolean;
  IsUnique: boolean;
  ParentField: string;
  RenderType: RenderType;
  SchemaName: string;
  Type: string;
  AccountRepresentationConfig: string;
  BaseTable?: string;
  GroupName?: string;
}
