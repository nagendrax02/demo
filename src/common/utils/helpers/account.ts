import { trackError } from 'common/utils/experience/utils/track-error';
import { Module, httpPost } from 'common/utils/rest-client';
import { StorageKey, setItem, getItem } from 'common/utils/storage-manager';
import { CallerSource } from 'common/utils/rest-client/rest-client.types';
import { API_ROUTES } from 'common/constants';
import {
  isMiP,
  openEntityDetailsPagesInPlatform,
  openEntityDetailsPagesInStandalone
} from './helpers';
import { EntityType } from 'common/types';
import { IAccountDetails } from '../../types/entity';

export interface IAccountCoreData {
  accountTypeName: string;
  accountTypeId: string;
  accountName: string;
}
interface IAccountTypeName {
  id?: IAccountCoreData;
}

const getAccountCoreDataFromCache = (id: string): IAccountCoreData | null => {
  const storedData: IAccountTypeName = getItem(StorageKey.AccountData) || {};
  if (storedData[id]) return storedData[id] as IAccountCoreData;
  return null;
};

const setAccountCoreDataInCache = (id: string, accountData: IAccountCoreData): void => {
  const storedData: IAccountTypeName = getItem(StorageKey.AccountData) || {};
  storedData[id] = accountData;
  setItem(StorageKey.AccountData, storedData);
};

export const getAccountData = async (id: string): Promise<IAccountDetails> => {
  try {
    const response = (await httpPost({
      path: API_ROUTES.accountDetailsGet,
      module: Module.Marvin,
      body: {
        AccountId: id,
        CanGetFormConfiguration: false,
        CanGetTabConfiguration: false,
        CanGetActionConfiguration: false
      },
      callerSource: CallerSource.ActivityHistory
    })) as IAccountDetails;
    if (response) {
      setAccountCoreDataInCache(id, {
        accountTypeName: response?.AccountTypeName,
        accountTypeId: response?.AccountTypeId,
        accountName: response?.Fields?.CompanyName || ''
      });
    }
    return response;
  } catch (error) {
    trackError('error while fetching account details ', error);
    throw error;
  }
};

export const getAccountTypeName = async (id: string): Promise<string> => {
  const cachedAccountData = getAccountCoreDataFromCache(id);
  if (cachedAccountData) return cachedAccountData?.accountTypeName || '';
  const accountData = await getAccountData(id);
  return accountData?.AccountTypeName || '';
};

export const getAccountTypeId = async (id: string): Promise<string> => {
  const cachedAccountData = getAccountCoreDataFromCache(id);
  if (cachedAccountData) return cachedAccountData?.accountTypeId || '';
  const accountData = await getAccountData(id);
  return accountData?.AccountTypeId || '';
};

export const getAccountCoreData = async (id: string): Promise<IAccountCoreData | undefined> => {
  if (!id) return undefined;
  const cachedAccountData = getAccountCoreDataFromCache(id);
  if (cachedAccountData) return cachedAccountData;
  const accountData = await getAccountData(id);
  return {
    accountTypeName: accountData?.AccountTypeName,
    accountTypeId: accountData?.AccountTypeId,
    accountName: accountData?.Fields?.CompanyName || ''
  };
};

export const openAccountDetailTab = async ({
  accountId,
  accountTypeCode,
  accountTypeName,
  openInNewTab
}: {
  accountId: string;
  accountTypeName?: string;
  accountTypeCode?: string;
  openInNewTab?: boolean;
}): Promise<void> => {
  if (accountId) {
    if (isMiP()) {
      const accountType = accountTypeName || (await getAccountTypeName(accountId));
      if (accountType) {
        openEntityDetailsPagesInPlatform({
          entity: EntityType.Account,
          id: accountId,
          accountType: accountType,
          openInNewTab
        });
      }
    } else {
      const accountTypeId = accountTypeCode || (await getAccountTypeId(accountId));
      if (accountTypeId) {
        openEntityDetailsPagesInStandalone({
          entity: EntityType.Account,
          id: accountId,
          accountTypeId: accountTypeId,
          openInNewTab
        });
      }
    }
  }
};
