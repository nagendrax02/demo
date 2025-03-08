import { API_ROUTES } from 'common/constants';
import { ACTION } from '../../../constants';
import { IBodyResponse, IResponse } from '../update.types';
import { getBody } from '../utils';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { ConfigType } from '../../change-stage/change-stage.types';
import { IApiHandler } from './api-handler';

const getComment = (data: IApiHandler): string => {
  const { config, commentsOptions, message } = data;
  if (config?.Type?.toUpperCase() === ConfigType.Dropdown) {
    return commentsOptions[0].value;
  }
  return message;
};

const getApiRequestBody = async (data: IApiHandler): Promise<IBodyResponse> => {
  const { actionType, selectedOption, entityId } = data;
  const schemaName = actionType === ACTION.ChangeStage ? 'ProspectStage' : 'OwnerId';
  return getBody({
    selectedOption,
    comments: getComment(data),
    schemaName,
    leadId: entityId
  });
};

const invokeAPI = async (path: string, body: IBodyResponse): Promise<IResponse> => {
  return (await httpPost({
    path,
    module: Module.Marvin,
    body,
    callerSource: CallerSource.LeadDetailsVCard
  })) as IResponse;
};

export const leadApiHandler = async (data: IApiHandler): Promise<IResponse> => {
  const body = await getApiRequestBody(data);
  const path = API_ROUTES.leadBulkUpdate;
  const response = invokeAPI(path, body);
  return response;
};
