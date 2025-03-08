import { IQuickActionConfig } from './types';
import { LEAD_SCHEMA_NAME } from './schema-names';
import { RenderType } from 'common/types/entity/lead';
import { EntityType } from 'common/types';
import { workAreaIds } from 'common/utils/process';
import { IEntityRepresentationConfig } from './types/entity-store.types';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';

const LEAD_METRICS = 'Metric';
const LEAD_QUALITY = 'Lead Quality';
const DISENGAGED = 'Disengaged';
const ENGAGED = 'Engaged';
const LEAD_PROPERTIES = 'Lead Properties';
const CONVERSE = 'Converse';
const VCARD_PROPERTIES = 'VCard Properties';
const TOP_SECTION = 'TopSection';
const ASSOCIATED_LEAD_SCHEMA_NAME = 'PC_Name';
const ASSOCIATED_LEAD_EMAIL_SCHEMA_NAME = 'PC_EmailAddress';
const ASSOCIATED_LEAD_PHONE_SCHEMA_NAME = 'PC_Phone';
const ASSOCIATED_LEAD_STAGE_SCHEMA_NAME = 'PC_ProspectStage';
const PRIMARY_CONTACT = 'PrimaryContact';

const LEAD_QUICK_ACTION_CONFIG: Record<string, IQuickActionConfig> = {
  leadStar: {
    name: 'leadStar',
    icon: 'star_outline',
    title: 'Star Lead',
    onClick: () => {}
  },
  leadShare: {
    name: 'leadShare',
    icon: 'share',
    title: 'Share Lead',
    onClick: () => {}
  },
  leadEdit: {
    name: 'leadEdit',
    icon: 'edit',
    onClick: () => {},
    workAreaConfig: { workAreaId: workAreaIds.LEAD_DETAILS.EDIT_VCARD },
    id: 'LeadDetailEditVcard',
    title: 'Edit VCard',
    featureRestrictionConfig: {
      moduleName: FeatureRestrictionModuleTypes.LeadDetails,
      actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.LeadDetails].EditLead,
      callerSource: CallerSource?.LeadDetailsVCard
    }
  },
  converse: {
    name: CONVERSE?.toLowerCase(),
    icon: 'chat',
    onClick: () => {}
  }
};

const ACCOUNT_QUICK_ACTION_CONFIG: Record<string, IQuickActionConfig> = {
  accountEdit: {
    name: 'accountEdit',
    icon: 'edit',
    onClick: () => {},
    id: 'AccountDetailEditVCard',
    title: 'Edit VCard'
  }
};

const META_DATA_FIELD_ORDER = {
  [LEAD_SCHEMA_NAME.JOB_TITLE]: 1,
  [LEAD_SCHEMA_NAME.COMPANY_NAME]: 2,
  [LEAD_SCHEMA_NAME.COMPANY]: 3,
  [LEAD_SCHEMA_NAME.EMAIL_ADDRESS]: 4,
  [LEAD_SCHEMA_NAME.PHONE]: 5,
  [LEAD_SCHEMA_NAME.MOBILE]: 6,
  [LEAD_SCHEMA_NAME.ADDRESS]: 7
};

const ACCOUNT_META_DATA_FIELD_ORDER = {
  [LEAD_SCHEMA_NAME.ADDRESS]: 1,
  [LEAD_SCHEMA_NAME.EMAIL_ADDRESS]: 2,
  [LEAD_SCHEMA_NAME.PHONE]: 3,
  [LEAD_SCHEMA_NAME.MOBILE]: 4,
  [LEAD_SCHEMA_NAME.WEBSITE]: 5,
  [LEAD_SCHEMA_NAME.CITY]: 6
};

const PRIMARY_ACTION = {
  ACTIVITY: 'Activity',
  OPPORTUNITY: 'Opportunity',
  NOTE: 'Note',
  TASKS: 'Tasks',
  TASK_ODVC: 'Task',
  PROCESSES: 'Processes',
  ASSIGN_LEADS: 'Assign_Leads',
  ADD_LEAD: 'Add_Lead',
  OPPORTUNITY_AUTOMATION_REPORT: 'ViewAutomationReportLink',
  OPPORTUNITY_AUTOMATION_REPORT_ODVC: 'AutomationReport',
  CHANGE_STATUS_STAGE_ODVC: 'ChangeStageStatus',
  LEAD_AUTOMATION_REPORT: 'AutomationReport'
};

const ACCOUNT_SCHEMA_NAME = {
  CITY: 'City',
  STATE: 'State',
  COUNTRY: 'Country'
};

