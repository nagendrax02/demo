import {
  IEntityRepresentationName,
  IFeatureRestrictionConfig
} from 'apps/entity-details/types/entity-data.types';
import { IConfig as ICompConfig } from 'apps/entity-details/types/vcard.types';

interface ILeadMetaData {
  LeadRepresentationConfig?: IEntityRepresentationName;
  Fields?: ILeadAttribute[];
}

enum EntityAttributeType {
  System = 'System',
  Custom = 'Custom'
}

enum LockAfterCreate {
  No = 0,
  Yes,
  AlwaysNo
}

interface ILeadAttribute {
  SchemaName: string;
  DisplayName: string;
  DataType: DataType;
  RenderType: RenderType;
  LOSProperties?: ILOSProperties;
  IsSortable?: boolean;
  ParentField?: string;
  Precision?: number;
  Scale?: number;
  IsDisabled?: boolean;
  IsLeadIdentifier?: boolean;
  IsUnique?: boolean;
  CustomObjectMetaData?: ICustomObjectMetaData;
  DefaultValue?: string;
  IsMandatory?: boolean;
  EntityAttributeType?: EntityAttributeType;
  entityId?: string;
  additionalData?: Record<string, string>;
  showAll?: boolean;
  removeDownloadOption?: boolean;
  LockAfterCreate?: LockAfterCreate;
  IsReadOnly?: boolean;
}

export interface ILeadMetadataMap {
  [key: string]: ILeadAttribute;
}

export interface IFetchLeadMetadata {
  metaData: ILeadMetadataMap;
  representationName: IEntityRepresentationName | undefined;
}

enum DataType {
  Text = 'Text',
  Email = 'Email',
  Phone = 'Phone',
  Website = 'Website',
  Url = 'Url',
  IP = 'IP',
  Select = 'Select',
  Time = 'Time',
  Boolean = 'Boolean',
  TimeZone = 'TimeZone',
  Country = 'Country',
  MultiSelect = 'MultiSelect',
  Number = 'Number',
  DateTime = 'DateTime',
  SearchableDropdown = 'SearchableDropdown',
  LargeOptionSet = 'LargeOptionSet',
  Dropdown = 'Dropdown',
  ActiveUsers = 'ActiveUsers',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ActivityEvent_Note = 'ActivityEvent_Note',
  Product = 'Product',
  CustomObject = 'CustomObject',
  String = 'String',
  File = 'File',
  Title = 'Title',
  Form = 'Form',
  Process = 'Process',
  Lead = 'Lead',
  Date = 'Date',
  MediaLink = 'MediaLink',
  GeoLocation = 'GeoLocation',
  Audio = 'Audio',
  DueDate = 'DueDate',
  CustomObjectFieldString = 'CustomObjectField-String'
}

export enum RenderTypeCode {
  HTML = '25',
  TextArea = '1'
}

enum RenderType {
  Account = 'Account',
  Notes = 'Notes',
  Counter = 'Counter',
  Currency = 'Currency',
  Phone = 'Phone',
  IP = 'IP',
  Select = 'Select',
  Calender = 'Calender',
  Date = 'Date', // No timezone conversion takes place
  Datetime = 'Datetime',
  DateWithTimezone = 'DateWithTimezone', // timezone conversion takes place
  Dropdown = 'Dropdown',
  RadioButtons = 'RadioButtons',
  GroupButtons = 'GroupButtons',
  ComboBox = 'ComboBox',
  DropdownWithCheckBox = 'DropdownWithCheckBox',
  Compound = 'Compound',
  DropdownWithOthers = 'DropdownWithOthers',
  CheckboxList = 'CheckboxList',
  HTML = 'HTML',
  Boolean = 'Boolean',
  Number = 'Number',
  DateTime = 'DateTime',
  SearchableDropdown = 'SearchableDropdown',
  LargeOptionSet = 'LargeOptionSet',
  ActiveUsers = 'ActiveUsers',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ActivityEvent_Note = 'ActivityEvent_Note',
  Product = 'Product',
  CustomObject = 'CustomObject',
  String = 'String',
  File = 'File',
  Title = 'Title',
  Form = 'Form',
  Process = 'Process',
  Lead = 'Lead',
  MediaLink = 'MediaLink',
  Text = 'Text',
  Textbox = 'Textbox',
  Email = 'Email',
  SearchableDropDown = 'SearchableDropDown',
  TextArea = 'TextArea',
  Checkbox = 'Checkbox',
  URL = 'URL',
  Time = 'Time',
  MultiSelect = 'MultiSelect',
  UserName = 'UserName',
  SocialMedia = 'SocialMedia',
  Audio = 'Audio',
  DueDate = 'DueDate',
  AccountName = 'AccountName',
  TimeZone = 'TimeZone',
  Component = 'Component',
  PrimaryContactName = 'PrimaryContactName',
  AssociatedLead = 'AssociatedLead',
  OpportunityStatus = 'OpportunityStatus',
  OppStatusHighlighted = 'OppStatusHighlighted',
  OpportunitySource = 'OpportunitySource',
  OpportunityName = 'OpportunityName',
  String1000 = 'String_TextLarge',
  StringCMS = 'String_TextContent_CMS',
  StringTextArea = 'String_TextContent_TextArea',
  PortalName = 'PortalName',
  FormName = 'FormName',
  None = 'None'
}

