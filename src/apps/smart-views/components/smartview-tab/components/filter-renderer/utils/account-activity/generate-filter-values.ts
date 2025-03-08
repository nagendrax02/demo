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
import { getDateFilterData } from '../common/generate-filter-value';
import { IGetFilterValue } from '../../filter-renderer.types';
import { fetchActivityMetadata } from 'apps/smart-views/augment-tab-data/account-activity/meta-data/account-activity';

const getFilterData = async ({
  selectedOption,
  entityCode,
  schemaName
}: {
  selectedOption: IOption[];
  schemaName: string;
  entityCode: string;
}): Promise<IOnFilterChange> => {
  const { metaDataMap } = await fetchActivityMetadata(entityCode);
  const fieldMetaData = { ...metaDataMap[schemaName] };

  const selectedValue = selectedOption?.map?.((x) => x?.value)?.join(OptionSeperator.MXSeparator);
  let conditionOperatorType = ConditionOperatorType.PickList;

  if (fieldMetaData.dataType === DataType.SearchableDropdown) {
    conditionOperatorType = ConditionOperatorType.SearchablePickList;
  } else if (fieldMetaData.dataType === DataType.MultiSelect) {
    conditionOperatorType = ConditionOperatorType.MultiSelect;
  } else if (fieldMetaData?.dataType == DataType.ActiveUsers) {
    conditionOperatorType = ConditionOperatorType.User;
  }

  return {
    selectedValue: selectedOption,
    value: selectedValue,
    entityType: ConditionEntityType.CompanyActivity,
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
      return await getDateFilterData(selectedOption, tabType, ConditionEntityType.CompanyActivity);
    } else {
      return await getFilterData({
        selectedOption,
        schemaName,
        entityCode: entityCode ?? ''
      });
    }
  } catch (error) {
    trackError(error);
    return null;
  }
};

export default generateActivityFilterValue;
