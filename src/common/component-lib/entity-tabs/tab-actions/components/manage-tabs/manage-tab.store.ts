import { create } from 'zustand';
import { ITabConfiguration } from 'common/types/entity/lead';
import { ISortableItem } from 'common/component-lib/sortable-list';
import { getDefaultTabId, getSortableList, handleDefaultTabIdUpdate } from './utils/utils';

interface IAddNewTab {
  sortedTabConfig: ISortableItem<ITabConfiguration>[];
  setSortedTabConfig: (sortedTabConfig: ISortableItem<ITabConfiguration>[]) => void;
  defaultTabId: string;
  setDefaultTabId: (tabId: string) => void;
  init: (tabConfig: ITabConfiguration[]) => void;
  reset: () => void;
}

const initValues = {
  sortedTabConfig: [],
  defaultTabId: ''
};
const initialState: IAddNewTab = {
  ...initValues,
  setSortedTabConfig: () => {},
  setDefaultTabId: () => {},
  init: () => {},
  reset: () => {}
};
const useManageTabs = create<IAddNewTab>((set) => ({
  ...initialState,

  init: (tabConfig: ITabConfiguration[]): void => {
    const defaultTabId = getDefaultTabId(tabConfig);
    set({ sortedTabConfig: getSortableList(tabConfig, defaultTabId), defaultTabId });
  },
  setSortedTabConfig: (sortedTabConfig: ISortableItem<ITabConfiguration>[]): void => {
    set({ sortedTabConfig });
  },
  setDefaultTabId: (defaultTabId: string): void => {
    set((state) => ({
      defaultTabId,
      sortedTabConfig: handleDefaultTabIdUpdate(state.sortedTabConfig, defaultTabId)
    }));
  },

  reset: (): void => {
    set({ ...initValues });
  }
}));

export default useManageTabs;
