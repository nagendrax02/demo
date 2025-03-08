import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource } from 'src/common/utils/rest-client';
import { fetchSmartViewOppMetadata } from './opportunity-metadata';
import { fetchLeadMetadataForOpportunity } from './lead-metadata';
import { IAugmentedSmartViewEntityMetadata } from '../../common-utilities/common.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';

export const fetchOppAndLeadMetaData = async (
  entityCode: string,
  tabId: string
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName: IEntityRepresentationName;
  leadRepName?: IEntityRepresentationName;
}> => {
  try {
    const [leadMetadata, oppMetaData] = await Promise.all([
      fetchLeadMetadataForOpportunity(tabId),
      fetchSmartViewOppMetadata(entityCode, CallerSource.SmartViews)
    ]);

    return {
      metaDataMap: { ...leadMetadata?.metaDataMap, ...oppMetaData?.metaDataMap },
      leadRepName: leadMetadata.representationName,
      representationName: oppMetaData?.representationName
    };
  } catch (error) {
    trackError(error);
  }
  return { metaDataMap: {}, representationName: DEFAULT_ENTITY_REP_NAMES.opportunity };
};
