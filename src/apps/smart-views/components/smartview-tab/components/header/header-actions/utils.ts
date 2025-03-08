import { IProcessFormsData, IWorkAreaConfig } from 'common/utils/process/process.types';
import { getProcessActionConfig } from 'apps/smart-views/utils/sv-process';
import { TABS_DEFAULT_ID } from 'apps/smart-views/constants/constants';
import {
  IHeaderAction,
  ISecondaryHeader,
  TabView
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { TaskActionIds } from 'apps/smart-views/augment-tab-data/task/constants';
import { getTabData, refreshGrid, skipAutoRefresh } from '../../../smartview-tab.store';
import { updateSmartViewsTab } from 'apps/smart-views/smartviews-store';
import { isFeatureRestricted } from 'common/utils/feature-restriction/utils/augment-data';
import { FeatureRestrictionModuleTypes } from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { sleep } from 'common/utils/helpers';

export const getConvertedAction = (
  action: IHeaderAction,
  processFormsData: IProcessFormsData | null,
  isLoading: boolean
): IHeaderAction => {
  const clonedAction = { ...action };
  if (clonedAction.workAreaConfig) {
    const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
      clonedAction,
      processFormsData
    );
    const hasSingleForm = totalForms === 1;
    return {
      ...convertedAction,
      subMenu: hasSingleForm ? [] : convertedAction?.subMenu,
      isLoading: isLoading,
      title: totalForms === 1 ? (firstFormName as string) : action?.title
    };
  }
  if (clonedAction.subMenu) {
    clonedAction.subMenu = clonedAction.subMenu.map((subMenuAction) => {
      if (subMenuAction.workAreaConfig) {
        const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
          subMenuAction,
          processFormsData
        );
        const hasSingleForm = totalForms === 1;
        return {
          ...convertedAction,
          subMenu: hasSingleForm ? [] : convertedAction?.subMenu,
          isLoading: isLoading,
          id: subMenuAction?.value,
          label: totalForms === 1 ? (firstFormName as string) : subMenuAction?.label
        };
      }
      return subMenuAction;
    });
  }
  return clonedAction;
};

export const getFilteredProcessActions = (
  actionConfiguration: IHeaderAction[]
): IWorkAreaConfig[] => {
  const filteredActions: IWorkAreaConfig[] = [];

  actionConfiguration.forEach((action) => {
    if (action.workAreaConfig) {
      filteredActions.push(action.workAreaConfig);
      if (action.workAreaConfig.fallbackAdditionalData)
        filteredActions.push({
          ...action.workAreaConfig,
          additionalData: TABS_DEFAULT_ID
        });
    }
    if (action.subMenu) {
      action.subMenu.forEach((subMenuAction) => {
        if (subMenuAction.workAreaConfig) {
          filteredActions.push(subMenuAction.workAreaConfig);
          if (subMenuAction.workAreaConfig.fallbackAdditionalData)
            filteredActions.push({
              ...subMenuAction.workAreaConfig,
              additionalData: TABS_DEFAULT_ID
            });
        }
      });
    }
  });

  return filteredActions;
};

export const getTabView = (actionId: string): TabView => {
  return actionId === TaskActionIds.CALENDAR_VIEW ? TabView.CalendarView : TabView.List;
};

export const handleToggleAction = (tabId: string, actionId: string): void => {
  const tabData = { ...getTabData(tabId) };
  const latestTabView = getTabView(actionId);
  if (latestTabView !== tabData.tabView) {
    tabData?.headerConfig?.secondary?.onToggleActionChange?.(actionId);
    tabData.tabView = latestTabView;
    updateSmartViewsTab(tabId, tabData, true);
  }
};

export const getEntityCode = (entityCode: string): string => {
  if (entityCode.trim().split(',').length > 1) return '';
  return !['-1', '0', '1'].includes(entityCode) ? entityCode : '';
};

export const getUpdatedActionConfiguration = async (
  actionConfiguration: IHeaderAction[],
  secondaryHeaderConfig: ISecondaryHeader
): Promise<IHeaderAction[]> => {
  const restrictionMap = {};
  const { featureRestrictionConfigMap: featureRestrictionMap, featureRestrictionModuleName } =
    secondaryHeaderConfig || {};

  if (!featureRestrictionMap) return actionConfiguration;

  await Promise.all(
    Object.keys(featureRestrictionMap).map(async (actionName) => {
      restrictionMap[actionName] = await isFeatureRestricted({
        actionName: featureRestrictionMap[actionName],
        moduleName: featureRestrictionModuleName ?? FeatureRestrictionModuleTypes.SmartViews,
        callerSource: CallerSource?.SmartViews
      });
    })
  );

  const updatedMenus: IHeaderAction[] = [];
  let updatedActionConfig = actionConfiguration.filter((action) => {
    if (action?.subMenu && action.subMenu.length > 0) {
      const updatedSubMenu = action.subMenu.filter((subMenu) => {
        return !restrictionMap[subMenu.value];
      });

      if (!updatedSubMenu || updatedSubMenu.length == 0) return false;

      const newAction = { ...action };
      newAction.subMenu = updatedSubMenu;
      updatedMenus.push(newAction);

      return false;
    } else return !restrictionMap[action.id];
  });

  if (updatedMenus && updatedMenus.length > 0)
    updatedActionConfig = [...updatedActionConfig, ...updatedMenus];

  return updatedActionConfig;
};
export const updateGridInEss = async (sleepTime?: number): Promise<void> => {
  const isEssTenantEnabled =
    ((getItem(StorageKey.Setting) as Record<string, string | object>) || {})
      ?.EnableESSForLeadManagement === '1';

  if (isEssTenantEnabled) {
    skipAutoRefresh(false);
    await sleep(sleepTime || 1000);
  }
  refreshGrid();
};
