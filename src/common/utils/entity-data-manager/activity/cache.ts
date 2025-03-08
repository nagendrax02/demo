import { StorageKey, getFromDB, setInDB } from '../../storage-manager';
import { IActivityMetaData, IPersistedActivityMetaData } from './activity.types';

const getPersistedActivityMetadata = async (
  eventCode: number
): Promise<IActivityMetaData | null> => {
  const activityMetadata =
    (await getFromDB<IPersistedActivityMetaData>(StorageKey.ActivityMetaData)) || {};

  return activityMetadata[eventCode] || null;
};

const persistConfig = async (config: IActivityMetaData, eventCode: number): Promise<void> => {
  const cachedConfig =
    (await getFromDB<IPersistedActivityMetaData>(StorageKey.ActivityMetaData)) || {};

  cachedConfig[eventCode] = config;
  await setInDB(StorageKey.ActivityMetaData, cachedConfig, true);
};

export { persistConfig, getPersistedActivityMetadata };
