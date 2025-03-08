import { trackError } from 'common/utils/experience/utils/track-error';
import { IHandleManageTabs } from 'common/component-lib/entity-tabs/types/entitytabs.types';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ISortableItem } from 'common/component-lib/sortable-list';
import { ITabConfiguration } from 'common/types/entity/lead';
import { CallerSource } from 'common/utils/rest-client';

const getTabs = (
  tabConfig: ISortableItem<ITabConfiguration>[],
  defaultTabId: string
): ITabConfiguration[] => {
  return tabConfig?.map((tab, index) => {
    const config = tab?.config;
    return {
      ...config,
      TabConfiguration: {
        ...config?.TabConfiguration,
        Sequence: index + 1,
        IsDefault: defaultTabId === config?.Id
      }
    };
  }) as ITabConfiguration[];
};

export const handleSave = async ({
  setIsLoading,
  sortedTabConfig,
  handleManageTab,
  showAlert,
  closeModal,
  defaultTabId
}: {
  setIsLoading: (data: boolean) => void;
  sortedTabConfig: ISortableItem<ITabConfiguration>[];
  handleManageTab: IHandleManageTabs;
  showAlert: (notification: INotification) => void;
  closeModal: () => void;
  defaultTabId: string;
}): Promise<void> => {
  try {
    setIsLoading(true);

    await handleManageTab({
      tabConfiguration: getTabs(sortedTabConfig, defaultTabId),
      activeTabId: defaultTabId,
      defaultTabId,
      callerSource: CallerSource.LeadDetailsManageTabs
    });
    showAlert({
      type: Type.SUCCESS,
      message: 'Tabs updated successfully'
    });
    closeModal();
  } catch (error) {
    trackError(error);
    showAlert({
      type: Type.ERROR,
      message: (error?.response?.ExceptionMessage ||
        'Failed to update tabs, please contact the administrator') as string
    });
  }
  setIsLoading(false);
};