const EXCLUDE_ACCOUNT_SCHEMA_NAME = {
  COMPANYNAME: 'CompanyName',
  STAGE: 'Stage'
};

const LEAD_PRIMARY_SCHEMA_NAMES = ['FirstName', 'LastName', 'ProspectStage', 'PhotoUrl'];
const LEAD_ADDRESS_SCHEMA_NAMES = ['mx_City', 'mx_State', 'mx_Country'];
const LEAD_VCARD_METADATA_DISPLAY_NAMES = {
  [LEAD_SCHEMA_NAME.PHONE]: { displayName: 'Ph', renderType: RenderType.Phone },
  [LEAD_SCHEMA_NAME.MOBILE]: { displayName: 'Mob', renderType: RenderType.Phone }
};
const SOCIAL_MEDIA_ICONS = ['TwitterId', 'FacebookId', 'LinkedInId', 'SkypeId'];

const LEAD_SECONDARY_SCHEMA_NAMES = [
  LEAD_SCHEMA_NAME.JOB_TITLE,
  LEAD_SCHEMA_NAME.COMPANY_NAME,
  LEAD_SCHEMA_NAME.COMPANY,
  LEAD_SCHEMA_NAME.EMAIL_ADDRESS,
  LEAD_SCHEMA_NAME.PHONE,
  LEAD_SCHEMA_NAME.MOBILE,
  LEAD_SCHEMA_NAME.ADDRESS,
  ...SOCIAL_MEDIA_ICONS
];

const DEPRECATED_SOCIAL_MEDIA_ICONS = ['GTalkId', 'GooglePlusId'];

const CUSTOM_ACTIONS = 'Custom Actions';

const ACTION = {
  ExportLead: 'ExportLead',
  DeleteAllLead: 'DeleteAllLead',
  DeleteList: 'DeleteList',
  UpdateAllLead: 'UpdateAllLead',
  Cancel: 'Cancel',
  ChangeStage: 'ChangeStage',
  ChangeOwner: 'ChangeOwner',
  Edit: 'Edit',
  Delete: 'Delete',
  OwnerId: 'OwnerId',
  SalesActivity: 'SalesActivity',
  OptOut: 'OptOut',
  SendEmail: 'SendEmail',
  Owner: 'Owner',
  Form: 'Form',
  Processes: 'Processes',
  Call: 'Call',
  SetAsPrimaryContact: 'SetAsPrimaryContact',
  IsPrimaryContact: 'IsPrimaryContact',
  AddToList: 'AddToList',
  RemoveFromList: 'RemoveFromList',
  ShareViaEmail: 'ShareViaEmail',
  Converse: 'Converse',
  Activity: 'Activity',
  EditActivity: 'EditActivity',
  Opportunity: 'Opportunity',
  Note: 'Note',
  Tasks: 'Tasks',
  AutomationReport: 'AutomationReport',
  LeadDetailEditVCard: 'LeadDetailEditVcard',
  ViewScheduledEmail: 'ViewScheduledEmail',
  DefaultAddTask: 'DefaultAddTask',
  EditTask: 'EditTask',
  SendEmailAction: 'SendEmailAction',
  LeadAttributeDetailsEdit: 'LeadAttributeDetailsEdit',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Change_Status_Stage: 'Change_Status_Stage',
  ViewAutomationReportLink: 'ViewAutomationReportLink',
  AccountAddNewTasks: 'AccountAddNewTasks',
  AccountAddNewActivity: 'AccountAddNewActivity',
  AccountAddNewLeadActivity: 'AccountAddNewLeadActivity',
  AccountAssignLead: 'AccountAssignLead',
  AccountAddNewLead: 'AccountAddNewLead',
  AccountDetailEditVCard: 'AccountDetailEditVCard',
  AccountAttributeDetailsEdit: 'AccountAttributeDetailsEdit',
  AddNewLead: 'AddNewLead',
  QuickAddLead: 'QuickAddLead',
  QuickAddActivity: 'QuickAddActivity',
  MarkOpen: 'MarkOpen',
  MarkComplete: 'MarkComplete',
  DeleteRecurrence: 'DeleteRecurrence',
  AddTaskForLead: 'AddTaskForLead',
  AddActivityForLead: 'AddActivityForLead',
  AccountEdit: 'AccountEdit',
  TaskDelete: 'TaskDelete',
  TaskCancel: 'TaskCancel',
  ChangeTaskOwner: 'ChangeTaskOwner',
  AddActivity: 'AddActivity',
  AddOpportunity: 'AddOpportunity',
  BulkUpdate: 'BulkUpdate',
  MergeLeads: 'MergeLeads',
  CustomActions: 'CustomActions',
  OpportunityDetailEditVCard: 'OpportunityDetailEditVCard',
  CreateTask: 'CreateTask',
  OpportunityAttributeDetailsEdit: 'OpportunityAttributeDetailsEdit',
  OpportunityAddActivity: 'OpportunityAddActivity',
  OpportunityAddTask: 'OpportunityAddTask',
  OpportunityEditTask: 'OpportunityEditTask',
  Add: 'Add',
  AccountDelete: 'AccountDelete',
  AddAccount: 'AddAccount',
  OpportunityAddNewLead: 'OpportunityAddNewLead',
  OpportunityBulkDelete: 'OpportunityBulkDelete',
  AccountEditActivity: 'AccountEditActivity',
  AccountActivityAddActivity: 'AccountActivityAddActivity',
  ListEdit: 'ListEdit',
  ListBulkDelete: 'ListBulkDelete',
  ListDelete: 'ListDelete',
  ListHide: 'ListHide',
  ListUnhide: 'ListUnhide',
  BulkListHide: 'BulkListHide',
  BulkListUnhide: 'BulkListUnhide',
  ListAddMore: 'ListAddMore'
};

