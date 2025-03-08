import { trackError } from 'common/utils/experience/utils/track-error';
import { ABORT_TIMEOUT } from './constant';
import {
  getHttpResponse,
  getHeaders,
  getRequestUrl,
  validateHttpBody,
  validateHttpPath
} from './utils/rest-client-utils';
import { HttpMethod, IRequest, IGet, IPost, IExperienceLog } from './rest-client.types';
import { roundOffDecimal } from 'common/utils/helpers/helpers';
import { getExperience, ExperienceType, getExperienceKey } from 'common/utils/experience';

const endTelemetry = async (
  request: IExperienceLog,
  response: Response | null,
  exception?: unknown
): Promise<void> => {
  const endTime = roundOffDecimal(performance.now());
  setTimeout(async () => {
    import('./utils/http-telemetry')
      .then((utils) => {
        utils.logTelemetry({ request, response, endTime, exception });
      })
      .catch((error) => {
        trackError(error);
      });
  }, 0);
};

const startTelemetry = (requestConfig: IRequest): IExperienceLog => {
  const experienceLog = { ...requestConfig } as IExperienceLog;
  experienceLog.startTime = roundOffDecimal(performance.now());
  const experienceConfig = getExperienceKey();
  experienceLog.experience = getExperience({
    module: experienceConfig?.module,
    //TODO: Need to update when there are experiences to consider.
    experience: ExperienceType?.Load,
    key: experienceConfig?.key
  });
  return experienceLog;
};

export const modifyError = (request: IRequest, error: unknown): void => {
  try {
    if (error && typeof error === 'object') {
      Object.assign(error, {
        swLiteRequestInfo: {
          url: request?.url,
          body: request?.body,
          method: request?.method,
          callerSource: request?.callerSource,
          requestedResponseType: request?.requestConfig?.responseType,
          doNotReIssueToken: request?.requestConfig?.doNotReIssueToken
        }
      });
    }
  } catch (err) {
    trackError(err);
  }
};

const httpRequest = async <T>(request: IRequest): Promise<T> => {
  const telemetryConfig = startTelemetry(request);
  let gotResponse = false;
  try {
    const { url, body, method, requestConfig, callerSource } = request;

    const signal = AbortSignal?.any?.(
      [
        requestConfig?.signal,
        AbortSignal?.timeout?.(requestConfig?.abortTimeout || ABORT_TIMEOUT)
      ].filter(Boolean) as AbortSignal[]
    ) as AbortSignal;

    const response: Response = await fetch(url, {
      method,
      body: body || null,
      headers: requestConfig?.headers,
      signal
    });

    gotResponse = true;
    endTelemetry(telemetryConfig, response?.clone());

    if (request?.responseInterceptor) request?.responseInterceptor(response);
    if (response?.ok) {
      return await getHttpResponse(response, requestConfig?.responseType);
    }

    const module = await import('./utils/on-unsuccessful-response');
    return (await module.onUnsuccessfulResponse(
      response,
      { url, body, method, requestConfig, callerSource },
      httpRequest
    )) as T;
  } catch (error) {
    if (!gotResponse) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      endTelemetry(telemetryConfig, null, { Stack: error?.stack, Message: error?.message });
    }
    modifyError(request, error);
    trackError('Error in request', error);
    throw error;
  }
};

const httpGet = async <T>({
  path,
  module,
  requestConfig,
  callerSource,
  responseInterceptor
}: IGet): Promise<T> => {
  validateHttpPath(path);

  const headers = getHeaders({
    requestInitHeader: requestConfig?.headers,
    body: undefined,
    module
  });
  const restClientRequestConfig = {
    ...(requestConfig || {}),
    headers: headers
  };

  return httpRequest({
    url: getRequestUrl(module, path),
    method: HttpMethod.Get,
    requestConfig: restClientRequestConfig,
    callerSource,
    responseInterceptor
  });
};

const httpPost = async <T, U>({
  path,
  module,
  body,
  requestConfig,
  callerSource,
  responseInterceptor
}: IPost<U>): Promise<T> => {
  validateHttpPath(path);
  validateHttpBody(body);

  const headers = getHeaders({ requestInitHeader: requestConfig?.headers, body, module });
  const restClientRequestConfig = {
    ...(requestConfig || {}),
    headers: headers
  };

  return httpRequest({
    url: getRequestUrl(module, path?.trim()),
    method: HttpMethod.Post,
    body: body instanceof FormData ? body : JSON.stringify(body),
    requestConfig: restClientRequestConfig,
    callerSource,
    responseInterceptor
  });
};

const httpPut = async <T, U>({
  path,
  module,
  body,
  requestConfig,
  callerSource
}: IPost<U>): Promise<T> => {
  validateHttpPath(path);
  validateHttpBody(body);

  const headers = getHeaders({ requestInitHeader: requestConfig?.headers, body, module });
  const restClientRequestConfig = {
    ...(requestConfig || {}),
    headers: headers
  };

  return httpRequest({
    url: getRequestUrl(module, path?.trim()),
    method: HttpMethod.Put,
    body: body instanceof FormData ? body : JSON.stringify(body),
    requestConfig: restClientRequestConfig,
    callerSource
  });
};

const batchGet = async <T>(requests: IGet[]): Promise<T[] | PromiseSettledResult<Awaited<T>>[]> => {
  const promises: Promise<T>[] = requests.map((request) => httpGet<T>(request));
  return Promise.allSettled(promises);
};

export { httpGet, httpPost, httpRequest, httpPut, batchGet };
