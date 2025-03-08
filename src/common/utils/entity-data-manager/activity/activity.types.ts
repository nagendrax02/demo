import {
  ActivityBaseAttributeDataType,
  ICustomObjectMetaData,
  ILOSProperties,
  RenderType
} from 'common/types/entity/lead';
import { CallerSource } from 'common/utils/rest-client';
import { IFetchDropdownPayload } from '../entity-data-manager.types';
import { EntityType } from '../common-utils/common.types';
import { IConfig } from 'apps/smart-views/augment-tab-data/activity/header-action';

interface IActivityBaseAttribute {
  SchemaName: string;
  DataType: ActivityBaseAttributeDataType;
  ParentField?: string;
  IsMultiSelectDropdown?: boolean;
  LOSProperties?: ILOSProperties;
  DisplayName: string;
  RenderType: RenderType;
  MaxLength?: number;
  RangeMax?: number;
  Scale?: number;
  IsMandatory?: boolean;
}

interface IActivityAttribute extends IActivityBaseAttribute {
  ShowInForm?: boolean | undefined;
  CustomObjectMetaData: ICustomObjectMetaData;
  EntityAttributeType?: string;
  InternalSchemaName?: string;
  fieldValue?: string | null;
}

type IActivityMetaDataMap = Record<string, IActivityAttribute>;
interface IActivityMetaData {
  Id: string;
  Code: number;
  Name?: string;
  DisplayName?: string;
  PluralName?: string;
  EntityType: EntityType;
  Score?: number;
  Fields?: IActivityAttribute[];
  metaDataMap?: IActivityMetaDataMap;
  CanDelete?: boolean;
  IsMultiSelectDropdown?: boolean;
}

export interface IBody extends IFetchDropdownPayload {
  code: string;
}
export interface IFetchActivityDropdownOptions {
  body: IBody;
  callerSource: CallerSource;
}

type IPersistedActivityMetaData = Record<string, IActivityMetaData>;
export { EntityType };
export type {
  IPersistedActivityMetaData,
  IActivityMetaData,
  IActivityAttribute,
  IActivityMetaDataMap
};

export interface IGetMoreActionSubMenuParams {
  tabId: string;
  activityDisplayName: string;
  entityCode: string;
  config: IConfig;
}
