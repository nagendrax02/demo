import { trackError } from 'common/utils/experience/utils/track-error';
import { isMiP, roundOffDecimal } from 'common/utils/helpers/helpers';
import { EVENT_TYPE, PAGE_ACTION } from '../constant';
import { ExperienceType } from '../experience-modules';
import { endExperience, logExperienceEvent } from '../experience.store';
import { getExperienceKey, getNavigationTimings } from './utils';
import { ILogInitialLoadTime } from '../experience.types';

export const endEntityDetailsLoadExperience = (): void => {
  const experienceConfig = getExperienceKey();
  endExperience({
    experience: ExperienceType.Load,
    key: experienceConfig.key,
    module: experienceConfig.module,
    startTime: isMiP() ? getNavigationTimings()?.responseEnd : undefined,
    logServerResponseTime: true
  });
};

export const logInitialLoadTimeEvent = async ({
  module,
  experience,
  experienceId,
  logInitialLoadTime
}: {
  module: string;
  experience: string;
  experienceId: string;
  logInitialLoadTime?: ILogInitialLoadTime;
}): Promise<void> => {
  try {
    const eventEndTime =
      typeof logInitialLoadTime?.endTime === 'number'
        ? logInitialLoadTime?.endTime
        : roundOffDecimal(performance?.now());
    const log = {
      module: module,
      experience: experience,
      event: 'InitialAppLoadTime',
      eventStartTime: roundOffDecimal((self?.['app-initial-load'] as number) || 0),
      eventEndTime,
      experienceId: experienceId,
      isExperience: 0,
      hasError: 0
    };
    logExperienceEvent({ actionName: PAGE_ACTION.EXPERIENCE, type: EVENT_TYPE, log });
  } catch (error) {
    trackError(error);
  }
};
