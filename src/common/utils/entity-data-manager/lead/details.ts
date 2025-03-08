import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { getEntityId } from 'common/utils/helpers';
import { ILeadDetails, ILeadDetailsRequest } from 'common/types/entity/lead';
import { getLeadDetailsCache, setLeadDetailsCache } from './cache-details';
import { ICachedLeadDetails } from 'common/types/entity/lead/cache.types';
import { validateEntityId } from '../common-utils/utils';
import { isLeadTypeEnabled } from '../../lead-type/settings';

const getLeadDetailsRequestBody = (
  cachedLeadDetails?: ICachedLeadDetails,
  customLeadId?: string
): ILeadDetailsRequest => {
  const leadId = customLeadId ? customLeadId : getEntityId();
  validateEntityId(leadId);
  return {
    Id: leadId,
    CanGetFormConfiguration: !(
      cachedLeadDetails?.VCardConfiguration && cachedLeadDetails?.LeadDetailsConfiguration
    ),
    CanGetTabConfiguration: !cachedLeadDetails?.TabsConfiguration,
    CanGetActionConfiguration: !(
      cachedLeadDetails?.ActionsConfiguration && cachedLeadDetails?.ConnectorConfiguration
    ),
    CanGetSettingConfiguration: !cachedLeadDetails?.SettingConfiguration
  };
};

const getLeadDetails = async (
  callerSource: CallerSource,
  cachedLeadDetails?: ICachedLeadDetails,
  customLeadId?: string
): Promise<ILeadDetails> => {
  try {
    return await httpPost({
      path: API_ROUTES.leadDetails,
      module: Module.Marvin,
      body: getLeadDetailsRequestBody(cachedLeadDetails, customLeadId),
      callerSource: callerSource
    });
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchDetailsOfNonLeadType = async (
  callerSource: CallerSource,
  customLeadId?: string
): Promise<ILeadDetails> => {
  const cachedLeadDetails = getLeadDetailsCache();
  let response = await getLeadDetails(callerSource, cachedLeadDetails, customLeadId);

  if (cachedLeadDetails) {
    response = { ...response, ...cachedLeadDetails };
  } else {
    setLeadDetailsCache(response);
  }

  return response;
};

const fetchDetails = async (
  callerSource: CallerSource,
  customLeadId?: string,
  leadType?: string
): Promise<ILeadDetails> => {
  try {
    const leadTypeEnabled = await isLeadTypeEnabled(callerSource);

    let response: ILeadDetails;

    if (leadTypeEnabled) {
      response = await (
        await import('../../lead-type/fetch-details')
      ).fetchDetailsOfLeadType(callerSource, customLeadId, leadType);

      const leadId = customLeadId ?? getEntityId();
      if (response?.Fields?.LeadType) {
        window[`lead_type_data_${leadId}`] = response?.Fields?.LeadType;
      }
      return response;
    } else {
      return await fetchDetailsOfNonLeadType(callerSource, customLeadId);
    }
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export { fetchDetails, getLeadDetails, getLeadDetailsRequestBody };
