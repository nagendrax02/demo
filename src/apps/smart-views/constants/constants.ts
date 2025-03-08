import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { EntityType } from 'common/types';
import { TABS_CACHE_KEYS } from '../components/custom-tabs/constants';
import { FeatureRestrictionConfigMap } from 'apps/entity-details/types/entity-data.types';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';

export enum PanelOrientation {
  Top,
  Left
}

export enum ColumnRenderWorkArea {
  SelectColumns,
  GridColumns
}

export enum TabType {
  Lead,
  Activity,
  Task,
  Account = 4,
  Opportunity = 5,
  AccountActivity = 6,
  Ticket = 7,
  Lists = 10,
  Custom = 99
}

export const entityTypeMap: Record<number, EntityType> = {
  [TabType.Lead]: EntityType.Lead,
  [TabType.Account]: EntityType.Account,
  [TabType.Activity]: EntityType.Activity,
  [TabType.Opportunity]: EntityType.Opportunity,
  [TabType.Task]: EntityType.Task,
  [TabType.AccountActivity]: EntityType.AccountActivity,
  [TabType.Lists]: EntityType.Lists,
  [TabType.Ticket]: EntityType.Ticket
};

export const sortByMap: Record<string, number> = {
  asc: 0,
  desc: 1
};

export enum HeaderActionType {
  ToggleAction, // Task toggle between list and grid view
  QuickAction,
  MoreAction,
  SecondaryAction,
  IconAction
}

export enum SortOrder {
  Asc,
  Desc,
  None
}

export enum RowHeightType {
  Sm = 'sm',
  Default = 'default',
  Lg = 'lg',
  Xl = 'xl'
}

export enum FilterType {
  Dropdown = 'Dropdown',
  Date = 'Date'
}

export enum ConditionEntityType {
  Lead = 'Lead',
  Activity = 'Activity',
  Task = 'Task',
  Opportunity = 'Opportunity',
  Account = 'Account',
  Company = 'Company',
  CompanyActivity = 'CompanyActivity',
  Lists = 'Lists'
}

export enum ConditionOperator {
  EQUALS = 'eq',
  BETWEEN = 'between'
}

export enum ConditionType {
  AND = 'and'
}

export enum ConditionOperatorType {
  User = 'User',
  UserGroup = 'UserGroup',
  PickList = 'PickList',
  MultiSelect = 'MultiSelect',
  SearchablePickList = 'SearchablePickList',
  PAEvent = 'PAEvent',
  DateTime = 'DateTime',
  Product = 'Product',
  Date = 'Date',
  String = 'String',
  POEvent = 'POEvent',
  Dropdown = 'Dropdown'
}

export enum PanelState {
  Open,
  Close
}

export const rowHeightMap = {
  [RowHeightType.Sm]: 'Small',
  [RowHeightType.Default]: 'Medium',
  [RowHeightType.Lg]: 'Large',
  [RowHeightType.Xl]: 'Extra Large'
};

export const orderMap: Record<string, SortOrder> = {
  asc: SortOrder.Asc,
  desc: SortOrder.Desc
};

export const SMARTVIEWS = {
  defaultPanelTitle: 'Smart Views'
};

export const TabTypeToNameMap = {
  [TabType.Lead]: 'Lead',
  [TabType.Activity]: 'Activity',
  [TabType.Task]: 'Task',
  [TabType.Account]: 'Account',
  [TabType.Opportunity]: 'Opportunity',
  [TabType.AccountActivity]: 'AccountActivity'
};

export const panelSettings = {
  options: [
    {
      value: 'add-new-tab',
      label: 'Add New Tab'
    },
    {
      value: 'manage-tabs',
      label: 'Manage Tabs'
    }
  ]
};

export const HeaderAction = {
  AddNewLead: 'add_new_lead',
  ImportLeads: 'import_leads',
  ExportLeads: 'export_leads',
  SelectColumns: 'select_columns',
  ManageFilters: 'manage_filters',
  CreateList: 'create_new_list',
  CreateEmptyList: 'create_empty_list',
  ListEdit: 'ListEdit',
  DeleteAllLead: 'DeleteAllLead',
  Delete: 'Delete',
  UpdateAllLead: 'UpdateAllLead',
  SendEmailAction: 'SendEmailAction',
  ViewScheduledEmail: 'ViewScheduledEmail',
  CustomActions: 'CustomActions',
  ListAddMore: 'ListAddMore'
};

