import { trackError } from 'common/utils/experience/utils/track-error';
import { IToken } from 'common/types';
import {
  HTTP_HEADERS,
  ERROR_MSG,
  ORGCODE_PLACEHOLDER,
  REGION_PLACEHOLDER,
  FALLBACK_ORG_CODE
} from 'common/utils/rest-client/constant';
import { HttpResponseType, Module } from '../rest-client.types';
import { getEnvConfig } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { addCustomErrorProperty } from '../../helpers/helpers';

const validateHttpPath = (path: string): void => {
  if (!path?.trim()) {
    trackError(ERROR_MSG.emptyPath);
    throw new Error(ERROR_MSG.emptyPath);
  }
};

const validateHttpBody = <T>(body: T): void => {
  if (!body || typeof body !== 'object') {
    trackError(ERROR_MSG.emptyBody);
    throw new Error(ERROR_MSG.emptyBody);
  }
};

const getOrgCode = (orgCode?: string): string => {
  try {
    if (orgCode?.trim() && Number(orgCode) > 0) {
      return orgCode;
    }
  } catch (error) {
    trackError(error);
  }
  return FALLBACK_ORG_CODE;
};

const getBaseUrl = (module: Module): string | null => {
  try {
    const baseUrl = (getEnvConfig(ENV_CONFIG?.apiURL) as Record<string, string>)?.[
      module
    ] as string;
    if (baseUrl) {
      const authConfig = getPersistedAuthConfig();

      return baseUrl
        ?.replace(ORGCODE_PLACEHOLDER, `${getOrgCode(authConfig?.User.OrgCode)}`)
        ?.replace(REGION_PLACEHOLDER, `${authConfig?.Tenant?.RegionId}`);
    }
  } catch (error) {
    trackError(error);
    throw error;
  }

  const error = new Error(ERROR_MSG.generic);
  addCustomErrorProperty(error, 'additionalData', {
    isEnvConfigPresent: !!getEnvConfig(ENV_CONFIG?.apiURL),
    module
  });
  throw error;
};

const getRequestUrl = (module: Module, path = '/'): string => {
  try {
    validateHttpPath(path);
    return `${getBaseUrl(module) || ''}${path}`;
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const getFieldSalesAuthorizationHeaders = (requestHeader: HeadersInit, token: string): Headers => {
  const regionId = getPersistedAuthConfig()?.Tenant?.RegionId || '';
  const headers = {
    [HTTP_HEADERS.xLsqMarvinToken]: token,
    [HTTP_HEADERS.xLsqRegionId]: regionId,
    [HTTP_HEADERS.contentType]: 'application/json',
    ...requestHeader
  };

  return new Headers(headers);
};

const getHeaders = <U>({
  requestInitHeader,
  body,
  module
}: {
  requestInitHeader?: HeadersInit;
  body?: U;
  module?: Module;
}): Headers => {
  try {
    const tokens = getPersistedAuthConfig()?.Tokens as IToken;
    const requestHeader = requestInitHeader || {};

    if (module === Module.FieldSales) {
      return getFieldSalesAuthorizationHeaders(requestHeader, `${tokens?.Token}`);
    }

    const headers = {
      [HTTP_HEADERS.authorization]: `${tokens?.Token}`,
      [HTTP_HEADERS.xLsqMarvinToken]: `${tokens?.Token}`,
      [HTTP_HEADERS.xLsqSessionId]: `${tokens?.SessionId}`,
      [HTTP_HEADERS.xLsqAppPermissions]: `${tokens?.PermissionsToken}`,
      [HTTP_HEADERS.xLsqAppCallerSrc]: 'Marvin',
      ...requestHeader
    };

    if (!body || !(body instanceof FormData)) {
      if (module !== Module.FileUpload) headers[HTTP_HEADERS.xLsqEnableCompression] = '1';
      headers[HTTP_HEADERS.contentType] = 'application/json';
    }

    return new Headers(headers);
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const getResponseType = (contentType: string, type: HttpResponseType): HttpResponseType => {
  if (contentType?.includes(HttpResponseType.HTML)) {
    type = HttpResponseType.HTML;
  }

  return type;
};

const getHttpResponse = async <T>(
  response: Response,
  type: HttpResponseType = HttpResponseType.Json
): Promise<T> => {
  try {
    const responseContentType = response?.headers?.get('Content-Type')?.toUpperCase() || '';
    type = getResponseType(responseContentType, type);

    switch (type) {
      case HttpResponseType.Json: {
        if (responseContentType?.includes(type)) {
          return (await response?.json()) as T;
        }
        return (await response.text()) as T;
      }
      case HttpResponseType.Blob: {
        return (await response.blob()) as T;
      }
      case HttpResponseType.HTML:
        throw new Error(`Unexpected Content-Type: ${responseContentType}`);
      default:
        throw new Error(`${type} is not supported currently`);
    }
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export {
  getHttpResponse,
  getRequestUrl,
  getHeaders,
  validateHttpBody,
  validateHttpPath,
  getBaseUrl
};
