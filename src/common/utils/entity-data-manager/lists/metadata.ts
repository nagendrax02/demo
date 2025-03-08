import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource } from 'common/utils/rest-client';
import { ILeadMetadataMap } from 'common/types/entity/lead';
import { IScheduledEmailCount } from 'common/types/entity/list/detail.types';
import { fetchMetadataOfNonLeadType } from '../lead/metadata';
import { getScheduledEmailCount } from 'apps/smart-views/components/custom-tabs/utils';

const fetchScheduledEmailCount = async (
  callerSource: CallerSource,
  listId: string
): Promise<number> => {
  try {
    const scheduledEmailCount: IScheduledEmailCount = await getScheduledEmailCount({
      listIds: [listId],
      callerSource
    });
    return scheduledEmailCount?.[listId] || 0;
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchMetaData = async (callerSource: CallerSource): Promise<ILeadMetadataMap> => {
  try {
    return await fetchMetadataOfNonLeadType(callerSource);
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export { fetchMetaData, fetchScheduledEmailCount };
