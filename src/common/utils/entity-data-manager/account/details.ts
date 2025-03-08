import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES, ERROR_MSG } from 'common/constants';
import { CallerSource, Module, httpPost } from '../../rest-client';
import { ICachedAccountDetails } from 'common/types/entity/account/cache.types';
import { IAccountDetails, IAccountDetailsRequest } from 'common/types/entity/account/details.types';
import { isValidGuid } from '../../helpers';
import { getAccountDetailsCache, setAccountDetailsCache } from './cache-details';
import { getAccountId } from '../../helpers/helpers';

const validateEntityId = (entityId: string): void => {
  if (!entityId || !isValidGuid(entityId)) {
    trackError(ERROR_MSG.invalidEntityId);
    throw new Error(ERROR_MSG.invalidEntityId);
  }
};

const getAccountDetailsRequestBody = (
  cachedLeadDetails?: ICachedAccountDetails
): IAccountDetailsRequest => {
  const accountId = getAccountId() ?? '';

  validateEntityId(accountId);
  return {
    AccountId: accountId,
    CanGetFormConfiguration: !(
      cachedLeadDetails?.VCardConfiguration &&
      cachedLeadDetails?.AttributeDetailsConfiguration &&
      cachedLeadDetails.PropertiesConfiguration
    ),
    CanGetTabConfiguration: !cachedLeadDetails?.TabsConfiguration,
    CanGetActionConfiguration: !cachedLeadDetails?.ActionsConfiguration
  };
};

const getAccountDetails = async (
  callerSource: CallerSource,
  cachedLeadDetails?: ICachedAccountDetails
): Promise<IAccountDetails> => {
  try {
    return await httpPost({
      path: API_ROUTES.accountDetails,
      module: Module.Marvin,
      body: getAccountDetailsRequestBody(cachedLeadDetails),

      callerSource: callerSource
    });
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchDetails = async (callerSource: CallerSource): Promise<IAccountDetails> => {
  try {
    const accountId = getAccountId() ?? '';
    const cachedLeadDetails = getAccountDetailsCache(accountId);
    let response = await getAccountDetails(callerSource, cachedLeadDetails);

    if (cachedLeadDetails) {
      response = { ...response, ...cachedLeadDetails };
    } else {
      setAccountDetailsCache(response, accountId);
    }
    return response;
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export { fetchDetails, getAccountDetails };
