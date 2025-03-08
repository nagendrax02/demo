import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { API_ROUTES } from 'common/constants';

const NULL = 'null';

const updateSettingCache = <T>(key, value: T): void => {
  const setting = (getItem(StorageKey.Setting) as Record<string, T>) || {};

  setting[key] = value || (NULL as T);

  setItem(StorageKey.Setting, setting);
};

export const settingKeys = {
  ConverseConfiguration: 'ConverseConfiguration',
  DisableSalesActivity: 'DisableSalesActivity',
  AccountEntitySettings: 'AccountEntitySettings',
  IsOMEnabled: 'IsOMEnabled',
  ShowSalesGroupFilterForSVOpp: 'ShowSalesGroupFilterForOpportunityGrid_SmartView',
  enableOppNameColumnCustomization: 'EnableOpportunityNameColumnCustomization_SmartView',
  EnableESSForLeadManagement: 'EnableESSForLeadManagement',
  ClassifyLeadTypesAsEntity: 'ClassifyLeadTypesAsEntity',
  IsLeadDetailsFullScreenModeEnabled: 'IsLeadDetailsFullScreenModeEnabled',
  EnableLeadTypeSmartView: 'EnableLeadType_SmartView',
  EntityDetailsViewConfiguration: 'EntityDetailsViewConfiguration',
  EnableDynamicFormsToSaveAsDrafts: 'EnableDynamicFormsToSaveAsDrafts',
  ActionPanelButtonsConfiguration: 'ActionPanelButtonsConfiguration',
  EnableAppTabsForMarvinSWLite: 'EnableAppTabsForMarvinSWLite',
  IsLeadTypeProcessV1RevertEnabled: 'IsLeadTypeProcessV1RevertEnabled'
};

const getSettingConfig = async <T>(key: string, callerSource: CallerSource): Promise<T | null> => {
  try {
    const setting = getItem(StorageKey.Setting) as Record<string, T>;

    if (setting?.[key]) {
      const value = setting?.[key];
      return value === NULL ? null : value;
    }

    const response = (await httpPost({
      path: API_ROUTES.setting,
      module: Module.Marvin,
      body: [key],
      callerSource
    })) as Record<string, T>;

    updateSettingCache(key, response?.[key]);
    return response?.[key];
  } catch (error) {
    trackError(error);
  }
  return null;
};

export { getSettingConfig };
