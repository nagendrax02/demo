import { IAugmentedEntity } from 'apps/entity-details/types';
import { EntityType, IAccount } from 'common/types';
import { getAugmentedVCard } from './vcard';
import { getAugmentedProperty } from './properties';
import { getAssociatedAugmentedProperty } from './associated-property';
import { getAugmentedTabData } from './tabs';
import { IAccountMetaData } from 'common/types/entity/account/metadata.types';
import { getAugmentedMetaData } from './metadata';
import { updatePageTitle } from 'common/utils/helpers/page-title';
import { getAccountName } from '../..';
import { getAccountDetailsPath } from 'router/utils/entity-details-url-format';
import { getAccountId } from 'common/utils/helpers/helpers';
import { handleUrlFormat } from 'router/utils/url-redirection';

const augmentedAccountData = (
  entityData: IAccount,
  isUpdateRestricted?: boolean
): IAugmentedEntity => {
  updatePageTitle({
    entityType: EntityType.Account,
    name: getAccountName(entityData?.details?.Fields),
    representationName: entityData?.metaData?.AccountRepresentationConfig?.SingularName || 'Account'
  });

  handleUrlFormat(
    getAccountDetailsPath(
      entityData.details.AccountTypeName,
      getAccountId(),
      entityData.details.AccountTypeId
    )
  );
  return {
    vcard: getAugmentedVCard(entityData, isUpdateRestricted),
    metrics: [],
    properties: getAugmentedProperty(entityData),
    associatedLeadProperties: getAssociatedAugmentedProperty(entityData),
    tabs: getAugmentedTabData(entityData?.details?.TabsConfiguration, entityData?.details),
    attributes: {
      detailsConfiguration: (entityData as IAccount)?.details?.AttributeDetailsConfiguration,
      fields: entityData?.details?.Fields,
      metadata: getAugmentedMetaData(entityData?.metaData as IAccountMetaData)
    }
  };
};

export default augmentedAccountData;
