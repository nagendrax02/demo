import { trackError } from 'common/utils/experience/utils/track-error';
import {
  IDropdownGroupOption,
  IDropdownOption,
  IFetchDropdownPayload,
  IOptions
} from 'common/utils/entity-data-manager/entity-data-manager.types';
import {
  getUserDropdownOptions,
  getAugmentedOptions,
  getProductOption
} from '../common/fetch-options';
import { FilterRenderType, NOT_SET } from '../../constants';
import { getDropdownOptions } from 'common/utils/entity-data-manager/activity/dropdown-options';
import { CallerSource } from 'common/utils/rest-client';
import { leadSchemaNamePrefix, SCHEMA_NAMES } from 'apps/smart-views/constants/constants';
import { fetchLeadOptions } from '../lead/fetch-options';
import { IFetchOptionsRelatedData } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { DataType } from 'common/types/entity/lead';
import { ActivityStatus } from 'apps/smart-views/augment-tab-data/activity/constants';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { addBadgeComponent } from '../add-badge';

const getNotSetOption = (options: IOptions, searchText): IOptions => {
  const option = options?.[0];
  const notSetOption = NOT_SET;

  let notSetDropdownOption: IDropdownOption | IDropdownGroupOption;

  if (searchText?.trim() && !NOT_SET?.label?.toLowerCase()?.includes(searchText?.toLowerCase()))
    return options;

  if ('options' in (option || {})) {
    notSetDropdownOption = {
      label: '',
      value: '',
      options: [notSetOption]
    };
  } else {
    notSetDropdownOption = {
      label: notSetOption?.label,
      value: notSetOption?.value
    };
  }

  options?.push(notSetDropdownOption as IDropdownOption & IDropdownGroupOption);
  return options;
};

const getOptionsFromMetaData = async (payload: IFetchDropdownPayload): Promise<IOption[]> => {
  try {
    const isActivityStatus = payload?.schemaName === ActivityStatus;
    const body = {
      code: payload?.code || '',
      searchText: payload?.searchText,
      schemaName: payload?.schemaName,
      customObjectSchemaName: payload.customObjectSchemaName
    };
    let options = await getDropdownOptions({
      body,
      callerSource: CallerSource.SmartViews
    });

    if (isActivityStatus) {
      options = getNotSetOption(options || [], payload?.searchText);
    }
    const augmentedOptions = getAugmentedOptions(options);
    return augmentedOptions;
  } catch (error) {
    trackError(error);
  }
  return [];
};

const getStatusOptions = async (payload: IFetchDropdownPayload): Promise<IOption[]> => {
  const statusOptions = await getOptionsFromMetaData(payload);
  return addBadgeComponent(statusOptions, true);
};

export const fetchActivityOptions = async (
  payload: IFetchDropdownPayload,
  fetchOptionsRelatedData: IFetchOptionsRelatedData
): Promise<IOption[]> => {
  const { filterConfig: fieldConfig } = fetchOptionsRelatedData;

  try {
    const { schemaName, searchText } = payload;
    const { renderType, dataType } = fieldConfig;

    if (schemaName?.startsWith(leadSchemaNamePrefix)) {
      return await fetchLeadOptions(payload, fetchOptionsRelatedData);
    }

    if (renderType === FilterRenderType?.UserDropdown) {
      return await getUserDropdownOptions(searchText);
    }

    if (dataType === DataType.Product) {
      return await getProductOption(searchText);
    }

    if (payload.schemaName === SCHEMA_NAMES.STATUS) {
      return await getStatusOptions(payload);
    }

    return (await getOptionsFromMetaData(payload)) || [];
  } catch (error) {
    console.log(error);
  }
  return [];
};
