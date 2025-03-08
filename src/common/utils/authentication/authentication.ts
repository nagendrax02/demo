import { trackError } from 'common/utils/experience/utils/track-error';
import { IAuthenticationConfig, IToken } from 'common/types';
import {
  StorageKey,
  clearExternalAppKeys,
  clearStorage,
  setItem
} from 'common/utils/storage-manager';
import { AuthKey, IAuthenticationStatus } from './authentication.types';
import {
  persistAuthConfig,
  getPersistedAuthConfig,
  getAuthDetails,
  isTokenExpired,
  validateUserDetails,
  populateExternalAppRequirements,
  initializeThirdPartyScript
} from './utils/authentication-utils';
import { isMiP } from 'common/utils/helpers';
import { useEffect, useState } from 'react';
import { ITenant, IUser } from 'common/types/authentication.types';
import { getMiPPreReqData } from '../helpers/helpers';
import { userRoleCodeMap } from './constant';
import {
  endExperienceEvent,
  getExperienceKey,
  startExperienceEvent
} from 'common/utils/experience';
import { AuthEvents, ExperienceType } from 'common/utils/experience/experience-modules';
import { CallerSource } from '../rest-client';
import { redirectToActiveSessionUrl, setSessionURL } from './utils/region-redirection-helpers';
import { useLocation } from 'wouter';
import { getLSQRedirectedURL } from 'router/utils/url-redirection';
import { IGetExperienceKey } from '../experience/experience.types';

const getValue = (queryParams: URLSearchParams, key: AuthKey): string => {
  return decodeURIComponent(queryParams?.get(key) || '');
};

const getParsedToken = (): IToken => {
  const mipAuthData = getMiPPreReqData();
  if (mipAuthData) {
    return {
      PermissionsToken: mipAuthData[AuthKey.PermissionsToken],
      RefreshToken: mipAuthData[AuthKey.RefreshToken],
      SessionId: mipAuthData[AuthKey.SessionId],
      Token: mipAuthData[AuthKey.Token],
      TokenExpirationTime: mipAuthData[AuthKey.TokenExpirationTime]
    };
  }

  const queryParams = new URLSearchParams(self?.location?.search);
  return {
    PermissionsToken: getValue(queryParams, AuthKey.PermissionsToken),
    RefreshToken: getValue(queryParams, AuthKey.RefreshToken),
    SessionId: getValue(queryParams, AuthKey.SessionId),
    Token: getValue(queryParams, AuthKey.Token),
    TokenExpirationTime: getValue(queryParams, AuthKey.TokenExpirationTime)
  };
};

const getParsedUserDetails = (): IUser => {
  const mipAuthData = getMiPPreReqData();
  if (mipAuthData) {
    return {
      DateFormat: mipAuthData[AuthKey.DateFormat],
      Id: mipAuthData[AuthKey.UserId],
      OrgCode: mipAuthData[AuthKey.OrgCode],
      TimeZone: mipAuthData[AuthKey.TimeZone],
      TimeZoneOffset: mipAuthData[AuthKey.TimeZoneOffset],
      AssociatedPhoneNumbers: mipAuthData[AuthKey.AssociatedPhoneNumbers],
      Role: userRoleCodeMap[mipAuthData[AuthKey.Role]],
      CreatedOn: mipAuthData[AuthKey.UserCreatedOn],
      EmailAddress: mipAuthData[AuthKey.UserEmail],
      IsDefaultOwner: mipAuthData[AuthKey.IsDefaultOwner],
      FullName: mipAuthData[AuthKey.UserName]
    };
  }

  const queryParams = new URLSearchParams(self?.location?.search);
  return {
    DateFormat: getValue(queryParams, AuthKey.DateFormat),
    Id: getValue(queryParams, AuthKey.UserId),
    OrgCode: getValue(queryParams, AuthKey.OrgCode),
    TimeZone: getValue(queryParams, AuthKey.TimeZone),
    TimeZoneOffset: getValue(queryParams, AuthKey.TimeZoneOffset),
    AssociatedPhoneNumbers: getValue(queryParams, AuthKey.AssociatedPhoneNumbers),
    Role: userRoleCodeMap[getValue(queryParams, AuthKey.Role)],
    CreatedOn: getValue(queryParams, AuthKey.UserCreatedOn),
    EmailAddress: getValue(queryParams, AuthKey.UserEmail),
    IsDefaultOwner: getValue(queryParams, AuthKey.IsDefaultOwner),
    FullName: getValue(queryParams, AuthKey.UserName)
  };
};

