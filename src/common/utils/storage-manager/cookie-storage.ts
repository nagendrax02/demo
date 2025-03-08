import { trackError } from 'common/utils/experience/utils/track-error';
import { CookieStorageKey } from './storage.types';

const getRootDomain = (): string => {
  const domainParts = self.location.hostname?.split('.');
  const rootDomain = domainParts?.slice(-2)?.join('.');
  return `.${rootDomain}`;
};

const getExpiryTimeInUtc = (expiresInMilliSeconds: number): string => {
  const date = new Date(expiresInMilliSeconds);
  const utcDateString = date.toUTCString();
  return utcDateString;
};

const setCookie = (
  key: CookieStorageKey,
  value: string,
  expiryTimeInMilliSeconds: number
): boolean => {
  try {
    const cookie = `${key}=${value}; expires=${getExpiryTimeInUtc(
      expiryTimeInMilliSeconds
    )}; path=/; domain=${getRootDomain()};`;
    document.cookie = cookie;
    return true;
  } catch (error) {
    trackError(error);
  }
  return false;
};

const getCookie = (key: CookieStorageKey): string | null => {
  try {
    const cookies = document.cookie.split('; ');
    let result: string | null = null;

    cookies.some((cookie) => {
      const [cookieKey, ...cookieValue] = cookie.split('=');
      const value = cookieValue.join('=');
      if (cookieKey === key) {
        result = value;
        return true;
      }
      return false;
    });

    return result;
  } catch (error) {
    trackError(error);
  }
  return null;
};

const removeCookie = (key: CookieStorageKey): boolean => {
  try {
    const cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=${getRootDomain()};`;
    document.cookie = cookie;
    return true;
  } catch (error) {
    trackError(error);
  }
  return false;
};

export { setCookie, getCookie, removeCookie };
