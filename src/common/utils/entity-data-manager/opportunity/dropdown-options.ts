import { API_ROUTES } from 'common/constants';
import { Module, httpPost } from 'common/utils/rest-client';
import IOptionsResponse, { IFetchDropdownOptions, IOptions } from '../entity-data-manager.types';
import { DEFAULT_COUNT } from '../contants';

const getDropdownOptions = async (config: IFetchDropdownOptions): Promise<IOptions> => {
  const { body, callerSource } = config;

  const response = (await httpPost({
    path: API_ROUTES.opportunityDropdownOptionGet,
    module: Module.Marvin,
    body: {
      Count: body?.count || DEFAULT_COUNT,
      SchemaName: body?.schemaName,
      SearchText: body?.searchText,
      Code: body?.code,
      CustomObjectSchemaName: body?.customObjectSchemaName
    },
    callerSource
  })) as IOptionsResponse;

  return response?.OptionSet?.length ? response?.OptionSet : response?.Options;
};

export { getDropdownOptions };
