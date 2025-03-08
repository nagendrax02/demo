import { APP_ROUTE } from '../../constants';

export const DefaultAppTitles: Record<string, string> = {
  [APP_ROUTE.leadDetails]: 'Lead Details',
  [APP_ROUTE.opportunityDetails]: 'Opportunity Details',
  [APP_ROUTE.accountDetails]: 'Account Details',
  [APP_ROUTE.smartviews]: 'Smartviews',
  [APP_ROUTE.platformLD]: 'Lead Details',
  [APP_ROUTE.platformSV]: 'Smartviews',
  [APP_ROUTE.platformOpportunityDetails]: 'Opportunity Details',
  [APP_ROUTE.accountmanagement]: 'Manage Accounts',
  [APP_ROUTE.dashboard]: 'Dashboard',
  [APP_ROUTE.casa]: 'Casa',
  [APP_ROUTE.settings]: 'Settings',
  [APP_ROUTE.comingSoon]: 'Coming Soon',
  [APP_ROUTE.platformManageTasks]: 'Manage Tasks',
  [APP_ROUTE.platformManageLeads]: 'Manage Leads',
  [APP_ROUTE.platformManageLeadsIndex]: 'Manage Leads',
  [APP_ROUTE.platformDashboard]: 'Dashboard',
  [APP_ROUTE.platformManageLists]: 'Lists',
  [APP_ROUTE.platformManageActivities]: 'Manage Activities',
  [APP_ROUTE.platformManageActivitiesIndex]: 'Manage Activities',
  [APP_ROUTE.listDetails]: 'List Details'
};

export const VISIBLE_TAB_WIDTH = '110px';
export const MORE_TAB_WIDTH = '168px';

export const DEFAULT_MAX_TAB_LIMIT = 5;
export const MAX_TAB_REACHED_MESSAGE =
  'You have reached the maximum tab limit of {{max tab limit}}. The {{old tab}} tab has been closed to accommodate the new tab.';
