import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants';
import { Module, httpGet, httpPost } from '../../rest-client';
import IOptionsResponse, { IFetchDropdownOptions, IOptions } from '../entity-data-manager.types';
import { IFetchAccountDropdownOptions } from './account.types';
import { DEFAULT_COUNT } from '../contants';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { getFromDB, setInDB, StorageKey } from '../../storage-manager';

const getDropdownOptions = async (config: IFetchAccountDropdownOptions): Promise<IOptions> => {
  const { body, callerSource } = config;

  const response = (await httpPost({
    path: API_ROUTES.accountDropdownOption,
    module: Module.Marvin,
    body: {
      Count: body?.count || DEFAULT_COUNT,
      SchemaName: body?.schemaName,
      SearchText: body?.searchText,
      Type: body?.code
    },
    callerSource
  })) as IOptionsResponse;

  return response?.OptionSet?.length ? response?.OptionSet : response?.Options;
};

export const getAccountDropdownOptions = async (
  props: IFetchDropdownOptions
): Promise<IOption[]> => {
  try {
    const { body, callerSource } = props;
    const { searchText = '', code = '' } = body;
    const accounts: IOption[] = await httpGet({
      path: `${API_ROUTES.associatedAccountsGet}?accountTypeId=${code}&searchText=${searchText}&pageSize=20`,
      callerSource: callerSource,
      module: Module.Marvin
    });

    return accounts;
  } catch (error) {
    trackError(error);
    return [];
  }
};

const searchFromResultList = (options: IOption[], searchText: string, key: string): IOption[] => {
  const searchedOptions = options?.filter(
    (option) => option?.[key].toLowerCase()?.includes(searchText?.toLowerCase())
  );
  return searchedOptions;
};

export const getAccountTypeDropdownOptions = async (
  props: IFetchDropdownOptions
): Promise<IOption[]> => {
  const { callerSource, body } = props;
  const { searchText = '' } = body;
  try {
    const cachedAccountTypeOptions = await getFromDB<IOption[]>(
      StorageKey.AccountTypeFilterOptions
    );
    if (cachedAccountTypeOptions) {
      if (searchText) {
        const searchedResult = searchFromResultList(cachedAccountTypeOptions, searchText, 'label');
        return searchedResult;
      }
      return cachedAccountTypeOptions;
    }

    const accounts: { Options: IOption[] } = await httpGet({
      path: API_ROUTES.accountTypesGet,
      callerSource: callerSource,
      module: Module.Marvin
    });

    const options = searchText
      ? searchFromResultList(accounts?.Options, searchText, 'label')
      : accounts?.Options;

    await setInDB(StorageKey.AccountTypeFilterOptions, options, true);
    return options;
  } catch (error) {
    trackError(error);
  }
  return [];
};

export { getDropdownOptions };
