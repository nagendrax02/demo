import { trackError } from 'common/utils/experience/utils/track-error';
import { ITabConfiguration } from 'common/types/entity/lead';
import { IHandleManageTabs } from '../../../../types/entitytabs.types';
import { InputId } from '../add-new-tab.types';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';
import { CallerSource } from 'common/utils/rest-client';

interface INewTab {
  isDefault: boolean;
  tabName: string;
  activities: string[];
}

export const getNewTab = (
  newTab: { isDefault: boolean; tabName: string; activities: string },
  sequence = 0
): ITabConfiguration | null => {
  if (!(typeof crypto?.randomUUID === 'function')) {
    return null;
  }

  const id = crypto?.randomUUID();

  return {
    Id: id,
    RestrictedRoles: null,
    Type: 2,
    IsEnabled: false,
    ShowInWeb: true,
    ShowInMobile: false,
    EntityType: null,
    TabConfiguration: {
      Location: null,
      Position: 0,
      Sequence: sequence + 1,
      ShowInForm: true,
      TabPosition: 0,
      Title: newTab.tabName,
      IsDefault: newTab.isDefault
    },
    TabContentConfiguration: {
      Activities: newTab.activities,
      From: 'mindate',
      To: 'maxdate',
      OptFilter: 'opt-all-time',
      CanEdit: true,
      CanDelete: true,
      CanClone: true,
      Title: newTab.tabName,
      URL: null,
      Width: null,
      OnClick: `LoadActivityHistory(${id})`
    }
  };
};

const createNewTab = (
  newTab: INewTab,
  tabConfig: ITabConfiguration[]
): ITabConfiguration | null => {
  const sequence = tabConfig?.[tabConfig?.length - 1]?.TabConfiguration?.Sequence;
  return getNewTab(
    {
      isDefault: newTab.isDefault,
      activities: newTab?.activities?.join(','),
      tabName: newTab.tabName
    },
    sequence
  );
};

const handleFocus = (id: InputId, setError: (data: InputId) => void): void => {
  const inputElement = document.getElementById(id) as HTMLInputElement;
  inputElement?.focus();
  setError(id);
};

const validateInput = (
  tabName: string,
  events: string[],
  setError: (data: InputId) => void
): boolean => {
  if (!tabName?.trim()) {
    handleFocus(InputId.Input, setError);
    return false;
  }
  if (!events?.length) {
    handleFocus(InputId.Dropdown, setError);
    return false;
  }
  return true;
};

const handleTabAddition = async ({
  tabConfig,
  handleManageTab,
  closeModal,
  setError,
  setIsLoading,
  showAlert,
  newTab
}: {
  newTab: INewTab;
  tabConfig: ITabConfiguration[];
  handleManageTab: IHandleManageTabs;
  closeModal: () => void;
  setError: (data: InputId) => void;
  setIsLoading: (data: boolean) => void;
  showAlert: (notification: INotification) => void;
}): Promise<void> => {
  try {
    if (!validateInput(newTab.tabName, newTab.activities, setError)) return;

    setIsLoading(true);

    const newTabConfig = createNewTab(newTab, tabConfig);

    if (!newTabConfig) return;

    await handleManageTab({
      tabConfiguration: [...tabConfig, newTabConfig],
      activeTabId: newTabConfig?.Id,
      defaultTabId: newTab?.isDefault ? newTabConfig?.Id : undefined,
      callerSource: CallerSource.LeadDetailsAddNewTab
    });

    closeModal();
  } catch (error) {
    showAlert({
      type: Type.ERROR,
      message: 'Failed to add tab, please contact the administrator'
    });

    trackError(error);
  }
  setIsLoading(false);
};

export { handleTabAddition };
