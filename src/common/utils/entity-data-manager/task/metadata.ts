import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpGet } from '../../rest-client';
import { createHashMapFromArray } from '../../helpers/helpers';
import { ITaskAttribute, ITaskMetadataResponse, ITaskMetadata } from 'common/types/entity';
import { getTaskMetaDataCache, setTaskMetaDataCache } from './cache-metadata';

const fetchMetaData = async (
  type: string,
  callerSource: CallerSource
): Promise<ITaskMetadata | undefined> => {
  try {
    const metaData = (await httpGet({
      path: `${API_ROUTES.taskMetaData}?taskType=${type}`,
      module: Module.Marvin,
      callerSource
    })) as ITaskMetadataResponse;

    const repName = metaData?.Name || 'Task';
    const metaDataMap = createHashMapFromArray<ITaskAttribute>(
      metaData?.Fields || [],
      'SchemaName'
    );
    const dataToCache = {
      taskRepName: repName,
      configuration: metaData?.Configuration,
      fields: metaDataMap,
      reminderConfig: metaData?.ReminderConfiguration,
      category: metaData?.Category
    };

    setTaskMetaDataCache(dataToCache, type);
    return dataToCache;
  } catch (error) {
    trackError(error);
  }
};

const fetchTaskMetaData = async (
  type: string,
  callerSource: CallerSource
): Promise<ITaskMetadata | undefined> => {
  const cachedMetaData = getTaskMetaDataCache();

  if (cachedMetaData?.[type]) {
    return cachedMetaData[type];
  } else {
    return fetchMetaData(type, callerSource);
  }
};

export default fetchTaskMetaData;
export { fetchMetaData };
