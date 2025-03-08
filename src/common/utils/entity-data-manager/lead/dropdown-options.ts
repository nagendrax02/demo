import { API_ROUTES } from 'common/constants';
import { Module, httpPost } from '../../rest-client';
import IOptionsResponse, {
  IFetchDropdownOptions,
  IFetchDropdownPayload,
  IOptions
} from '../entity-data-manager.types';
import { DEFAULT_COUNT } from '../contants';
import { getLeadStageApiRoute } from '../../helpers/helpers';

const getDropdownOptions = async (config: IFetchDropdownOptions): Promise<IOptions> => {
  const { body, callerSource } = config;

  const response = (await httpPost({
    path: API_ROUTES.leadDropdownOption,
    module: Module.Marvin,
    body: body,
    callerSource
  })) as IOptionsResponse;

  return response?.OptionSet?.length ? response?.OptionSet : response?.Options;
};

export const getStageDropdownOptions = async (config: IFetchDropdownOptions): Promise<IOptions> => {
  const { body, callerSource, leadType } = config;

  const response = await httpPost<IOptionsResponse, IFetchDropdownPayload>({
    path: getLeadStageApiRoute(leadType ?? ''),
    module: Module.Marvin,
    body: body,
    callerSource
  });

  return response?.OptionSet?.length ? response?.OptionSet : response?.Options;
};

export const getSalesGroupOptions = async (config: IFetchDropdownOptions): Promise<IOptions> => {
  const { body, callerSource } = config;

  const payload = {
    Parameter: {
      SearchText: body?.searchText
    },
    Paging: {
      PageSize: body?.count || DEFAULT_COUNT
    }
  };

  const response = (await httpPost({
    path: API_ROUTES.salesGroup,
    module: Module.Marvin,
    body: payload,
    callerSource
  })) as IOptionsResponse;

  return response?.OptionSet?.length ? response?.OptionSet : response?.Options;
};

export default getDropdownOptions;
