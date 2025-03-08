import { trackError } from 'common/utils/experience/utils/track-error';
import {
  ACCOUNT_SCHEMA_PREFIX,
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  ownerSchemas,
  SCHEMA_NAMES
} from 'apps/smart-views/constants/constants';
import { IOnFilterChange } from '../../../../smartview-tab.types';
import { IGetFilterValue } from '../../filter-renderer.types';
import { getDateFilterData } from '../common/generate-filter-value';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { fetchAccountMetaData } from 'common/utils/entity-data-manager/account/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { OptionSeperator } from '../../constants';
import { DataType, RenderType } from 'common/types/entity/lead';
import { removeSchemaPrefix } from 'apps/smart-views/components/smartview-tab/utils';

const getFilterData = async (
  selectedOption: IOption[],
  schemaName: string,
  accountType: string
): Promise<IOnFilterChange> => {
  const { metaData } = await fetchAccountMetaData(accountType, CallerSource.SmartViews);
  const fieldMetaData = { ...(metaData[schemaName] || {}) };
  const selectedValue = selectedOption?.map?.((x) => x?.value)?.join(OptionSeperator.MXSeparator);
  let conditionOperatorType = ConditionOperatorType.PickList;
  if (
    fieldMetaData.DataType === DataType.MultiSelect ||
    schemaName === SCHEMA_NAMES.RELATED_COMPANY_ID
  ) {
    conditionOperatorType = ConditionOperatorType.MultiSelect;
  } else if (fieldMetaData.RenderType === RenderType.SearchableDropdown) {
    conditionOperatorType = ConditionOperatorType.SearchablePickList;
  } else if (schemaName === SCHEMA_NAMES.COMPANY_TYPE_NAME) {
    conditionOperatorType = ConditionOperatorType.String;
  } else if (ownerSchemas[schemaName]) {
    conditionOperatorType = ConditionOperatorType.User;
  }

  return {
    selectedValue: selectedOption,
    value: selectedValue,
    entityType: ConditionEntityType.Account,
    filterOperator: ConditionOperator.EQUALS,
    filterOperatorType: conditionOperatorType
  };
};

export const generateAccountFilterValue = async ({
  schemaName,
  selectedOption,
  tabType,
  entityCode = '' // entityCode === accountType in this context
}: IGetFilterValue): Promise<IOnFilterChange | null> => {
  try {
    const schema = removeSchemaPrefix(schemaName, ACCOUNT_SCHEMA_PREFIX);

    if (!selectedOption) {
      return null;
    }

    if ('startDate' in selectedOption) {
      return await getDateFilterData(selectedOption, tabType, ConditionEntityType.Account);
    } else {
      return await getFilterData(selectedOption, schema, entityCode);
    }
  } catch (error) {
    trackError(error);
    return null;
  }
};
