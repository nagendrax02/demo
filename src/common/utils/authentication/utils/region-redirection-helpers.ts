import { ENV_CONFIG } from 'common/constants';
import { getApiUrl, getEnvConfig, isMiP } from 'common/utils/helpers';
import { CookieStorageKey, getCookie, setCookie } from 'common/utils/storage-manager';
import { SWLITE_REDIRECTION } from 'apps/authentication/constant';

const isOriginUrlDifferent = (sessionUrl?: string): boolean => {
  return sessionUrl ? sessionUrl !== window.location.origin : false;
};

const disableRegionRedirection = (): boolean => {
  return !!getEnvConfig(ENV_CONFIG.disableRegionRedirection);
};

export const redirectToActiveSessionUrl = (): void => {
  if (isMiP()) return;

  const cachedSessionUrl = getCookie(CookieStorageKey.SessionUrl);

  if (!cachedSessionUrl || disableRegionRedirection()) return;

  if (isOriginUrlDifferent(cachedSessionUrl)) {
    const url = new URL(cachedSessionUrl);
    url.pathname = window.location.pathname;
    url.search = window.location.search;

    window.location.replace(url.toString());
  }
};

export const setSessionURL = (expiryTime: string): boolean => {
  if (isMiP()) return false;

  const date = new Date(expiryTime || Date.now());
  date.setDate(date.getDate() + 1);
  const expiryTimeInMS = date.getTime();
  return setCookie(CookieStorageKey.SessionUrl, getApiUrl(ENV_CONFIG?.appDomain), expiryTimeInMS);
};

const getDefaultRegionUrl = (): string => {
  return getEnvConfig(ENV_CONFIG.swliteUrl)['1'] as string;
};

const isRedirectedUrl = (): boolean => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get(SWLITE_REDIRECTION) === '1';
};
export const redirectToDefaultRegionUrl = (canPersistPathAndSearch = true): boolean => {
  try {
    const defaultRegionUrl = getDefaultRegionUrl();
    if (isMiP() || disableRegionRedirection() || isRedirectedUrl()) return false;

    if (isOriginUrlDifferent(defaultRegionUrl)) {
      //Copy path name and search for region redirection
      const url = new URL(defaultRegionUrl);
      if (canPersistPathAndSearch) {
        url.pathname = self.location.pathname;
        url.search = self.location.search;
      }
      window.location.replace(url.toString());
      return true;
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};
