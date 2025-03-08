import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource } from 'src/common/utils/rest-client';
import { fetchSmartViewActivityMetadata } from './activity-metadata';
import { fetchLeadMetadataForActivity } from './lead-metadata';
import { IAugmentedSmartViewEntityMetadata } from '../../common-utilities/common.types';
import { IEntityRepresentationName } from 'src/apps/entity-details/types/entity-data.types';

export const fetchActivityAndLeadMetaData = async (
  entityCode: string,
  tabId: string
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  leadRepName?: IEntityRepresentationName;
}> => {
  try {
    const [leadMetadata, activityMetaData] = await Promise.all([
      fetchLeadMetadataForActivity(tabId),
      fetchSmartViewActivityMetadata(entityCode, CallerSource.SmartViews)
    ]);

    return {
      metaDataMap: { ...leadMetadata?.metaDataMap, ...activityMetaData?.metaDataMap },
      leadRepName: leadMetadata.representationName
    };
  } catch (error) {
    trackError(error);
  }
  return { metaDataMap: {} };
};