enum SchemaName {
  OwnerId = 'OwnerId',
  CreatedByName = 'CreatedByName',
  ModifiedByName = 'ModifiedByName',
  RelatedCompanyId = 'RelatedCompanyId'
}

enum InternalSchema {
  OpportunityReason = 'OpportunityReason'
}

interface ILOSProperties {
  IncludeOthersOption?: boolean;
  IsLargeOptionSetField?: boolean;
  IncludeOthers?: boolean;
}

interface ICustomObjectMetaData {
  FileStorageVersion?: number;
  Fields?: ICustomObjectAttribute[];
}

interface ICustomObjectAttribute extends IActivityBaseAttribute {
  CustomObjectSchemaName: string;
  EntityAttributeType?: string;
  ColSpan?: number;
  SortOrder?: number;
}

enum ActivityBaseAttributeDataType {
  Number = 'Number',
  DateTime = 'DateTime',
  SearchableDropdown = 'SearchableDropdown',
  LargeOptionSet = 'LargeOptionSet',
  Dropdown = 'Dropdown',
  ActiveUsers = 'ActiveUsers',
  ActivityEventNote = 'ActivityEvent_Note',
  Product = 'Product',
  CustomObject = 'CustomObject',
  String = 'String',
  File = 'File',
  Title = 'Title',
  Form = 'Form',
  Process = 'Process',
  Lead = 'Lead',
  Date = 'Date',
  MediaLink = 'MediaLink',
  Phone = 'Phone',
  Text = 'Text'
}

interface IActivityBaseAttribute {
  SchemaName: string;
  DataType: ActivityBaseAttributeDataType;
  ParentField?: string;
  IsMultiSelectDropdown?: boolean;
  LOSProperties?: ILOSProperties;
  DisplayName: string;
  RenderType?: string;
  IsMandatory?: boolean;
  MaxLength?: number;
  RangeMax?: number;
  Scale?: number;
}

interface IAugmentedLeadMetaData {
  RenderType: RenderType;
  DataType: DataType;
  DisplayName: string;
  EntityAttributeType?: EntityAttributeType;
}

type IAugmentedMetaDataProvider = Record<string, IAugmentedLeadMetaData>;

interface IConfig {
  [key: string]: Record<string, string | null> | string;
}

interface IEntityFieldConfig {
  config: IConfig;
}

interface IRenderConfig {
  [key: string]: string | boolean | null;
}

interface IEntityProperty {
  id: string;
  name: string;
  value: string;
  fieldRenderType: RenderType;
  schemaName: string;
  dataType: DataType;
  internalSchemaName?: string;
  entityAttributeType?: EntityAttributeType;
  parentSchemaName?: string;
  isCFSField?: boolean;
  config?: IEntityFieldConfig;
  entityId?: string;
  displayValue?: string;
  leadId?: string;
  isActivity?: boolean;
  timeFormat?: string;
  dateTimeFormat?: string;
  customObjectMetaData?: ICustomObjectMetaData;
  isRenderedInGrid?: boolean;
  charLimit?: number;
  renderConfig?: IRenderConfig;
  additionalData?: Record<string, string>;
  componentConfig?: Record<string, ICompConfig>;
  showAll?: boolean;
  removeDownloadOption?: boolean;
  eventCode?: string;
  preventAlignment?: boolean;
  customDisplayName?: string;
  isAssociatedLeadProperty?: boolean;
  doNotUseNameAsValue?: boolean;
  ignoreSystemTimeValue?: boolean;
}

interface IProperty {
  entityProperty: IEntityProperty[];
  fields: Record<string, string | null>;
  entityConfig: { [key: string]: string | null };
  title?: string;
  featureRestrictionConfig?: IFeatureRestrictionConfig;
}

const PhotoUrlSchemaName = 'PhotoUrl';

const Timezone = 'TimeZone';

export type {
  ILeadMetaData,
  ILeadAttribute,
  ILOSProperties,
  ICustomObjectMetaData,
  ICustomObjectAttribute,
  IActivityBaseAttribute,
  IAugmentedLeadMetaData,
  IAugmentedMetaDataProvider,
  IEntityProperty,
  IProperty
};

export {
  DataType,
  LockAfterCreate,
  RenderType,
  SchemaName,
  ActivityBaseAttributeDataType,
  PhotoUrlSchemaName,
  Timezone,
  EntityAttributeType,
  InternalSchema
};
