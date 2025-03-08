import { IActionConfig } from 'apps/entity-details/types';
import { IAddActivityForms } from 'apps/entity-details/types/action.types';
import {
  IActivityProcessBtnConfig,
  IProcessConfig
} from 'apps/entity-details/types/entity-data.types';
import { ISettingConfiguration } from 'common/types/entity/lead';
import { safeParseJson } from 'common/utils/helpers';
import { ACTION } from 'apps/entity-details/constants';

const getAddActivityForms = async (): Promise<IAddActivityForms[]> => {
  return [];
};

export const handleProcessButton = async (
  actions: IActionConfig[],
  settingConfig?: ISettingConfiguration
): Promise<IProcessConfig | null> => {
  if (!actions?.length) {
    return null;
  }

  const processAction = actions?.find((action) => action?.id === ACTION.Processes);

  if (!processAction) return null;

  const processConfig = safeParseJson(
    settingConfig?.ActivityProcessBtnConfig || '{}'
  ) as IActivityProcessBtnConfig;

  const addActivityForms = await getAddActivityForms();

  //TODO: Uncomment the line below once the `getAddActivityForms` function is implemented.
  // if (!addActivityForms?.length) {
  //   return null;
  // }

  let processTitle = processConfig?.displayName;

  if (addActivityForms?.length === 1) {
    processTitle = addActivityForms?.[0]?.Entity?.DisplayProperty?.DisplayName || '';
  }

  return { title: processTitle, isProcessPresent: true };
};
