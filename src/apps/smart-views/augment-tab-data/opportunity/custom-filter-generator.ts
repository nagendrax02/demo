import { OptionSeperator } from '../../components/smartview-tab/components/filter-renderer/constants';
import { IFilterData, IGroupCondition } from '../../components/smartview-tab/smartview-tab.types';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  ConditionType,
  GROUPS
} from '../../constants/constants';
import { IsMarvinRequest } from '../../utils/utils';

const getProductCondition = ({
  schemaName,
  entityCode,
  filterData
}: {
  schemaName: string;
  filterData: IFilterData;
  entityCode: string;
}): IGroupCondition => {
  return {
    Type:
      filterData?.entityType === ConditionEntityType.Opportunity
        ? ConditionEntityType.Activity
        : filterData?.entityType,
    ConOp: ConditionType.AND,
    RowCondition: [
      {
        ['RSO_IsMailMerged']: false,
        LSO: 'ActivityEvent',
        ['LSO_Type']: ConditionOperatorType.PAEvent,
        Operator: ConditionOperator.EQUALS,
        RSO: entityCode,
        SubConOp: ConditionType.AND,
        IsMarvinRequest: IsMarvinRequest(ConditionOperator.EQUALS, ConditionOperatorType.PAEvent)
      },
      {
        ['RSO_IsMailMerged']: false,
        RSO: filterData.value?.replaceAll(OptionSeperator.MXSeparator, ','),
        Operator: filterData.filterOperator,
        ['LSO_Type']: filterData.filterOperatorType,
        LSO: schemaName,
        SubConOp: ConditionType.AND,
        IsMarvinRequest: IsMarvinRequest(filterData.filterOperator, filterData.filterOperatorType)
      }
    ]
  };
};

export const opportunityCustomFilterGenerator = ({
  entityCode,
  filterData,
  schemaName,
  defaultValue
}: {
  entityCode: string;
  filterData: IFilterData;
  schemaName: string;
  defaultValue: IGroupCondition;
}): IGroupCondition[] => {
  const conditions: IGroupCondition[] = [];
  if (filterData?.filterOperatorType === ConditionOperatorType.Product) {
    conditions?.push(
      getProductCondition({
        schemaName,
        filterData,
        entityCode
      })
    );
  } else if (schemaName !== GROUPS) {
    conditions.push(defaultValue);
  }

  return conditions;
};
