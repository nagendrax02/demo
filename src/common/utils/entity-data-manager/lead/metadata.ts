import { trackError } from 'common/utils/experience/utils/track-error';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { ILeadMetaData } from 'common/types';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import {
  getLeadMetaDataCache,
  setLeadMetaDataCache,
  getRepresentationNameCache,
  setRepresentationNameCache
} from './cache-metadata';
import { ILeadAttribute, ILeadMetadataMap } from 'common/types/entity/lead';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';
import { IFetchLeadMetadata } from 'common/types/entity/lead/metadata.types';
import { isLeadTypeEnabled } from '../../lead-type/settings';
import { createStoredPromise, getStoredPromise } from 'common/utils/helpers/promise-helpers';

const getLeadMetaData = async (callerSource: CallerSource): Promise<ILeadMetaData> => {
  try {
    const promiseKey = '__lead_metadata_get_promise__';
    if (!getStoredPromise<ILeadMetaData>(promiseKey)) {
      createStoredPromise(
        promiseKey,
        httpGet({
          path: API_ROUTES.leadMetadata,
          module: Module.Marvin,
          callerSource: callerSource
        })
      );
    }
    return await getStoredPromise<ILeadMetaData>(promiseKey);
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export const fetchMetadataOfNonLeadType = async (
  callerSource: CallerSource
): Promise<ILeadMetadataMap> => {
  const cachedLeadMetaData = await getLeadMetaDataCache();
  if (cachedLeadMetaData) return cachedLeadMetaData;

  const response = await getLeadMetaData(callerSource);
  const metaDataMap = createHashMapFromArray<ILeadAttribute>(response?.Fields || [], 'SchemaName');
  setLeadMetaDataCache(metaDataMap);
  if (response?.LeadRepresentationConfig) {
    setRepresentationNameCache(response.LeadRepresentationConfig);
  }

  return metaDataMap;
};

const fetchMetaData = async (
  callerSource: CallerSource,
  leadType?: string,
  ignoreSVLeadTypeSetting?: boolean
): Promise<ILeadMetadataMap> => {
  try {
    const leadTypeEnabled = await isLeadTypeEnabled(callerSource, ignoreSVLeadTypeSetting);

    return leadTypeEnabled && leadType
      ? await (
          await import('../../lead-type/metadata')
        ).fetchMetadataOfLeadType(leadType, callerSource)
      : await fetchMetadataOfNonLeadType(callerSource);
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export const fetchRepNameOfNonLeadType = async (
  callerSource: CallerSource
): Promise<IEntityRepresentationName | undefined> => {
  const repName = getRepresentationNameCache();
  if (repName) return repName;

  const response = await getLeadMetaData(callerSource);
  const cachedLeadMetaData = await getLeadMetaDataCache();
  if (!cachedLeadMetaData) {
    const metaDataMap = createHashMapFromArray<ILeadAttribute>(
      response?.Fields || [],
      'SchemaName'
    );
    setLeadMetaDataCache(metaDataMap);
  }
  const { LeadRepresentationConfig } = response;
  if (LeadRepresentationConfig) setRepresentationNameCache(LeadRepresentationConfig);

  return LeadRepresentationConfig;
};

const fetchRepresentationName = async (
  callerSource: CallerSource,
  leadType?: string
): Promise<IEntityRepresentationName | undefined> => {
  try {
    const leadTypeEnabled = await isLeadTypeEnabled(callerSource);

    return leadTypeEnabled && leadType
      ? await (
          await import('../../lead-type/metadata')
        ).fetchRepNameOfLeadType(leadType, callerSource)
      : await fetchRepNameOfNonLeadType(callerSource);
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchLeadMetaData = async (callerSource: CallerSource): Promise<IFetchLeadMetadata> => {
  let metaDataMap: ILeadMetadataMap, repName: IEntityRepresentationName | undefined;
  const cachedLeadMetaData = await getLeadMetaDataCache();
  const cachedLeadRepName = getRepresentationNameCache();
  if (cachedLeadMetaData && cachedLeadRepName) {
    metaDataMap = cachedLeadMetaData;
    repName = cachedLeadRepName;
  } else {
    metaDataMap = await fetchMetaData(callerSource);
    repName = await fetchRepresentationName(callerSource);
  }
  return {
    metaData: metaDataMap,
    representationName: repName
  };
};

export { fetchMetaData, fetchRepresentationName, getLeadMetaData, fetchLeadMetaData };
