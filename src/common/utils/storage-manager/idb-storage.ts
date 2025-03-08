import { trackError } from 'common/utils/experience/utils/track-error';
import { get, set, clear } from 'idb-keyval';
import { getItem, setItem } from './storage';
import { StorageKey } from './storage.types';

const dbTimeLimit = (msg, timeout): Promise<void> =>
  new Promise((res, rej) =>
    setTimeout(() => {
      rej(new Error(`${msg} :: DB Timed out`));
    }, timeout)
  );

export const setInDB = async <T>(
  key: StorageKey,
  value: T,
  skipLocalStorage?: boolean
): Promise<void | boolean> => {
  try {
    const setData = set(key, value);
    const failover = dbTimeLimit('Set', 150);
    await Promise.race([setData, failover]);
    // self[`IDB_${key}`] = value;

    // Added for backward compatibility... To be removed once migration from localstorage is done.
    if (!skipLocalStorage) {
      setItem(key, value);
    }
    return true;
  } catch (err) {
    trackError(err);
    if (!skipLocalStorage) {
      setItem(key, value);
    }
    return false;
  }
};

// Commented assignment to window to verify performance
/* Note: If we ever need to uncomment window logic, we have to fix following issue: 
   - If we use getFromDB to get any data added to indexeddb, it will fetch it from window object.
   - Any changes done to this object fetched, will change it in window as well because of reference (corruption of data).
   - Later on, if getFromDB is done in another place, it will fetch this corrupted data.
*/
export const getFromDB = async <T>(key: StorageKey): Promise<T | undefined> => {
  try {
    // if (self[`IDB_${key}`]) {
    //   return self[`IDB_${key}`] as T;
    // }
    const getData = get(key) as Promise<T>;

    // Fail and return undefined if indexed DB takes more than 200ms to return data
    const failover = dbTimeLimit('Get', 200);

    const data = (await Promise.race([getData, failover])) as T;
    // if (data) {
    //   self[`IDB_${key}`] = data;
    // }
    return await (data ?? getItem(key) ?? undefined);
  } catch (err) {
    trackError(err);
    return getItem(key) ?? undefined;
  }
};

export const clearDatabase = async (): Promise<void> => {
  try {
    clear();
  } catch (err) {
    trackError(err);
  }
};
