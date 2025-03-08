import { EntityType } from 'common/types';
import { TABS_CACHE_KEYS } from '../constants';

export const defaultEntityLeadsFilter = 'ProspectStage,OwnerId';

export const defaultEntityLeadsColumns =
  'LeadIdentifier,Score,ProspectStage,OwnerIdName,ModifiedOn';

export const defaultEntityLeadsSortOn = 'ModifiedOn-desc';

export const entityTypeMap = {
  [EntityType.Account]: TABS_CACHE_KEYS.LEADS_CACHE_KEY,
  [EntityType.Lead]: TABS_CACHE_KEYS.RELATED_LEADS_CACHE_KEY
};
