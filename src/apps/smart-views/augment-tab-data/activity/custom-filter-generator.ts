import { OptionSeperator } from '../../components/smartview-tab/components/filter-renderer/constants';
import { IFilterData, IGroupCondition } from '../../components/smartview-tab/smartview-tab.types';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  ConditionType,
  GROUPS,
  leadSchemaNameMxPrefix
} from '../../constants/constants';
import { IsMarvinRequest } from '../../utils/utils';

const getProductSchemaName = (filterConfig: IFilterData, productSchema: string): string => {
  return filterConfig.entityType === ConditionEntityType.Activity &&
    productSchema.startsWith(leadSchemaNameMxPrefix)
    ? productSchema
    : '';
};

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
    Type: filterData.entityType,
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

export const addSalesActivityCondition = (): IGroupCondition => {
  return {
    Type: ConditionEntityType.Activity,
    ConOp: ConditionType.AND,
    RowCondition: [
      {
        ['RSO_IsMailMerged']: false,
        RSO: '0',
        Operator: ConditionOperator.EQUALS,
        ['LSO_Type']: ConditionOperatorType.PAEvent,
        LSO: 'StatusReason',
        SubConOp: ConditionType.AND
      }
    ]
  };
};

export const activityCustomFilterGenerator = ({
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
        schemaName: getProductSchemaName(filterData, schemaName),
        filterData,
        entityCode
      })
    );
  } else if (schemaName !== GROUPS) {
    conditions.push(defaultValue);
  }

  return conditions;
};
