import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { IAdvancedSearch } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

interface ILeadOpportunityTab {
  coreData: IEntityDetailsCoreData;
}

type ILeadOpportunityTabAdvSearch = Omit<IAdvancedSearch, 'QueryTimeZone'>;

export type { ILeadOpportunityTab, ILeadOpportunityTabAdvSearch };
