import { trackError } from 'common/utils/experience/utils/track-error';
import { StorageKey, getItem } from '../storage-manager';
import {
  IAuthDetails,
  IMarvinStorageData,
  ITenantDetails,
  IUserDetails
} from './marvin-helper.types';

export const generateAuthStorageData = (): IMarvinStorageData | null => {
  try {
    const authData: IMarvinStorageData | null = getItem(StorageKey?.Auth);
    if (!authData) {
      return null;
    }
    const tokenData: IAuthDetails = authData?.Tokens;
    const userData: IUserDetails = authData?.User;
    const tenantData: ITenantDetails = authData?.Tenant;
    tenantData.OrgCode = userData.OrgCode;
    return {
      Tokens: tokenData,
      User: userData,
      Tenant: tenantData
    };
  } catch (error) {
    trackError(error);
    return null;
  }
};
