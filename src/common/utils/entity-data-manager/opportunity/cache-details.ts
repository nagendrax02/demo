import { trackError } from 'common/utils/experience/utils/track-error';
import { StorageKey, setItem, getItem } from 'common/utils/storage-manager';
import { ICachedOpportunityDetails, IOpportunityDetails } from 'common/types/entity/opportunity';
import { ITabConfiguration } from '../../../types/entity/opportunity/detail.types';
import { ICachedOpportunityDetailsMap } from '../../../types/entity/opportunity/cache.types';

const setOpportunityDetailsCache = (
  opportunityDetails: IOpportunityDetails,
  eventCode?: string
): void => {
  try {
    const prevData = getItem(StorageKey.ODCompoundData) as ICachedOpportunityDetailsMap;
    const {
      VCardConfiguration,
      TabConfiguration,
      ActionsConfiguration,
      ConnectorConfiguration,
      OpportunityDetailsConfiguration
    } = opportunityDetails;
    const filteredOppDetails: ICachedOpportunityDetails = {
      VCardConfiguration,
      TabConfiguration,
      ActionsConfiguration,
      ConnectorConfiguration,
      OpportunityDetailsConfiguration
    };

    const updatedData = { ...(prevData || {}), [eventCode || '']: filteredOppDetails };

    setItem(StorageKey.ODCompoundData, updatedData);
  } catch (error) {
    trackError(error);
  }
};

const getOpportunityDetailsCache = (eventCode?: string): ICachedOpportunityDetails | undefined => {
  try {
    const cachedData = getItem(StorageKey.ODCompoundData) as ICachedOpportunityDetailsMap;
    return cachedData?.[eventCode || ''];
  } catch (error) {
    trackError(error);
  }
};

const updateOpportunityTabConfiguration = (
  tabConfiguration: ITabConfiguration[],
  eventCode?: string
): void => {
  try {
    const cachedOppData = getOpportunityDetailsCache(eventCode);
    if (!cachedOppData) return;

    cachedOppData.TabConfiguration = tabConfiguration;
    setOpportunityDetailsCache(cachedOppData as IOpportunityDetails, eventCode);
  } catch (error) {
    trackError(error);
  }
};

export {
  getOpportunityDetailsCache,
  setOpportunityDetailsCache,
  updateOpportunityTabConfiguration
};
