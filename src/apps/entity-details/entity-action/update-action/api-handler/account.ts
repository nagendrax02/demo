import { API_ROUTES } from 'common/constants';
import { ACTION } from '../../../constants';
import { IAccountBodyResponse, IResponse } from '../update.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { IApiHandler } from './api-handler';

const getApiRequestBody = async (data: IApiHandler): Promise<IAccountBodyResponse> => {
  const { actionType, selectedOption, entityIds, entityId } = data;

  const schemaName = actionType === ACTION.ChangeOwner ? 'OwnerId' : 'Stage';
  return schemaName === 'Stage'
    ? {
        CompanyIds: entityId,
        CompanyTypeId: entityIds?.EntityTypeId || '',
        Stage: selectedOption[0]?.value
      }
    : {
        CompanyIds: entityId,
        CompanyTypeId: entityIds?.EntityTypeId || '',
        OwnerId: selectedOption[0]?.value
      };
};

const invokeAPI = async (path: string, body: IAccountBodyResponse): Promise<IResponse> => {
  return (await httpPost({
    path,
    module: Module.Marvin,
    body,
    callerSource: CallerSource.AccountDetailsVCard
  })) as IResponse;
};

export const accountApiHandler = async (data: IApiHandler): Promise<IResponse> => {
  const body = await getApiRequestBody(data);
  const path = API_ROUTES.accountBulkUpdate;
  const response = invokeAPI(path, body);
  return response;
};
