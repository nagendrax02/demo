import {
  setItem,
  getItem,
  removeItem,
  clearStorage,
  getInMemoryCache,
  setInMemoryCache,
  clearExternalAppKeys
} from './storage';

import { getFromDB, setInDB, clearDatabase } from './idb-storage';
import { getCookie, removeCookie, setCookie } from './cookie-storage';
import {
  StorageKey,
  ExternalAppStorageKey,
  InMemoryStorageKey,
  CookieStorageKey,
  UserPersonalisationKeys
} from './storage.types';

export {
  StorageKey,
  ExternalAppStorageKey,
  InMemoryStorageKey,
  CookieStorageKey,
  UserPersonalisationKeys
};

export {
  setItem,
  getItem,
  removeItem,
  clearStorage,
  getInMemoryCache,
  setInMemoryCache,
  clearExternalAppKeys
};
export { getCookie, removeCookie, setCookie };
export { getFromDB, setInDB, clearDatabase };
