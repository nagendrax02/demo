import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants/api-routes';
import { CallerSource, Module, httpGet, httpPost } from '../rest-client';
import { StorageKey, getItem, setItem } from '../storage-manager';
import { safeParseJson } from '../helpers/helpers';
import { convertToStorableData } from '../storage-manager/storage';

export const updateCachedObject = (key: string, storableData: string): void => {
  const cachedObject = getItem<Record<string, string>>(StorageKey.UserPersonalisationKey) ?? {};
  cachedObject[key] = storableData;
  setItem(StorageKey.UserPersonalisationKey, cachedObject);
};

export const getUserPersonalisation = async <T>(
  key: string,
  callerSource: CallerSource
): Promise<T | null> => {
  try {
    const cachedObject = getItem<Record<string, string>>(StorageKey.UserPersonalisationKey);
    if (cachedObject?.[key]) {
      return safeParseJson<T>(cachedObject[key]);
    }

    const apiResponse = await httpGet<string>({
      path: `${API_ROUTES.UserPersonalisationGet}?key=${key}`,
      module: Module.Marvin,
      callerSource: callerSource
    });

    if (apiResponse) {
      // Here API is giving response of text type, so we need to parse it to string first,
      // in order that when its parsed again it will be parsed to object/required format.
      const parsedResponse = safeParseJson<string>(apiResponse);
      if (parsedResponse) {
        updateCachedObject(key, parsedResponse);
      }

      return safeParseJson<T>(parsedResponse ?? '');
    }
  } catch (error) {
    trackError(error);
  }
  return null;
};

export const setUserPersonalisation = async <T>(
  key: string,
  callerSource: CallerSource,
  value: T
): Promise<void> => {
  try {
    const storableData = convertToStorableData(value);
    updateCachedObject(key, storableData);

    await httpPost({
      path: `${API_ROUTES.UserPersonalisationPut}`,
      module: Module.Marvin,
      callerSource: callerSource,
      body: {
        Key: key,
        Value: storableData
      }
    });
  } catch (error) {
    trackError(error);
  }
};
