import { ACTION } from 'apps/entity-details/constants';
import { IActionConfig } from 'apps/entity-details/types';
import {
  getSalesActivityDisplayName,
  getSalesActivitySettings,
  SALES_ACTIVITY_NAME
} from 'common/utils/helpers/sales-activity';
import { getCallerSource } from './utils';

const handleSalesActivityButton = async (actions: IActionConfig[]): Promise<string | null> => {
  const salesActivityConfig = actions?.find((action) => action?.id === ACTION.SalesActivity);
  if (!salesActivityConfig) return null;

  const settingConfig = await getSalesActivitySettings(getCallerSource());

  if (!settingConfig?.Settings?.RetrictUsersFromNewActivity) {
    return getSalesActivityDisplayName(getCallerSource());
  }
  return SALES_ACTIVITY_NAME;
};

export { handleSalesActivityButton };
