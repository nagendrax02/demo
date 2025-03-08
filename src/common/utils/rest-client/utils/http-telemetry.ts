import { trackError } from 'common/utils/experience/utils/track-error';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { getEnvConfig, isMiP } from 'common/utils/helpers';
import logger from 'common/utils/logger';
import { HTTP_HEADERS } from '../constant';
import { ENV_CONFIG } from 'common/constants';
import { IErroneousResponse, IExperienceLog } from '../rest-client.types';
import { getUUId } from '../../helpers/helpers';
import { getHttpResponse } from './rest-client-utils';

const getException = (response: Response | null, errorResponse: IErroneousResponse): string => {
  try {
    if (response?.ok) return '';

    const data = errorResponse?.Data || errorResponse?.ExceptionMessage || errorResponse?.Message;

    if (typeof errorResponse === 'object') {
      return JSON.stringify(errorResponse);
    }

    return typeof data === 'object' ? JSON.stringify(data) : (data as string);
  } catch (error) {
    trackError(error);
  }

  return 'failed to get exception';
};

const getResponse = async (
  response: Response | null,
  requestConfig: IExperienceLog,
  exception: unknown
): Promise<IErroneousResponse> => {
  try {
    if (exception) {
      return exception as IErroneousResponse;
    }

    if (response?.ok) {
      return await getHttpResponse(response, requestConfig?.requestConfig?.responseType);
    }

    return (await response?.json()) as IErroneousResponse;
  } catch (error) {
    trackError(error);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { Stack: error?.stack, Message: error?.message } as unknown as IErroneousResponse;
  }
};

const getContext = (): string => {
  return isMiP() ? 'SWLiteMiP' : 'SWLiteMarvin';
};

const getStringifiedContent = (data: unknown): string => {
  return data === 'object' ? JSON.stringify(data) : (data as string);
};

const getStringContent = (value?: string): string => {
  return value || 'NA';
};

// eslint-disable-next-line max-lines-per-function, complexity
export const logTelemetry = async ({
  endTime,
  exception,
  request,
  response
}: {
  request: IExperienceLog;
  response: Response | null;
  endTime: number;
  exception: unknown;
}): Promise<void> => {
  const duration = endTime - request?.startTime || -1;
  const authConfig = getPersistedAuthConfig();
  const errorResponseJson = await getResponse(response, request, exception);

  const log = {
    Application: getContext(),
    ExperienceId: request?.experience?.experienceId || getUUId(),
    Input: JSON.stringify(request?.body || {}),
    Exception: getException(response, errorResponseJson),
    Method: 'logRequestData',
    Class: 'restClient',
    OrgCode: getStringContent(authConfig?.User?.OrgCode),
    OrgName: getStringContent(authConfig?.Tenant?.DisplayName),
    UserEmail: getStringContent(authConfig?.User?.EmailAddress),
    HttpMethod: getStringContent(request?.method),
    RegionId: getStringContent(authConfig?.Tenant?.RegionId),
    Url: request?.url as string,
    UserId: getStringContent(authConfig?.User?.Id),
    LogType: 'experience',
    Message: `Logging all sw-lite ${isMiP() ? 'mip' : ''} requests`,
    StatusCode: response?.status || -1,
    Took: duration,
    StartTime: request.startTime,
    BuildVersions: getEnvConfig(ENV_CONFIG.appVersion) as string,
    AdditionalData: request?.telemetryConfig?.captureResponse
      ? getStringifiedContent(errorResponseJson)
      : 'NA',
    Module: getStringContent(request?.callerSource),
    Experience: request?.experience?.experience,
    EmbeddedContext: getContext(),
    RequestContentType: (request?.requestConfig?.headers as Headers)?.get(
      HTTP_HEADERS.contentType
    ) as string,
    ContentType: getStringContent(response?.headers?.get('Content-Type') || ''),
    Initiator: window.location.href,
    TabId: (self as unknown as Record<string, string>)?.tabId || '',
    CreatedOn: new Date().toISOString(),
    EndTime: endTime
  };

  logger.telemetry(log);
};
