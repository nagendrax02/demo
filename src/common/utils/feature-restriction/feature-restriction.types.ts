export enum FeatureRestrictionModuleTypes {
  CustomMenus = 'CustomMenus',
  Dashboard = 'Dashboard',
  LeadDetails = 'LeadDetails',
  ManageActivities = 'ManageActivities',
  ManageLeads = 'ManageLeads',
  ManageLists = 'ManageLists',
  ManageTasks = 'ManageTasks',
  Navigation = 'Navigation',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Navigation_GlobalAdd = 'Navigation-GlobalAdd',
  OpportunityDetails = 'OpportunityDetails',
  Settings = 'Settings',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Settings_Security = 'Settings-Security',
  SmartViews = 'SmartViews',
  ServiceCloud = 'ServiceCloud'
}

export const FeatureRestrictionActionTypes = {
  [FeatureRestrictionModuleTypes.Dashboard]: {
    View: 'View'
  },
  [FeatureRestrictionModuleTypes.LeadDetails]: {
    EditLead: 'Edit Lead',
    AddNewTab: 'Add New Tab',
    ManageTabs: 'Manage Tabs'
  },
  [FeatureRestrictionModuleTypes.ManageActivities]: {
    View: 'View',
    SelectColumn: 'Select Column'
  },
  [FeatureRestrictionModuleTypes.ManageLeads]: {
    QuickAddLead: 'Quick Add Lead',
    AddNewLead: 'Add New Lead',
    ImportLeads: 'Import Leads',
    ExportLeads: 'Export Leads',
    ManageFilters: 'Manage Filters',
    Sorting: 'Sorting',
    RowActions: 'Row Actions',
    BulkActions: 'Bulk Actions',
    View: 'View',
    SelectColumn: 'Select Column'
  },
  [FeatureRestrictionModuleTypes.ManageLists]: {
    View: 'View'
  },
  [FeatureRestrictionModuleTypes.ManageTasks]: {
    View: 'View',
    SelectColumn: 'Select Column'
  },
  [FeatureRestrictionModuleTypes.Navigation]: {
    GlobalAdd: 'Global Add',
    GlobalSearch: 'Global Search',
    Calls: 'Calls'
  },
  [FeatureRestrictionModuleTypes.Navigation_GlobalAdd]: {
    GlobalAddLead: 'Global Add Lead',
    GlobalAddActivity: 'Global Add Activity',
    GlobalAddTask: 'Global Add Task',
    GlobalAddOpportunity: 'Global Add Opportunity'
  },
  [FeatureRestrictionModuleTypes.OpportunityDetails]: {
    EditOpportunity: 'Edit Opportunity',
    AddNewTab: 'Add New Tab',
    ManageTabs: 'Manage Tabs'
  },
  [FeatureRestrictionModuleTypes.Settings]: {
    EditProfile: 'Edit Profile',
    Security: 'Security'
  },
  [FeatureRestrictionModuleTypes.Settings_Security]: {
    ResetPassword: 'Reset Password',
    ConfigureTwoFA: 'Configure TwoFA'
  },
  [FeatureRestrictionModuleTypes.SmartViews]: {
    View: 'View',
    QuickAddLead: 'Quick Add Lead',
    AddNewLead: 'Add New Lead',
    ImportLeads: 'Import Leads',
    ExportLeads: 'Export Leads',
    ManageFilters: 'Manage Filters',
    Sorting: 'Sorting',
    RowActions: 'Row Actions',
    BulkActions: 'Bulk Actions',
    SelectColumn: 'Select Column',
    AddNewTab: 'Add New Tab'
  },
  [FeatureRestrictionModuleTypes.ServiceCloud]: {
    View: 'View'
  },
  [FeatureRestrictionModuleTypes.CustomMenus]: {
    View: 'View'
  }
};

export type UserRestrictions = Map<string, number>;

export interface IRawUserAction {
  DoNotDisplay: boolean;
  DynamicGroupType: number;
  ExpValue: number;
  ImageURL: string;
  IsDynamicGroup: boolean;
  Key: string;
  Name: string;
  Position: number;
  Value: number;
  GroupName: string;
}

export type UserActions = Map<string, number>;

export interface IRestrictionData {
  userActions: UserActions;
  userRestrictions: UserRestrictions;
}
