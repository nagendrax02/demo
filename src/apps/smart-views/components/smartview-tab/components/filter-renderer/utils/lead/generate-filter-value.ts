import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IOnFilterChange } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { OptionSeperator } from '../../constants';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  GROUPS,
  SCHEMA_NAMES,
  ownerSchemas
} from 'apps/smart-views/constants/constants';
import { fetchSmartViewLeadMetadata } from 'apps/smart-views/augment-tab-data/lead/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { DataType, RenderType } from 'common/types/entity/lead';
import { getDateFilterData } from '../common/generate-filter-value';
import { removeSchemaPrefix } from '../../../../utils';
import { IGetFilterValue, IHandleDateFilter } from '../../filter-renderer.types';
import { IDateOption } from 'common/component-lib/date-filter';
import { getActiveTabId } from 'apps/smart-views/smartviews-store';
import { getActiveTab } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';

const getFilterData = async (
  selectedOption: IOption[],
  schemaName: string
): Promise<IOnFilterChange> => {
  const { metaDataMap } = await fetchSmartViewLeadMetadata(
    CallerSource.SmartViews,
    getActiveTabId() ?? getActiveTab()
  );
  const fieldMetaData = { ...(metaDataMap[schemaName] || {}) };

  const selectedValue = selectedOption.map((x) => x.value).join(OptionSeperator.MXSeparator);
  let conditionOperatorType = ConditionOperatorType.PickList;
  if (fieldMetaData.dataType === DataType.MultiSelect) {
    conditionOperatorType = ConditionOperatorType.MultiSelect;
  } else if (fieldMetaData.renderType === RenderType.SearchableDropdown) {
    conditionOperatorType = ConditionOperatorType.SearchablePickList;
  } else if (ownerSchemas[schemaName]) {
    conditionOperatorType = ConditionOperatorType.User;
  }

  return {
    selectedValue: selectedOption,
    value: selectedValue,
    entityType: ConditionEntityType.Lead,
    filterOperator: ConditionOperator.EQUALS,
    filterOperatorType: conditionOperatorType
  };
};

const getSalesGroupFilterData = async (selectedOption: IOption[]): Promise<IOnFilterChange> => {
  const selectedValue = selectedOption.map((x) => x.value).join(OptionSeperator.CommaSeparator);

  return {
    selectedValue: selectedOption,
    value: selectedValue,
    entityType: ConditionEntityType.Lead,
    filterOperator: ConditionOperator.EQUALS,
    filterOperatorType: ConditionOperatorType.UserGroup
  };
};

const getAugmentedFilterOperator = (
  selectedOption: IDateOption,
  utcDateFormatEnabled: boolean | undefined,
  dateFilterData: IOnFilterChange
): ConditionOperator => {
  if (selectedOption?.startDate && utcDateFormatEnabled) {
    return ConditionOperator.BETWEEN;
  }
  return dateFilterData?.filterOperator;
};

const getAugmentedFilterValue = (
  selectedOption: IDateOption,
  utcDateFormatEnabled: boolean | undefined,
  dateFilterData: IOnFilterChange
): string => {
  if (selectedOption?.startDate && utcDateFormatEnabled) {
    return `${selectedOption?.startDate} TO ${selectedOption?.endDate}`;
  }
  return dateFilterData?.value;
};

const handleDateFilter = async (props: IHandleDateFilter): Promise<IOnFilterChange> => {
  const { selectedOption, replacedSchema, tabType, utcDateFormatEnabled } = props;
  const [{ metaDataMap }, dateFilterData] = await Promise.all([
    fetchSmartViewLeadMetadata(CallerSource.SmartViews, getActiveTabId() ?? getActiveTab()),
    getDateFilterData(selectedOption, tabType, ConditionEntityType.Lead)
  ]);

  const renderType = metaDataMap?.[replacedSchema]?.renderType;
  if (renderType === RenderType.Date) {
    dateFilterData.filterOperatorType = ConditionOperatorType.Date;
  }

  dateFilterData.filterOperator = getAugmentedFilterOperator(
    selectedOption,
    utcDateFormatEnabled,
    dateFilterData
  );

  dateFilterData.value = getAugmentedFilterValue(
    selectedOption,
    utcDateFormatEnabled,
    dateFilterData
  );

  return dateFilterData;
};

const generateFilterValue = async ({
  schemaName,
  selectedOption,
  tabType,
  utcDateFormatEnabled
}: IGetFilterValue): Promise<IOnFilterChange | null> => {
  try {
    if (!selectedOption) {
      return null;
    }
    const replacedSchema = removeSchemaPrefix(schemaName);

    if ('startDate' in selectedOption) {
      return await handleDateFilter({
        selectedOption,
        replacedSchema,
        tabType,
        utcDateFormatEnabled
      });
    } else if (replacedSchema === SCHEMA_NAMES.GROUP || replacedSchema === GROUPS) {
      return await getSalesGroupFilterData(selectedOption);
    } else {
      return await getFilterData(selectedOption, replacedSchema);
    }
  } catch (error) {
    trackError(error);
    return null;
  }
};

export default generateFilterValue;
