import { trackError } from 'common/utils/experience/utils/track-error';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { isMiP } from 'common/utils/helpers';
import {
  AvailableTheme,
  getCurrentTheme,
  addPrimaryColorConfig
} from '@lsq/nextgen-preact/v2/stylesmanager';
import { THEME_CONFIG } from '@lsq/nextgen-preact/v2/stylesmanager/theme-config';

export enum NavMenuMode {
  LEFT,
  TOP
}

export enum FormFactorType {
  WEB,
  MOBILE
}

export const RTL_LANGUAGES = ['ab', 'ud'];

const getAuthenticationDetails = async (): Promise<Record<string, string | undefined>> => {
  const tokens = getPersistedAuthConfig()?.Tokens;

  return {
    token: tokens?.Token,
    refreshToken: tokens?.PermissionsToken
  };
};

const getUserDetails = (): Record<string, string | undefined> => {
  const userDetails = getPersistedAuthConfig()?.User;

  return {
    id: userDetails?.Id,
    dateFormat: userDetails?.DateFormat,
    timezone: userDetails?.TimeZone,
    timeZoneOffset: userDetails?.TimeZoneOffset,
    associatedPhoneNumbers: userDetails?.AssociatedPhoneNumbers
  };
};

const getTenantDetails = (): Record<string, string | undefined> => {
  const tenantDetails = getPersistedAuthConfig()?.Tenant;
  const userDetails = getPersistedAuthConfig()?.User;
  return {
    ...tenantDetails,
    orgCode: userDetails?.OrgCode,
    displayName: tenantDetails?.DisplayName,
    timezone: userDetails?.TimeZone,
    regionId: tenantDetails?.RegionId,
    phoneNumberFormat: tenantDetails?.AccountPhoneNumberFormat
  };
};

const getNavMenuMode = (): number => {
  // TODO:Marvin implementation
  return NavMenuMode.TOP;
};

const getThemeObj = (
  themeObj: Record<string, string | boolean>
): Record<string, Record<string, string | boolean>> => {
  return { config: themeObj };
};

const getFormFactor = (): Record<string, number | string> => {
  const isMobile = window.innerWidth <= 768;
  return {
    type: isMobile ? FormFactorType.MOBILE : FormFactorType.WEB,
    width: window.innerWidth
  };
};

const getGlobalConfig = (): Record<string, string> => {
  const cdnUrlKey = 'localization-cdn-url';
  //TODO: need implementation
  return { [cdnUrlKey]: '' };
};

const getLanguageConfig = async (): Promise<Record<string, string>> => {
  const lang = 'en';
  const dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
  return {
    language: lang,
    direction: dir
  };
};

const getActiveUrl = (): string => {
  try {
    const key = 'active_iframe_url';
    return window[`${key}`] as string;
  } catch (err) {
    trackError(err);
  }
  return window.location.href;
};

const getContextData = async (): Promise<unknown> => {
  const themeConfig = {
    ...THEME_CONFIG.BASE,
    ...THEME_CONFIG[getCurrentTheme() || AvailableTheme.Default],
    ...addPrimaryColorConfig({ ...getPersistedAuthConfig()?.LaunchConfig })
  };

  return {
    authenticationDetails: await getAuthenticationDetails(),
    userDetails: getUserDetails(),
    tenantDetails: getTenantDetails(),
    language: await getLanguageConfig(),
    theme: getThemeObj(themeConfig),
    navMenuMode: getNavMenuMode(),
    formFactor: getFormFactor(),
    globalConfig: getGlobalConfig(),
    activeAppUrl: getActiveUrl(),
    isMarvinLoadedInPlatform: isMiP(),
    isSWLite: true
  };
};

const getContextProcessor = async (event: MessageEvent): Promise<void> => {
  try {
    const contextData = await getContextData();
    if (event.ports[0]) event.ports[0].postMessage(contextData);
  } catch (ex) {
    trackError('Error in getContextProcessor :', ex);
  }
};

export default getContextProcessor;
