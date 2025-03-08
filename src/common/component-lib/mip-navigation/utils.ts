import { getSettingConfig, settingKeys } from 'common/utils/helpers';
import { CallerSource } from 'common/utils/rest-client';

export const isAppTabsEnabled = async (): Promise<boolean> => {
  const appTabsEnabled = await getSettingConfig<string>(
    settingKeys.EnableAppTabsForMarvinSWLite,
    CallerSource.MiPNavMenu
  );

  return appTabsEnabled === '1';
};
