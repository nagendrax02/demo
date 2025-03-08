import { trackError } from 'common/utils/experience/utils/track-error';
import {
  IAccountAttribute,
  IAccountMetaData,
  IAccountMetaDataMap,
  IFetchAccountMetaData
} from 'common/types/entity/account/metadata.types';
import { CallerSource, Module, httpGet } from '../../rest-client';
import {
  getAccountMetaDataCache,
  getAccountRepresentationNameCache,
  setAccountMetaDataCache,
  setAccountRepresentationNameCache
} from './cache-metadata';
import { API_ROUTES } from 'common/constants';

import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { createHashMapFromArray } from '../../helpers/helpers';

const getAccountMetaData = async (
  accountTypeId: number,
  callerSource: CallerSource
): Promise<IAccountMetaData> => {
  try {
    const url = `${API_ROUTES.accountMetadata}?accountTypeId=${accountTypeId}`;

    return await httpGet({
      path: url,
      module: Module.Marvin,
      callerSource: callerSource
    });
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchMetaData = async (
  callerSource: CallerSource,
  accountTypeId: string
): Promise<IAccountMetaDataMap> => {
  try {
    const cachedAccountMetaData = getAccountMetaDataCache(accountTypeId);
    if (cachedAccountMetaData) return cachedAccountMetaData;

    const typeId = parseInt(accountTypeId);
    const response = await getAccountMetaData(typeId, callerSource);
    const metaDataMap = createHashMapFromArray<IAccountAttribute>(
      response?.Fields || [],
      'SchemaName'
    );

    setAccountMetaDataCache(metaDataMap, accountTypeId);
    if (response?.CompanyTypeName && response?.PluralName) {
      setAccountRepresentationNameCache(
        {
          SingularName: response?.CompanyTypeName,
          PluralName: response?.PluralName
        },
        accountTypeId || ''
      );
    }

    return metaDataMap;
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchRepresentationName = async (
  callerSource: CallerSource,
  accountTypeId: string
): Promise<IEntityRepresentationName | undefined> => {
  try {
    const repName = getAccountRepresentationNameCache(accountTypeId);
    if (repName) return repName;

    const typeId = parseInt(accountTypeId);
    const response = await getAccountMetaData(typeId, callerSource);
    const { CompanyTypeName, PluralName } = response;
    if (CompanyTypeName && PluralName)
      setAccountRepresentationNameCache(
        {
          SingularName: response?.CompanyTypeName as string,
          PluralName: response?.PluralName as string
        },
        accountTypeId
      );
    return {
      SingularName: response?.CompanyTypeName as string,
      PluralName: response?.PluralName as string
    };
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchAccountMetaData = async (
  accountTypeId: string,
  callerSource: CallerSource
): Promise<IFetchAccountMetaData> => {
  let metaDataMap: IAccountMetaDataMap, repName: IEntityRepresentationName | undefined;
  const cachedAccountMetaData = getAccountMetaDataCache(accountTypeId);
  const cachedAccountRepName = getAccountRepresentationNameCache(accountTypeId);
  if (cachedAccountMetaData && cachedAccountRepName) {
    metaDataMap = cachedAccountMetaData;
    repName = cachedAccountRepName;
  } else {
    metaDataMap = await fetchMetaData(callerSource, accountTypeId);
    repName = await fetchRepresentationName(callerSource, accountTypeId);
  }
  return {
    metaData: metaDataMap,
    representationName: repName
  };
};

export {
  fetchMetaData,
  fetchRepresentationName,
  fetchAccountMetaData,
  getAccountRepresentationNameCache
};
