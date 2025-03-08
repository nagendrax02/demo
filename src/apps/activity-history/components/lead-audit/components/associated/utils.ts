import { trackError } from 'common/utils/experience/utils/track-error';
import { APP_ROUTE } from 'common/constants';
import { EntityType } from 'common/types';
import { isMiP } from 'common/utils/helpers';
import { getAccountCoreData } from 'common/utils/helpers/account';
import { getAccountDetailsPath } from 'router/utils/entity-details-url-format';

const getLeadUrls = (oldValue: string, newValue: string): Record<string, string> => {
  try {
    const oldValueLeadId = oldValue?.split?.('}')?.[1];
    const newValueLeadId = newValue?.split?.('}')?.[1];

    const oldValueUrl = `${
      isMiP() ? APP_ROUTE.platformLD : APP_ROUTE.leadDetails
    }?LeadID=${oldValueLeadId}`;
    const newValueUrl = `${
      isMiP() ? APP_ROUTE.platformLD : APP_ROUTE.leadDetails
    }?LeadID=${newValueLeadId}`;

    return {
      [oldValueLeadId]: oldValueUrl,
      [newValueLeadId]: newValueUrl
    };
  } catch (err) {
    trackError(err);
    return {};
  }
};

const getAccountUrls = async (
  oldValue: string,
  newValue: string
): Promise<Record<string, string>> => {
  try {
    const oldValueAccountId = oldValue?.split?.('{mxseperator}')?.[1];
    const newValueAccountId = newValue?.split?.('{mxseperator}')?.[1];

    const [oldValueAccountData, newValueAccountData] = await Promise.all([
      getAccountCoreData(oldValueAccountId),
      getAccountCoreData(newValueAccountId)
    ]);

    const oldValueUrl = getAccountDetailsPath(
      oldValueAccountData?.accountTypeName || '',
      oldValueAccountId,
      oldValueAccountData?.accountTypeId || ''
    );

    const newValueUrl = getAccountDetailsPath(
      newValueAccountData?.accountTypeName || '',
      newValueAccountId,
      newValueAccountData?.accountTypeId || ''
    );

    return {
      [oldValueAccountId]: oldValueUrl,
      [newValueAccountId]: newValueUrl
    };
  } catch (err) {
    trackError(err);
    return {};
  }
};

export const getEntityUrls = async (
  oldValue: string,
  newValue: string,
  type?: EntityType
): Promise<Record<string, string>> => {
  try {
    if (type === EntityType.Account) {
      return getLeadUrls(oldValue, newValue);
    } else {
      const accountUrls = await getAccountUrls(oldValue, newValue);
      return accountUrls;
    }
  } catch (err) {
    trackError(err);
    return {};
  }
};
