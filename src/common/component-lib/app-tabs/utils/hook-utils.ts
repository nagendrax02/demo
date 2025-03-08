import { ITabConfig, TabIconType, TabType } from '../app-tabs.types';
import { DEFAULT_MAX_TAB_LIMIT, DefaultAppTitles } from '../constants';
import { APP_ROUTE, ENV_CONFIG } from '../../../constants';
import { getEnvConfig } from '../../../utils/helpers';

const entityDetailsIconMap: Record<string, TabIconType> = {
  [APP_ROUTE.leadDetails]: TabIconType.Lead,
  [APP_ROUTE.platformLD]: TabIconType.Lead,
  [APP_ROUTE.opportunityDetails]: TabIconType.Opportunity,
  [APP_ROUTE.platformOpportunityDetails]: TabIconType.Opportunity,
  [APP_ROUTE.accountDetails]: TabIconType.Account,
  [APP_ROUTE.accountmanagement]: TabIconType.Account
};

const isPlatformAccountDetailsPage = (pathName: string): boolean => {
  return pathName?.startsWith?.('/accountmanagement');
};

export const getActiveTabType = (pathName: string): TabType => {
  if (isPlatformAccountDetailsPage(pathName)) {
    return TabType.Secondary;
  }
  const secondaryTabs = [
    APP_ROUTE.leadDetails,
    APP_ROUTE.opportunityDetails,
    APP_ROUTE.accountDetails,
    APP_ROUTE.platformLD,
    APP_ROUTE.platformOpportunityDetails
  ];
  return secondaryTabs.includes(pathName) ? TabType.Secondary : TabType.Primary;
};

export const getActiveAppTabId = (): string => {
  return `${window.location.pathname}${window.location.search}`.toLowerCase();
};

export const getActiveTabTitle = (pathName: string, tabCount: number): string => {
  if (isPlatformAccountDetailsPage(pathName)) {
    return DefaultAppTitles[APP_ROUTE.accountDetails];
  }
  return DefaultAppTitles?.[pathName] || `New Tab - ${tabCount}`;
};

export const getActiveTabIconType = (pathName: string): TabIconType => {
  if (isPlatformAccountDetailsPage(pathName)) {
    return entityDetailsIconMap[APP_ROUTE.accountmanagement];
  }
  return entityDetailsIconMap?.[pathName] || TabIconType.Custom;
};

export const createNewAppTabConfig = (pathName: string, tabCount: number): ITabConfig => {
  return {
    id: getActiveAppTabId(),
    type: getActiveTabType(pathName),
    title: getActiveTabTitle(pathName, tabCount),
    url: window.location.href,
    isActiveTab: true,
    iconType: getActiveTabIconType(pathName)
  };
};

export const isValidPath = (pathName: string): boolean => {
  if (isPlatformAccountDetailsPage(pathName)) {
    return true;
  }
  const { default: defaultRoute, ...APP_ROUTE_NEW } = APP_ROUTE;
  return Object.values(APP_ROUTE_NEW).includes(pathName);
};

export const getMaxTabLimit = (): number => {
  const maxTabLimit = getEnvConfig(ENV_CONFIG.appTabsMaxLimit) as unknown as number;
  return maxTabLimit ?? DEFAULT_MAX_TAB_LIMIT;
};