const DEFAULT_REPRESENTATION_NAME: IEntityRepresentationConfig = {
  [EntityType.Lead]: {
    SingularName: 'Lead',
    PluralName: 'Leads'
  },
  [EntityType.Account]: {
    SingularName: 'Account',
    PluralName: 'Accounts'
  },
  [EntityType.Activity]: {
    SingularName: 'Activity',
    PluralName: 'Activities'
  },
  [EntityType.AccountActivity]: {
    SingularName: 'Activity',
    PluralName: 'Activities'
  },
  [EntityType.Opportunity]: {
    SingularName: 'Opportunity',
    PluralName: 'Opportunities'
  },
  [EntityType.Task]: {
    SingularName: 'Task',
    PluralName: 'Tasks'
  },
  [EntityType.Lists]: {
    SingularName: 'List',
    PluralName: 'Lists'
  },
  [EntityType.Ticket]: {
    SingularName: 'Ticket',
    PluralName: 'Tickets'
  }
};

const actionToWorkAreaMap = {
  [EntityType.Lead]: {
    [ACTION.Processes]: workAreaIds.LEAD_DETAILS.ADD_ACTIVITY,
    [ACTION.Edit]: workAreaIds.LEAD_DETAILS.EDIT_LEAD,
    [ACTION.Tasks]: workAreaIds.LEAD_DETAILS.ADD_TASK,
    [ACTION.Opportunity]: workAreaIds.LEAD_DETAILS.ADD_OPPORTUNITY
  }
};

export const OPPORTUNITY_NAME_SCHEMA = 'mx_Custom_1';

const salesActivityInfo = {
  ENTITY_TYPE: '30'
};

export {
  LEAD_METRICS,
  LEAD_QUALITY,
  DISENGAGED,
  ENGAGED,
  LEAD_PROPERTIES,
  LEAD_QUICK_ACTION_CONFIG,
  LEAD_PRIMARY_SCHEMA_NAMES,
  CONVERSE,
  VCARD_PROPERTIES,
  CUSTOM_ACTIONS,
  ACTION,
  DEFAULT_REPRESENTATION_NAME,
  LEAD_ADDRESS_SCHEMA_NAMES,
  LEAD_VCARD_METADATA_DISPLAY_NAMES,
  actionToWorkAreaMap,
  SOCIAL_MEDIA_ICONS,
  DEPRECATED_SOCIAL_MEDIA_ICONS,
  salesActivityInfo,
  META_DATA_FIELD_ORDER,
  ACCOUNT_META_DATA_FIELD_ORDER,
  TOP_SECTION,
  ASSOCIATED_LEAD_SCHEMA_NAME,
  ASSOCIATED_LEAD_EMAIL_SCHEMA_NAME,
  ASSOCIATED_LEAD_PHONE_SCHEMA_NAME,
  ASSOCIATED_LEAD_STAGE_SCHEMA_NAME,
  PRIMARY_CONTACT,
  PRIMARY_ACTION,
  ACCOUNT_QUICK_ACTION_CONFIG,
  ACCOUNT_SCHEMA_NAME,
  EXCLUDE_ACCOUNT_SCHEMA_NAME,
  LEAD_SECONDARY_SCHEMA_NAMES
};
export const OPP_CONFIGURATION = {
  callerSource: CallerSource?.OpportunityDetails,
  moduleName: FeatureRestrictionModuleTypes.OpportunityDetails
};
