import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants';
import { Module, httpPost } from 'common/utils/rest-client';
import {
  getInMemoryCache,
  setInMemoryCache,
  InMemoryStorageKey
} from 'common/utils/storage-manager';
import { DEFAULT_COUNT, MAX_PRODUCT_OPTIONS_COUNT } from '../contants';
import IOptionsResponse, {
  IDropdownGroupOption,
  IDropdownOption,
  IOptions
} from '../entity-data-manager.types';
import { IFetchProductDropdownOptions } from './product.types';
const getLowerCase = (value = ''): string => {
  return value?.toLowerCase();
};

const getSearchedOptions = (
  options: IDropdownOption[],
  searchText: string,
  count: number
): IDropdownOption[] => {
  try {
    let filteredData = options;
    if (searchText) {
      filteredData = options?.filter(
        (currentOption) =>
          getLowerCase(currentOption?.label)?.includes(getLowerCase(searchText)) ||
          getLowerCase(currentOption?.text)?.includes(getLowerCase(searchText)) ||
          getLowerCase(currentOption?.value)?.includes(getLowerCase(searchText))
      );
    }
    return filteredData.splice(0, count);
  } catch (error) {
    trackError(error);
  }
  return options.splice(0, count);
};

const getSearchedOptionsSet = (
  options: IDropdownGroupOption[],
  searchText: string,
  count: number
): IDropdownGroupOption[] => {
  let filterOptions: IDropdownGroupOption[] = [];
  try {
    filterOptions = options?.reduce((prev, curr) => {
      if (getLowerCase(curr?.label)?.includes(getLowerCase(searchText))) {
        prev.push(curr);
      } else if (curr?.options?.length) {
        const filteredData = curr?.options.filter(
          (subOpt) => getLowerCase(subOpt?.label)?.includes(getLowerCase(searchText))
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
  return options.splice(0, count);
};

const getOptions = (
  response: IOptionsResponse,
  searchText: string,
  count = DEFAULT_COUNT
): IOptions => {
  if (response?.OptionSet?.length) {
    return getSearchedOptionsSet(response.OptionSet, searchText, count) as IOptions;
  }
  return getSearchedOptions(response.Options, searchText, count);
};

const getDropdownOptions = async (config: IFetchProductDropdownOptions): Promise<IOptions> => {
  const { body, callerSource } = config;

  let response = getInMemoryCache(InMemoryStorageKey.Product) as IOptionsResponse;

  if (!response) {
    response = await httpPost({
      path: API_ROUTES.productDropdownOptionsGet,
      module: Module.Marvin,
      body: {
        SearchText: '',
        Count: MAX_PRODUCT_OPTIONS_COUNT,
        GetProductWithSku: true
      },
      callerSource: callerSource
    });
    setInMemoryCache(InMemoryStorageKey.Product, response);
  }

  return getOptions(response, body?.searchText, body?.count || DEFAULT_COUNT);
};

export { getDropdownOptions };
