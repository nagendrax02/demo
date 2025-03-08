import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IOnFilterChange } from '../../../../smartview-tab.types';
import { getDateFilterData } from '../common/generate-filter-value';
import fetchLeadAndTaskMetadata, {
  IAugmentedMetaDataForTasks
} from 'apps/smart-views/augment-tab-data/task/metadata';
import { CallerSource } from 'common/utils/rest-client';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  SCHEMA_NAMES,
  leadSchemaNamePrefix,
  ownerSchemas
} from 'apps/smart-views/constants/constants';
import { OptionSeperator } from '../../constants';
import {
  TaskAttributeDataType,
  TaskAttributeRenderType
} from 'common/types/entity/task/metadata.types';
import { IGetFilterValue } from '../../filter-renderer.types';
import { getActiveTabId } from 'apps/smart-views/smartviews-store';
import { getActiveTab } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';

const getConditionOperatorType = (
  fieldMetaData: IAugmentedMetaDataForTasks
): ConditionOperatorType => {
  let conditionOperatorType = ConditionOperatorType.PickList;
  if ([SCHEMA_NAMES.TASK_TYPE, SCHEMA_NAMES.TASK_STATUS].includes(fieldMetaData?.schemaName)) {
    conditionOperatorType = ConditionOperatorType.PickList;
  } else if (fieldMetaData.dataType === TaskAttributeDataType.MultiSelect) {
    conditionOperatorType = ConditionOperatorType.MultiSelect;
  } else if (fieldMetaData.renderType === TaskAttributeRenderType.SearchableDropDown) {
    conditionOperatorType = ConditionOperatorType.SearchablePickList;
  } else if (ownerSchemas[fieldMetaData?.schemaName]) {
    conditionOperatorType = ConditionOperatorType.User;
  }

  return conditionOperatorType;
};

const getFilterData = async (
  selectedOption: IOption[],
  schemaName: string,
  code: string
): Promise<IOnFilterChange> => {
  const { metadata } =
    (await fetchLeadAndTaskMetadata(
      code,
      CallerSource.SmartViews,
      getActiveTabId() ?? getActiveTab()
    )) || {};
  const isLeadField = schemaName?.startsWith(leadSchemaNamePrefix);
  const fieldMetaData = isLeadField
    ? metadata?.leadMetadata?.[schemaName]
    : metadata?.taskMetadata?.[schemaName];

  const augmentedValue = selectedOption.map((x) => x.value).join(OptionSeperator.MXSeparator);
  const conditionOperatorType = getConditionOperatorType(fieldMetaData);

  return {
    selectedValue: selectedOption,
    value: augmentedValue,
    entityType: isLeadField ? ConditionEntityType.Lead : ConditionEntityType.Task,
    filterOperator: ConditionOperator.EQUALS,
    filterOperatorType: conditionOperatorType
  };
};

export const getTaskTypeFilterValue = (selectedOption: IOption[]): IOnFilterChange => {
  const augmentedValue = selectedOption.map((x) => x.value).join(OptionSeperator.CommaSeparator);

  return {
    selectedValue: selectedOption,
    value: augmentedValue,
    entityType: ConditionEntityType.Task,
    filterOperator: ConditionOperator.EQUALS,
    filterOperatorType: ConditionOperatorType.MultiSelect
  };
};

export const generateTaskFilterValue = async ({
  schemaName,
  selectedOption,
  tabType,
  entityCode
}: IGetFilterValue): Promise<IOnFilterChange | null> => {
  try {
    if (!selectedOption) {
      return null;
    }

    if ('startDate' in selectedOption) {
      return await getDateFilterData(selectedOption, tabType, ConditionEntityType.Task);
    } else if (schemaName === SCHEMA_NAMES.TASK_TYPE) {
      return getTaskTypeFilterValue(selectedOption);
    } else {
      return await getFilterData(selectedOption, schemaName, entityCode || '');
    }
  } catch (error) {
    trackError(error);
    return null;
  }
};
