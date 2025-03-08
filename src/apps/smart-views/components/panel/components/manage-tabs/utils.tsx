import { ISortableItem } from 'common/component-lib/sortable-list';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import Title from './components/Title';
import { setDefaultTabId } from './manage-tabs.store';
import { httpPut } from 'common/utils/rest-client/rest-client';
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module } from 'common/utils/rest-client';
import { IManageTabsRef } from './manage-tabs.types';

export const generateSortableList = (
  allTabs: string[],
  rawTabData: Record<string, ITabResponse>,
  manageTabsRef: React.MutableRefObject<IManageTabsRef>
): ISortableItem<ITabResponse>[] => {
  return allTabs?.map((tabId) => {
    const currentTabData = rawTabData[tabId];
    const isRemovable = !currentTabData?.IsSystemTab && !currentTabData?.SharedBy;
    const isDefault = currentTabData?.TabConfiguration?.IsDefault;

    if (isDefault) {
      setDefaultTabId(tabId);
      manageTabsRef.current.currentDefaultTabId = tabId;
    }
    return {
      id: tabId,
      label: <Title tabData={currentTabData} />,
      isRemovable: isRemovable,
      config: currentTabData
    };
  });
};

export const getUpdatedDefaultTab = (
  currentDefaultTabId: string,
  deleteTabIds: string[],
  allTabIds: string[]
): string => {
  let updatedDefaultTabId = currentDefaultTabId;
  const index = deleteTabIds?.findIndex((tabId) => tabId === currentDefaultTabId);
  if (index !== -1) {
    const remainingTabs = allTabIds?.filter((tabId) => !deleteTabIds.includes(tabId)) || [];
    updatedDefaultTabId = remainingTabs[0] || currentDefaultTabId;
  }
  return updatedDefaultTabId;
};

export const saveDefaultTab = async (tabId: string): Promise<void> => {
  const url = `${API_ROUTES.smartviews.tabDefault}/${tabId}`;
  await httpPut({
    path: url,
    module: Module.SmartViews,
    body: {
      Id: tabId
    },
    callerSource: CallerSource.SmartViews
  });
};

export const saveDeletedTabs = async (deletedTabs: string[]): Promise<void> => {
  const url = `${API_ROUTES.smartviews.tabDelete}`;
  await httpPut({
    path: url,
    module: Module.SmartViews,
    body: {
      TabIds: deletedTabs
    },
    callerSource: CallerSource.SmartViews
  });
};

export const saveTabOrder = async (tabIds: string[]): Promise<void> => {
  const url = `${API_ROUTES.smartviews.tabOrder}`;
  await httpPut({
    path: url,
    module: Module.SmartViews,
    body: {
      Ids: tabIds
    },
    callerSource: CallerSource.SmartViews
  });
};
