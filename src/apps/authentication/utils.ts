import { trackError } from 'common/utils/experience/utils/track-error';
import { IAuthenticationStatus } from 'common/utils/authentication/authentication.types';
import { populateAuthConfig } from 'common/utils/authentication/authentication';
import {
  APPS_TO_ADD_TO_MODULE_CONFIG,
  APP_IN_HEADER_CATEGORY,
  AuthRoutes,
  AUTHENTICATION,
  SWLITE_REDIRECTION
} from './constant';
import {
  IAuthenticationConfig,
  IModuleConfig,
  ITenant,
  IToken,
  IUser
} from 'common/types/authentication.types';
import { setSessionURL } from 'common/utils/authentication/utils/region-redirection-helpers';
import { getApiUrl, isMiP } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';
import { initializeThirdPartyScript } from 'common/utils/authentication/utils/authentication-utils';
import { setInDB, StorageKey } from 'common/utils/storage-manager';
import { getUserSelectedTheme } from 'common/utils/helpers/personalization';
import { AvailableTheme, addPrimaryColorConfig } from '@lsq/nextgen-preact/v2/stylesmanager';
import { IThemeConfig } from '@lsq/nextgen-preact/v2/stylesmanager/theme.types';
import { onThemeUpdateCallback } from 'common/utils/helpers/helpers';

const onPageRedirection = (event: MessageEvent): void => {
  const redirectionUrl = event?.data?.payload?.redirectionUrl as string;

  if (redirectionUrl) {
    const url = new URL(redirectionUrl);
    url.searchParams.set(SWLITE_REDIRECTION, '1');
    window.location.replace(url);
  }
};

const normalizeModuleConfig = (moduleConfig: IModuleConfig[]): Record<string, IModuleConfig> => {
  return moduleConfig?.reduce((acc: Record<string, IModuleConfig>, appConfig) => {
    if (
      appConfig &&
      (appConfig.Category === APP_IN_HEADER_CATEGORY ||
        APPS_TO_ADD_TO_MODULE_CONFIG[appConfig?.Name])
    ) {
      acc[appConfig.Name] = appConfig;
    }
    return acc;
  }, {});
};

const getToken = (tokenConfig: IToken): IToken => {
  return {
    PermissionsToken: tokenConfig.PermissionsToken,
    RefreshToken: tokenConfig.RefreshToken,
    Token: tokenConfig.Token,
    TokenExpirationTime: tokenConfig.TokenExpirationTime
  };
};

const getUserDetails = (userConfig: IUser): IUser => {
  return {
    DateFormat: userConfig.DateFormat,
    Id: userConfig.Id,
    OrgCode: userConfig.OrgCode,
    TimeZone: userConfig.TimeZone,
    TimeZoneOffset: userConfig.TimeZoneOffset,
    AssociatedPhoneNumbers: userConfig.AssociatedPhoneNumbers,
    Role: userConfig.Role,
    CreatedOn: userConfig.CreatedOn,
    EmailAddress: userConfig.EmailAddress,
    IsDefaultOwner: userConfig.IsDefaultOwner,
    FullName: userConfig.FullName,
    ProfilePhoto: userConfig?.ProfilePhoto,
    AutoCheckOutOnSignOut: userConfig?.AutoCheckOutOnSignOut,
    AvailabilityStatus: userConfig?.AvailabilityStatus,
    IsCheckInCheckOutEnabled: userConfig?.IsCheckInCheckOutEnabled,
    MandateWebUserCheckIn: userConfig?.MandateWebUserCheckIn,
    FirstName: userConfig?.FirstName,
    LastName: userConfig?.LastName
  };
};

const getTenantDetails = (tenantConfig: ITenant): ITenant => {
  return {
    RegionId: tenantConfig.RegionId,
    DefinedWeek: tenantConfig.DefinedWeek,
    DisplayName: tenantConfig.DisplayName,
    AccountTimeZone: tenantConfig.AccountTimeZone,
    AccountPhoneNumberFormat: tenantConfig.AccountPhoneNumberFormat,
    BusinessType: tenantConfig.BusinessType,
    ClusterID: tenantConfig.ClusterID,
    CreatedOn: tenantConfig.CreatedOn,
    CustomerType: tenantConfig.CustomerType,
    Industry: tenantConfig.Industry,
    Plan: tenantConfig.Plan,
    RenewalDate: tenantConfig.RenewalDate,
    SubIndustry: tenantConfig.SubIndustry,
    DefaultCountryCode: tenantConfig.DefaultCountryCode,
    CICOStatusConfiguration: tenantConfig?.CICOStatusConfiguration,
    IdleTimeout: tenantConfig?.IdleTimeout
  };
};

