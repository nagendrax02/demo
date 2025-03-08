import { IAugmentedEntity } from 'apps/entity-details/types';
import { getAugmentedVCard } from './vcard';
import { getAugmentedTabData } from './tabs';
import { ILead } from 'common/types';
import { getAugmentedLeadProperty } from './properties';
import { EntityType } from 'common/types';
import { getAugmentedMetricDetails } from './metric-details';
import { getLeadName } from '../..';
import { updatePageTitle } from 'common/utils/helpers/page-title';
import { getLeadDetailsPath } from 'router/utils/entity-details-url-format';
import { getEntityId } from 'common/utils/helpers';
import { handleUrlFormat } from 'router/utils/url-redirection';
import { getIsFullScreenEnabled } from 'common/component-lib/full-screen-header/full-screen.store';

const augmentedLeadData = (entityData: ILead, isUpdateRestricted?: boolean): IAugmentedEntity => {
  updatePageTitle({
    entityType: EntityType.Lead,
    name: getLeadName(entityData?.details?.Fields),
    representationName: entityData?.metaData?.LeadRepresentationConfig?.SingularName || 'Lead'
  });
  if (!getIsFullScreenEnabled() && getEntityId()) {
    handleUrlFormat(getLeadDetailsPath(getEntityId()));
  }

  return {
    vcard: getAugmentedVCard(entityData, isUpdateRestricted),
    metrics: getAugmentedMetricDetails(entityData),
    properties: getAugmentedLeadProperty(entityData),
    tabs: getAugmentedTabData(entityData?.details?.TabsConfiguration),
    attributes: {
      detailsConfiguration: entityData?.details?.LeadDetailsConfiguration,
      fields: entityData?.details?.Fields,
      metadata: entityData?.metaData
    },
    autoId: entityData?.details?.Fields?.ProspectAutoId || undefined
  };
};

export default augmentedLeadData;
