import { trackError } from 'common/utils/experience/utils/track-error';
import { IFetchDropdownPayload } from 'common/utils/entity-data-manager/entity-data-manager.types';
import { getUserDropdownOptions, getAugmentedOptions } from '../common/fetch-options';
import { FilterRenderType } from '../../constants';
import { getDropdownOptions } from 'common/utils/entity-data-manager/account-activity/dropdown-options';
import { CallerSource } from 'common/utils/rest-client';
import { IFetchOptionsRelatedData } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { fetchAccountOptions } from '../account/fetch-options';
import { ACCOUNT_SCHEMA_PREFIX } from 'apps/smart-views/constants/constants';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';

const getOptionsFromMetaData = async (payload: IFetchDropdownPayload): Promise<IOption[]> => {
  try {
    const body = {
      code: payload?.code || '',
      searchText: payload?.searchText,
      schemaName: payload?.schemaName,
      customObjectSchemaName: payload.customObjectSchemaName
    };
    const options = await getDropdownOptions({
      body,
      callerSource: CallerSource.SmartViews
    });

    const augmentedOptions = getAugmentedOptions(options);
    return augmentedOptions;
  } catch (error) {
    trackError(error);
  }
  return [];
};

export const fetchActivityOptions = async (
  payload: IFetchDropdownPayload,
  fetchOptionsRelatedData: IFetchOptionsRelatedData
): Promise<IOption[]> => {
  const { filterConfig: fieldConfig } = fetchOptionsRelatedData;

  try {
    const { schemaName, searchText } = payload;
    const { renderType } = fieldConfig;

    if (schemaName?.startsWith(ACCOUNT_SCHEMA_PREFIX)) {
      return await fetchAccountOptions(payload, fetchOptionsRelatedData);
    }

    if (renderType === FilterRenderType?.UserDropdown) {
      return await getUserDropdownOptions(searchText);
    }

    return (await getOptionsFromMetaData(payload)) || [];
  } catch (error) {
    console.log(error);
  }
  return [];
};
