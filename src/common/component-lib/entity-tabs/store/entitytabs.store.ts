import { create } from 'zustand';
import { IAugmentedTabConfig } from '../types';
import { ITabConfiguration } from 'common/types/entity/lead';
import { TAB_ID } from '../constants/tab-id';
import useNotesStore from 'apps/notes/notes.store';
import useTasksStore from 'apps/tasks/tasks.store';
import { updateMapForTabsToUpdate } from 'apps/forms/utils';

interface IEntityTabsState {
  activeTabKey: string;
  setActiveTabKey: (tabKey: string) => void;
  augmentedTabs: IAugmentedTabConfig[] | null;
  setAugmentedTabs: (augmentedTabsConfig: IAugmentedTabConfig[]) => void;
  tabConfig: ITabConfiguration[] | undefined;
  setTabConfig: (tabConfig: ITabConfiguration[] | undefined) => void;
  reset: () => void;
  refreshConfig: Record<string, string>;
  setRefreshTab: (tabId?: string) => void;
}

const resetStore = {
  [TAB_ID.LeadNotes]: useNotesStore.getState().reset,
  [TAB_ID.LeadTasks]: useTasksStore.getState().reset
};

const initialState: IEntityTabsState = {
  activeTabKey: '',
  augmentedTabs: [],
  setAugmentedTabs: () => {},
  setActiveTabKey: () => {},
  tabConfig: [],
  setTabConfig: () => {},
  reset: () => {},
  refreshConfig: {},
  setRefreshTab: () => {}
};

const useEntityTabsStore = create<IEntityTabsState>((set) => ({
  ...initialState,
  augmentedTabs: [],
  setAugmentedTabs: (augmentedTabsConfig: IAugmentedTabConfig[]): void => {
    set(() => ({ augmentedTabs: augmentedTabsConfig }));
  },
  activeTabKey: '',
  setActiveTabKey: (tabKey: string): void => {
    set(() => ({ activeTabKey: tabKey }));
  },

  setTabConfig: (tabConfig: ITabConfiguration[]): void => {
    set({ tabConfig: tabConfig });
  },

  setRefreshTab: (tabId?: string): void => {
    const tabToRefresh = tabId || useEntityTabsStore.getState().activeTabKey;
    set((state) => ({
      refreshConfig: { ...state.refreshConfig, [tabToRefresh]: `${tabToRefresh}_${Math.random()}` }
    }));
    updateMapForTabsToUpdate(tabToRefresh);
    resetStore[tabToRefresh]?.();
  },

  reset: (): void => {
    set(initialState);
  }
}));

const getAllAugmentedTabs = (): IAugmentedTabConfig[] | null => {
  return useEntityTabsStore?.getState()?.augmentedTabs;
};

const updateTab = (tabId?: string): void => {
  const tabToRefresh = tabId || useEntityTabsStore.getState().activeTabKey;
  const currentState = useEntityTabsStore.getState();
  useEntityTabsStore.setState({
    refreshConfig: {
      ...currentState.refreshConfig,
      [tabToRefresh]: `${tabToRefresh}_${Math.random()}`
    }
  });
  updateMapForTabsToUpdate(tabToRefresh);
};

export { useEntityTabsStore, getAllAugmentedTabs, updateTab };

export const resetActiveTabKey = (): void => {
  useEntityTabsStore.getState().setActiveTabKey('');
};

export type { IAugmentedTabConfig };
