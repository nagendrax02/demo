import { create } from 'zustand';
import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { IActionSummary } from './manage-lists.types';

export interface IManageListStore {
  showScheduleEmail: boolean;
  showRefreshPanelForRefreshList: boolean;
  record: IRecordType;
  actionSummary: IActionSummary;
  resetManageListStore: () => void;
}

const initialState = {
  showScheduleEmail: false,
  showRefreshPanelForRefreshList: false,
  actionSummary: {
    isFailure: false,
    successCount: 0,
    failureCount: 0,
    failureList: [],
    actionType: ''
  },
  record: {
    id: ''
  }
};

const useManageListStore = create<IManageListStore>((set) => {
  return {
    ...initialState,

    // reset all states to initial values
    resetManageListStore: (): void => {
      set({ ...initialState });
    }
  };
});

export const setManageListSelectedRecordId = (record: IRecordType): void => {
  useManageListStore.setState(() => ({ record: record }));
};

export const setShowScheduleEmail = (showScheduleEmail: boolean): void => {
  useManageListStore.setState(() => ({ showScheduleEmail }));
};

export const setActionSummary = (summary: IActionSummary): void => {
  useManageListStore.setState(() => ({ actionSummary: summary }));
};

export const setShowRefreshPanelForRefreshList = (
  showRefreshPanelForRefreshList: boolean
): void => {
  useManageListStore.setState(() => ({ showRefreshPanelForRefreshList }));
};

export default useManageListStore;
