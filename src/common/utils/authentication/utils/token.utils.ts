import { trackError } from 'common/utils/experience/utils/track-error';
import { ENV_CONFIG, API_ROUTES } from 'common/constants';
import { IAuthenticationConfig, IToken } from 'common/types';
import { getEnvConfig } from 'common/utils/helpers';
import { httpRequest, HttpMethod, CallerSource } from 'common/utils/rest-client';
import { AUTH_HEADERS } from '../constant';
import { getTokenConfig } from '../authentication';
import { persistAuthToken } from './authentication-utils';
import {
  AuthEvents,
  ExperienceType,
  endExperienceEvent,
  getExperienceKey,
  startExperienceEvent
} from 'common/utils/experience';

// eslint-disable-next-line max-lines-per-function
const getReIssuedTokens = async (
  callerSource: CallerSource
): Promise<IAuthenticationConfig | null> => {
  const experienceConfig = getExperienceKey();
  try {
    startExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: AuthEvents.ReissueToken,
      key: experienceConfig.key
    });

    const tokenDetails = getTokenConfig() as IToken;

    if (tokenDetails?.Token && tokenDetails?.RefreshToken) {
      const { Token, RefreshToken } = tokenDetails;
      const baseUrl = getEnvConfig(ENV_CONFIG.authAPIBaseURL) as string;

      const reIssuedToken: IAuthenticationConfig = (await httpRequest({
        url: `${baseUrl}${API_ROUTES?.tokenReIssue}`,
        method: HttpMethod.Post,
        body: JSON.stringify({
          Token,
          RefreshToken,
          IsMIPRequest: true
        }),
        requestConfig: {
          headers: new Headers({
            [AUTH_HEADERS.contentType]: 'application/json'
          }),
          doNotReIssueToken: true
        },
        callerSource: callerSource
      })) as IAuthenticationConfig;

      if (reIssuedToken?.Tokens) {
        persistAuthToken(reIssuedToken);
        return reIssuedToken;
      }
    }
  } catch (error) {
    trackError(error);
  } finally {
    endExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: AuthEvents.ReissueToken,
      key: experienceConfig.key
    });
  }

  return null;
};

export { getReIssuedTokens };
