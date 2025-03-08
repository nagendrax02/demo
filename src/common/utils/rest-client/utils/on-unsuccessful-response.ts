import { trackError } from 'common/utils/experience/utils/track-error';
import { IAuthenticationConfig } from 'common/types';
import { IErroneousResponse, IRequest } from '../rest-client.types';
import { getHeaders } from './rest-client-utils';

const UNAUTHORIZED_STATUS = 401;
const UNAUTHORIZED_EXCEPTIONS = [
  'MXUnAuthorizedTokenException',
  'MXInvalidTokenException',
  'MXTokenExpiredException'
];

let reIssueTokenPromise: Promise<IAuthenticationConfig | null> | null = null;

const isV1Request = (url: string): boolean => {
  return url?.includes('/v1/Marvin.svc');
};

const canBeRetried = async (failedRequest: IRequest, response: Response): Promise<boolean> => {
  if (
    !(response?.status === UNAUTHORIZED_STATUS) ||
    failedRequest?.requestConfig?.doNotReIssueToken
  ) {
    return false;
  }

  const isV1Call = isV1Request(failedRequest?.url as string);

  if (!isV1Call) return true;

  return (
    isV1Call &&
    UNAUTHORIZED_EXCEPTIONS?.includes(
      ((await response.json()) as IErroneousResponse)?.ExceptionType
    )
  );
};

const handleError = async <T>(response: Response): Promise<T> => {
  const module = await import('./http-error-utils');
  throw await module.getHttpError(response);
};

const reInitiateCall = async <T>(
  failedRequest: IRequest,
  httpRequestCallback: ({ url, body, method, requestConfig }: IRequest) => Promise<T>
): Promise<T> => {
  const res = await httpRequestCallback({
    url: failedRequest.url,
    method: failedRequest.method,
    body: failedRequest.body,
    requestConfig: {
      ...failedRequest.requestConfig,
      headers: getHeaders({
        requestInitHeader: failedRequest?.requestConfig?.headers,
        body: failedRequest.body
      }),
      doNotReIssueToken: true
    },
    callerSource: failedRequest.callerSource
  });

  return res as T;
};

export const onUnsuccessfulResponse = async <T>(
  response: Response,
  failedRequest: IRequest,
  httpRequestCallback: ({ url, body, method, requestConfig }: IRequest) => Promise<T>
): Promise<T> => {
  try {
    const isRecoverableApi = await canBeRetried(failedRequest, response?.clone());
    if (!isRecoverableApi) {
      return await handleError(response);
    }

    if (!reIssueTokenPromise) {
      reIssueTokenPromise = (async (): Promise<IAuthenticationConfig | null> => {
        const module = await import('common/utils/authentication/utils/token.utils');
        const tokens = await module.getReIssuedTokens(failedRequest.callerSource);
        return tokens;
      })();
    }

    const reIssuedToken =
      reIssueTokenPromise && typeof reIssueTokenPromise === 'object'
        ? await reIssueTokenPromise
        : null;

    reIssueTokenPromise = null;
    if (!reIssuedToken?.Tokens?.Token) {
      const module = await import('common/utils/authentication/utils/logout');
      module.logout();
      return await handleError(response);
    }

    const res = await reInitiateCall(failedRequest, httpRequestCallback);

    return res;
  } catch (error) {
    trackError(error);
    throw error;
  }
};
