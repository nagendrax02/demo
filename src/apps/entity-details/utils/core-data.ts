import { EntityType, IAccount, IEntity, IOpportunity } from 'common/types';
import { IAugmentedEntity, IEntityDetailsCoreData } from '../types/entity-data.types';
import { IEntityIds, IEntityRepNames } from '../types/entity-store.types';
import { getEntityId, getOpportunityId } from 'common/utils/helpers';
import {
  getFullScreenSelectedRecordId,
  getFullScreenTabType,
  getIsFullScreenEnabled
} from 'common/component-lib/full-screen-header/full-screen.store';
import { getListId } from 'common/utils/helpers/helpers';

interface IGetEntityDetailsCoreData {
  entityType: EntityType;
  augmentedData: IAugmentedEntity;
  repNames: IEntityRepNames;
  response: IEntity;
}

// eslint-disable-next-line max-lines-per-function
const getEntityIds = (
  activeEntityType: EntityType,
  entityData: IAugmentedEntity,
  response: IEntity
): IEntityIds => {
  switch (activeEntityType) {
    case EntityType.Opportunity:
      return {
        [EntityType.Lead]: entityData?.associatedEntityId || '',
        [EntityType.Activity]: '',
        [EntityType.Opportunity]: getOpportunityId(),
        [EntityType.Account]: '',
        [EntityType.Task]: '',
        [EntityType.AccountActivity]: '',
        [EntityType.Lists]: '',
        [EntityType.Ticket]: ''
      };
    case EntityType.Account:
      return {
        [EntityType.Lead]: (response as IAccount)?.details?.LeadId,
        [EntityType.Activity]: '',
        [EntityType.Opportunity]: '',
        [EntityType.Account]: entityData?.attributes?.fields?.CompanyId || '',
        [EntityType.Task]: '',
        [EntityType.AccountActivity]: '',
        EntityTypeId: (response as IAccount)?.details?.AccountTypeId,
        [EntityType.Lists]: '',
        [EntityType.Ticket]: ''
      };
    case EntityType.Lead:
    default:
      return {
        [EntityType.Lead]: getEntityId(),
        [EntityType.Activity]: '',
        [EntityType.Opportunity]: '',
        [EntityType.Account]: '',
        [EntityType.Task]: '',
        [EntityType.AccountActivity]: '',
        [EntityType.Lists]: getListId() ?? '',
        [EntityType.Ticket]: ''
      };
  }
};

const getEntityTypeRepName = (activeEntityType: EntityType, response: IEntity): string => {
  switch (activeEntityType) {
    case EntityType.Account:
      return (response as IAccount).details?.AccountTypeName;
    case EntityType.Opportunity:
      return (response as IOpportunity).metaData.DisplayName || 'Opportunity';
    default:
      return '';
  }
};

export const getEntityDetailsCoreData = (
  props: IGetEntityDetailsCoreData
): IEntityDetailsCoreData => {
  const { entityType, augmentedData, repNames, response } = props;
  let entityId = getEntityIds(entityType, augmentedData, response);
  const selectedRecordId = getFullScreenSelectedRecordId();
  const showFullScreen = getIsFullScreenEnabled();
  const fullScreenTabType = getFullScreenTabType();
  if (selectedRecordId && showFullScreen && fullScreenTabType)
    entityId = {
      ...entityId,
      [fullScreenTabType]: selectedRecordId
    };
  return {
    entityDetailsType: entityType,
    entityIds: entityId,
    entityRepNames: repNames,
    eventCode: augmentedData?.entityCode,
    prospectAutoId: augmentedData?.autoId,
    entityTypeRepName: getEntityTypeRepName(entityType, response)
  };
};
