import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IOnFilterChange } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { OptionSeperator } from '../../constants';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  ownerSchemas
} from 'apps/smart-views/constants/constants';
import { DataType, RenderType } from 'common/types/entity/lead';
import { getDateFilterData } from '../common/generate-filter-value';
import { IGetFilterValue } from '../../filter-renderer.types';
import { fetchOppAndLeadMetaData } from 'apps/smart-views/augment-tab-data/opportunity/meta-data/combined';
import { getActiveTab } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { getActiveTabId } from 'apps/smart-views/smartviews-store';

/* Note: entityType that needs to be sent to api for opportunity tab is ConditionEntityType.Activity */

const getFilterData = async (
  selectedOption: IOption[],
  schemaName: string,
  entityCode: string
): Promise<IOnFilterChange> => {
  const { metaDataMap } = await fetchOppAndLeadMetaData(
    entityCode,
    getActiveTabId() ?? getActiveTab()
  );
  const fieldMetaData = { ...metaDataMap[schemaName] };

  const selectedValue = selectedOption.map((x) => x.value).join(OptionSeperator.MXSeparator);
  let conditionOperatorType = ConditionOperatorType.PickList;
  if (fieldMetaData?.dataType == DataType.Product) {
    conditionOperatorType = ConditionOperatorType.Product;
  } else if (fieldMetaData.renderType === RenderType.SearchableDropdown) {
    conditionOperatorType = ConditionOperatorType.SearchablePickList;
    if (fieldMetaData.IsMultiSelectDropdown) {
      conditionOperatorType = ConditionOperatorType.MultiSelect;
    }
  } else if (ownerSchemas[schemaName] || fieldMetaData?.dataType == DataType.ActiveUsers) {
    conditionOperatorType = ConditionOperatorType.User;
  }

  return {
    selectedValue: selectedOption,
    value: selectedValue,
    entityType: ConditionEntityType.Opportunity,
    filterOperator: ConditionOperator.EQUALS,
    filterOperatorType: conditionOperatorType
  };
};

const generateOpportunityFilterValue = async ({
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
      return await getDateFilterData(selectedOption, tabType, ConditionEntityType.Opportunity);
    } else {
      return await getFilterData(selectedOption, schemaName, entityCode || '');
    }
  } catch (error) {
    trackError(error);
    return null;
  }
};

export default generateOpportunityFilterValue;
