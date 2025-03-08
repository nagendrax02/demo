export enum TaskAttributeDataType {
  None = 'None',
  Text = 'Text',
  Number = 'Number',
  Email = 'Email',
  Phone = 'Phone',
  Website = 'Website',
  Url = 'Url',
  IP = 'IP',
  Date = 'Date',
  Select = 'Select',
  Time = 'Time',
  Boolean = 'Boolean',
  TimeZone = 'TimeZone',
  Country = 'Country',
  MultiSelect = 'MultiSelect',
  ActiveUsers = 'ActiveUsers',
  CustomObject = 'CustomObject',
  DateTime = 'DateTime'
}

export enum TaskAttributeRenderType {
  None = 'None',
  Textbox = 'Textbox',
  TextArea = 'TextArea',
  Notes = 'Notes',
  Counter = 'Counter',
  Currency = 'Currency',
  Email = 'Email',
  Phone = 'Phone',
  URL = 'URL',
  IP = 'IP',
  Select = 'Select',
  Calender = 'Calender',
  Date = 'Date',
  Datetime = 'Datetime',
  Dropdown = 'Dropdown',
  RadioButtons = 'RadioButtons',
  GroupButtons = 'GroupButtons',
  ComboBox = 'ComboBox',
  Checkbox = 'Checkbox',
  DropdownWithCheckBox = 'DropdownWithCheckBox',
  Compound = 'Compound',
  DropdownWithOthers = 'DropdownWithOthers',
  Time = 'Time',
  SearchableDropDown = 'SearchableDropDown',
  MultiSelect = 'MultiSelect',
  Boolean = 'Boolean'
}

export enum TaskTypeCategory {
  Appointment = 0,
  Todo = 1
}

enum TaskTypeStatus {
  InActive = 0,
  Active = 1
}

interface ITaskAttribute {
  SchemaName: string;
  DisplayName: string;
  DataType: TaskAttributeDataType;
  RenderType: TaskAttributeRenderType;
  IsMandatory?: boolean;
  EntityAttributeType?: string;
  isLocationEnabled?: boolean;
}

interface ICalendarSchemaConfig {
  IsEnabled: boolean;
}

interface ICalendarInvite {
  Lead: ICalendarSchemaConfig;
  Organizer: ICalendarSchemaConfig;
  Owner: ICalendarSchemaConfig;
}

interface ILocationData {
  GeofenceLocation: boolean;
  GeofenceRange: number;
  IsEnabled: boolean;
  IsMandatory: boolean;
  LocationValue: unknown;
}

interface IDurationData {
  IsEnabled: boolean;
  Value: string;
  Values: unknown;
}

interface ITaskConfiguration {
  CalenderInvite: ICalendarInvite;
  Location?: ILocationData;
  Duration?: IDurationData;
}

export interface IReminderConfig {
  IsEnable?: boolean;
}

interface ITaskMetadataResponse {
  Id: string;
  Name?: string;
  PreventConflict?: boolean;
  Status: TaskTypeStatus;
  Fields?: ITaskAttribute[];
  Color?: string;
  Category: TaskTypeCategory;
  Configuration?: ITaskConfiguration;
  ReminderConfiguration?: IReminderConfig;
}

interface ITaskMetadataMap {
  [key: string]: ITaskAttribute;
}

interface ITaskMetadata {
  taskRepName: string;
  configuration: ITaskConfiguration | undefined;
  fields: ITaskMetadataMap;
  reminderConfig?: IReminderConfig;
  category?: TaskTypeCategory;
}

export default ITaskMetadataResponse;
export type { ITaskAttribute, ITaskMetadataMap, ITaskMetadata };
