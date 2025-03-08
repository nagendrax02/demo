import { IAugmentedEntity } from 'apps/entity-details/types';
import { EntityType, IOpportunity } from 'common/types';
import { getAugmentedVCard } from './vcard/vcard';
import { getOpportunityProperties } from './properties/opportunity-properties';
import { getAssociatedLeadProperties } from './properties/associated-lead-properties';
import { getOpportunityFields } from './attributes/fields';
import { getDetailsConfiguration } from './attributes/details-config';
import { getAugmentedTabData } from './tabs/tabs';
import { getAugmentedMetaData } from './attributes/metadata';
import { getOpportunityDetailsPath } from 'router/utils/entity-details-url-format';
import { getOpportunityEventCode, getOpportunityId } from 'common/utils/helpers';
import { handleUrlFormat } from 'router/utils/url-redirection';
import { updatePageTitle } from 'common/utils/helpers/page-title';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { OPPORTUNITY_NAME_SCHEMA } from 'apps/entity-details/constants';
import { getIsFullScreenEnabled } from 'common/component-lib/full-screen-header/full-screen.store';

const augmentedOpportunityData = (
  entityData: IOpportunity,
  isUpdateRestricted?: boolean
): IAugmentedEntity => {
  updatePageTitle({
    entityType: EntityType.Opportunity,
    name:
      entityData?.details?.Fields?.[OPPORTUNITY_NAME_SCHEMA] ||
      DEFAULT_ENTITY_REP_NAMES.opportunity.SingularName,
    representationName: ''
  });

  if (!getIsFullScreenEnabled() && getOpportunityId()) {
    handleUrlFormat(getOpportunityDetailsPath(getOpportunityId(), `${getOpportunityEventCode()}`));
  }

  return {
    vcard: getAugmentedVCard(entityData, isUpdateRestricted),
    properties: getOpportunityProperties(entityData),
    associatedEntityProperties: getAssociatedLeadProperties(entityData),
    tabs: getAugmentedTabData(entityData?.details?.TabConfiguration),
    attributes: {
      detailsConfiguration: getDetailsConfiguration(entityData),
      fields: getOpportunityFields(entityData),
      metadata: getAugmentedMetaData(entityData)
    },
    entityCode: entityData?.details?.EventCode,
    associatedEntityId: entityData?.details?.RelatedProspectId,
    associatedEntityRepName:
      entityData?.details?.AssociatedLeadData?.metaData?.LeadRepresentationConfig,
    autoId: entityData?.details?.ProspectActivityAutoId
      ? `${entityData?.details?.ProspectActivityAutoId}`
      : undefined
  };
};

export default augmentedOpportunityData;
