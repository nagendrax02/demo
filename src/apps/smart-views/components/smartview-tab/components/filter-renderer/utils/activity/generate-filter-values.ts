import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IOnFilterChange } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { OptionSeperator } from '../../constants';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType
} from 'apps/smart-views/constants/constants';
import { DataType } from 'common/types/entity/lead';
import { fetchActivityAndLeadMetaData } from 'apps/smart-views/augment-tab-data/activity/meta-data/combined';
import {
  ActivityStatus,
  OWNER_DROPDOWN_SCHEMA
} from 'apps/smart-views/augment-tab-data/activity/constants';
import { getDateFilterData } from '../common/generate-filter-value';
import { IGetFilterValue } from '../../filter-renderer.types';
import { getActiveTabId } from 'apps/smart-views/smartviews-store';
import { getActiveTab } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';

// eslint-disable-next-line complexity
const getFilterData = async (
  selectedOption: IOption[],
  schemaName: string,
  entityCode?: string
): Promise<IOnFilterChange> => {
  const { metaDataMap } = await fetchActivityAndLeadMetaData(
    entityCode ?? '',
    getActiveTabId() ?? getActiveTab()
  );
  const fieldMetaData = { ...(metaDataMap[schemaName] || {}) };

  const selectedValue = selectedOption?.map?.((x) => x?.value)?.join(OptionSeperator.MXSeparator);
  let conditionOperatorType = ConditionOperatorType.PickList;

  if (schemaName === ActivityStatus) {
    conditionOperatorType = ConditionOperatorType.SearchablePickList;
  } else if (fieldMetaData?.dataType == DataType.Product) {
    conditionOperatorType = ConditionOperatorType.Product;
  } else if (fieldMetaData.dataType === DataType.SearchableDropdown) {
    if (fieldMetaData?.IsMultiSelectDropdown) {
      conditionOperatorType = ConditionOperatorType.MultiSelect;
    } else {
      conditionOperatorType = ConditionOperatorType.SearchablePickList;
    }
  } else if (fieldMetaData.dataType === DataType.MultiSelect) {
    conditionOperatorType = ConditionOperatorType.MultiSelect;
  } else if (OWNER_DROPDOWN_SCHEMA[schemaName] || fieldMetaData?.dataType == DataType.ActiveUsers) {
    conditionOperatorType = ConditionOperatorType.User;
  }
  return {
    selectedValue: selectedOption,
    value: selectedValue,
    entityType: ConditionEntityType.Activity,
    filterOperator: ConditionOperator.EQUALS,
    filterOperatorType: conditionOperatorType
  };
};

const generateActivityFilterValue = async ({
  entityCode,
  schemaName,
  selectedOption,
  tabType
}: IGetFilterValue): Promise<IOnFilterChange | null> => {
  try {
    if (!selectedOption) {
      return null;
    }
    if ('startDate' in selectedOption) {
      return await getDateFilterData(selectedOption, tabType, ConditionEntityType.Activity);
    } else {
      return await getFilterData(selectedOption, schemaName, entityCode);
    }
  } catch (error) {
    trackError(error);
    return null;
  }
};

export default generateActivityFilterValue;
