import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';

export const fetchOption = async ({
  callerSource,
  searchValue = '',
  accountTypeId = ''
}: {
  searchValue: string;
  callerSource: CallerSource;
  accountTypeId?: string;
}): Promise<IOption[]> => {
  const accounts: IOption[] = await httpGet({
    path: `${API_ROUTES.associatedAccountsGet}?accountTypeId=${accountTypeId}&searchText=${searchValue}&pageSize=50`,
    callerSource: callerSource,
    module: Module.Marvin
  });

  return accounts;
};
