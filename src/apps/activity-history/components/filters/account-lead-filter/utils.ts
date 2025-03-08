const getOptionLabel = (
  firstName: string | null,
  lastName: string | null,
  emailAddress: string | null
): string => {
  return `${firstName || ''} ${lastName || ''}`.trim() + (emailAddress ? `<${emailAddress}>` : '');
};

import { API_ROUTES } from 'common/constants';
import { getAccountId } from 'common/utils/helpers/helpers';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { IResponse, ISelectedLeadFilterOption } from './accountLeadFilter.types';

const getAugmentedDropdownOptions = (leadData: IResponse[]): ISelectedLeadFilterOption[] => {
  const augmentedOptions: ISelectedLeadFilterOption[] = [];
  leadData?.forEach((lead) => {
    const prospectID = lead?.ProspectID;
    const firstName = lead?.FirstName;
    const lastName = lead?.LastName;
    const emailAddress = lead?.EmailAddress;
    const doNotEmail = lead?.DoNotEmail;

    if (prospectID && firstName + lastName + emailAddress) {
      augmentedOptions.push({
        value: prospectID,
        label: getOptionLabel(firstName, lastName, emailAddress),
        data: doNotEmail
      });
    }
  });
  return augmentedOptions;
};

const fetchOptions = async (searchText?: string): Promise<ISelectedLeadFilterOption[]> => {
  const body = {
    CompanyId: getAccountId(),
    Columns: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Include_CSV: 'ProspectID,ProspectAutoID,FirstName,LastName,EmailAddress,DoNotEmail'
    },
    QuickSearch: searchText || '',
    Sorting: {
      ColumnName: 'FirstName',
      Direction: 0
    },
    Paging: {
      PageIndex: 1,
      PageSize: 25
    },
    DoNotFetchStarredLeads: true,
    DoNotFetchTaggedLeads: true
  };
  const path = API_ROUTES.accountLeads;
  const response = (await httpPost({
    path,
    module: Module.Marvin,
    body,
    callerSource: CallerSource.AccountLeadFilters
  })) as IResponse[];
  const augmentedResponse = getAugmentedDropdownOptions(response);
  return augmentedResponse;
};

export { fetchOptions };
