import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';

interface IBodyResponse {
  Id: string;
  Owner: string;
  SendCalenderInvite: boolean;
}

interface ITaskChangeOwnerResponse {
  Message: {
    AffectedRows: number;
    IsSuccessful: boolean;
    Result: boolean;
  };
  Status: string;
}

export interface IApiHandler {
  entityId: string[];
  selectedOption: {
    label: string;
    value: string;
  }[];
  sendCalenderInvite: boolean;
}

const getApiRequestBody = async (data: IApiHandler, id: string): Promise<IBodyResponse> => {
  const { selectedOption, sendCalenderInvite } = data;
  return {
    Id: id,
    Owner: selectedOption?.[0]?.value,
    SendCalenderInvite: sendCalenderInvite
  };
};

const invokeAPI = async (path: string, body: IBodyResponse): Promise<ITaskChangeOwnerResponse> => {
  return (await httpPost({
    path,
    module: Module.Marvin,
    body,
    callerSource: CallerSource.LeadDetailsVCard
  })) as ITaskChangeOwnerResponse;
};

export const taskApiHandler = async (data: IApiHandler): Promise<ITaskChangeOwnerResponse[]> => {
  try {
    const { entityId } = data;
    if (!entityId.length) return [];
    const promises = entityId.map(async (id) => {
      const body = await getApiRequestBody(data, id);
      const path = API_ROUTES.taskChangeOwner;
      return invokeAPI(path, body);
    });

    const results = await Promise.allSettled([...promises]);

    const responses = results
      .map((result) => (result.status === 'fulfilled' ? result.value : null))
      .filter(Boolean);

    return responses as ITaskChangeOwnerResponse[];
  } catch (error) {
    trackError('Error in taskApiHandler', error);
    return [];
  }
};
