import { trackError } from 'common/utils/experience/utils/track-error';
import { isMiP, safeParseJson } from '../helpers';
import { removeCookie } from './cookie-storage';
import { clearDatabase } from './idb-storage';
import {
  CookieStorageKey,
  ExternalAppStorageKey,
  InMemoryStorageKey,
  StorageKey
} from './storage.types';

export const convertToStorableData = <T>(value: T): string => {
  return typeof value === 'string' ? value : JSON.stringify(value);
};

const getInMemoryStoredValue = (key: string): string => {
  return self?.[`MX${key}`] as string;
};

export const getInMemoryCache = <T>(key: InMemoryStorageKey | StorageKey): T | null => {
  try {
    const data = getInMemoryStoredValue(key);
    const parsedData = safeParseJson(data) as T;
    return parsedData === null ? (data as T) : parsedData;
  } catch (error) {
    trackError(error);
  }
  return null;
};

export const setInMemoryCache = <T>(key: InMemoryStorageKey | StorageKey, value: T): boolean => {
  try {
    self[`MX${key}`] = convertToStorableData(value);
    return true;
  } catch (ex) {
    trackError(ex);
  }

  return false;
};

export const setItem = <T>(key: StorageKey, value: T): boolean => {
  try {
    //handled the string type if we stringify the string again it will add extra quote '"String"'
    localStorage.setItem(key, convertToStorableData(value));
    return true;
  } catch (ex) {
    trackError(ex);
    return setInMemoryCache(key, value);
  }
};

export const getItem = <T>(key: StorageKey): T | null => {
  try {
    const data = (localStorage.getItem(key) || getInMemoryStoredValue(key)) as string;
    const parsedData = safeParseJson(data) as T;
    const returnValue = parsedData === null ? (data as T) : parsedData;

    return returnValue;
  } catch (ex) {
    trackError(ex);
  }

  return null;
};

export const removeItem = (key: StorageKey): boolean => {
  localStorage.removeItem(key);
  return true;
};

export const clearExternalAppKeys = (): void => {
  for (const key in localStorage) {
    Object.values(ExternalAppStorageKey)?.map((storageKey) => {
      if (key?.includes(storageKey)) localStorage?.removeItem(key);
    });
  }
};

export const clearMiPKeys = (): void => {
  Object.values(StorageKey)?.map((key) => {
    localStorage?.removeItem(key);
  });
  clearExternalAppKeys();
};

export const clearCookies = (): void => {
  Object.values(CookieStorageKey)?.map((key) => {
    removeCookie(key);
  });
};

export const clearStorage = (): boolean => {
  try {
    if (isMiP()) {
      clearMiPKeys();
    } else {
      localStorage.clear();
      clearCookies();
    }
    // Clear Indexed DB
    clearDatabase();
    return true;
  } catch (error) {
    trackError(error);
  }

  return false;
};
