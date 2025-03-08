import { trackError } from 'common/utils/experience/utils/track-error';
import { safeParseJson } from '../helpers';
import { convertToStorableData } from './storage';
import { StorageKey } from './storage.types';

export const setInSessionStorage = <T>(key: StorageKey, value: T): boolean => {
  try {
    sessionStorage.setItem(key, convertToStorableData(value));
    return true;
  } catch (ex) {
    trackError(ex);
    return false;
  }
};

export const getFromSessionStorage = <T>(key: StorageKey): T | null => {
  try {
    const data = sessionStorage.getItem(key) as string;
    const parsedData = safeParseJson(data) as T;
    return parsedData ?? (data as T);
  } catch (ex) {
    trackError(ex);
  }

  return null;
};
