import { trackError } from 'common/utils/experience/utils/track-error';
import { getFromDB, setInDB, StorageKey } from '../../storage-manager';
import { UserActions, UserRestrictions } from '../feature-restriction.types';

export const getCachedUserRestrictions = async (): Promise<UserRestrictions | undefined> => {
  try {
    const cachedData = (await getFromDB(StorageKey.UserRestrictions)) as
      | UserRestrictions
      | undefined;
    return typeof cachedData === 'object' ? new Map(cachedData) : undefined;
  } catch (err) {
    trackError(err);
    return undefined;
  }
};

export const setUserRestrictionsInCache = async (data: UserRestrictions): Promise<void> => {
  try {
    await setInDB(StorageKey.UserRestrictions, data, true);
  } catch (err) {
    trackError(err);
  }
};

export const getCachedUserActions = async (): Promise<UserActions | undefined> => {
  try {
    const cachedData = (await getFromDB(StorageKey.UserActions)) as UserActions | undefined;
    return cachedData;
  } catch (err) {
    trackError(err);
    return undefined;
  }
};

export const setUserActionsInCache = async (data: UserActions): Promise<void> => {
  try {
    await setInDB(StorageKey.UserActions, data, true);
  } catch (err) {
    trackError(err);
  }
};
