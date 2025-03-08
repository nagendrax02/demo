import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
import { API_ROUTES } from 'common/constants';
import { getAccountId } from 'common/utils/helpers/helpers';
import { CallerSource, Module, httpPost } from 'src/common/utils/rest-client';
import { IResponseOption } from './change-primary-contact.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';

const getAugumentResponse = (
  response: IOption[],
  currentPrimaryContactId?: string
): IResponseOption[] => {
  const valueKey = 'ProspectID';
  return currentPrimaryContactId
    ? response?.filter((e) => (e?.[valueKey] as string) !== currentPrimaryContactId)
    : response;
};

const fetchOptions = async (
  searchKeyWord?: string,
  currentPrimaryContactId?: string
): Promise<IResponseOption[]> => {
  try {
    const path = API_ROUTES.accountLeads;
    const payload = {
      CompanyId: getAccountId(),
      Columns: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Include_CSV:
          'ProspectID,ProspectAutoID,FirstName,LastName,EmailAddress,DoNotEmail,Phone,Mobile'
      },
      QuickSearch: searchKeyWord || '',
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

    const response = (await httpPost({
      path,
      module: Module.Marvin,
      body: payload,
      callerSource: CallerSource.AccountDetailsProperties
    })) as IOption[];

    return getAugumentResponse(response, currentPrimaryContactId);
  } catch (error) {
    trackError(error);
  }
  return [];
};

export { fetchOptions };
