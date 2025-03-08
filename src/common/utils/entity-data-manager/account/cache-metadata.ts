import { trackError } from 'common/utils/experience/utils/track-error';
import { IAccountMetaDataMap } from 'common/types/entity/account/metadata.types';
import { StorageKey, getItem, setItem } from '../../storage-manager';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';

const setAccountMetaDataCache = (
  accountMetaData: IAccountMetaDataMap,
  accountTypeId: string
): void => {
  try {
    const metaData = (getItem(StorageKey.ADMetaData) as Record<string, IAccountMetaDataMap>) || {};

    metaData[accountTypeId] = accountMetaData;

    setItem(StorageKey.ADMetaData, metaData);
  } catch (error) {
    trackError(error);
  }
};

const getAccountMetaDataCache = (accountTypeId: string): IAccountMetaDataMap | undefined => {
  try {
    const metaData =
      (getItem(StorageKey.ADMetaData) as Record<string, IAccountMetaDataMap>) || undefined;

    return metaData?.[accountTypeId];
  } catch (error) {
    trackError(error);
  }
};

const setAccountRepresentationNameCache = (
  representationName: IEntityRepresentationName,
  accountTypeId: string
): void => {
  try {
    const repNames =
      (getItem(StorageKey.AccountRepresentationName) as Record<
        string,
        IEntityRepresentationName
      >) || {};
    repNames[accountTypeId] = representationName;
    setItem(StorageKey.AccountRepresentationName, repNames);
  } catch (error) {
    trackError(error);
  }
};

const getAccountRepresentationNameCache = (
  accountTypeId: string
): IEntityRepresentationName | undefined => {
  try {
    const repNames =
      (getItem(StorageKey.AccountRepresentationName) as Record<
        string,
        IEntityRepresentationName
      >) || {};
    return repNames?.[accountTypeId];
  } catch (error) {
    trackError(error);
  }
};

export {
  getAccountMetaDataCache,
  setAccountMetaDataCache,
  setAccountRepresentationNameCache,
  getAccountRepresentationNameCache
};
