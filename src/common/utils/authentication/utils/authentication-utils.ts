import { trackError } from 'common/utils/experience/utils/track-error';
import { IAuthenticationConfig } from 'common/types';
import { StorageKey, setItem, getItem } from 'common/utils/storage-manager';
import { AuthConfig, DEFAULT_FAVICON_URL } from '../constant';
import { AuthKey, IAuthDetails } from '../authentication.types';
import { getMiPPreReqData } from 'common/utils/helpers/helpers';
import { ExternalAppStorageKey } from 'common/utils/storage-manager';
import { getContext } from 'common/utils/experience/utils/log-experience';

const persistAuthConfig = (authConfig: IAuthenticationConfig): void => {
  try {
    setItem(StorageKey.Auth, authConfig);
  } catch (error: unknown) {
    trackError(error);
  }
};

const getUrlParams = (
  urlParams: URLSearchParams,
  authKey: AuthKey,
  authConfigKey: string
): string => {
  try {
    return (urlParams.get(authKey) || urlParams.get(authConfigKey) || '') as string;
  } catch (error) {
    trackError(error);
  }
  return '';
};

const getAuthDetails = (authConfig?: IAuthenticationConfig): IAuthDetails | null => {
  try {
    const mipAuthData = getMiPPreReqData();
    if (mipAuthData) {
      return {
        userId: mipAuthData[AuthKey.UserId],
        orgCode: mipAuthData[AuthKey.OrgCode],
        sessionId: mipAuthData[AuthKey.SessionId]
      };
    }
    const urlParams = new URLSearchParams(window?.location?.search);
    return {
      userId: authConfig?.User?.Id || getUrlParams(urlParams, AuthKey.UserId, AuthConfig.UserId),
      orgCode:
        authConfig?.User?.OrgCode || getUrlParams(urlParams, AuthKey.OrgCode, AuthConfig.OrgCode),
      sessionId:
        authConfig?.SessionId || getUrlParams(urlParams, AuthKey.SessionId, AuthConfig.SessionId)
    };
  } catch (error) {
    trackError(error);
  }
  return null;
};

const getAuthTokenKey = (authConfig: IAuthenticationConfig): string => {
  return `${authConfig?.User?.Id}-${authConfig?.User?.OrgCode}${ExternalAppStorageKey.AuthToken}`;
};

const populateExternalAppRequirements = (authConfig: IAuthenticationConfig): void => {
  //@ts-ignore: for External App
  setItem(getAuthTokenKey(authConfig), `"${authConfig?.Tokens?.Token}"`);
  //@ts-ignore: for External App
  setItem(ExternalAppStorageKey.UserAuthDetails, getAuthDetails(authConfig));
};

const getPersistedAuthConfig = (): IAuthenticationConfig | null => {
  try {
    return getItem(StorageKey.Auth) as IAuthenticationConfig;
  } catch (error: unknown) {
    trackError(error);
  }
  return null;
};

const persistAuthToken = (authConfig: IAuthenticationConfig): boolean => {
  try {
    const persistedData = getPersistedAuthConfig() || ({} as IAuthenticationConfig);
    persistedData.Tokens = authConfig.Tokens;
    persistAuthConfig(persistedData);
    populateExternalAppRequirements(persistedData);
  } catch (error: unknown) {
    trackError(error);
  }
  return false;
};

export const isTokenExpired = (tokenExpirationDateInUTC: string): boolean => {
  try {
    if (!tokenExpirationDateInUTC) return true;

    const expirationDateInMilliSeconds = new Date(tokenExpirationDateInUTC)?.getTime();
    const currentTimeInMilliSeconds = new Date()?.getTime();
    return currentTimeInMilliSeconds > expirationDateInMilliSeconds;
  } catch (error) {
    trackError(error);
  }
  return true;
};

const validateUserDetails = (): boolean => {
  const persistedAuthData = getItem(StorageKey.UserAuthDetails) as IAuthDetails;
  const currentAuthData = getAuthDetails();
  return (
    persistedAuthData?.userId !== currentAuthData?.userId ||
    persistedAuthData?.orgCode !== currentAuthData?.orgCode ||
    persistedAuthData?.sessionId !== currentAuthData?.sessionId
  );
};

const initiateClarity = (authConfig: IAuthenticationConfig | null): void => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const clarity = (window as any)?.clarity;

    if (typeof clarity === 'function') {
      clarity('set', 'userId', authConfig?.User?.Id);
      clarity('set', 'sessionId', authConfig?.SessionId);
      clarity('set', 'regionId', authConfig?.Tenant?.RegionId);
      clarity('set', 'orgCode', authConfig?.User?.OrgCode);
      clarity('set', 'embeddedContext', getContext());
      clarity('set', 'userEmail', authConfig?.User?.EmailAddress);
      clarity('set', 'orgName', authConfig?.Tenant?.DisplayName);
    }
  } catch (error) {
    trackError(error);
  }
};

const initiateNewRelic = (authConfig: IAuthenticationConfig | null): void => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newRelic =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (window as any).newrelic === 'object' ? (window as any).newrelic : undefined;

    if (newRelic) {
      newRelic?.setCustomAttribute('userId', authConfig?.User?.Id);
      newRelic?.setCustomAttribute('orgCode', authConfig?.User?.OrgCode);
      newRelic?.setCustomAttribute('regionId', authConfig?.Tenant?.RegionId);
      newRelic?.setCustomAttribute('userRole', authConfig?.User?.Role);
      newRelic?.setCustomAttribute('userSessionId', authConfig?.SessionId);
      newRelic?.setCustomAttribute('embeddedContext', getContext());
      newRelic?.setCustomAttribute('userEmail', authConfig?.User?.EmailAddress);
      newRelic?.setCustomAttribute('orgName', authConfig?.Tenant?.DisplayName);
      newRelic?.setCustomAttribute('appInstanceName', 'next-gen-app');
    }
  } catch (error) {
    trackError(error);
  }
};

const initializeThirdPartyScript = (): void => {
  try {
    const authConfig = getPersistedAuthConfig();
    initiateNewRelic(authConfig);
    initiateClarity(authConfig);
  } catch (error) {
    trackError(error);
  }
};

const addFaviconUrlFromLaunchConfig = (): void => {
  try {
    const { LaunchConfig } = (getItem(StorageKey.Auth) as IAuthenticationConfig) || {};
    const url = LaunchConfig?.FavIconURL || DEFAULT_FAVICON_URL;
    const faviconEle = document.getElementById('favicon') as HTMLLinkElement;
    if (faviconEle && url) {
      faviconEle.href = url;
    }
  } catch (error) {
    trackError(error);
  }
};

export {
  persistAuthConfig,
  getPersistedAuthConfig,
  persistAuthToken,
  getAuthDetails,
  validateUserDetails,
  getAuthTokenKey,
  populateExternalAppRequirements,
  initializeThirdPartyScript,
  addFaviconUrlFromLaunchConfig
};
