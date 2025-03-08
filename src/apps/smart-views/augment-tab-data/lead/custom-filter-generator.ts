import { IFilterData, IGroupCondition } from '../../components/smartview-tab/smartview-tab.types';
import { ConditionEntityType, ConditionType, SCHEMA_NAMES } from '../../constants/constants';
import { IsMarvinRequest } from '../../utils/utils';

const geCompanyTypeSchemaName = (schemaName: string): string => {
  return schemaName === SCHEMA_NAMES.COMPANY_TYPE_NAME ? SCHEMA_NAMES.COMPANY_TYPE : schemaName;
};

const getCompanyTypeCondition = ({
  schemaName,
  filterData
}: {
  schemaName: string;
  filterData: IFilterData;
}): IGroupCondition => {
  return {
    Type: ConditionEntityType.Lead,
    ConOp: ConditionType.AND,
    RowCondition: [
      {
        ['RSO_IsMailMerged']: false,
        RSO: filterData?.value,
        Operator: filterData.filterOperator,
        ['LSO_Type']: filterData.filterOperatorType,
        LSO: schemaName,
        SubConOp: ConditionType.AND,
        IsMarvinRequest: IsMarvinRequest(filterData.filterOperator, filterData.filterOperatorType)
      }
    ]
  };
};

export const leadCustomFilterGenerator = ({
  filterData,
  schemaName,
  defaultValue
}: {
  filterData: IFilterData;
  schemaName: string;
  defaultValue: IGroupCondition;
}): IGroupCondition[] => {
  const conditions: IGroupCondition[] = [];
  if (
    schemaName === SCHEMA_NAMES.COMPANY_TYPE_NAME ||
    schemaName === SCHEMA_NAMES.RELATED_COMPANY_ID
  ) {
    conditions?.push(
      getCompanyTypeCondition({
        schemaName: geCompanyTypeSchemaName(schemaName),
        filterData
      })
    );
  } else {
    conditions.push(defaultValue);
  }

  return conditions;
};
