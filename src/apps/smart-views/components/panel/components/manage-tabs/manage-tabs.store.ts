import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { ISortableItem } from 'common/component-lib/sortable-list';
import { create } from 'zustand';

interface IManageTabs {
  sortableList: ISortableItem<ITabResponse>[];
  defaultTabId: string;
}

const initialState = {
  sortableList: [],
  defaultTabId: ''
};

const useManageSVTabsStore = create<IManageTabs>(() => ({
  ...initialState
}));

const setSortableList = (sortableList: ISortableItem<ITabResponse>[]): void => {
  useManageSVTabsStore.setState({ sortableList: sortableList });
};

const setDefaultTabId = (tabId: string): void => {
  useManageSVTabsStore.setState({ defaultTabId: tabId });
};

export { setSortableList, setDefaultTabId };
export default useManageSVTabsStore;
