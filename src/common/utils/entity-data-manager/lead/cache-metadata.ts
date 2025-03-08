import { trackError } from 'common/utils/experience/utils/track-error';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { StorageKey, setItem, getItem } from 'common/utils/storage-manager';
import { ILeadMetadataMap } from 'common/types';
import { getFromDB, setInDB } from '../../storage-manager/idb-storage';

const setLeadMetaDataCache = (leadMetaData: ILeadMetadataMap): void => {
  try {
    setInDB(StorageKey.LDMetaData, leadMetaData);
  } catch (error) {
    trackError(error);
  }
};

const getLeadMetaDataCache = async (): Promise<ILeadMetadataMap | undefined> => {
  try {
    return (await getFromDB(StorageKey.LDMetaData)) as ILeadMetadataMap;
  } catch (error) {
    trackError(error);
  }
};

const setRepresentationNameCache = (representationName: IEntityRepresentationName): void => {
  try {
    setItem(StorageKey.LeadRepresentationName, representationName);
  } catch (error) {
    trackError(error);
  }
};

const getRepresentationNameCache = (): IEntityRepresentationName | undefined => {
  try {
    return getItem(StorageKey.LeadRepresentationName) as IEntityRepresentationName;
  } catch (error) {
    trackError(error);
  }
};

export {
  setLeadMetaDataCache,
  getLeadMetaDataCache,
  setRepresentationNameCache,
  getRepresentationNameCache
};
