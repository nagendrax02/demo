import { CallerSource } from 'common/utils/rest-client';
import { IDisableSalesActivitySetting } from 'common/types/sales-activity.types';
import { getSettingConfig, safeParseJson, settingKeys } from 'common/utils/helpers';
import { trackError } from 'common/utils/experience';

export const SALES_ACTIVITY_EVENT_CODE = 30;
export const SALES_ACTIVITY_NAME = 'Sales Activity';

export const getSalesActivitySettings = async (
  callerSource: CallerSource
): Promise<IDisableSalesActivitySetting | null> => {
  try {
    const salesActivitySetting = await getSettingConfig<string>(
      settingKeys.DisableSalesActivity,
      callerSource
    );

    const settings = salesActivitySetting
      ? safeParseJson<IDisableSalesActivitySetting>(salesActivitySetting)
      : null;

    return settings;
  } catch (error) {
    trackError(error);
  }
  return null;
};

export const getSalesActivityDisplayName = async (callerSource: CallerSource): Promise<string> => {
  try {
    const module = await import('common/utils/entity-data-manager/activity');
    const salesActivity = await module.default.fetchMetaData(
      SALES_ACTIVITY_EVENT_CODE,
      callerSource
    );
    return salesActivity?.DisplayName ?? SALES_ACTIVITY_NAME;
  } catch (error) {
    trackError(error);
  }

  return SALES_ACTIVITY_NAME;
};
