import { EntityType, IEntity } from 'common/types';
import augmentedLeadData from './lead';
import { IAugmentedEntity } from '../../types';
import { augmentedOpportunityData } from './opportunity';
import augmentedAccountData from './account';
import augmentedListData from './list';

const augmentEntityData: {
  [key in EntityType]?: (entityData: IEntity, isUpdateRestricted?: boolean) => IAugmentedEntity;
} = {
  [EntityType.Lead]: augmentedLeadData,
  [EntityType.Opportunity]: augmentedOpportunityData,
  [EntityType.Account]: augmentedAccountData,
  [EntityType.Lists]: augmentedListData
};

export default augmentEntityData;
