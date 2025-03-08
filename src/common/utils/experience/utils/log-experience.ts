import { trackError } from 'common/utils/experience/utils/track-error';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { IConnection, ILogExperience } from '../experience.types';
import { getUserAgentInfo } from 'common/utils/logger/utils/user-agent';
import { getEnvConfig, isMiP } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';

const getNetworkConnectionType = (): Record<string, string> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const connection: IConnection =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any)?.connection ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any)?.mozConnection ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any)?.webkitConnection;

    return {
      connectionType: connection?.effectiveType,
      internetSpeed: connection?.downlink,
      ram: (navigator as unknown as { deviceMemory: string })?.deviceMemory || '',
      timezone: Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone,
      connectionRTT: connection?.rtt,
      connectionCategory: connection?.type,
      processors: `${navigator.hardwareConcurrency || ''}`
    };
  } catch (error) {
    trackError(error);
  }
  return {};
};

export const getExperienceIdentifier = (): string => {
  if (typeof crypto?.randomUUID === 'function') {
    return crypto?.randomUUID();
  } else {
    const authConfig = getPersistedAuthConfig();
    return `${Date.now()}-${authConfig?.User?.Id}`;
  }
};

export const getUserConfig = (): Record<string, string> => {
  const authConfig = getPersistedAuthConfig();
  return {
    orgCode: authConfig?.User?.OrgCode || 'NA',
    userId: authConfig?.User.Id || 'NA',
    userEmail: authConfig?.User?.EmailAddress || 'NA',
    orgName: authConfig?.Tenant?.DisplayName || 'NA',
    regionId: authConfig?.Tenant?.RegionId || 'NA'
  };
};

export const getContext = (): string => {
  return isMiP() ? 'SWLiteMiP' : 'SWLiteMarvin';
};

export const logExperience = ({ actionName, log, type }: ILogExperience): void => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const newRelic = (window as any)?.newrelic;

    if (typeof newRelic !== 'object') {
      trackError('NewRelic Not found!!');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newRelic as any)?.addPageAction(actionName, {
      type: type,
      took: log.eventEndTime - log.eventStartTime,
      Initiator: window.location.href,
      ...log,
      ...getUserConfig(),
      ...getNetworkConnectionType(),
      ...getUserAgentInfo(),
      browserTabId: (self as unknown as { tabId: string })?.tabId || '',
      embeddedContext: getContext(),
      buildVersions: getEnvConfig(ENV_CONFIG.appVersion) as string,
      isMiP: isMiP() ? 1 : 0
    });
  } catch (error) {
    trackError(error);
  }
};