export const DefaultRepresentationName = {
  [TabType.Lead]: 'Leads'
};

export const PageSizeOptions: IOption[] = [
  {
    label: '10',
    value: '10'
  },
  {
    label: '15',
    value: '15'
  },
  {
    label: '25',
    value: '25'
  },
  {
    label: '50',
    value: '50'
  },
  {
    label: '100',
    value: '100'
  },
  {
    label: '200',
    value: '200'
  }
];

export const GROUPS = 'Groups';

export const SCHEMA_NAMES = {
  OWNER_ID: 'OwnerId',
  CREATED_BY_NAME: 'CreatedByName',
  CREATED_BY: 'CreatedBy',
  RELATED_COMPANY_ID: 'RelatedCompanyId',
  RELATED_COMPANY_ID_NAME: 'RelatedCompanyIdName',
  GOOGLE_PLUS_ID: 'GooglePlusId',
  LINKED_IN_ID: 'LinkedInId',
  TWITTER_ID: 'TwitterId',
  SKYPE_ID: 'SkypeId',
  FACEBOOK_ID: 'FacebookId',
  OWNER_ID_NAME: 'OwnerIdName',
  GROUP: 'Group',
  SALES_GROUP: 'SalesGroup',
  LOCATION: 'Location',
  RELATED_ENTITY_ID: 'RelatedEntityId',
  ASSOCIATED_LEAD: 'Associated Lead',
  PERCENT_COMPLETED: 'PercentCompleted',
  ASSOCIATED_OPPORTUNITY: 'RelatedOpportunityId',
  STATUS_CODE: 'StatusCode',
  REMINDER: 'Reminder',
  NAME: 'Name',
  TASK_TYPE: 'TaskType',
  TASK_STATUS: 'status',
  COMPLETED_BY: 'CompletedBy',
  COMPLETED_BY_NAME: 'CompletedByName',
  MODIFIED_BY: 'ModifiedBy',
  MODIFIED_BY_NAME: 'ModifiedByName',
  TIME_ZONE: 'TimeZone',
  OWNER_NAME: 'OwnerName',
  COMPLETED_ON: 'CompletedOn',
  PHOTO_URL: 'PhotoUrl',
  TIMEZONE: 'TimeZone',
  DUE_DATE: 'DueDate',
  END_DATE: 'EndDate',
  REVENUE: 'Revenue',
  MAILING_PREFERENCES: 'MailingPreferences',
  COMPANY_NAME: 'CompanyName',
  COMPANY_TYPE_NAME: 'CompanyTypeName',
  COMPANY_TYPE: 'CompanyType',
  ACCOUNT_IDENTIFIER: 'AccountIdentifier',
  CREATED_ON: 'CreatedOn',
  LEAD_TYPE: 'LeadType',
  LEAD_IDENTIFIER: 'LeadIdentifier',
  FIRST_NAME: 'FirstName',
  LIST_TYPE: 'ListType',
  PROSPECT_STAGE: 'ProspectStage',
  STATUS: 'Status',
  STAGE: 'Stage'
};

export const VALUE_SCHEMA_NAMES = {
  [SCHEMA_NAMES.OWNER_ID]: SCHEMA_NAMES.OWNER_NAME,
  [SCHEMA_NAMES.CREATED_BY]: SCHEMA_NAMES.CREATED_BY_NAME,
  [SCHEMA_NAMES.MODIFIED_BY]: SCHEMA_NAMES.MODIFIED_BY_NAME,
  [SCHEMA_NAMES.COMPLETED_BY]: SCHEMA_NAMES.COMPLETED_BY_NAME
};

export const USER_SCHEMA_NAMES = [
  SCHEMA_NAMES.OWNER_ID,
  SCHEMA_NAMES.CREATED_BY,
  SCHEMA_NAMES.MODIFIED_BY,
  SCHEMA_NAMES.COMPLETED_BY
];

