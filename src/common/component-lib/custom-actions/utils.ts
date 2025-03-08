import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { IConnectorAction, IConnectorActionConfig } from 'common/types/entity/lead';
import { AUTH_HEADERS } from 'common/utils/authentication/constant';
import { safeParseJson } from 'common/utils/helpers/helpers';
import { HttpMethod, httpRequest, httpPost, Module } from 'common/utils/rest-client';
import { IAPIResponse, IConfig } from './cutom-actions.types';
import { API_ROUTES } from 'common/constants';
import { Type, INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { IRequest, CallerSource } from 'common/utils/rest-client/rest-client.types';

type Alert = (notification: INotification) => void;

export const headers = {
  [AUTH_HEADERS.contentType]: 'application/json'
};

export const getMailMergedData = async (
  config: IConfig,
  callerSource: CallerSource
): Promise<string> => {
  const content: string = await httpPost({
    path: API_ROUTES.mailMergedContent,
    module: Module.Connector,
    body: {
      data: JSON.stringify({
        configURL: config.actionConfig?.URL,
        configData: config.actionConfig?.Data
      }),
      leadId: config?.leadIds?.[0],
      LeadIds: config.leadIds,
      activityId: config?.activityIds?.[0],
      ActivityIds: config.activityIds,
      opportunityId: config?.opportunityIds?.[0],
      OpportunityIds: config.opportunityIds,
      taskId: config?.taskIds?.[0],
      TaskIds: config.taskIds,
      UserIds: config.userIds,
      UserAutoIds: config.userAutoIds,
      UserAdvancedSearch: config.userAdvancedSearch,
      listId: config?.listId
    },
    callerSource
  });
  return content;
};

const getMessage = (message: string): string => {
  try {
    if (typeof message === 'string') {
      return message;
    }
    return JSON.stringify(message);
  } catch (error) {
    trackError(error);
    return message;
  }
};

const handleAPIResponse = (showAlert: Alert, response?: unknown): void => {
  if (response) {
    if (typeof response === 'string' && !safeParseJson(response)) {
      showAlert({
        type: Type.ERROR,
        message: response || ERROR_MSG.generic
      });
    } else {
      const responseData = (
        typeof response === 'string' ? safeParseJson(response) : response
      ) as IAPIResponse;
      const status = responseData?.status || responseData?.Status;
      const message = responseData?.message || responseData?.Message;
      if (status && status.toLowerCase() === 'success') {
        showAlert({
          type: Type.SUCCESS,
          message: getMessage(message || '') || 'Action Executed Successfully'
        });
      } else {
        throw { message: message || response } as Error;
      }
    }
  }
};

// eslint-disable-next-line max-lines-per-function
export const callAnAPI = async ({
  actionConfig,
  configURL,
  showAlert,
  configData,
  showPopup,
  callerSource
}: {
  actionConfig?: IConnectorActionConfig;
  configURL: string;
  showAlert: Alert;
  callerSource: CallerSource;
  configData?: string;
  showPopup?: boolean;
}): Promise<string | undefined> => {
  try {
    const method = actionConfig?.Method.toUpperCase() as HttpMethod;
    const payload: IRequest = {
      method,
      url: configURL,
      requestConfig: { headers },
      callerSource
    };
    if (method === HttpMethod.Post)
      payload.body = (safeParseJson(configData || '') || configData) as BodyInit;
    const response = await httpRequest(payload);
    if (!showPopup) handleAPIResponse(showAlert, response);
    return response as string;
  } catch (err: unknown) {
    const error = err as Error & { status: number };
    if (error.status >= 400) {
      showAlert({ type: Type.ERROR, message: `Request failed with status code ${error.status}` });
    } else {
      showAlert({
        type: Type.ERROR,
        message: getMessage(error?.message) || ERROR_MSG.generic
      });
    }
  }
  return;
};

export const getAttributes = (config: IConnectorAction): Record<string, string> => {
  const defaultSandboxValue =
    'allow-modals allow-same-origin allow-scripts allow-popups allow-forms allow-downloads';
  try {
    const iFrameAttribute = config?.ActionConfig?.IframeAttribute;

    let allAttribute: Record<string, string> = {};
    if (iFrameAttribute) {
      const allAttributes = iFrameAttribute?.split('&');

      const attributeEntries = allAttributes?.map((attr: string) => {
        const [attribute, value] = attr.trim().split('=');
        return [attribute, value];
      });

      allAttribute = Object?.fromEntries(attributeEntries) as Record<string, string>;
    }
    const { height, width, sandbox, ...rest } = allAttribute as Record<string, string>;

    return { sandbox: sandbox || defaultSandboxValue, ...rest };
  } catch (error) {
    trackError(error);
  }
  return { sandbox: defaultSandboxValue };
};
