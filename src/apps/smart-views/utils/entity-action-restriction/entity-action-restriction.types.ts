import { EntityType } from 'common/types';
import { EntityActions } from './constants';
export interface IActionVisibility {
  Name: string;
  IsVisible: boolean;
}

export interface ITabVisibility {
  ManageLeads: IActionVisibility[];
  ManageActivities: IActionVisibility[];
  ManageOpportunities: IActionVisibility[];
}

export interface IVisibilityConfig {
  ManageLeads: IActionVisibility[];
  ManageActivities: IActionVisibility[];
  ManageOpportunities: IActionVisibility[];
  ManageSmartViews: ITabVisibility;
}

export interface IButtonActionDetails {
  tabId: string;
  entityType: EntityType | undefined;
  action: EntityActions;
}

export interface IActionPanelButtonsConfigurationSettingResponse {
  ActionPanelButtonsConfiguration: string;
}
