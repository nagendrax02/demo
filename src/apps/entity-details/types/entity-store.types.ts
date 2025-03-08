import { EntityType } from 'common/types';
import {
  IAugmentedEntity,
  IEntityDetailsCoreData,
  IEntityRepresentationName
} from './entity-data.types';

type IEntityRepresentationConfig = Record<EntityType, IEntityRepresentationName>;

interface IEntityDetailStore {
  isLoading: boolean;
  isUpdating: boolean;
  error: Error | null;
  augmentedEntityData: IAugmentedEntity | null;
  representationName: IEntityRepresentationConfig;
  setIsLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setAugmentedEntityData: (data: IAugmentedEntity) => void;
  setRepresentationName: (config: IEntityRepresentationConfig) => void;
  resetEntityDetailStore: () => void;
  entityType: EntityType;
  setEntityType: (data: EntityType) => void;
  isStarred: boolean;
  setIsStarred: (data: boolean) => void;
  coreData: IEntityDetailsCoreData;
  setCoreData: (data: IEntityDetailsCoreData) => void;
  vcardName?: string;
  setVcardName: (data: string) => void;
  resetKey?: number;
  primaryContactLeadId?: string;
}

interface IEntityIds {
  [EntityType.Lead]: string;
  [EntityType.Account]: string;
  [EntityType.Opportunity]: string;
  [EntityType.Activity]: string;
  [EntityType.Task]: string;
  [EntityType.AccountActivity]: string;
  EntityTypeId?: string;
  relatedEntityTypeId?: string;
  [EntityType.Lists]: string;
  [EntityType.Ticket]: string;
}

interface IEntityRepNames {
  [EntityType.Lead]: IEntityRepresentationName;
  [EntityType.Account]: IEntityRepresentationName;
  [EntityType.Opportunity]: IEntityRepresentationName;
  [EntityType.Activity]: IEntityRepresentationName;
  [EntityType.Task]: IEntityRepresentationName;
  [EntityType.AccountActivity]: IEntityRepresentationName;
  [EntityType.Lists]: IEntityRepresentationName;
  [EntityType.Ticket]: IEntityRepresentationName;
}

interface IEntityRepNamesFromStore {
  leadRepName: IEntityRepresentationName;
  activityRepName: IEntityRepresentationName;
  opportunityRepName: IEntityRepresentationName;
  accountRepName: IEntityRepresentationName;
}

export type {
  IEntityDetailStore,
  IEntityRepresentationConfig,
  IEntityIds,
  IEntityRepNamesFromStore,
  IEntityRepNames
};
