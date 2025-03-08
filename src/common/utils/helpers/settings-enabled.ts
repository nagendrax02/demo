import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource } from '../rest-client';
import { getItem, StorageKey } from '../storage-manager';
import { getSettingConfig, settingKeys } from './settings';

interface IResponse {
  IsOMEnabled: string;
}

const isOpportunityEnabled = async (callerSource: CallerSource): Promise<boolean> => {
  try {
    const isOMEnabled =
      (await getSettingConfig(settingKeys.IsOMEnabled, callerSource)) || ({} as IResponse);

    if (isOMEnabled === '0') {
      return false;
    } else if (isOMEnabled === '1') {
      return true;
    }
  } catch (error) {
    trackError(error);
  }
  return false;
};

const getIsAccountEnabled = async (callerSource: CallerSource): Promise<boolean> => {
  try {
    const accountEntitySettings = await getSettingConfig(
      settingKeys.AccountEntitySettings,
      callerSource
    );

    if (accountEntitySettings === null || accountEntitySettings === '0') {
      return false;
    }
    return true;
  } catch (error) {
    trackError(error);
  }
  return false;
};

const getIsFullScreenEnabled = async (callerSource: CallerSource): Promise<boolean> => {
  try {
    const detailsFromCache = (getItem(StorageKey.Setting) as Record<string, string>)
      ?.IsLeadDetailsFullScreenModeEnabled;
    if (!detailsFromCache) {
      const fullScreenSettings = await getSettingConfig(
        settingKeys.IsLeadDetailsFullScreenModeEnabled,
        callerSource
      );
      return fullScreenSettings === '1';
    }
    return detailsFromCache === '1';
  } catch (error) {
    trackError(error);
  }
  return false;
};

export { isOpportunityEnabled, getIsAccountEnabled, getIsFullScreenEnabled };
