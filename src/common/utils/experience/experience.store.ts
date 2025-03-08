import { trackError } from 'common/utils/experience/utils/track-error';
import { getExperienceKey, getNavigationTimingLogs } from './utils/utils';
import {
  IUseExperience,
  IStartExperience,
  IEndExperience,
  IStartEvent,
  ILogSingleEvent,
  IEndEvent,
  IGetExpConfig,
  IExperienceConfig
} from './experience.types';
import {
  getExperienceEventName,
  getExperienceName,
  validateEvent,
  validateExperience
} from './utils/utils';
import { EVENT_TYPE, PAGE_ACTION } from './constant';
import { logInitialLoadTimeEvent } from './utils/module-utils';
import { getUUId, hasAppVisibilityChanged, roundOffDecimal } from '../helpers/helpers';

const initialState: IUseExperience = {
  experiences: {},
  experienceEvents: {},
  experienceId: {}
};

const EXPERIENCE = (window['mx-experience'] = initialState);

// eslint-disable-next-line complexity
const getExistingExpConfig = ({
  experience,
  key,
  module,
  relatedExperience
}: IGetExpConfig): {
  name: string;
  data: IExperienceConfig;
  isRelatedExpExist: boolean;
  module: string;
  experience: string;
  key: string;
} => {
  const experienceName = getExperienceName({ module, experience, key });
  const relatedExperienceName = relatedExperience
    ? getExperienceName({
        module: relatedExperience?.module,
        experience: relatedExperience?.experience,
        key: relatedExperience?.key
      })
    : null;

  const experienceConfig = EXPERIENCE.experiences?.[experienceName];
  const relatedExpConfig = relatedExperienceName
    ? EXPERIENCE.experiences?.[relatedExperienceName] || null
    : null;

  const relatedExpExist = relatedExpConfig?.experienceId;
  return {
    name: relatedExpExist ? relatedExperienceName || '' : experienceName,
    data: relatedExpExist ? relatedExpConfig : experienceConfig,
    isRelatedExpExist: !!relatedExpExist,
    module: relatedExpExist ? relatedExperience?.module || '' : module,
    experience: relatedExpExist ? relatedExperience?.experience || '' : experience,
    key: relatedExpExist ? relatedExperience?.key || '' : key
  };
};

const startExperience = ({
  startTime = performance?.now(),
  experience,
  module,
  key,
  logInitialLoadTime,
  relatedExperience
}: IStartExperience): void => {
  try {
    if (hasAppVisibilityChanged()) return;
    validateExperience({ experience, module, key });

    const experienceConfig = getExistingExpConfig({ module, experience, key, relatedExperience });
    if (experienceConfig?.data || experienceConfig?.isRelatedExpExist) return;

    const startExperienceConfig = {
      eventStartTime: roundOffDecimal(startTime),
      experienceId: getUUId(),
      experience: experience
    };
    if (logInitialLoadTime) {
      logInitialLoadTimeEvent({
        module,
        experience,
        experienceId: startExperienceConfig.experienceId
      });
    }

    EXPERIENCE.experiences[experienceConfig?.name] = startExperienceConfig;
    EXPERIENCE.experienceId[experienceConfig?.name] = startExperienceConfig.experienceId;
  } catch (error) {
    trackError(error);
  }
};

// eslint-disable-next-line complexity, max-lines-per-function
const endExperience = async (endExperienceConfig: IEndExperience): Promise<void> => {
  try {
    if (hasAppVisibilityChanged()) return;
    const eventEndTime = roundOffDecimal(performance.now());
    const {
      experience,
      module,
      startTime,
      key,
      logServerResponseTime,
      relatedExperience,
      additionalData
    } = endExperienceConfig;
    if (!validateExperience({ experience, module, key })) return;

    const experienceConfig = {
      ...(getExistingExpConfig({ module, experience, key, relatedExperience }) || {})
    };
    if (!experienceConfig?.data || experienceConfig?.isRelatedExpExist) return;

    const log = {
      eventStartTime:
        startTime || startTime === 0
          ? roundOffDecimal(startTime)
          : roundOffDecimal(experienceConfig?.data.eventStartTime),
      experienceId: experienceConfig?.data.experienceId,
      module: experienceConfig.module,
      experience: experienceConfig.experience,
      hasError: experienceConfig?.data.hasException ? 1 : 0,
      eventEndTime,
      event: '',
      isExperience: 1,
      additionalExpData: additionalData,
      ...getNavigationTimingLogs(logServerResponseTime)
    };
    delete EXPERIENCE?.experiences?.[experienceConfig?.name];
    if (experienceConfig?.data?.experienceId) {
      const logModule = await import('./utils/log-experience');
      logModule.logExperience({ actionName: PAGE_ACTION.EXPERIENCE, type: EVENT_TYPE, log });
    }
  } catch (error) {
    trackError(error);
  }
};

