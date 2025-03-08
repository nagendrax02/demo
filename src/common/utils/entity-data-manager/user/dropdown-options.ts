import { trackError } from 'common/utils/experience/utils/track-error';
import { IUserData, IUserOption, IUserOptionGroup } from 'common/types';
import { DEFAULT_OPTIONS_COUNT } from './constants';
import { CallerSource, Module, httpPost } from '../../rest-client';
import { API_ROUTES } from '../../../constants';

interface IFetchOptions {
  body: Record<string, string | number | null>;
  callerSource: CallerSource;
}

const fetchOptions = async ({ body, callerSource }: IFetchOptions): Promise<IUserData> => {
  const response = (await httpPost({
    path: API_ROUTES.userDropdownOptionsGet,
    module: Module.Marvin,
    body: body,
    callerSource
  })) as IUserData;

  return response;
};

const getFilteredOptions = (
  options: IUserOption[],
  searchText: string,
  count: number
): IUserOption[] => {
  try {
    let filteredData = options || [];
    if (searchText) {
      filteredData = options?.filter(
        (currentOption) =>
          currentOption?.label?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
          currentOption?.text?.toLowerCase()?.includes(searchText?.toLowerCase())
      );
    }
    return filteredData?.splice(0, count);
  } catch (error) {
    trackError(error);
  }
  return options?.splice(0, count);
};

const getFilteredOptionsGroup = (
  options: IUserOptionGroup[],
  searchText: string,
  count: number
): IUserOptionGroup[] => {
  let filterOptions: IUserOptionGroup[] = [];
  try {
    filterOptions = options?.reduce((prev, curr) => {
      if (curr?.label?.toLowerCase()?.includes(searchText?.toLowerCase())) {
        prev.push(curr);
      } else if (curr?.options?.length) {
        const filteredData = curr?.options.filter(
          (subOpt) => subOpt?.label?.toLowerCase()?.includes(searchText?.toLowerCase())
        );
        if (filteredData?.length) {
          prev.push({ ...curr, options: filteredData });
        }
      }

      return prev;
    }, filterOptions);
    return filterOptions?.splice(0, count);
  } catch (error) {
    trackError(error);
  }
  return options?.splice(0, count);
};

const getAugmentedOptions = (
  userData: IUserData,
  searchText: string,
  count: number
): IUserOption[] | IUserOptionGroup[] => {
  if (userData?.OptionSet?.length) {
    return getFilteredOptionsGroup(userData.OptionSet, searchText, count);
  }

  return getFilteredOptions(userData.Options, searchText, count);
};

const getDropdownOptions = async ({
  searchText,
  count = DEFAULT_OPTIONS_COUNT,
  additionalData,
  callerSource
}: {
  searchText: string;
  count?: number;
  additionalData?: Record<string, unknown>;
  callerSource: CallerSource;
}): Promise<IUserOption[] | IUserOptionGroup[] | undefined> => {
  try {
    let body = {
      SearchText: searchText || '',
      Count: count
    };
    if (additionalData) {
      body = {
        ...body,
        ...additionalData
      };
    }
    const response = await fetchOptions({ body: body, callerSource });
    const augmentedData = getAugmentedOptions(response, searchText, count);

    return augmentedData;
  } catch (error) {
    trackError(error);
  }
};

export { getDropdownOptions, getFilteredOptionsGroup, getFilteredOptions };
