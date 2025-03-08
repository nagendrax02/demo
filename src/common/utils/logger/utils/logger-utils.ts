import { trackError } from 'common/utils/experience/utils/track-error';
import { ENV_CONFIG } from 'common/constants';
import { getApiUrl } from 'common/utils/helpers';
import { ICachedLogs, ILog, ILogData, ILogInfo, LogType } from '../logger.types';
import { HEADER, API_PATH, ERROR_MSG, BATCH_SIZE, STORAGE_KEY } from '../constant';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { IAuthenticationConfig } from 'src/common/types';
import { getUserAgentInfo } from './user-agent';

export const getHeaders = (): Headers => {
  const authDetails = getPersistedAuthConfig();
  return new Headers({
    [HEADER.authorization]: authDetails?.Tokens?.Token || '',
    [HEADER.contentType]: 'application/json'
  });
};

export const getUrl = (logType: LogType): string => {
  const url = getApiUrl(ENV_CONFIG?.logger);
  return `${url}${API_PATH[logType]}`;
};

export const stringifyError = (key: unknown, value: unknown): unknown => {
  try {
    if (value instanceof Error) {
      const error = {};
      Object.getOwnPropertyNames(value).forEach(function (propName) {
        error[propName] = value[propName] as unknown;
      });
      return error;
    }
    return value;
  } catch (error) {
    trackError(error);
  }
};

export const validateModuleName = (moduleName: string): void => {
  if (!moduleName || typeof moduleName !== 'string') {
    throw new Error(ERROR_MSG.module);
  }
};

export const validateMessage = (message: string): void => {
  if (!message || typeof message !== 'string') {
    throw new Error(ERROR_MSG.message);
  }
};
export const validateMethod = (method: string): void => {
  if (!method || typeof method !== 'string') {
    throw new Error(ERROR_MSG.method);
  }
};

export const validateData = (data: ILogData): void => {
  if (!data || typeof data !== 'object') {
    throw new Error(ERROR_MSG.data);
  }
};

export const validateError = (error: unknown): void => {
  if (!error) {
    throw new Error(ERROR_MSG.error);
  }
};

const getCachedLogs = <T>(): ICachedLogs<T[]> => {
  return self[STORAGE_KEY] as ICachedLogs<T[]>;
};

export const updateCachedLogs = <T>(logType: LogType, newLogs: T[]): void => {
  const cachedLogs = getCachedLogs() || {};
  self[STORAGE_KEY] = {
    ...cachedLogs,
    [logType]: [...((cachedLogs?.[logType] as T[]) || []), ...newLogs]
  };
};

export const getLog = (logInfo: ILogInfo, logType: LogType): ILog => {
  const userAgentInfo = getUserAgentInfo();
  const authDetails = getPersistedAuthConfig() as IAuthenticationConfig;
  const userDetails = authDetails?.User;
  const tenantDetails = authDetails?.Tenant;
  return {
    Message: logInfo?.message,
    LogType: logType,
    Method: logInfo.method,
    AppName: logInfo.module,
    Class: logInfo.module,
    CustomData: JSON.stringify(logInfo.data),
    Exception: JSON.stringify(logInfo.error, stringifyError),
    OrgCode: userDetails?.OrgCode as string,
    UserId: userDetails?.Id as string,
    RegionId: tenantDetails?.RegionId as string,
    UserAgent: navigator?.userAgent,
    OSName: userAgentInfo.operatingSystem,
    OSVersion: 'NA',
    BrowserName: userAgentInfo.browser,
    BrowserVersion: userAgentInfo.browserVersion,
    DeviceType: userAgentInfo.deviceType,
    Url: self?.location?.href,
    CreatedOn: new Date().toISOString(),
    ConnectionType: userAgentInfo.connectionType
  };
};

export const logRequest = async <T>(url: string, log: T): Promise<void> => {
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(log),
    headers: getHeaders()
  });
};

export const batchRequest = async <T>(logType: LogType, forcePush = false): Promise<void> => {
  const allLogs = getCachedLogs();
  const typeLogs = allLogs?.[logType] as T[];

  if (typeLogs?.length && (typeLogs?.length >= BATCH_SIZE || forcePush)) {
    try {
      const firstBatch = [...typeLogs]?.splice(0, BATCH_SIZE);
      logRequest(getUrl(logType), firstBatch);
      const remainingLog = [...typeLogs].splice(BATCH_SIZE);
      self[STORAGE_KEY] = { ...allLogs, [logType]: remainingLog };
      batchRequest(logType, forcePush);
    } catch (error) {
      trackError(error);
    }
  }
};