//key should be same as experience key
const startExperienceEvent = ({
  module,
  experience,
  event,
  key,
  relatedExperience
}: IStartEvent): void => {
  try {
    if (hasAppVisibilityChanged()) return;
    const eventStartTime = roundOffDecimal(performance.now());
    if (!validateEvent({ module, experience, event, key })) return;

    const eventName = getExperienceEventName({ module, experience, event, key });

    const experienceConfig = getExistingExpConfig({ experience, key, module, relatedExperience });
    const eventConfig = EXPERIENCE.experienceEvents?.[eventName];

    if (!experienceConfig?.data || eventConfig) return;

    const eventLog = {
      eventStartTime
    };

    EXPERIENCE.experienceEvents[eventName] = eventLog;
  } catch (error) {
    trackError(error);
  }
};

// eslint-disable-next-line max-lines-per-function, complexity
const endExperienceEvent = async ({
  module,
  experience,
  event,
  key,
  hasException = false,
  logInitialLoadTime,
  relatedExperience
}: IEndEvent): Promise<void> => {
  try {
    if (hasAppVisibilityChanged()) return;
    const eventEndTime = roundOffDecimal(performance.now());

    validateEvent({ module, experience, event, key });

    const eventName = getExperienceEventName({ module, experience, event, key });

    const experienceConfig = getExistingExpConfig({ module, experience, key, relatedExperience });
    const startEventConfig = EXPERIENCE.experienceEvents?.[eventName];

    if (!experienceConfig || !startEventConfig) return;

    const log = {
      eventStartTime: roundOffDecimal(startEventConfig.eventStartTime),
      experienceId: experienceConfig?.data?.experienceId,
      module: experienceConfig?.module,
      experience: experienceConfig?.experience,
      event,
      eventEndTime,
      isExperience: 0,
      hasError: hasException ? 1 : 0
    };

    if (EXPERIENCE.experiences[experienceConfig?.name]) {
      EXPERIENCE.experiences[experienceConfig?.name].hasException = hasException;
    }

    if (experienceConfig?.data?.experienceId) {
      if (logInitialLoadTime) {
        logInitialLoadTimeEvent({
          module,
          experience,
          experienceId: experienceConfig?.data?.experienceId,
          logInitialLoadTime
        });
      }
      delete EXPERIENCE?.experienceEvents?.[eventName];
      const logModule = await import('./utils/log-experience');
      logModule.logExperience({ actionName: PAGE_ACTION.EXPERIENCE, type: EVENT_TYPE, log });
    }
  } catch (error) {
    trackError(error);
  }
};

// eslint-disable-next-line complexity
const logExperienceEvent = async ({ actionName, log, type }: ILogSingleEvent): Promise<void> => {
  try {
    if (!actionName || !log || !type) return;

    const logModule = await import('./utils/log-experience');
    logModule.logExperience({
      actionName,
      type,
      log: {
        ...log,
        eventStartTime:
          typeof log?.eventStartTime === 'number' ? roundOffDecimal(log?.eventStartTime || 0) : -1,
        eventEndTime:
          typeof log?.eventEndTime === 'number' ? roundOffDecimal(log?.eventEndTime || 0) : -1
      }
    });
  } catch (error) {
    trackError(error);
  }
};

const getExperience = ({
  experience,
  module,
  key
}: {
  experience: string;
  module: string;
  key: string;
}): { experienceId: string; experience: string } => {
  try {
    const currentContext = getExperienceKey();
    const experiences = EXPERIENCE?.experiences;
    const runningExperience =
      experiences?.[
        getExperienceName({ module: currentContext?.module, experience, key: currentContext?.key })
      ];

    if (runningExperience) {
      return runningExperience;
    }

    return experiences?.[getExperienceName({ module, experience, key })];
  } catch (error) {
    trackError(error);
  }
  return { experienceId: '', experience: '' };
};

const getExperienceId = ({
  experience,
  module,
  key
}: {
  experience: string;
  module: string;
  key: string;
}): string => {
  try {
    return EXPERIENCE?.experienceId?.[getExperienceName({ module, experience, key })];
  } catch (error) {
    trackError(error);
  }
  return '';
};

const clearRunningExperience = (): void => {
  try {
    EXPERIENCE.experienceEvents = {};
    EXPERIENCE.experienceEvents = {};
  } catch (error) {
    trackError(error);
  }
};

const clearExperience = (
  config: {
    module: string;
    experience: string;
    key: string;
  }[]
): void => {
  config?.forEach((data) => {
    const { experience, key, module } = data;
    const experienceName = getExperienceName({ module, experience, key });
    if (EXPERIENCE.experiences?.[experienceName]) {
      delete EXPERIENCE?.experiences?.[experienceName];
    }
  });
};

export {
  startExperience,
  endExperience,
  startExperienceEvent,
  endExperienceEvent,
  logExperienceEvent,
  getExperience,
  getExperienceId,
  clearRunningExperience,
  clearExperience
};
