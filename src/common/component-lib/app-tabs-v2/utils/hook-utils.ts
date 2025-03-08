import { ITabConfig, TabIconType } from '../app-tabs.types';
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
  const validPaths = [
    APP_ROUTE.accountDetails,
    APP_ROUTE.leadDetails,
    APP_ROUTE.opportunityDetails,
    APP_ROUTE.platformLD,
    APP_ROUTE.platformOpportunityDetails
  ];
  return validPaths.includes(pathName);
};

export const getMaxTabLimit = (): number => {
  const maxTabLimit = getEnvConfig(ENV_CONFIG.appTabsMaxLimit) as unknown as number;
  return maxTabLimit ?? DEFAULT_MAX_TAB_LIMIT;
};
