import { trackError } from 'common/utils/experience/utils/track-error';
import { ENV_CONFIG, API_ROUTES } from 'common/constants';
import { IAuthenticationConfig } from 'common/types';
import { getEnvConfig } from '../../helpers';
import { httpRequest, HttpMethod, CallerSource } from '../../rest-client';
import { AUTH_HEADERS, AUTH_ERROR_MSG, AuthConfig } from '../constant';
import { populateAuthConfig } from '../authentication';

export const validateAuthData = (authData: string): void => {
  if (!authData) throw new Error(AUTH_ERROR_MSG.invalidAuthData);
};

export const getQueryParamsAuthData = (): string | null => {
  try {
    const authData = new URLSearchParams(self.location.search).get(AuthConfig.AuthData) || '';
    validateAuthData(authData);
    return authData;
  } catch (error: unknown) {
    trackError(error);
    throw error;
  }
};

export const getAuthHeaders = (): Headers => {
  try {
    return new Headers({
      [AUTH_HEADERS.xLsqAppToken]: decodeURIComponent(getQueryParamsAuthData() || ''),
      [AUTH_HEADERS.contentType]: 'application/json'
    });
  } catch (error: unknown) {
    throw new Error(AUTH_ERROR_MSG.failedToGetAuthToken);
  }
};

export const initiateSSOLogin = async (): Promise<IAuthenticationConfig | null> => {
  try {
    const baseUrl = getEnvConfig(ENV_CONFIG.authAPIBaseURL) as string;
    const path = API_ROUTES.ssoLogin;

    const ssoConfig: IAuthenticationConfig = (await httpRequest({
      url: `${baseUrl}${path}`,
      method: HttpMethod.Post,
      body: JSON.stringify({}),
      requestConfig: { headers: getAuthHeaders() },
      callerSource: CallerSource.Authentication
    })) as IAuthenticationConfig;

    populateAuthConfig(ssoConfig);
    return ssoConfig;
  } catch (error: unknown) {
    trackError(error);
  }

  return null;
};
