import { API_ROUTES } from 'common/constants';
import { Module, httpPost } from 'common/utils/rest-client';
import IOptionsResponse, { IOptions } from '../entity-data-manager.types';
import { IFetchActivityDropdownOptions } from './account-activity.types';
import { DEFAULT_OPTIONS_COUNT } from '../user/constants';

export const getDropdownOptions = async (
  config: IFetchActivityDropdownOptions
): Promise<IOptions> => {
  const { body, callerSource } = config;
  const { code, schemaName, searchText, SearchValues, count, customObjectSchemaName } = body;
  const response: IOptionsResponse = await httpPost({
    path: API_ROUTES.accountActivityDropdownOptionsGet,
    module: Module.Marvin,
    body: {
      SchemaName: schemaName,
      CustomObjectSchemaName: customObjectSchemaName,
      SearchText: searchText,
      Count: count || DEFAULT_OPTIONS_COUNT,
      Type: code,
      SearchValues
    },
    callerSource: callerSource
  });

  return response?.OptionSet?.length ? response.OptionSet : response.Options;
};
