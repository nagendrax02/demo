import { trackError } from 'common/utils/experience/utils/track-error';
import {
  getAccountTypeName,
  getMiPPreReqData,
  getOpportunityTypeName
} from 'common/utils/helpers/helpers';
import { ActionId, IMiPHeader, Module } from './mip-header.types';
import { AuthKey } from 'common/utils/authentication/authentication.types';
import { CallerSource, httpGet, Module as RestClientModule } from 'common/utils/rest-client';
import { API_ROUTES, APP_ROUTE } from 'common/constants';
import { IHeader } from 'apps/mip-menu/header.types';
import { OldMenuData } from './old-menu-dummy-data';

export const canHideSwitchBack = (): string => {
  try {
    const config = getMiPPreReqData();
    if (config) {
      return config?.[AuthKey.HideSwitchBack] || '';
    }
  } catch (error) {
    trackError(error);
  }
  return '';
};

export const canHideBack = (
  module: Module,
  action: IMiPHeader,
  appTabsEnabled?: boolean
): boolean => {
  if (action.id === ActionId.Back) {
    const backActionDisabledModules = [Module.SmartViews, Module.ManageTasks, Module.ManageLeads];
    if (appTabsEnabled) {
      return [
        ...backActionDisabledModules,
        Module.LeadDetails,
        Module.AccountDetails,
        Module.OpportunityDetails
      ].includes(module);
    }
    return backActionDisabledModules.includes(module);
  }
  return action.canHide ?? false;
};

const getRedirectionURL = (module: string): string | null => {
  const redirectionId = getMiPPreReqData()?.[AuthKey.RedirectionId];
  try {
    if (module === Module.LeadDetails) {
      return `../LeadManagement/ReturnFromLeadDetails?id=${redirectionId}`;
    } else if (module === Module.AccountDetails) {
      return `../${getAccountTypeName()}`;
    } else if (module === Module.OpportunityDetails) {
      return `../${getOpportunityTypeName()}`;
    }
  } catch (error) {
    trackError(error);
  }
  return null;
};

export const goBack = (module: Module): void => {
  const redirectionUrl = getRedirectionURL(module);
  if (redirectionUrl) self.location.href = redirectionUrl;
};

export const getInvokerModule = (module: string): CallerSource => {
  if (module === Module.LeadDetails) {
    return CallerSource.LeadDetails;
  }
  return CallerSource.NA;
};

export const isDashboardPage = (): boolean => {
  return [APP_ROUTE.dashboard, APP_ROUTE.platformDashboard].includes(
    window.location.pathname?.toLowerCase()
  );
};

export async function getHeaderData(): Promise<IHeader[]> {
  try {
    const response = (await httpGet({
      path: `${API_ROUTES.NavigationGet}?donotUseCache=true`,
      module: RestClientModule.Marvin,
      callerSource: CallerSource.TopNavigation
    })) as IHeader[];
    console.log('response', response);
    return OldMenuData as unknown as IHeader[];
  } catch (error) {
    trackError(error);
    return [];
  }
}
