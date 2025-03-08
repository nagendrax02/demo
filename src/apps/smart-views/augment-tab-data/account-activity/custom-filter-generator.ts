import { IGroupCondition } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { ConditionEntityType } from '../../constants/constants';

export const AccountActivityCustomFilterGenerator = (
  defaultValue: IGroupCondition
): IGroupCondition[] => {
  const conditions: IGroupCondition[] = [];
  defaultValue.Type =
    defaultValue.Type === ConditionEntityType.Account
      ? ConditionEntityType.Company
      : defaultValue.Type;
  conditions.push(defaultValue);
  return conditions;
};
