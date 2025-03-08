import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'src/common/constants';
import { CallerSource, Module, httpGet } from '../../rest-client';
import { EntityType, IActivityAttribute, IActivityMetaData } from './activity.types';
import { getPersistedActivityMetadata, persistConfig } from './cache';

const augmentActivityMetaData = (
  fields: IActivityAttribute[]
): Record<string, IActivityAttribute> => {
  const fieldsMap = fields.reduce((acc: Record<string, IActivityAttribute>, item) => {
    acc[item.SchemaName] = item;
    return acc;
  }, {});
  return fieldsMap;
};

const activityMetadataGet = async (
  code: number,
  callerSource: CallerSource
): Promise<IActivityMetaData> => {
  let result: IActivityMetaData = {
    Id: '',
    Code: code,
    EntityType: EntityType.Activity
  };

  try {
    const persistedConfig = await getPersistedActivityMetadata(code);
    if (persistedConfig) return persistedConfig;

    const response: IActivityMetaData = await httpGet({
      path: `${API_ROUTES.activityMetadataGet}${code}`,
      module: Module.Marvin,
      callerSource
    });
    if (response?.Fields?.length && !response.metaDataMap) {
      response.metaDataMap = augmentActivityMetaData(response.Fields);
      delete response.Fields;
    }
    persistConfig(response, code);
    if (response) result = response;
  } catch (error) {
    trackError(error);
  }
  return result;
};

export { activityMetadataGet };