const getNormalizedAuthConfig = (authConfig: IAuthenticationConfig): IAuthenticationConfig => {
  return {
    Tokens: getToken({ ...authConfig.Tokens }),
    Tenant: getTenantDetails({ ...authConfig.Tenant }),
    User: getUserDetails({ ...authConfig.User }),
    ModulesConfig: normalizeModuleConfig([
      ...((authConfig.ModulesConfig as unknown as IModuleConfig[]) || [])
    ]),
    LaunchConfig: authConfig?.LaunchConfig
  };
};

interface IOnLoginSuccess {
  event: MessageEvent;
  setAuthStatus: (data: IAuthenticationStatus) => void;
  setTheme: (
    themeName: AvailableTheme,
    primaryColorConfig: IThemeConfig,
    onThemeUpdate?: (selectedThemeConfig: { [x: string]: string | boolean }) => void
  ) => void;
}

const onLoginSuccess = async ({
  event,
  setAuthStatus,
  setTheme
}: IOnLoginSuccess): Promise<void> => {
  const receivedAuthConfig = event?.data?.payload?.response as IAuthenticationConfig;
  const authConfig = getNormalizedAuthConfig({ ...receivedAuthConfig });
  setSessionURL(authConfig.Tokens?.TokenExpirationTime);
  populateAuthConfig(authConfig);
  await setInDB(StorageKey.PostLoginConfig, {
    Tenant: receivedAuthConfig.Tenant,
    Tokens: receivedAuthConfig.Tokens,
    User: receivedAuthConfig.User,
    ModulesConfig: receivedAuthConfig.ModulesConfig,
    SessionId: receivedAuthConfig.SessionId
  });

  if (event?.data?.payload?.redirectionUrl) {
    onPageRedirection(event);
  }
  initializeThirdPartyScript();
  setAuthStatus({ isLoading: false, isSuccess: true });
  if (!isMiP()) {
    const selectedTheme = await getUserSelectedTheme();
    setTheme(
      selectedTheme,
      addPrimaryColorConfig({ ...authConfig?.LaunchConfig }),
      onThemeUpdateCallback
    );
  }
};

const cleanAndUpdateUrl = (url: URL): void => {
  //Don't add utility params to parent window
  url.searchParams.delete('isSWLite');
  url.searchParams.delete('lsqMarvinToken');
  url.searchParams.delete('isMarvin');
  url.searchParams.delete('swTimestamp');
  url.searchParams.delete('feature');
  url.searchParams.delete(SWLITE_REDIRECTION);
  url.searchParams.delete('returnUrl');
  window.history.pushState({}, '', url?.toString());
};

const getAuthRenderUrl = (): string => {
  const source = new URL(self?.location?.href);

  //Delete SWLiteRedirection  from query params
  cleanAndUpdateUrl(source);
  const returnUrl = source.pathname.concat(source.search);
  const target = new URL(
    `${
      getApiUrl(ENV_CONFIG.marvinAppDomain) as string
    }/?isSWLite=true&swTimestamp=${Date.now()}&feature=${AUTHENTICATION}&returnUrl=${returnUrl}`
  );

  //Copy the path to support Auth MFE routing
  if (AuthRoutes?.includes(source.pathname.replace(/\/$/, ''))) target.pathname = source?.pathname;

  const sourceParams = new URLSearchParams(source?.search);
  const targetParams = new URLSearchParams(target?.search);

  // Copy the search params to help region redirection
  sourceParams.forEach((value, key) => {
    targetParams.set(key, value);
  });

  target.search = targetParams?.toString();

  return target?.toString();
};

const updateWindowHistory = (event: MessageEvent): void => {
  try {
    if (!event?.data?.payload?.historyConfig) return;
    const { pathName, search } = event.data.payload.historyConfig as {
      pathName: string;
      search?: string;
    };
    const parentUrl = new URL(self?.location?.href);
    if (search) {
      const queryParams = new URLSearchParams(search);
      parentUrl.search = `?${queryParams?.toString()}`;
    }
    if (pathName) {
      parentUrl.pathname = pathName;
    }

    cleanAndUpdateUrl(parentUrl);
  } catch (error) {
    trackError(error);
  }
};
export { onLoginSuccess, onPageRedirection, getAuthRenderUrl, updateWindowHistory };
