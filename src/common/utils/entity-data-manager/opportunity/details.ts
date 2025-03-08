import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import {
  getOpportunityEventCode,
  getOpportunityId,
  getSettingConfig,
  safeParseJson,
  settingKeys
} from 'common/utils/helpers';
import { getOpportunityDetailsCache, setOpportunityDetailsCache } from './cache-details';
import { IOpportunityDetails } from 'common/types/entity';
import {
  ICachedOpportunityDetails,
  IOpportunityDetailsRequest
} from 'common/types/entity/opportunity';
import { validateEntityId } from '../common-utils/utils';
import { fetchData as fetchLeadData } from '../lead/lead';
import { getFromDB, setInDB, StorageKey } from '../../storage-manager';

const getIsODVCEnabled = async (): Promise<boolean> => {
  try {
    const cachedData = await getFromDB(StorageKey.IsODVCEnabled);
    if (typeof cachedData !== 'boolean') {
      const response = (await getSettingConfig(
        settingKeys.EntityDetailsViewConfiguration,
        CallerSource.OpportunityDetails
      )) as string;
      const isODVCEnabled = (safeParseJson(response) as Record<string, unknown>)
        ?.IsEnabled as boolean;
      await setInDB(StorageKey.IsODVCEnabled, isODVCEnabled);
      return isODVCEnabled;
    }
    return cachedData;
  } catch (err) {
    trackError(err);
  }
  return false;
};

const getOpportunityDetailsRequestBody = (
  cachedOpportunityDetails?: ICachedOpportunityDetails,
  isODVCEnabled?: boolean
): IOpportunityDetailsRequest => {
  const opportunityId = getOpportunityId();
  validateEntityId(opportunityId);
  return {
    ActivityId: opportunityId,
    CanGetFormConfiguration: !(
      cachedOpportunityDetails?.VCardConfiguration &&
      cachedOpportunityDetails?.OpportunityDetailsConfiguration
    ),
    CanGetTabConfiguration: !cachedOpportunityDetails?.TabConfiguration || !!isODVCEnabled,
    CanGetActionConfiguration: !(
      cachedOpportunityDetails?.ActionsConfiguration &&
      cachedOpportunityDetails?.ConnectorConfiguration
    )
  };
};

const getOpportunityDetails = async (
  callerSource: CallerSource,
  cachedOpportunityDetails?: ICachedOpportunityDetails,
  isODVCEnabled?: boolean
): Promise<IOpportunityDetails> => {
  try {
    return await httpPost({
      path: API_ROUTES.opportunityDetails,
      module: Module.Marvin,
      body: getOpportunityDetailsRequestBody(cachedOpportunityDetails, isODVCEnabled),
      callerSource
    });
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchDetails = async (callerSource: CallerSource): Promise<IOpportunityDetails> => {
  try {
    const eventCode = getOpportunityEventCode();
    const eventCodeString = eventCode ? `${eventCode}` : undefined;
    const cachedOpportunityDetails = getOpportunityDetailsCache(eventCodeString);
    const isODVCEnabled = await getIsODVCEnabled();

    let response = await getOpportunityDetails(
      callerSource,
      cachedOpportunityDetails,
      isODVCEnabled
    );

    if (cachedOpportunityDetails) {
      response = {
        ...response,
        ...cachedOpportunityDetails,
        TabConfiguration: isODVCEnabled
          ? response?.TabConfiguration
          : cachedOpportunityDetails?.TabConfiguration
      };
    } else {
      setOpportunityDetailsCache(response, eventCodeString);
    }

    if (response?.RelatedProspectId) {
      const associatedLeadData = await fetchLeadData(response?.RelatedProspectId);
      response.AssociatedLeadData = associatedLeadData;
    }

    return response;
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export { fetchDetails, getOpportunityDetails, getOpportunityDetailsRequestBody };
