import { trackError } from 'common/utils/experience/utils/track-error';
import { IOpportunityMetaData } from 'common/types';
import { StorageKey, setItem, getItem } from 'common/utils/storage-manager';

export const setOpporunityMetaDataCache = (
  opportunityMetaData: IOpportunityMetaData,
  eventcode: number
): void => {
  try {
    const prevData = getItem(StorageKey.ODMetaData);
    const updatedData = { ...(prevData || {}), [eventcode]: opportunityMetaData };
    setItem(StorageKey.ODMetaData, updatedData);
  } catch (error) {
    trackError(error);
  }
};

export const getOpportunityMetaDataCache = (
  eventcode: number
): IOpportunityMetaData | undefined => {
  try {
    const cachedData = getItem(StorageKey.ODMetaData) as Record<string, IOpportunityMetaData>;
    return cachedData?.[eventcode];
  } catch (error) {
    trackError(error);
  }
};