const getParsedTenantDetails = (): ITenant => {
  const mipAuthData = getMiPPreReqData();
  if (mipAuthData) {
    return {
      RegionId: mipAuthData[AuthKey.RegionId],
      DefinedWeek: mipAuthData[AuthKey.DefinedWeek],
      DisplayName: mipAuthData[AuthKey.DisplayName],
      AccountTimeZone: mipAuthData[AuthKey.AccountTimezone],
      AccountPhoneNumberFormat: mipAuthData[AuthKey.AccountPhoneNumberFormat],
      BusinessType: mipAuthData[AuthKey.BusinessType],
      ClusterID: mipAuthData[AuthKey.ClusterID],
      CreatedOn: mipAuthData[AuthKey.TenantCreatedOn],
      CustomerType: mipAuthData[AuthKey.CustomerType],
      Industry: mipAuthData[AuthKey.Industry],
      Plan: mipAuthData[AuthKey.Plan],
      RenewalDate: mipAuthData[AuthKey.RenewalDate],
      SubIndustry: mipAuthData[AuthKey.SubIndustry],
      DefaultCountryCode: mipAuthData[AuthKey.DefaultCountryCode],
      IdleTimeout: mipAuthData[AuthKey.IdleTimeout]
    };
  }
  const queryParams = new URLSearchParams(self?.location?.search);

  return {
    RegionId: getValue(queryParams, AuthKey.RegionId),
    DefinedWeek: getValue(queryParams, AuthKey.DefinedWeek),
    AccountPhoneNumberFormat: getValue(queryParams, AuthKey.AccountPhoneNumberFormat),
    AccountTimeZone: getValue(queryParams, AuthKey.AccountTimezone),
    DisplayName: getValue(queryParams, AuthKey.DisplayName),
    BusinessType: getValue(queryParams, AuthKey.BusinessType),
    ClusterID: getValue(queryParams, AuthKey.ClusterID),
    CreatedOn: getValue(queryParams, AuthKey.TenantCreatedOn),
    CustomerType: getValue(queryParams, AuthKey.CustomerType),
    Industry: getValue(queryParams, AuthKey.Industry),
    Plan: getValue(queryParams, AuthKey.Plan),
    RenewalDate: getValue(queryParams, AuthKey.RenewalDate),
    SubIndustry: getValue(queryParams, AuthKey.SubIndustry),
    DefaultCountryCode: getValue(queryParams, AuthKey.DefaultCountryCode)
  };
};

export const populateAuthConfig = (authConfig: IAuthenticationConfig): void => {
  populateExternalAppRequirements(authConfig);
  setItem(StorageKey.UserAuthDetails, getAuthDetails());
  persistAuthConfig(authConfig);
};

export const authDataParser = (): IAuthenticationConfig | null => {
  try {
    const token = getParsedToken();

    if (!(token?.Token && token?.RefreshToken)) return null;

    const authConfig: IAuthenticationConfig = {
      Tokens: token,
      Tenant: getParsedTenantDetails(),
      User: getParsedUserDetails(),
      SessionId: getAuthDetails()?.sessionId || ''
    };
    populateAuthConfig(authConfig);
    return authConfig;
  } catch (error) {
    trackError(error);
  }
  return null;
};

export const getTokenConfig = (): IToken | null => {
  const config = getPersistedAuthConfig();
  return config?.Tokens || null;
};

