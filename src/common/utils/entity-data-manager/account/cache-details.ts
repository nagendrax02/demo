import { trackError } from 'common/utils/experience/utils/track-error';
import { ICachedAccountDetails } from 'common/types/entity/account/cache.types';
import { StorageKey, getItem, setItem } from '../../storage-manager';
import {
  IAccountDetails,
  IAccountTabsConfiguration
} from 'common/types/entity/account/details.types';

const setAccountDetailsCache = (accountDetails: IAccountDetails, accountTypeId: string): void => {
  try {
    const { Fields, ...filteredAccountDetails } = accountDetails;
    const details =
      (getItem(StorageKey.ADCompoundData) as Record<string, ICachedAccountDetails>) || {};
    details[accountTypeId] = filteredAccountDetails;
    setItem(StorageKey.ADCompoundData, details);
    const ids = (getItem(StorageKey.ADType) as Record<string, string>) || {};
    ids[accountTypeId] = accountDetails?.AccountTypeId;
    setItem(StorageKey.ADType, ids);
  } catch (error) {
    trackError(error);
  }
};

const getAccountDetailsCache = (accountTypeId: string): ICachedAccountDetails | undefined => {
  try {
    const details =
      (getItem(StorageKey.ADCompoundData) as Record<string, ICachedAccountDetails>) || {};
    return details?.[accountTypeId];
  } catch (error) {
    trackError(error);
  }
};

const updateAccountTabConfiguration = (
  tabConfiguration: IAccountTabsConfiguration[],
  accountTypeId: string
): void => {
  try {
    const cachedLeadData = getAccountDetailsCache(accountTypeId);
    if (!cachedLeadData) return;

    cachedLeadData.TabsConfiguration = tabConfiguration;
    setAccountDetailsCache({ ...cachedLeadData, Fields: {} }, accountTypeId);
  } catch (error) {
    trackError(error);
  }
};

export { getAccountDetailsCache, setAccountDetailsCache, updateAccountTabConfiguration };
