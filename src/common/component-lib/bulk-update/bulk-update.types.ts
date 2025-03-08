import { EntityType } from 'common/types';
import { ICustomObjectMetaData, ILOSProperties } from 'common/types/entity/lead';
import { CallerSource } from 'common/utils/rest-client';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IOptions } from 'common/utils/entity-data-manager/entity-data-manager.types';
import { ILeadTypeConfiguration } from 'apps/smart-views/smartviews.types';

export enum RenderTypeCode {
  HTML = '25',
  MultiSelect = '23'
}

export enum Schema {
  MailingPreferences = 'MailingPreferences',
  OwnerId = 'OwnerId',
  Owner = 'Owner',
  ActivityEventNote = 'ActivityEvent_Note',
  Stage = 'Stage',
  RelatedCompanyId = 'RelatedCompanyId',
  ProspectStage = 'ProspectStage'
}

export enum DataType {
  ActiveUsers = 'ActiveUsers',
  Product = 'Product',
  Textarea = 'textarea',
  LargeOptionSet = 'LargeOptionSet',
  SearchableDropdown = 'SearchableDropdown',
  Number = 'Number',
  Select = 'Select'
}

export enum AugmentedRenderType {
  AssociatedDropdown = 'associated-dropdown',
  Owner = 'owner',
  Product = 'product',
  LargeOptionSet = 'LargeOptionSet',
  Date = 'date',
  DateTime = 'datetime',
  Time = 'time',
  ActiveUsers = 'ActiveUsers',
  MultiselectDropdown = 'multiselectDropdown',
  ChangeStage = 'change-stage',
  Number = 'number',
  SearchableDropDown = 'searchable-dropdown',
  DropdownWithOthers = 'dropdown-with-other',
  Dropdown = 'dropdown',
  TextArea = 'textArea',
  Editor = 'editor',
  RadioButtons = 'radio-buttons',
  Checkbox = 'checkbox',
  Phone = 'phone',
  Email = 'email',
  TextBox = 'TextBox',
  ChangeStatus = 'change-status'
}

interface IBulkUpdateField {
  value: string;
  label: string;
  schemaName: string;
  entityType: EntityType;
  augmentedRenderType: AugmentedRenderType;
  isCFS: boolean;
  renderType?: string;
  maxLength?: number;
  isMandatory?: boolean;
  showCommentBox?: boolean;
  scale?: number;
  includeLOSOtherOption?: boolean;
  internalSchemaName?: string;
}

export interface ISettings {
  BulkLeadUpdateCount: string;
  EnableNLeadsFeature: string;
  MaxNLeadsToUpdateInSync: string;
}
interface IBulkUpdateConfig {
  Configs: ISettings;
  SchemaNames: string[];
}

interface IBulkConfigCache {
  [entityTypeAndCode: string]: IBulkUpdateConfig;
}

interface IMetaDataField {
  SchemaName: string;
  DisplayName: string;
  DataType: string;
  RenderType: string;
  IsMultiSelectDropdown?: boolean;
  IsMandatory?: boolean;
  CustomObjectMetaData?: ICustomObjectMetaData;
  MaxLength?: number;
  RangeMax?: number;
  InternalSchemaName?: string;
  Scale?: number;
  LOSProperties?: ILOSProperties;
}

export interface ISearchParams {
  advancedSearchText: string;
  advancedSearchTextNew: string;
  searchText: string;
  customFilters?: string;
  pageSize?: string;
  sortOn?: string;
  sortBy?: string;
  listId?: string;
}

export interface IGridConfig {
  isSelectAll: boolean;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
  updateAll?: boolean;
}
interface IBulkUpdate {
  setShow: (show: boolean) => void;
  searchParams: ISearchParams;
  gridConfig: IGridConfig;
  entityIds: string[];
  entityType: EntityType;
  callerSource: CallerSource;
  eventCode?: string;
  show?: boolean;
  onSuccess?: () => void;
  successModal?: ({
    onClose,
    repPluralName
  }: {
    onClose: () => void;
    repPluralName?: string;
  }) => JSX.Element;
}

enum InputId {
  UpdateTo = 'update-to',
  SelectedField = 'selected-field',
  NLeads = 'n-leads',
  Invalid = 'invalid'
}

enum BulkMode {
  SelectedLead = 'selected-lead',
  TotalRecords = 'total-records',
  NLeads = 'n-leads',
  UpdateAll = 'updateAll'
}

interface IMetaDataGet {
  metaDataMap: IMetaDataField[];
  repName: IEntityRepresentationName;
}

interface IDropdownOptionGet {
  schemaName: string;
  searchText: string;
  customObjectSchemaName: string;
  code?: string;
}
type IBulkUpdateHelper = {
  [entityType: string]: {
    bulkUpdateConfigGet: (config: {
      eventCode?: number;
      callerSource: CallerSource;
    }) => Promise<IBulkUpdateConfig>;
    metaDataGet: (
      eventCode?: number,
      leadTypeConfiguration?: ILeadTypeConfiguration[]
    ) => Promise<IMetaDataGet>;
    augmenter: (field) => IBulkUpdateField[];
    settingConfigGet: (config: ISettings) => ISettings;
    dropdownOptionGet: (config: IDropdownOptionGet) => Promise<IOptions>;
    canSortFields: boolean;
  };
};

export type {
  IBulkUpdate,
  IBulkConfigCache,
  IBulkUpdateConfig,
  IMetaDataField,
  IBulkUpdateField,
  IMetaDataGet,
  IBulkUpdateHelper,
  IDropdownOptionGet
};
export { InputId, BulkMode };
