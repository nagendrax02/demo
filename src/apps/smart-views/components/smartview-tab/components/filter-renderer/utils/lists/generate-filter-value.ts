import { IOnFilterChange } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { IGetFilterValue } from '../../filter-renderer.types';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType
} from 'apps/smart-views/constants/constants';
import { OptionSeperator } from '../../constants';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';

const generateFilterValue = async ({
  selectedOption
}: IGetFilterValue): Promise<IOnFilterChange | null> => {
  if (!selectedOption) {
    return null;
  }
  const selectedValue = (selectedOption as IOption[])
    ?.map((x) => x.value)
    ?.join(OptionSeperator.MXSeparator);
  return {
    selectedValue: selectedOption,
    value: selectedValue,
    entityType: ConditionEntityType.Lists,
    filterOperator: ConditionOperator.EQUALS,
    filterOperatorType: ConditionOperatorType.SearchablePickList
  };
};

export default generateFilterValue;
