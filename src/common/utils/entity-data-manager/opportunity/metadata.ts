import { trackError } from 'common/utils/experience/utils/track-error';
import { IOpportunityMetaData } from 'common/types';
import { getOpportunityMetaDataCache, setOpporunityMetaDataCache } from './cache-metadata';
import { CallerSource, Module, httpGet } from '../../rest-client';
import { API_ROUTES } from '../../../constants';
import { getOpportunityEventCode } from '../../helpers';
import { EntityType, IActivityAttribute, IActivityMetaData } from '../activity/activity.types';
import { createHashMapFromArray } from '../../helpers/helpers';

export const getOpportunityMetaData = async (
  callerSource: CallerSource,
  code?: number
): Promise<IOpportunityMetaData> => {
  try {
    const eventCode = code ?? getOpportunityEventCode();
    let result: IOpportunityMetaData = {
      Id: '',
      Code: eventCode,
      EntityType: EntityType.Opportunity
    };

    const response = (await httpGet({
      path: `${API_ROUTES.opportunityMetaData}?code=${eventCode}`,
      module: Module.Marvin,
      callerSource
    })) as IActivityMetaData;

    const metaDataMap = createHashMapFromArray<IActivityAttribute>(
      response?.Fields || [],
      'SchemaName'
    );

    if (response) result = { ...response, Fields: metaDataMap } as IOpportunityMetaData;
    return result;
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export const fetchMetaData = async (
  callerSource: CallerSource,
  eventCode?: string
): Promise<IOpportunityMetaData> => {
  try {
    const oppEventCode = parseInt(eventCode || '0', 10) || getOpportunityEventCode();
    const cachedLeadMetaData = getOpportunityMetaDataCache(oppEventCode);
    if (cachedLeadMetaData) return cachedLeadMetaData;

    const response = await getOpportunityMetaData(callerSource, oppEventCode);
    setOpporunityMetaDataCache(response, oppEventCode);

    return response;
  } catch (error) {
    trackError(error);
    throw error;
  }
};
