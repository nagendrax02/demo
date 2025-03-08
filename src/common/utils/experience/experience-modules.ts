export const AuthEvents = {
  AuthStatus: 'AuthStatus',
  ReissueToken: 'ReissueToken'
};

export const EntityDetailsEvents = {
  FetchApi: 'FetchApi',
  EntityDataAugmentation: 'EntityDataAugmentation',
  VCardRender: 'VCardRender',
  PropertiesRender: 'PropertiesRender',
  PrimaryContactRender: 'PrimaryContactRender', //Account Primary Contact
  TabsRender: 'TabsRender',
  ActivityHistoryApi: 'ActivityHistoryApi',
  ActivityDataAugmentation: 'ActivityDataAugmentation',
  ActivityHistoryRender: 'ActivityHistoryRender'
};

//From SmartViews tab click to grid render
export const SmartViewsTabLoadEvents = {
  ActiveTabDataAugmentation: 'ActiveTabDataAugmentation',
  GridGetAPI: 'GridGetApi',
  GridRender: 'GridRender',
  CalendarRender: 'CalendarRender'
};

//From browser page navigation to SmartViews grid render
export const SmartViewsEvents = {
  TabMetaDataApi: 'TabMetaDataApi',
  TabMetaDataFetchAndAugmentation: 'TabMetaDataFetchAndAugmentation',
  TabNavigationPanelRender: 'TabNavigationPanelRender',
  ...SmartViewsTabLoadEvents
};

export const ExperienceType = {
  Load: 'Load',
  SVTabSwitch: 'SVTabSwitch',
  ModuleUsage: 'ModuleUsage'
};

export const SVUsageWorkArea = {
  Refresh: 'Refresh',
  GridSort: 'GridSort',
  GridColumnResize: 'GridColumnResize',
  GridPageSize: 'GridPageSize',
  Search: 'Search',
  RowHeight: 'RowHeight',
  RestoreDefault: 'RestoreDefault',
  TabInfo: 'TabInfo',
  Delete: 'Delete', // Delete and Edit are part of TabInfo.
  Edit: 'Edit' // Delete and Edit are part of TabInfo.
  //+ Add new Tab, Manage Tabs and Header Actions will be logged as action id
};

export const ExperienceModule = {
  LeadDetails: 'LeadDetails',
  AccountDetails: 'AccountDetails',
  OpportunityDetails: 'OpportunityDetails',
  SmartViews: 'SmartViews',
  ManageLeads: 'ManageLeads',
  ManageTask: 'ManageTasks',
  ListDetails: 'ListDetails'
};
