import { trackError } from 'common/utils/experience/utils/track-error';
import { EntityType, ILeadDetails } from 'common/types';
import { ICachedLeadDetails } from 'common/types/entity/lead/cache.types';
import { StorageKey, setItem, getItem } from 'common/utils/storage-manager';
import { ITabConfiguration } from 'src/common/types/entity/lead';
import { updateOpportunityTabConfiguration } from '../opportunity/cache-details';
import { updateAccountTabConfiguration } from '../account/cache-details';
import { getAccountId } from '../../helpers/helpers';

const setLeadDetailsCache = (leadDetails: ILeadDetails): void => {
  try {
    const { Fields, ...filteredLeadDetails } = leadDetails;
    setItem(StorageKey.LDCompoundData, filteredLeadDetails as ICachedLeadDetails);
  } catch (error) {
    trackError(error);
  }
};

const getLeadDetailsCache = (): ICachedLeadDetails | undefined => {
  try {
    return getItem(StorageKey.LDCompoundData) as ICachedLeadDetails;
  } catch (error) {
    trackError(error);
  }
};

const updateLeadTabConfiguration = (tabConfiguration: ITabConfiguration[]): void => {
  try {
    const cachedLeadData = getLeadDetailsCache();
    if (!cachedLeadData) return;

    cachedLeadData.TabsConfiguration = tabConfiguration;
    setLeadDetailsCache({ ...cachedLeadData, Fields: {} });
  } catch (error) {
    trackError(error);
  }
};

const updateEntityTabConfiguration = (
  entityType: EntityType,
  tabConfiguration: ITabConfiguration[],
  eventCode?: string
): void => {
  switch (entityType) {
    case EntityType.Lead:
      updateLeadTabConfiguration(tabConfiguration);
      break;
    case EntityType.Opportunity:
      updateOpportunityTabConfiguration(tabConfiguration, eventCode);
      break;
    case EntityType.Account:
      updateAccountTabConfiguration(tabConfiguration, getAccountId());
      break;
  }
};

export { setLeadDetailsCache, getLeadDetailsCache, updateEntityTabConfiguration };