export const DISPLAY_NAME = {
  SALES_GROUP: 'Sales Group'
};

export const ownerSchemas = {
  [SCHEMA_NAMES.CREATED_BY_NAME]: SCHEMA_NAMES.CREATED_BY_NAME,
  [SCHEMA_NAMES.OWNER_ID]: SCHEMA_NAMES.OWNER_ID,
  [SCHEMA_NAMES.CREATED_BY]: SCHEMA_NAMES.CREATED_BY
};

export const SOCIAL_MEDIA_SCHEMA_NAMES = [
  SCHEMA_NAMES.FACEBOOK_ID,
  SCHEMA_NAMES.GOOGLE_PLUS_ID,
  SCHEMA_NAMES.LINKED_IN_ID,
  SCHEMA_NAMES.TWITTER_ID,
  SCHEMA_NAMES.SKYPE_ID
];

export enum FilterOptionType {
  Date,
  MultiSelect
}

export const DEFAULT_MAX_ALLOWED = {
  // 60 normal columns + 1 action column
  Columns: 61,
  Filters: 5
};

export const rowHeightMenu: IMenuItem[] = [
  {
    label: rowHeightMap[RowHeightType.Sm],
    value: RowHeightType.Sm
  },
  {
    label: rowHeightMap[RowHeightType.Default],
    value: RowHeightType.Default
  },
  {
    label: rowHeightMap[RowHeightType.Lg],
    value: RowHeightType.Lg
  },
  {
    label: rowHeightMap[RowHeightType.Xl],
    value: RowHeightType.Xl
  }
];

export const UserRoleMap = {
  Admin: 'Administrator',
  MarketingUser: 'Marketing_User',
  SalesManager: 'Sales_Manager',
  SalesUser: 'Sales_User'
};

export const MAX_ALLOWED_TABS_DEFAULT = 10;

export const leadSchemaNamePrefix = 'P_';
export const cfsSchemaNameSuffix = '~mx_CustomObject';

export const leadSchemaNameMxPrefix = 'mx_';

export const FETCH_CRITERIA_SALES_GROUP_TABS = {
  [TabType.Task]: 1,
  [TabType.Activity]: 1,
  [TabType.Opportunity]: 1
};

export const tabsNotToCache = {
  [TABS_CACHE_KEYS.LEADS_CACHE_KEY]: true,
  [TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY]: true,
  [TABS_CACHE_KEYS.RELATED_LEADS_CACHE_KEY]: true,
  [TABS_CACHE_KEYS.SEARCH_RESULTS_CACHE_KEY]: true,
  [TABS_CACHE_KEYS.SALES_ACTIVITY_TAB]: true,
  [TABS_CACHE_KEYS.LEAD_OPPORTUNITY_TAB]: true,
  [TABS_CACHE_KEYS.MANAGE_LEADS_TAB]: true,
  [TABS_CACHE_KEYS.MANAGE_TASKS_TAB]: true,
  [TABS_CACHE_KEYS.MANAGE_LISTS_TAB]: true,
  [TABS_CACHE_KEYS.MANAGE_ACTIVITIES]: true
};

export const entityDetailsTabs = [
  TABS_CACHE_KEYS.LEADS_CACHE_KEY,
  TABS_CACHE_KEYS.RELATED_LEADS_CACHE_KEY,
  TABS_CACHE_KEYS.SALES_ACTIVITY_TAB,
  TABS_CACHE_KEYS.LEAD_OPPORTUNITY_TAB
];

export const TASK_TYPE_CATEGORY = {
  APPOINTMENT: 0,
  TODO: 1
};

export const TASK_DATE_SCHEMA_NAME = ['EndDate', 'DueDate'];

export const DEFAULT_DATE_TIME = '0001-01-01 00:00:00';

export const TABS_DEFAULT_ID = 'MXDEFAULTSMARTVIEWTABID';

export const ManageFilters = 'manage_filters';

export const SelectColumn = 'select_columns';

export const CUSTOM_ACTIONS = 'Custom Actions';

