import { ACTION } from 'apps/entity-details/constants';
import { TabType } from 'apps/smart-views/constants/constants';

export const FORM_ACTION = {
  [ACTION.AddActivity]: ACTION.Activity,
  [ACTION.AddOpportunity]: ACTION.Opportunity
};

export const AssociatedEntity: Record<string, number> = {
  [TabType.Lead]: 0,
  [TabType.Opportunity]: 1
};
