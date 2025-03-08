import { IApiHandler } from './api-handler';
import { API_ROUTES } from 'common/constants';
import { ACTION } from '../../../constants';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { IActivityField, IOppBodyPayload, IResponse } from '../update.types';
import { getPurifiedContent } from 'common/utils/helpers';
import handleWildCardRestriction from 'common/utils/wildcard-restriction';

const getActivityFields = async (data: IApiHandler): Promise<IActivityField[]> => {
  const { actionType, selectedOption, secondarySelectedOption, message, config } = data;
  if (actionType === ACTION.Change_Status_Stage) {
    const statusStageConfig = [
      {
        ColumnName: 'Status',
        ColumnValue: secondarySelectedOption?.[0]?.value
      },
      {
        ColumnName: 'mx_Custom_2',
        ColumnValue: selectedOption?.[0].value
      }
    ];

    if (message && config?.SchemaName) {
      statusStageConfig.push({
        ColumnName: config?.SchemaName,
        ColumnValue: await getPurifiedContent(message)
      });
    }
    return statusStageConfig;
  } else if (actionType === ACTION.ChangeOwner) {
    return [
      {
        ColumnName: 'Owner',
        ColumnValue: selectedOption?.[0].value
      }
    ];
  }
  return [];
};

const getApiRequestBody = async (data: IApiHandler): Promise<IOppBodyPayload> => {
  const { entityId, actionType, eventCode, searchParams, updatedAllPageRecord } = data;

  return {
    ActivityIds: entityId,
    ActivityFields: await getActivityFields(data),
    UpdateAll: updatedAllPageRecord || false,
    ActivityEventCode: eventCode || -1,
    IsOpportunity: true,
    IsStatusUpdate: actionType === ACTION.Change_Status_Stage,
    ActivitySearchParams: searchParams?.advancedSearchText,
    SearchText: searchParams?.searchText
  };
};

const invokeAPI = async (path: string, body: IOppBodyPayload): Promise<IResponse> => {
  return (await httpPost({
    path,
    module: Module.Marvin,
    body,
    callerSource: CallerSource.LeadDetailsVCard
  })) as IResponse;
};

export const opportunityApiHandler = async (data: IApiHandler): Promise<IResponse> => {
  try {
    const body = await getApiRequestBody(data);
    const path = API_ROUTES.activityBulkUpdate;
    const response = await invokeAPI(path, body);
    return response;
  } catch (error) {
    handleWildCardRestriction({
      type: (error?.name || error?.ExceptionType) as string,
      message: (error?.message || error?.ExceptionMessage) as string
    });

    throw error;
  }
};