export const ALL = 'all';

export const COLUMN_IDS = {
  Actions: 'Actions'
};

export const ALL_TASKS_TYPES_CACHE_KEY = 'DEFAULT_ALL_TYPE';

export const MAVIS_TAB = 'Mavis';

export const dependentSchemaNames = {
  [SCHEMA_NAMES.COMPANY_TYPE_NAME]: {
    child: SCHEMA_NAMES.RELATED_COMPANY_ID
  },
  [SCHEMA_NAMES.RELATED_COMPANY_ID]: {
    parent: SCHEMA_NAMES.COMPANY_TYPE_NAME
  }
};

export const SALES_ACTIVITY_CODE = '30';

export const ACTIVITY_DATE_TYPE_FILTER: Record<string, string> = {
  ActivityCreatedOn: 'PACreatedOn',
  ActivityModifiedOn: 'PAModifiedOn'
};

export const ACTIVITY_DATE_VALUE_FILTER_MAP: Record<string, string> = {
  PACreatedOn: 'ActivityCreatedOn',
  PAModifiedOn: 'ActivityModifiedOn'
};

export const ACTIVITY_PRODUCT_TYPE_FILTER: Record<string, string> = {
  ProductCode: 'mx_Custom_1'
};

export const ACTIVITY_PRODUCT_VALUE_TYPE_FILTER: Record<string, string> = {
  ['mx_Custom_1']: 'ProductCode'
};

export const activityReplaceableSchema: Record<string, string> = {
  [ACTIVITY_DATE_TYPE_FILTER.ActivityCreatedOn]: 'CreatedOn',
  [ACTIVITY_DATE_TYPE_FILTER.ActivityModifiedOn]: 'ModifiedOn',
  PACreatedByName: 'CreatedBy'
};

export const TaskStatusOptions = {
  All: 'all',
  Pending: 'pending',
  Overdue: 'overdue',
  Completed: 'completed',
  Cancelled: 'cancelled'
};

export const PlatformSettingsLeadDateFilter = {
  ['0']: 'ProspectActivityDate_Max',
  ['1']: 'CreatedOn',
  ['2']: 'ModifiedOn'
};

export const PlatformSettingsLeadSchemaMap = {
  ProspectStage: 'Stage',
  OwnerId: 'LeadOwner',
  Source: 'Source',
  Group: 'SalesGroup',
  TimeZone: 'TimeZone',
  CurrentOptInStatus: 'CurrentOptInStatus'
};

export const SALES_GROUP_SCHEMA_NAME = {
  LEAD: 'Group',
  LEAD_PREFIX: 'P_Groups'
};

export const ACCOUNT_SCHEMA_PREFIX = 'C_';

export const PhoneCallActivity = {
  InboundPhoneCallActivity: '21',
  OutboundPhoneCallActivity: '22'
};

export const MANAGE_LISTS_FILTER_SCHEMA = [SCHEMA_NAMES.CREATED_BY, SCHEMA_NAMES.LIST_TYPE];

export const DEFAULT_DATE_VALUE = 'opt-all-time';

export const MANAGE_COLUMN_FEATURE_RESTRICTION_MAP: FeatureRestrictionConfigMap = {
  [TABS_CACHE_KEYS.MANAGE_LEADS_TAB]: {
    moduleName: FeatureRestrictionModuleTypes.ManageLeads,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].SelectColumn,
    callerSource: CallerSource?.ManageLeads
  },
  [TABS_CACHE_KEYS.MANAGE_ACTIVITIES]: {
    moduleName: FeatureRestrictionModuleTypes.ManageActivities,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageActivities].SelectColumn,
    callerSource: CallerSource?.ManageActivities
  },
  [TABS_CACHE_KEYS.MANAGE_TASKS_TAB]: {
    moduleName: FeatureRestrictionModuleTypes.ManageTasks,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageTasks].SelectColumn,
    callerSource: CallerSource?.ManageTasks
  },
  Smartviews: {
    moduleName: FeatureRestrictionModuleTypes.SmartViews,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].SelectColumn,
    callerSource: CallerSource?.SmartViews
  }
};
