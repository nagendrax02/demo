import { trackError } from 'common/utils/experience/utils/track-error';
import {
  ACCOUNT_SCHEMA_PREFIX,
  ownerSchemas,
  SCHEMA_NAMES
} from 'apps/smart-views/constants/constants';
import { getAugmentedOptions, getUserDropdownOptions } from '../common/fetch-options';
import getEntityDataManager from 'common/utils/entity-data-manager';
import { EntityType } from 'common/types';
import { CallerSource } from 'common/utils/rest-client';
import { IFetchDropdownPayload } from 'common/utils/entity-data-manager/entity-data-manager.types';
import { removeSchemaPrefix } from 'apps/smart-views/components/smartview-tab/utils';
import {
  IFetchOptionsRelatedData,
  IFilterConfig,
  IFilterData
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { ACCOUNT_CONFIG, FilterRenderType } from '../../constants';
import {
  getAccountDropdownOptions,
  getAccountTypeDropdownOptions
} from 'common/utils/entity-data-manager/account/dropdown-options';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { addBadgeComponent } from '../add-badge';
import { fetchV2AugmentedOptions } from 'v2/associated-entity-label-v2/fetchOptions';

const getOptionsFromMetaData = async (payload: IFetchDropdownPayload): Promise<IOption[]> => {
  try {
    const options =
      (await (
        await getEntityDataManager(EntityType.Account)
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

const handleAccountDropdownOptions = async (
  payload: IFetchDropdownPayload,
  fieldConfig: IFilterData,
  bySchemaName?: IFilterConfig
): Promise<IOption[]> => {
  const parentSchemaName = fieldConfig?.parentSchema || '';
  const accountTypeId = bySchemaName?.[parentSchemaName]?.value || '';
  payload.code = accountTypeId;
  const options = await getAccountDropdownOptions({
    body: payload,
    callerSource: CallerSource.SmartViews
  });

  const augmentedOptions = await fetchV2AugmentedOptions({
    options,
    displayConfig: ACCOUNT_CONFIG,
    valueKey: 'AccountId',
    showSelectedValueAsText: true
  });
  return augmentedOptions;
};

const isUserDropdown = (schemaName: string, renderType: FilterRenderType): boolean => {
  return !!(ownerSchemas[schemaName] || renderType === FilterRenderType.UserDropdown);
};

const getStageOptions = async (payload: IFetchDropdownPayload): Promise<IOption[]> => {
  const stageOptions = await getOptionsFromMetaData(payload);
  return addBadgeComponent(stageOptions, true);
};

export const fetchAccountOptions = async (
  payload: IFetchDropdownPayload,
  fetchOptionsRelatedData: IFetchOptionsRelatedData
): Promise<IOption[]> => {
  const { filterConfig: fieldConfig, bySchemaName } = fetchOptionsRelatedData;
  try {
    const { searchText, schemaName } = payload;
    const { renderType } = fieldConfig;
    payload.schemaName = removeSchemaPrefix(payload.schemaName, ACCOUNT_SCHEMA_PREFIX);
    if (payload?.relatedEntityCode) {
      payload.code = payload?.relatedEntityCode;
      delete payload?.relatedEntityCode;
    }

    if (schemaName === SCHEMA_NAMES.RELATED_COMPANY_ID) {
      return await handleAccountDropdownOptions(payload, fieldConfig, bySchemaName);
    }

    if (schemaName === SCHEMA_NAMES.COMPANY_TYPE_NAME) {
      return await getAccountTypeDropdownOptions({
        body: payload,
        callerSource: CallerSource.SmartViews
      });
    }

    if (isUserDropdown(schemaName, renderType)) {
      return await getUserDropdownOptions(searchText);
    }

    if (payload.schemaName === SCHEMA_NAMES.STAGE) {
      return await getStageOptions(payload);
    }

    return await getOptionsFromMetaData(payload);
  } catch (error) {
    trackError(error);
    return [];
  }
};
