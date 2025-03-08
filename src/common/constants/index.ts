import { IEntityIds, IEntityRepNames } from 'apps/entity-details/types/entity-store.types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { EntityType } from '../types';

export const APP_ROUTE = {
  sandbox: '/sandbox',
  leadDetails: '/leaddetails',
  search: '/search',
  platformLD: '/leadmanagement/leaddetails',
  platformSV: '/leadmanagement/smartviews',
  mipPerfDebug: '/mip/index',
  opportunityDetails: '/opportunitydetails',
  platformOpportunityDetails: '/opportunitymanagement/opportunitydetails',
  smartviews: '/smartviews',
  accountDetails: '/accountdetails',
  accountmanagement: '/accountmanagement',
  default: '/',
  dashboard: '/dashboard',
  casa: '/casa',
  settings: '/settings',
  externalApp: '/externalapp',
  comingSoon: '/comingsoon',
  platformManageTasks: '/tasks/alltasks',
  platformManageLeads: '/leadmanagement',
  platformManageLeadsIndex: '/leadmanagement/index',
  platformDashboard: '/dashboard/index',
  platformManageLists: '/managelists',
  platformManageListsIndex: '/managelists/index',
  platformManageActivities: '/activitymanagement',
  platformManageActivitiesIndex: '/activitymanagement/index',
  listDetails: '/listdetails'
};

export const DYNAMIC_DIMENSIONS_ROUTES = [
  APP_ROUTE.platformSV,
  APP_ROUTE.smartviews,
  APP_ROUTE.platformManageTasks,
  APP_ROUTE.platformManageLeads,
  APP_ROUTE.platformManageLeadsIndex,
  APP_ROUTE.platformManageLists,
  APP_ROUTE.platformManageListsIndex,
  APP_ROUTE.listDetails,
  APP_ROUTE.platformManageActivities
];

export const ENV_CONFIG = {
  envKey: '___env_var___',
  authAPIBaseURL: 'AUTH_API_BASE_URL',
  apiURL: 'API_URL',
  logger: 'LOGGER',
  externalApp: 'EXTERNAL_APP',
  formsApiURL: 'FORMS_API_URL',
  formsRenderURL: 'FORMS_RENDER_URL',
  formsCloneRenderURL: 'FORMS_CLONE_RENDER_URL',
  smartviewsRenderURL: 'SMARTVIEWS_RENDER_URL',
  dashboardRenderUrl: 'DASHBOARD_RENDER_URL',
  appDomain: 'APP_DOMAIN',
  marvinAppDomain: 'MARVIN_APP_DOMAIN',
  appVersion: 'APP_VERSION',
  googleMapApiKey: 'GOOGLE_MAP_API_KEY',
  swliteUrl: 'SWLITE_URL',
  disableRegionRedirection: 'DISABLE_REGION_REDIRECTION',
  casaWeb: 'CASA_WEB',
  platformBaseURL: 'PLATFORM_APP_BASE_URL',
  appTabsMaxLimit: 'APP_TABS_MAX_LIMIT'
};

export const ERROR_MSG = {
  failedToGetEnvValue: 'Failed to get ENV value',
  invalidEntityId: 'Invalid Entity Id'
};

export { API_ROUTES } from './api-routes';

export const tabletWindowWidth = 1024;

export const PROMISE_FULFILLED = 'fulfilled';
export const WORD_LIMIT = 150;

export const CHANGE_STAGE = 'ChangeStage';
export const CHANGE_OWNER = 'ChangeOwner';
export const CHANGE_STATUS_STAGE = 'Change_Status_Stage';

export const PREVIEW_NOT_AVAILABLE = {
  value: 'PREVIEW_NOT_AVAILABLE',
  label: 'Preview not available'
};

export const NOT_UPLOADED = 'Not Uploaded';

export const VIEW_FILES = 'View files';

export const MASKED_TEXT = 'xxxxx';

export const EXCEPTION_MESSAGE =
  'There was an error processing the request. Please contact administrator';

export const CHAR_WORD_LIMIT = 150;

export const NO_NAME = '[No Name]';

export const HYPHEN = '-';

export const OPPORTUNITY_ENTITY_CODE = 12000;

export const TOOLTIP_CHAR_LIMIT = 25;

export const TOOLTIP_CHAR_LIMIT_TEXTAREA = 30;

export const APP_VISIBILITY_CHANGED = 'app-visibility-changed';

export const FIELD_SEPARATOR = '_x007E_';

export const DEFAULT_ENTITY_IDS: IEntityIds = {
  [EntityType.Lead]: '',
  [EntityType.Opportunity]: '',
  [EntityType.Account]: '',
  [EntityType.Task]: '',
  [EntityType.Activity]: '',
  [EntityType.AccountActivity]: '',
  [EntityType.Lists]: '',
  [EntityType.Ticket]: ''
};

export const DEFAULT_ENTITY_REP_NAMES: IEntityRepNames = {
  [EntityType.Lead]: { SingularName: 'Lead', PluralName: 'Leads' },
  [EntityType.Opportunity]: { SingularName: 'Opportunity', PluralName: 'Opportunities' },
  [EntityType.Account]: { SingularName: 'Account', PluralName: 'Accounts' },
  [EntityType.Activity]: { SingularName: 'Activity', PluralName: 'Activities' },
  [EntityType.Task]: { SingularName: 'Task', PluralName: 'Tasks' },
  [EntityType.AccountActivity]: { SingularName: 'Activity', PluralName: 'Activities' },
  [EntityType.Lists]: { SingularName: 'List', PluralName: 'Lists' },
  [EntityType.Ticket]: { SingularName: 'Ticket', PluralName: 'Tickets' }
};

export const MOCK_ENTITY_DETAILS_CORE_DATA: IEntityDetailsCoreData = {
  entityDetailsType: EntityType.Lead,
  entityIds: { ...DEFAULT_ENTITY_IDS, lead: 'testId' },
  entityRepNames: DEFAULT_ENTITY_REP_NAMES
};

export const MOCK_ENTITY_DETAILS_CORE_DATA_FOR_QUICK_ADD: IEntityDetailsCoreData = {
  entityDetailsType: EntityType.Lead,
  entityIds: { ...DEFAULT_ENTITY_IDS, lead: '' },
  entityRepNames: DEFAULT_ENTITY_REP_NAMES
};

export const LEAD_TYPE_ADDITIONAL_DATA_SEP = 'MXLTDATASEPARATOR';

export const FAILED_TO_FETCH = 'Failed to fetch';

export const EXTERNAL_APP_GLOBAL_OBJ_KEY =
  '___lsq-marvin-external-app-nav-menu-{{name}}-handler___';

export const EXTERNAL_APP_GLOBAL_PROMISE_KEY =
  '___lsq-marvin-external-app-promise-{{name}}-handler___';

export const EXTERNAL_APP_VISIBILITY_CHECK_KEY =
  '___lsq-marvin-external-app-visibility-check-{{name}}-handler___';

export const APP_INTEGRATOR_URL =
  'https://assets.marvin.marketxpander.net/js/lsqmarvinappintegrator.js';

export enum ExceptionType {
  MXWildcardAPIRateLimitExceededException = 'MXWildcardAPIRateLimitExceededException',
  MXActivityAggregateException = 'MXActivityAggregateException',
  MXInvalidOperationException = 'MXInvalidOperationException'
}

export const ENTITY_STORE_RESET_KEY = 'isStoreResetNeeded';
export const APP_SOURCE = 'NextGen';
