import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  TabType
} from 'apps/smart-views/constants/constants';
import { IDateOption } from 'common/component-lib/date-filter';
import { IOnFilterChange } from '../../../../smartview-tab.types';
import { DATE_FILTER, OptionSeperator } from '../../constants';
import { getWithZValue } from 'common/utils/helpers/helpers';

export const getDateFilterData = async (
  selectedOption: IDateOption,
  type: TabType,
  entityType: ConditionEntityType
): Promise<IOnFilterChange> => {
  const module = await import('@lsq/nextgen-preact/date/utils');
  let selectedValue = '';
  let filterOperator = ConditionOperator.BETWEEN;

  // when date value is custom
  if (selectedOption?.value === DATE_FILTER.CUSTOM) {
    const isLeadOrAccountTabType = type === TabType.Lead || type === TabType.Account;
    const format = isLeadOrAccountTabType ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm:ss a';
    const startDate = module.format({
      originalDate: getWithZValue(selectedOption.startDate),
      pattern: format
    });
    const endDate = module.format({
      originalDate: getWithZValue(selectedOption.endDate),
      pattern: format
    });
    selectedValue = `${startDate}${OptionSeperator.DateSeparator}${endDate}`;
  } else {
    const value = selectedOption?.value || '';
    const updatedValue = value
      .replaceAll('_', '-')
      .replace(DATE_FILTER[30], DATE_FILTER.THIRTY)
      .replace(DATE_FILTER[7], DATE_FILTER.SEVEN);
    selectedValue = `opt-${updatedValue}`;
    filterOperator = ConditionOperator.EQUALS;
  }

  return {
    selectedValue: selectedOption,
    value: selectedValue,
    entityType: entityType,
    filterOperator: filterOperator,
    filterOperatorType: ConditionOperatorType.DateTime
  };
};
