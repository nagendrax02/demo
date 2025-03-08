import { trackError } from 'common/utils/experience/utils/track-error';
import {
  getAugmentedOptions,
  getProductOption,
  getUserDropdownOptions
} from '../common/fetch-options';
import getEntityDataManager from 'common/utils/entity-data-manager';
import { EntityType } from 'common/types';
import { CallerSource } from 'common/utils/rest-client';
import { IFetchDropdownPayload } from 'common/utils/entity-data-manager/entity-data-manager.types';
import { IFetchOptionsRelatedData } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { FilterRenderType } from '../../constants';
import { DataType } from 'common/types/entity/lead';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { SCHEMA_NAMES } from 'apps/smart-views/constants/constants';
import { addBadgeComponent } from '../add-badge';

const getOptionsFromMetaData = async (payload: IFetchDropdownPayload): Promise<IOption[]> => {
  try {
    const options =
      (await (
        await getEntityDataManager(EntityType.Opportunity)
      )?.getDropdownOptions?.({
        body: payload,
        callerSource: CallerSource.SmartViews
      })) || [];

    const augmentedOptions = getAugmentedOptions(options);
    return augmentedOptions;
  } catch (error) {
    trackError(error);
  }
  return [];
};

const getStatusOptions = async (payload: IFetchDropdownPayload): Promise<IOption[]> => {
  const statusOptions = await getOptionsFromMetaData(payload);
  return addBadgeComponent(statusOptions);
};

export const fetchOpportunityOptions = async (
  payload: IFetchDropdownPayload,
  fetchOptionsRelatedData: IFetchOptionsRelatedData
): Promise<IOption[]> => {
  const { filterConfig: fieldConfig } = fetchOptionsRelatedData;

  try {
    const { searchText } = payload;
    const { renderType, dataType } = fieldConfig;

    if (renderType === FilterRenderType.UserDropdown) {
      return await getUserDropdownOptions(searchText);
    }

    if (dataType === DataType.Product) {
      return await getProductOption(searchText);
    }

    if (payload.schemaName === SCHEMA_NAMES.STATUS) {
      return await getStatusOptions(payload);
    }

    return await getOptionsFromMetaData(payload);
  } catch (error) {
    trackError(error);
    return [];
  }
};
