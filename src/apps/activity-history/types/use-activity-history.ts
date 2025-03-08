import { EntityType } from 'common/types';
import { IAugmentedAHDetail } from './activity-history.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { TabType } from 'apps/entity-details/types/entity-data.types';
import { IEntityIds } from '../../entity-details/types/entity-store.types';

interface IUseActivityHistory {
  type: EntityType;
  entityIds: IEntityIds;
  customTypeFilter?: IOption[];
  tabType?: TabType;
  eventCode?: number;
  entityDetailsType?: EntityType;
}

interface IActivityHistoryHook {
  isLoading: boolean;
  isLoadingNextPage: boolean;
  intersectionRef: React.RefObject<HTMLDivElement>;
  augmentedAHDetails: IAugmentedAHDetail[] | null;
}

export type { IUseActivityHistory, IActivityHistoryHook };
