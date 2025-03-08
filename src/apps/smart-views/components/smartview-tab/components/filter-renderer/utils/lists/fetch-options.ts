import { IFetchDropdownPayload } from 'common/utils/entity-data-manager/entity-data-manager.types';
import { LIST_TYPE_MAPPING, ListType } from 'apps/smart-views/smartviews.types';
import { getListsConfigurations } from 'apps/smart-views/components/custom-tabs/manage-lists/utils';
import { trackError } from 'common/utils/experience';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';

export const fetchListsOptions = async (payload: IFetchDropdownPayload): Promise<IOption[]> => {
  try {
    const { searchText } = payload;
    const { IsLargeTenant } = await getListsConfigurations();
    const options = [
      {
        label: LIST_TYPE_MAPPING[ListType.STATIC].toString(),
        value: ListType.STATIC.toString()
      },
      {
        label: LIST_TYPE_MAPPING[ListType.DYNAMIC].toString(),
        value: ListType.DYNAMIC.toString()
      }
    ];
    if (IsLargeTenant === '1') {
      options.push({
        label: LIST_TYPE_MAPPING[ListType.REFRESHABLE].toString(),
        value: ListType.REFRESHABLE.toString()
      });
    }
    return options?.filter(
      (option) => !searchText || option?.label?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
  } catch (error) {
    trackError(error);
  }
  return [];
};
