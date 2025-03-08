import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpGet, httpPost } from '../../rest-client';
import IOptionsResponse, { IOptions } from '../entity-data-manager.types';
import { IFetchTaskDropdownOptions, ITaskTypeOption } from './task.types';
import { DEFAULT_COUNT } from '../contants';

const getDropdownOptions = async (config: IFetchTaskDropdownOptions): Promise<IOptions> => {
  const { body, callerSource } = config;

  const response = (await httpPost({
    path: API_ROUTES.taskDropdownOptions,
    module: Module.Marvin,
    body: { ...body, count: body?.count || DEFAULT_COUNT },
    callerSource
  })) as IOptionsResponse;

  return response?.OptionSet?.length ? response?.OptionSet : response?.Options;
};

export const getTaskStatusOptions = async (searchText?: string): Promise<IOptions> => {
  const options: IOptions = [
    {
      value: 'pending',
      label: 'Pending'
    },
    {
      value: 'overdue',
      label: 'Overdue'
    },
    {
      value: 'completed',
      label: 'Completed'
    },
    {
      value: 'cancelled',
      label: 'Cancelled'
    }
  ];

  return searchText
    ? options?.filter((option) => option.label?.toLowerCase()?.includes(searchText?.toLowerCase()))
    : options;
};

export const getTaskTypeOptions = async (
  callerSource: CallerSource,
  searchText?: string
): Promise<ITaskTypeOption[]> => {
  const response = (await httpGet({
    path: `${API_ROUTES.taskTypeDropdown}`,
    module: Module.Marvin,
    callerSource
  })) as ITaskTypeOption[];

  const options = searchText
    ? response?.filter((option) => option.Name?.toLowerCase()?.includes(searchText?.toLowerCase()))
    : response;

  return options;
};

export default getDropdownOptions;
