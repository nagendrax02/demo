/* eslint-disable @typescript-eslint/naming-convention */
import { workAreaIds } from 'common/utils/process';
import { FeatureRestrictionConfigMap } from '../entity-details/types/entity-data.types';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';

export const HELP_OPTIONS = [
  {
    value: 'https://help.leadsquared.com/',
    label: 'Contact Support'
  },
  {
    value: 'https://help.leadsquared.com/',
    label: 'Share Feedback'
  },
  {
    value: 'https://help.leadsquared.com/marvin-feature-guide/',
    label: 'Help Center'
  }
];
export const LEAD_REP_NAME = '{{LEAD_REP_NAME}}';

export const QUICK_ADD_OPTIONS = [
  {
    key: '202',
    id: 'AddNewLead',
    title: `Add New ${LEAD_REP_NAME}`,
    toolTip: `${LEAD_REP_NAME}`,
    value: 'lead',
    label: `${LEAD_REP_NAME}`,
    workAreaConfig: { workAreaId: workAreaIds.QUICK.ADD_LEAD }
  },
  {
    key: '204',
    id: 'Activity',
    title: 'Add New Activity',
    toolTip: 'Activity',
    value: 'activity',
    label: 'Activity',
    workAreaConfig: { workAreaId: workAreaIds.QUICK.ADD_ACTIVITY }
  },
  {
    key: '203',
    id: 'CreateTask',
    title: 'Add New Task',
    toolTip: 'Task',
    value: 'task',
    label: 'Task',
    workAreaConfig: { workAreaId: workAreaIds.QUICK.ADD_TASK }
  },
  {
    key: '205',
    id: 'AddOpportunity',
    title: 'Add New Opportunity',
    toolTip: 'Opportunity',
    value: 'opportunity',
    label: 'Opportunity',
    workAreaConfig: { workAreaId: workAreaIds.QUICK.ADD_OPPORTUNITY }
  }
];

export const DEFAULT_LOGO_URL = 'https://marvin.leadsquared.com/content/images/favicon.ico';

export const WORK_AREA = {
  Top: 0,
  Bottom: 1
};

export const HEADER_STYLE = {
  Padding: 8,
  IconGap: 20,
  IconHeight: 32
};

export const menuItemsSortConfig = {
  DASHBOARD: 0,
  SMARTVIEWS: 1,
  'converse-app': 2,
  REPORTS: 3,
  'service-cloud-dashboard': 4,
  'service-cloud': 5,
  'service-cloud-converse-app': 6,
  'service-cloud-reports': 7,
  CUSTOM_MENU: 8,
  'converse-app-menu': 9,
  'telephony-app-menu': 10,
  'carter-app-menu': 11
};

export const APPS_WITHOUT_DISPLAY_CHECK = {
  ['carter-app-menu']: 1
};

export enum HeaderModules {
  SmartViews = 'SMARTVIEWS',
  Dashboard = 'DASHBOARD',
  Calls = 'telephony-app-menu',
  ServiceCloud = 'service-cloud',
  CustomMenu = 'CUSTOM_MENU'
}

export const HEADER_FEATURE_RESTRICTION_MAP: FeatureRestrictionConfigMap = {
  [HeaderModules.SmartViews]: {
    actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].View,
    moduleName: FeatureRestrictionModuleTypes.SmartViews,
    callerSource: CallerSource.MarvinHeader
  },
  [HeaderModules.Dashboard]: {
    actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.Dashboard].View,
    moduleName: FeatureRestrictionModuleTypes.Dashboard,
    callerSource: CallerSource.MarvinHeader
  },
  [HeaderModules.Calls]: {
    actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.Navigation].Calls,
    moduleName: FeatureRestrictionModuleTypes.Navigation,
    callerSource: CallerSource.MarvinHeader
  },
  [HeaderModules.ServiceCloud]: {
    actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ServiceCloud].View,
    moduleName: FeatureRestrictionModuleTypes.ServiceCloud,
    callerSource: CallerSource.MarvinHeader
  },
  [HeaderModules.CustomMenu]: {
    actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.CustomMenus].View,
    moduleName: FeatureRestrictionModuleTypes.CustomMenus,
    callerSource: CallerSource.MarvinHeader
  }
};

export const APP_NAMES = {
  SMARTVIEWS: 'SMARTVIEWS',
  SERVICE_CLOUD: 'service-cloud'
};

export const FEATURE_NAMES = {
  QUICK_ADD: 'QUICK_ADD',
  GLOBAL_SEARCH: 'GLOBAL_SEARCH'
};

export const ORDER_OF_DEFAULT_APPS = { [APP_NAMES.SMARTVIEWS]: 1, [APP_NAMES.SERVICE_CLOUD]: 2 };

export const MODAL_STATE_CHANGED = 'ModalStateChanged';
