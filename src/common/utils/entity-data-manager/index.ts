import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IEntity, IEntityDetails, IEntityMetaData } from 'common/types';
import { EntityType } from 'common/types';
import { getDropdownOptions } from './user/dropdown-options';
import { CallerSource } from '../rest-client';
import { IFetchDropdownOptions, IOptions } from './entity-data-manager.types';

interface IEntityDataManager {
  fetchData: () => Promise<IEntity>;
  fetchDetails: (callerSource: CallerSource) => Promise<IEntityDetails>;
  fetchMetaData: (callerSource: CallerSource, typeId: string) => Promise<IEntityMetaData>;
  fetchRepresentationName?: (
    callerSource: CallerSource,
    typeId: string
  ) => Promise<IEntityRepresentationName | undefined>;
  getDropdownOptions?: (config: IFetchDropdownOptions) => Promise<IOptions>;
  getSalesGroupOptions?: (config: IFetchDropdownOptions) => Promise<IOptions>;
}

const getEntityDataManager = async (type: EntityType): Promise<IEntityDataManager> => {
  switch (type) {
    case EntityType.Opportunity: {
      return (await import('./opportunity')).default;
    }
    case EntityType.Account: {
      return (await import('./account')).default;
    }
    case EntityType.Lists: {
      return (await import('./lists')).default;
    }
    case EntityType.Lead:
    default: {
      return (await import('./lead')).default;
    }
  }
};

const userDataManager = {
  getDropdownOptions: getDropdownOptions
};

export default getEntityDataManager;
export { userDataManager };
