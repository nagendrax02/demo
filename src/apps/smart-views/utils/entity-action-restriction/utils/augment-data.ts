import { isSmartviewTab } from 'apps/smart-views/utils/utils';
import {
  IActionVisibility,
  IButtonActionDetails,
  IVisibilityConfig
} from '../entity-action-restriction.types';
import { EntityType } from 'common/types';
import {
  EntityTypeTabLinkingConfig,
  ManageTabsActionsConfig,
  SmartViewActionsConfig,
  SmartViewBaseKey
} from '../constants';

const getTabKey = (
  entityType: EntityType | undefined
): keyof IVisibilityConfig | keyof IVisibilityConfig[typeof SmartViewBaseKey] | null => {
  if (!entityType) return null;
  return EntityTypeTabLinkingConfig[entityType] ?? null;
};

const getActionKey = (
  entityType: EntityType | undefined,
  action: string,
  isSmartView: boolean
): string => {
  if (!entityType) return '';
  const actionMappings: Partial<Record<EntityType, Record<string, string>>> = isSmartView
    ? SmartViewActionsConfig
    : ManageTabsActionsConfig;

  const entityActionMapping = actionMappings[entityType];
  if (!entityActionMapping) return '';

  const actionKey = entityActionMapping[action];
  return typeof actionKey === 'string' ? actionKey : '';
};

const getTabConfig = (
  config: IVisibilityConfig,
  tabKey: keyof IVisibilityConfig | keyof IVisibilityConfig[typeof SmartViewBaseKey],
  tabId: string
): IActionVisibility[] | undefined => {
  const isSmartView = isSmartviewTab(tabId);
  if (isSmartView) {
    const smartViewConfig =
      config[SmartViewBaseKey]?.[tabKey as keyof IVisibilityConfig[typeof SmartViewBaseKey]];
    return Array.isArray(smartViewConfig) ? smartViewConfig : undefined;
  } else {
    const regularConfig = config[tabKey as keyof IVisibilityConfig];
    return Array.isArray(regularConfig) ? regularConfig : undefined;
  }
};

export const getVisibilityFromConfig = (
  visibilityConfig: IVisibilityConfig | undefined,
  buttonActionDetails: IButtonActionDetails
): boolean => {
  if (!visibilityConfig) return true;
  const { tabId, entityType, action } = buttonActionDetails;

  const isSmartView = isSmartviewTab(tabId);

  const tabKey = getTabKey(entityType);
  if (!tabKey) return true;

  const tabConfig = getTabConfig(visibilityConfig, tabKey, tabId);
  if (!tabConfig) return true;

  const actionKey = getActionKey(entityType, action, isSmartView);
  if (!actionKey) return true;

  const visibilityInfo = tabConfig.find((item: IActionVisibility) => item.Name === actionKey);

  return visibilityInfo?.IsVisible ?? false;
};
