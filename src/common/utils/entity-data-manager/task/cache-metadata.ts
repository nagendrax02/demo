import { trackError } from 'common/utils/experience/utils/track-error';
import { ITaskMetadata } from 'common/types/entity';
import { StorageKey, getItem, setItem } from '../../storage-manager';

const getTaskMetaDataCache = (): Record<string, ITaskMetadata> | undefined => {
  try {
    return getItem(StorageKey.TaskMetaData) as Record<string, ITaskMetadata>;
  } catch (error) {
    trackError(error);
  }
};

const setTaskMetaDataCache = (dataToCache: ITaskMetadata, type: string): void => {
  try {
    const currentCache = getTaskMetaDataCache() || {};
    setItem(StorageKey.TaskMetaData, { ...currentCache, [type]: dataToCache });
  } catch (error) {
    trackError(error);
  }
};

export { setTaskMetaDataCache, getTaskMetaDataCache };
