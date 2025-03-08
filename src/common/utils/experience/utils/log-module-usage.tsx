import { getUUId } from 'common/utils/helpers/helpers';
import { getExperienceId, logExperienceEvent } from '../experience.store';
import { getExperienceKey } from './utils';
import { ExperienceType } from '../experience-modules';
import { EVENT_TYPE, PAGE_ACTION } from '../constant';

const getModuleAndExperienceId = (usageModule?: string): { id: string; module: string } => {
  const experienceConfig = getExperienceKey();

  return {
    module: usageModule ?? experienceConfig?.module,
    id:
      getExperienceId({
        module: experienceConfig.module,
        experience: ExperienceType.Load,
        key: experienceConfig.key
      }) || getUUId()
  };
};

interface IModuleData {
  workArea: string;
  module?: string;
  entityType?: string;
  subWorkArea?: string | number;
  workAreaValue?: string | number;
  additionalData?: Record<string, unknown>;
}
export const logModuleUsage = async (usageData: IModuleData): Promise<void> => {
  if (!usageData?.workArea) return;

  const experienceConfig = getModuleAndExperienceId(usageData.module);

  const log = {
    ...(usageData || {}),
    module: experienceConfig.module,
    workArea: usageData?.workArea ?? '',
    subWorkArea: usageData?.subWorkArea ?? '',
    workAreaValue: usageData?.workAreaValue ?? '',
    experience: ExperienceType.ModuleUsage,
    event: ExperienceType.ModuleUsage,
    experienceId: experienceConfig.id,
    isExperience: 0,
    hasError: 0,
    additionalData: usageData?.additionalData
      ? JSON.stringify(usageData?.additionalData)
      : undefined,
    entityType: usageData.entityType
  };

  logExperienceEvent({
    log,
    actionName: PAGE_ACTION.MODULE_USAGE,
    type: EVENT_TYPE
  });
};
