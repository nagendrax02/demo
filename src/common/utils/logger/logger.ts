import { trackError } from 'common/utils/experience/utils/track-error';
import {
  ExperienceType,
  getExperienceId,
  getExperienceKey,
  logExperienceEvent,
  EVENT_TYPE
} from 'common/utils/experience';
import { IFatal, ITelemetryLog, LogType } from './logger.types';
import {
  getUrl,
  validateData,
  validateModuleName,
  validateMessage,
  validateError,
  validateMethod,
  updateCachedLogs,
  batchRequest,
  getLog,
  logRequest
} from './utils/logger-utils';
import { getUUId } from '../helpers/helpers';
import { PAGE_ACTION } from '../experience/constant';

const telemetry = async (log: ITelemetryLog): Promise<void> => {
  try {
    if (!log) {
      trackError('No Log for telemetry');
      return;
    }

    updateCachedLogs(LogType.Experience, [{ ...log, Id: getUUId() }]);
    batchRequest(LogType.Experience);
  } catch (error) {
    trackError(error);
  }
};

const dispatchAllCachedLogs = (): void => {
  Object?.values(LogType)?.forEach((logType) => {
    batchRequest(logType, true);
  });
};

const fatal = (log: IFatal): void => {
  try {
    validateModuleName(log.module);
    validateMessage(log.message);
    validateData(log.data);
    validateMethod(log.method);
    validateError(log.error);

    const experienceConfig = getExperienceKey();
    const experienceId = getExperienceId({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      key: experienceConfig.key
    });

    const logId = experienceId || getUUId();
    const fatalLog = { ...getLog(log, LogType.Fatal), Id: logId };

    const experienceLog = {
      ...fatalLog,
      experience: 'sw-lite-fatal',
      event: 'sw-lite-fatal',
      module: log?.module,
      experienceId: logId,
      isExperience: 0,
      hasError: 1,
      additionalData: JSON.stringify(log.data)
    };

    logExperienceEvent({ actionName: PAGE_ACTION.FATAL_LOG, type: EVENT_TYPE, log: experienceLog });
    logRequest(getUrl(LogType.Fatal), [experienceLog]);
    dispatchAllCachedLogs();
  } catch (error) {
    trackError(error);
  }
};

const logger = { fatal, telemetry };

export { logger };
