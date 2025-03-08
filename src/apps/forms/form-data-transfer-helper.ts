import { StorageKey, getItem } from 'src/common/utils/storage-manager';
import {
  IAuthDetails,
  IModulesConfig,
  IStorageData,
  ITenantDetails,
  IUserDetails
} from './forms.types';
import { getEnvConfig } from 'src/common/utils/helpers';
import { ENV_CONFIG } from 'src/common/constants';
import {
  MARVIN_ORG_PLACEHOLDER,
  MARVIN_REGION_PLACEHOLDER,
  ORGCODE_PLACEHOLDER,
  REGION_PLACEHOLDER
} from 'src/common/utils/rest-client/constant';

// getEnvConfig(ENV_CONFIG.authAPIBaseURL)

function generateModuleConfigData(): IModulesConfig[] | null {
  const moduleApiURl = getEnvConfig(ENV_CONFIG.formsApiURL) as Record<string, string>;
  const moduleConfigs: IModulesConfig[] = [];
  if (!moduleApiURl) {
    throw new Error('Error getting module api urls');
  }
  const moduleApiURlCopy = { ...moduleApiURl };
  for (const [moduleName, url] of Object.entries(moduleApiURlCopy)) {
    let augmentedUrl = url.replace(ORGCODE_PLACEHOLDER, MARVIN_ORG_PLACEHOLDER);
    augmentedUrl = augmentedUrl.replace(REGION_PLACEHOLDER, MARVIN_REGION_PLACEHOLDER);
    const moduleConfig: IModulesConfig = {
      Name: moduleName,
      APIURL: {
        FrontEndAPIURL: augmentedUrl,
        Name: moduleName
      }
    };
    moduleConfigs.push(moduleConfig);
  }
  return moduleConfigs;
}

function generateAuthStorageData(): IStorageData | null {
  try {
    const authData: IStorageData | null = getItem(StorageKey?.Auth);
    if (!authData) {
      throw new Error('Problem getting auth data');
    }
    const tokenData: IAuthDetails = authData?.Tokens;
    const userData: IUserDetails = authData?.User;
    const tenantData: ITenantDetails = authData?.Tenant;
    const moduleConfigs = generateModuleConfigData();
    if (!moduleConfigs) return null;
    tenantData.OrgCode = userData.OrgCode;
    return {
      Tokens: tokenData,
      User: userData,
      Tenant: tenantData,
      ModulesConfig: moduleConfigs
    };
  } catch (err) {
    // console.log(err);
    return null;
  }
}

export default generateAuthStorageData;
