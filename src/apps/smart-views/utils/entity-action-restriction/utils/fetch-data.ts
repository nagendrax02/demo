import { getSettingConfig, safeParseJson, settingKeys } from 'common/utils/helpers';
import { trackError } from 'common/utils/experience';
import { CallerSource } from 'common/utils/rest-client';
import { IVisibilityConfig } from '../entity-action-restriction.types';

export const fetchActionPanelSetting = async (
  callerSource: CallerSource
): Promise<IVisibilityConfig | undefined> => {
  try {
    const configString = await getSettingConfig<string>(
      settingKeys.ActionPanelButtonsConfiguration,
      callerSource
    );

    return configString ? (safeParseJson(configString) as IVisibilityConfig) : undefined;
  } catch (error) {
    trackError(error);
    return undefined;
  }
};
