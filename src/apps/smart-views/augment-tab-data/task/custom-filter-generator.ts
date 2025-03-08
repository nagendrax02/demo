import { IGroupCondition } from '../../components/smartview-tab/smartview-tab.types';
import { GROUPS } from '../../constants/constants';

export const taskCustomFilterGenerator = ({
  schemaName,
  defaultValue
}: {
  schemaName: string;
  defaultValue: IGroupCondition;
}): IGroupCondition[] => {
  const conditions: IGroupCondition[] = [];

  if (schemaName === GROUPS) {
    return [];
  } else {
    conditions.push(defaultValue);
  }

  return conditions;
};
