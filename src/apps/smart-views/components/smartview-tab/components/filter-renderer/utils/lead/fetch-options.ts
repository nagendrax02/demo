import { trackError } from 'common/utils/experience/utils/track-error';
import { EntityType } from 'common/types';
import getEntityDataManager from 'common/utils/entity-data-manager';
import { CallerSource } from 'common/utils/rest-client';
import { IFetchDropdownPayload } from 'common/utils/entity-data-manager/entity-data-manager.types';
import {
  getAugmentedOptions,
  getSalesGroupOptions,
  getUserDropdownOptions
} from '../common/fetch-options';
import { GROUPS, SCHEMA_NAMES, ownerSchemas } from 'apps/smart-views/constants/constants';
import { removeSchemaPrefix } from '../../../../utils';
import {
  IDropdownGroupOption,
  IDropdownOption
} from 'common/utils/entity-data-manager/entity-data-manager.types';
import { IFetchOptionsRelatedData } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { getStageDropdownOptions } from 'common/utils/entity-data-manager/lead/dropdown-options';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { addBadgeComponent } from '../add-badge';

const getOptionsFromMetaData = async (
  payload: IFetchDropdownPayload,
  entityType: EntityType
): Promise<IOption[]> => {
  try {
    if (payload) {
      delete payload.code;
    }
    const options =
      (await (
        await getEntityDataManager(entityType)
      )?.getDropdownOptions?.({
        body: payload,
        callerSource: CallerSource.SmartViews
      })) || [];

    const augmentedOptions = getAugmentedOptions(options, payload);
    return augmentedOptions;
  } catch (error) {
    trackError(error);
  }
  return [];
};

const getTimeZoneOptions = async (
  payload: IFetchDropdownPayload,
  entityType: EntityType
): Promise<IOption[]> => {
  try {
    const options =
      (await (
        await getEntityDataManager(entityType)
      )?.getDropdownOptions?.({
        body: payload,
        callerSource: CallerSource.SmartViews
      })) || [];

    const augmentedOptions: IOption[] = [];
    options?.forEach((option: IDropdownOption | IDropdownGroupOption) => {
      if (!('options' in option) && option?.value) {
        augmentedOptions.push({
          label: option?.text || option?.label,
          value: option?.value
        });
      }
    });
    return augmentedOptions;
  } catch (error) {
    trackError(error);
  }
  return [];
};

const getStageOptions = async (
  payload: IFetchDropdownPayload,
  leadType?: string
): Promise<IOption[]> => {
  try {
    if (payload) {
      delete payload.code;
    }
    const options = await getStageDropdownOptions({
      body: payload,
      callerSource: CallerSource.SmartViews,
      leadType
    });

    const augmentedOptions = getAugmentedOptions(options, payload);
    return addBadgeComponent(augmentedOptions, true);
  } catch (error) {
    trackError(error);
  }
  return [];
};

// eslint-disable-next-line complexity
export const fetchLeadOptions = async (
  payload: IFetchDropdownPayload,
  fetchOptionsRelatedData: IFetchOptionsRelatedData
): Promise<IOption[]> => {
  const { entityType, leadType } = fetchOptionsRelatedData;

  try {
    let { schemaName } = payload;
    const { searchText } = payload;
    schemaName = removeSchemaPrefix(schemaName);
    payload.schemaName = schemaName;

    if (ownerSchemas[schemaName]) {
      return await getUserDropdownOptions(searchText);
    }
    if (entityType) {
      if (schemaName === SCHEMA_NAMES.TIME_ZONE) {
        return await getTimeZoneOptions(payload, entityType);
      }
      if ([SCHEMA_NAMES.GROUP, GROUPS].includes(schemaName)) {
        return await getSalesGroupOptions(payload, entityType);
      }
      if (schemaName === LEAD_SCHEMA_NAME.PROSPECT_STAGE) {
        return await getStageOptions(payload, leadType);
      }
      return (await getOptionsFromMetaData(payload, entityType)) || [];
    }
  } catch (error) {
    trackError(error);
  }
  return [];
};
