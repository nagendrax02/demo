import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'src/common/constants';
import { IResponse, IResponseOption } from './change-owner.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import HandleOwnerOption from './HandleOwnerOption';
import { StorageKey, setItem, getItem } from 'common/utils/storage-manager';

// eslint-disable-next-line complexity
const fetchOption = async (searchKeyWord?: string): Promise<IResponseOption[]> => {
  try {
    const path = API_ROUTES.user;
    let response = getItem(StorageKey.Users) as IResponse;
    if (!response) {
      response = (await httpPost({
        path,
        module: Module.Marvin,
        body: {
          SearchText: searchKeyWord ? searchKeyWord : '',
          Count: 100000
        },
        callerSource: CallerSource.LeadDetailsVCard
      })) as IResponse;
      if (response) setItem(StorageKey.Users, response);
    }
    if (searchKeyWord) {
      response.Options = response.Options.filter(
        (opt) =>
          opt.label?.toLowerCase().includes(searchKeyWord?.toLowerCase()) ||
          opt.text?.toLowerCase().includes(searchKeyWord?.toLowerCase())
      );
    }

    if (response?.Options?.length) {
      response.Options.map((option) => {
        option.customComponent = HandleOwnerOption(option);
      });
    }

    return response?.Options || [];
  } catch (error) {
    trackError(error);
  }
  return [];
};

export { fetchOption };
