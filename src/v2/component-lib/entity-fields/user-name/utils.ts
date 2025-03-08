import { trackError } from 'common/utils/experience/utils/track-error';
import { httpPost, CallerSource, Module } from 'common/utils/rest-client';
import { setItem, getItem, StorageKey } from 'common/utils/storage-manager';
import { IUserNameMap } from './username.types';
import { API_ROUTES } from 'common/constants';

const getUserNamesFromStorage = (): IUserNameMap => {
  try {
    const userNames: IUserNameMap | null = getItem(StorageKey.UserName);
    return userNames || {};
  } catch (error) {
    trackError(error);
    return {};
  }
};

const setUserNamesInStorage = (userNames: IUserNameMap): void => {
  try {
    const userNamesFromStorage = getUserNamesFromStorage();
    const updatedUserNames = { ...userNamesFromStorage, ...userNames };
    setItem(StorageKey.UserName, updatedUserNames);
  } catch (error) {
    trackError(error);
  }
};

export const getUserNameFromAPI = async (
  ids: string[],
  callerSource: CallerSource
): Promise<IUserNameMap | null> => {
  try {
    const response: IUserNameMap = await httpPost({
      path: API_ROUTES.userName,
      module: Module.Marvin,
      body: ids,
      callerSource
    });

    return response || null;
  } catch (error) {
    trackError(error);
    return null;
  }
};

const getCachedUserNames = (ids: string[], userNamesFromStorage: IUserNameMap): IUserNameMap => {
  return ids.reduce((acc, id) => {
    const userName = userNamesFromStorage[id];
    if (userName) {
      acc[id] = userName;
    }
    return acc;
  }, {} as IUserNameMap);
};

const getAllUserNames = async ({
  cachedUserNames,
  ids,
  callerSource
}: {
  ids: string[];
  cachedUserNames: IUserNameMap;
  callerSource: CallerSource;
}): Promise<IUserNameMap> => {
  let allUserNames = cachedUserNames;
  try {
    const apiResponse = await getUserNameFromAPI(ids, callerSource);
    if (apiResponse) {
      setUserNamesInStorage({ ...apiResponse });
      allUserNames = { ...cachedUserNames, ...apiResponse };
    }
  } catch (error) {
    trackError(error);
  }
  return allUserNames;
};

const getUserNames = async (ids: string[], callerSource: CallerSource): Promise<IUserNameMap> => {
  const uniqueIds = [...new Set(ids)];
  const userNamesFromStorage = getUserNamesFromStorage();
  const cachedUserNames = getCachedUserNames(uniqueIds, userNamesFromStorage);

  const remainingIds = uniqueIds.filter((id) => !cachedUserNames[id]);

  if (remainingIds.length) {
    return getAllUserNames({
      ids: remainingIds,
      cachedUserNames,
      callerSource
    });
  }

  return cachedUserNames;
};

export { getUserNames };