const logOutUser = async (): Promise<void> => {
  if (!isMiP()) {
    const logout = (await import('./utils/logout')).logout;
    logout();
  }
};
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    redirectToActiveSessionUrl();
    const tokenDetails = getTokenConfig();

    if (!tokenDetails?.Token) {
      return false;
    }

    if (!isTokenExpired(tokenDetails.TokenExpirationTime)) {
      return true;
    }

    const module = await import('./utils/token.utils');

    const reIssuedToken = await module.getReIssuedTokens(CallerSource.Authentication);

    if (reIssuedToken?.Tokens) {
      const { Token, RefreshToken } = reIssuedToken.Tokens;
      setSessionURL(reIssuedToken.Tokens?.TokenExpirationTime);
      return Token && RefreshToken ? true : false;
    }

    await logOutUser();
    return false;
  } catch (error) {
    trackError(error);
  }

  return false;
};

const updateAuthData = (): void => {
  clearExternalAppKeys();
  localStorage.removeItem(StorageKey.UserAuthDetails);
  localStorage.removeItem(StorageKey.Auth);
  authDataParser();
};

export const validateMiPAuthentication = async (): Promise<boolean> => {
  try {
    if (!validateUserDetails()) {
      updateAuthData();
      if (await isUserAuthenticated()) return true;
    }

    clearStorage();
    let ssoConfig = authDataParser();

    if (!ssoConfig) {
      const module = await import('./utils/ssoLogin');
      ssoConfig = await module.initiateSSOLogin();
    }

    if (ssoConfig?.Tokens?.Token) {
      return true;
    }
  } catch (error) {
    trackError(error);
  }
  return false;
};

export const getAuthenticationStatus = async (): Promise<IAuthenticationStatus> => {
  const isLoggedIn = isMiP() ? await validateMiPAuthentication() : await isUserAuthenticated();
  if (isLoggedIn) {
    initializeThirdPartyScript();
  }
  return isLoggedIn
    ? {
        isLoading: false,
        isSuccess: true
      }
    : { isLoading: false, isSuccess: false };
};

const startExperience = (experienceConfig: IGetExperienceKey): void => {
  startExperienceEvent({
    module: experienceConfig.module,
    experience: ExperienceType.Load,
    event: AuthEvents.AuthStatus,
    key: experienceConfig.key
  });
};

const endExperience = (
  experienceConfig: IGetExperienceKey,
  authStatusConfig: IAuthenticationStatus,
  layoutReachTime: number
): void => {
  endExperienceEvent({
    module: experienceConfig.module,
    experience: ExperienceType.Load,
    event: AuthEvents.AuthStatus,
    key: experienceConfig.key,
    hasException: !authStatusConfig.isSuccess,
    logInitialLoadTime: { endTime: layoutReachTime }
  });
};

export const useAuthenticationStatus = (
  layoutReachTime: number
): {
  authStatus: IAuthenticationStatus;
  setAuthStatus: (data: IAuthenticationStatus) => void;
} => {
  const [authStatus, setAuthStatus] = useState({ isLoading: true, isSuccess: false });
  const [, setLocation] = useLocation();

  useEffect(() => {
    (async (): Promise<void> => {
      const experienceConfig = getExperienceKey();
      const redirectionUrl = getLSQRedirectedURL();
      if (redirectionUrl) setLocation(redirectionUrl);
      startExperience(experienceConfig);

      const authStatusConfig = await getAuthenticationStatus();
      setAuthStatus(authStatusConfig);
      endExperienceEvent({
        module: experienceConfig.module,
        experience: ExperienceType.Load,
        event: AuthEvents.AuthStatus,
        key: experienceConfig.key,
        hasException: !authStatusConfig.isSuccess,
        logInitialLoadTime: { endTime: layoutReachTime }
      });
      endExperience(experienceConfig, authStatusConfig, layoutReachTime);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { authStatus, setAuthStatus };
};
