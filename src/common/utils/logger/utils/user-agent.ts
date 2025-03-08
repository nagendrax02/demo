import { trackError } from 'common/utils/experience/utils/track-error';
import { BROWSER, OS_CLIENT } from '../constant';
import { DeviceType, IFindBrowserMatch, IUserAgent } from '../logger.types';

const getBrowserVersion = (userAgent: string, matchIndex: number, offset: number): string => {
  let version = userAgent?.substring(matchIndex + offset);
  const indexOfVersion = userAgent?.indexOf('version');
  if (indexOfVersion > -1) {
    version = userAgent?.substring(indexOfVersion + 8);
  }
  return version?.split(' ')?.[0] || version;
};
const findBrowserMatch = ({
  browser,
  offset,
  regex,
  condition,
  userAgent
}: IFindBrowserMatch): {
  browser: string;
  version: string;
} | null => {
  try {
    const match = userAgent?.match(regex);
    if (match?.index && match?.index >= 1 && condition) {
      const version = getBrowserVersion(userAgent, match?.index, offset);
      return { browser, version };
    }
  } catch (error) {
    trackError(error);
  }
  return null;
};

export const getBrowserDetails = (): { browser: string; version: string } => {
  const userAgent = navigator?.userAgent?.toLowerCase();
  let browserInfo = { browser: `Other Browser : ${userAgent}`, version: 'NA' };
  try {
    BROWSER.some((browser) => {
      const result = findBrowserMatch({ ...browser, userAgent });
      if (result) {
        browserInfo = result;
        return true;
      }
    });

    return browserInfo;
  } catch (error) {
    trackError(error);
  }
  return browserInfo;
};

export const getOS = (): string => {
  try {
    const userAgent = navigator.userAgent;

    let operatingSystem: string = '';
    OS_CLIENT?.some((client) => {
      if (client?.regex?.test(userAgent)) {
        operatingSystem = client.os;
        return true;
      }
    });

    if (!operatingSystem) {
      operatingSystem = `Other OS: ${userAgent}`;
    }

    return operatingSystem;
  } catch (error) {
    trackError(error);
  }
  return 'NA';
};

const isTablet = (userAgent): boolean => {
  const tabletRegex = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i;
  return tabletRegex?.test(userAgent);
};

const isMobile = (userAgent): boolean => {
  const mobileRegex =
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i;
  return mobileRegex?.test(userAgent);
};

const getDeviceType = (): string => {
  try {
    const userAgent = navigator?.userAgent;

    if (isTablet(userAgent)) {
      return DeviceType.Tablet;
    }

    if (isMobile(userAgent)) {
      return DeviceType.Mobile;
    }

    return DeviceType.Desktop;
  } catch (error) {
    trackError(error);
  }
  return DeviceType.NA;
};

const getNetworkConnectionType = (): { connectionType: string } => {
  const connection =
    //@ts-ignore: Experimental features
    navigator?.connection as Record<string, string>;
  return {
    connectionType: (connection?.effectiveType as string) || 'NA'
  };
};
export const getUserAgentInfo = (): IUserAgent => {
  const browserDetails = getBrowserDetails();
  const operatingSystem = getOS();
  const deviceType = getDeviceType();
  const connection = getNetworkConnectionType();
  return {
    browser: browserDetails?.browser,
    browserVersion: browserDetails?.version,
    operatingSystem,
    deviceType,
    connectionType: connection?.connectionType
  };
};
