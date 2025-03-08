import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES, APP_ROUTE } from 'common/constants';
import { getSettingConfig, safeParseJson, settingKeys } from 'common/utils/helpers';
import { createStoredPromise, getStoredPromise } from 'common/utils/helpers/promise-helpers';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { getFromDB, setInDB, StorageKey } from 'common/utils/storage-manager';
import { ILeadTypeConfig } from './lead-type.types';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';

const fetchLeadTypeConfig = async (
  callerSource: CallerSource
): Promise<Record<string, ILeadTypeConfig>> => {
  try {
    const cachedResponse = await getFromDB(StorageKey.LeadTypeConfig);
    if (cachedResponse) {
      return cachedResponse as Record<string, ILeadTypeConfig>;
    }

    if (!getStoredPromise(StorageKey.LeadTypeConfig)) {
      createStoredPromise(
        StorageKey.LeadTypeConfig,
        httpGet({
          path: `${API_ROUTES.leadTypesGet}`,
          module: Module.Marvin,
          callerSource: callerSource
        })
      );
    }

    const leadTypeConfigMap = createHashMapFromArray<ILeadTypeConfig>(
      await getStoredPromise(StorageKey.LeadTypeConfig),
      'InternalName'
    );
    setInDB(StorageKey.LeadTypeConfig, leadTypeConfigMap, true);

    return leadTypeConfigMap;
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchLeadTypeSetting = async (callerSource: CallerSource): Promise<string | null> => {
  try {
    if (!getStoredPromise<string | null>(settingKeys.ClassifyLeadTypesAsEntity)) {
      createStoredPromise(
        settingKeys.ClassifyLeadTypesAsEntity,
        getSettingConfig<string>(settingKeys.ClassifyLeadTypesAsEntity, callerSource)
      );
    }

    return await getStoredPromise<string | null>(settingKeys.ClassifyLeadTypesAsEntity);
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchLeadTypeProcessV1RevertSetting = async (
  callerSource: CallerSource
): Promise<string | null> => {
  try {
    if (!getStoredPromise<string | null>(settingKeys.IsLeadTypeProcessV1RevertEnabled)) {
      createStoredPromise(
        settingKeys.IsLeadTypeProcessV1RevertEnabled,
        getSettingConfig<string>(settingKeys.IsLeadTypeProcessV1RevertEnabled, callerSource)
      );
    }

    return await getStoredPromise<string | null>(settingKeys.IsLeadTypeProcessV1RevertEnabled);
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchSVLeadTypeSetting = async (callerSource: CallerSource): Promise<boolean> => {
  try {
    if (!getStoredPromise<string | null>(settingKeys.EnableLeadTypeSmartView)) {
      createStoredPromise(
        settingKeys.EnableLeadTypeSmartView,
        getSettingConfig<string>(settingKeys.EnableLeadTypeSmartView, callerSource)
      );
    }

    const isSVLeadTypeEnabled = await getStoredPromise<string | null>(
      settingKeys.EnableLeadTypeSmartView
    );
    return isSVLeadTypeEnabled === '1';
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export const isLeadTypeSupportedInManageEntity = (): boolean => {
  const pathName = window?.location?.pathname?.toLowerCase();
  return (
    pathName === APP_ROUTE.platformManageTasks ||
    pathName === APP_ROUTE.platformManageLeads ||
    pathName === APP_ROUTE.platformManageLists ||
    pathName === APP_ROUTE.listDetails
  );
};

export const isLeadTypeEnabledForProcess = async (callerSource: CallerSource): Promise<boolean> => {
  try {
    if (!isLeadTypeSupportedInManageEntity()) return false;

    const [processV1RevertSetting, leadTypeSetting] = await Promise.all([
      fetchLeadTypeProcessV1RevertSetting(callerSource),
      fetchLeadTypeSetting(callerSource)
    ]);

    const isProcessV1RevertSettingEnabled = processV1RevertSetting === '1';
    const isLeadTypeSettingEnabled =
      safeParseJson<{ IsEnabled: boolean }>(leadTypeSetting ?? '{}')?.IsEnabled === true;

    return !isProcessV1RevertSettingEnabled && isLeadTypeSettingEnabled;
  } catch (error) {
    trackError(error);
  }
  return false;
};

// eslint-disable-next-line complexity
const isLeadTypeEnabled = async (
  callerSource: CallerSource,
  ignoreSVLeadTypeSetting?: boolean
): Promise<boolean> => {
  try {
    const pathName = window?.location?.pathname?.toLowerCase();
    const setting = await fetchLeadTypeSetting(callerSource);
    const isEnabled = safeParseJson<{ IsEnabled: boolean }>(setting ?? '')?.IsEnabled === true;

    if (ignoreSVLeadTypeSetting) {
      return isEnabled;
    }

    if ([APP_ROUTE.smartviews, APP_ROUTE.platformSV].includes(pathName)) {
      const isSVLeadTypeEnabled = await fetchSVLeadTypeSetting(callerSource);
      return isEnabled && isSVLeadTypeEnabled;
    } else if ([APP_ROUTE.leadDetails, APP_ROUTE.platformLD].includes(pathName)) {
      return isEnabled;
    } else if (isLeadTypeSupportedInManageEntity()) {
      return isEnabled;
    }
  } catch (error) {
    trackError(error);
  }

  return false;
};

const isDefaultLeadType = async (
  leadTypeInternalName: string,
  callerSource: CallerSource
): Promise<boolean> => {
  try {
    const allLeadTypes = await fetchLeadTypeConfig(callerSource);
    return allLeadTypes[leadTypeInternalName]?.IsDefault ?? false;
  } catch (error) {
    trackError(error);
  }
  return false;
};

const getLeadTypeName = async (
  leadTypeInternalName: string,
  callerSource: CallerSource
): Promise<string> => {
  const leadTypeConfigMap = await fetchLeadTypeConfig(callerSource);
  return leadTypeConfigMap[leadTypeInternalName]?.Name ?? '';
};

export {
  isLeadTypeEnabled,
  fetchLeadTypeConfig,
  isDefaultLeadType,
  fetchLeadTypeProcessV1RevertSetting,
  getLeadTypeName
};
