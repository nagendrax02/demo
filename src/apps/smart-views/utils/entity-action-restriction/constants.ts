import { EntityType } from 'common/types';
import { ITabVisibility } from './entity-action-restriction.types';

export enum EntityActions {
  QuickAdd = 'QUICK_ADD',
  AddNew = 'ADD_NEW',
  AddNewLead = 'ADD_NEW_LEAD'
}

export const ManageTabsActionsConfig = {
  [EntityType.Lead]: {
    [EntityActions.QuickAdd]: 'QuickAddLead',
    [EntityActions.AddNew]: 'AddNewLead'
  },
  [EntityType.Activity]: {
    [EntityActions.AddNew]: 'AddActivity',
    [EntityActions.AddNewLead]: 'AddNewLead'
  },
  [EntityType.Opportunity]: {
    [EntityActions.AddNew]: 'AddOpportunity',
    [EntityActions.AddNewLead]: 'AddNewLead'
  }
};

export const SmartViewActionsConfig = {
  [EntityType.Lead]: {
    [EntityActions.QuickAdd]: 'SVQuickAddLead',
    [EntityActions.AddNew]: 'SVAddNewLead'
  },
  [EntityType.Activity]: {
    [EntityActions.AddNew]: 'SVActAddActivity'
  },
  [EntityType.Opportunity]: {
    [EntityActions.AddNew]: 'SVOppAddOpportunity',
    [EntityActions.AddNewLead]: 'SVOppAddNewLead'
  }
};

export const SmartViewBaseKey = 'ManageSmartViews';

export const EntityTypeTabLinkingConfig: Partial<Record<EntityType, keyof ITabVisibility>> = {
  [EntityType.Lead]: 'ManageLeads',
  [EntityType.Activity]: 'ManageActivities',
  [EntityType.Opportunity]: 'ManageOpportunities'
};
