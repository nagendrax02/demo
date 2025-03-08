import { StoreApi, create, createStore, useStore } from 'zustand';
import {
  StorageKey,
  setItem,
  getItem,
  UserPersonalisationKeys
} from 'common/utils/storage-manager';
import { IActivityHistoryStore, IAugmentedAHDetail } from './types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IDateOption } from 'common/component-lib/date-filter';
import { ALL_TIME } from './constants';
import { handleActionModal } from './utils/utils';
import { IActionModal, IActivityHistoryActionsStore } from './types/activity-history-store.types';
import useEntityTabsStore from 'common/component-lib/entity-tabs/store';
import { createContext, useContext, useRef } from 'react';
import { CallerSource } from 'common/utils/rest-client';
import { ISelectedLeadFilterOption } from './components/filters/account-lead-filter/accountLeadFilter.types';
import { EntityType } from 'common/types';
import {
  cacheAccountLeadFilter,
  canStoreInRemoteCache,
  getCachedAccountLeadFilter,
  removeSpecificItem,
  storeTypeFilter
} from './cache-utils';
import { TabType } from '../entity-details/types/entity-data.types';
import { getUserPersonalisation, setUserPersonalisation } from 'common/utils/user-personalisation';
import { trackError } from 'common/utils/experience/utils/track-error';

interface ICacheFilterParams {
  data: IDateOption | undefined;
  entityDetailId: string;
  type: EntityType;
  isAccountLeadActivityHistoryTab?: boolean;
}
export const cacheDateFilter = async ({
  data,
  entityDetailId,
  type,
  isAccountLeadActivityHistoryTab = false
}: ICacheFilterParams): Promise<void> => {
  if (canStoreInRemoteCache(type, isAccountLeadActivityHistoryTab)) {
    await setUserPersonalisation<IDateOption>(
      `${type}-${UserPersonalisationKeys.AHDateFilterCheck}`,
      CallerSource.ActivityHistory,
      data ?? ({ value: 'all_time', label: 'All Time' } as IDateOption)
    );
    return;
  }

  const activeTabKey = useEntityTabsStore.getState()?.activeTabKey;
  const existingFilters = getItem(StorageKey.AHDateFilter) || {};

  setItem(StorageKey.AHDateFilter, {
    ...existingFilters,
    [`${activeTabKey}-${entityDetailId}`]: data
  });
};

export const getCachedDateFilter = async (
  entityDetailId: string,
  type: EntityType,
  isAccountLeadActivityHistoryTab?: boolean
): Promise<IDateOption | undefined> => {
  try {
    if (canStoreInRemoteCache(type, isAccountLeadActivityHistoryTab)) {
      const dateOptions = await getUserPersonalisation<IDateOption>(
        `${type}-${UserPersonalisationKeys.AHDateFilterCheck}`,
        CallerSource.ActivityHistory
      );
      return dateOptions ?? undefined;
    } else {
      const activeTabKey = useEntityTabsStore.getState()?.activeTabKey;
      const storedFilters = getItem(StorageKey.AHDateFilter);
      return storedFilters?.[`${activeTabKey}-${entityDetailId}`] as IDateOption;
    }
  } catch (error) {
    trackError(error);
    return undefined;
  }
};

const StoreContext = createContext<StoreApi<IActivityHistoryStore> | null>(null);

const isCustomActivityTab = (): boolean => {
  const { activeTabKey, tabConfig } = useEntityTabsStore.getState() || {};
  const activeTabConfig = tabConfig?.filter((tab) => tab.Id === activeTabKey)?.[0];
  return (
    activeTabConfig?.Type === TabType.CustomActivity || activeTabConfig?.Type === TabType.CustomTab
  );
};

// Adding store to react context to have seperate store for each AH tab (System and Custom)
export const AHStoreProvider = ({
  children,
  type,
  entityDetailId
}: {
  children: JSX.Element;
  type: EntityType;
  entityDetailId: string;
}): JSX.Element => {
  const initialState = {
    isLoading: true,
    augmentedAHDetails: null,
    typeFilter: [],
    dateFilter: undefined,
    showModal: {
      delete: false,
      cancel: false
    },
    selectedIdToPerformAction: '',
    selectedDetails: null,
    accountLeadSelectedOption: getCachedAccountLeadFilter(type, entityDetailId)
  };

  const storeRef = useRef<StoreApi<IActivityHistoryStore>>();
  if (!storeRef.current) {
    storeRef.current = createStore<IActivityHistoryStore>((set) => ({
      // state
      ...initialState,

      // setState
      setIsLoading: (loading: boolean): void => {
        set({ isLoading: loading });
      },

      setAugmentedAHDetails: (data: IAugmentedAHDetail[]): void => {
        set({ augmentedAHDetails: data });
      },

      updateAHRecord: (data: IAugmentedAHDetail): void => {
        set((state) => {
          const records = state.augmentedAHDetails || [];
          const itemIndex = records.findIndex((item) => item.Id === data.Id);
          if (itemIndex !== -1) {
            records[itemIndex] = data;
          }
          return { ...state, augmentedAHDetails: records };
        });
      },

      setTypeFilter: (data: IOption[], isAccountLeadActivityHistoryTab?: boolean): void => {
        if (!isCustomActivityTab())
          storeTypeFilter({ type, entityDetailId, data, isAccountLeadActivityHistoryTab });
        set({ typeFilter: data });
      },

      setDateFilter: (data: IDateOption): void => {
        cacheDateFilter({ data, entityDetailId, type });
        set({ dateFilter: data.value !== ALL_TIME ? data : undefined });
      },

      clearFilters: (isAccountLeadActivityHistoryTab): void => {
        if (!isCustomActivityTab())
          storeTypeFilter({
            type,
            entityDetailId,
            data: [],
            isAccountLeadActivityHistoryTab
          });
        set({ typeFilter: [], dateFilter: undefined });
        removeSpecificItem(StorageKey.AHEventsCodes, `${type}-${entityDetailId}`);
        cacheDateFilter({ data: undefined, entityDetailId, type, isAccountLeadActivityHistoryTab });
      },

      setSelectedIdToPerformAction: (id: string): void => {
        set({
          selectedIdToPerformAction: id
        });
      },

      setShowModal: (actionType: string, visibility: boolean): void => {
        set({ showModal: handleActionModal(initialState.showModal, actionType, visibility) });
      },

      setSelectedDetails: (data: IAugmentedAHDetail): void => {
        set({ selectedDetails: data });
      },

      setAccountLeadSelectedOption: (data: ISelectedLeadFilterOption[]): void => {
        set({ accountLeadSelectedOption: data });
        cacheAccountLeadFilter(type, entityDetailId, data);
      },

      // reset all states to initial values
      reset: (): void => {
        set({ ...initialState });
      }
    }));
  }
  return (
    <StoreContext.Provider value={storeRef.current as never}>{children}</StoreContext.Provider>
  );
};

const initialActionState = {
  showModal: {
    delete: false,
    cancel: false
  },
  selectedIdToPerformAction: '',
  selectedDetails: null,
  actionCallerSource: CallerSource.NA
};

export const useActivityHistoryActionsStore = create<IActivityHistoryActionsStore>((set) => ({
  // state
  ...initialActionState,

  setSelectedIdToPerformAction: (id: string): void => {
    set({
      selectedIdToPerformAction: id
    });
  },

  setShowModal: (actionType: string, visibility: boolean, callerSource: CallerSource): void => {
    set({
      showModal: handleActionModal(initialActionState.showModal, actionType, visibility),
      actionCallerSource: callerSource
    });
  },

  setSelectedDetails: (data: IAugmentedAHDetail): void => {
    set({ selectedDetails: data });
  },

  // reset all states to initial values
  reset: (): void => {
    set({ ...initialActionState });
  }
}));

const useShowModal = (): IActionModal =>
  useActivityHistoryActionsStore((state) => state?.showModal);
const useSetShowModal = (): ((
  actionType: string,
  visibility: boolean,
  callerSource: CallerSource
) => void) => useActivityHistoryActionsStore((state) => state?.setShowModal);
const useSetSelectedIdToPerformAction = (): ((id: string) => void) =>
  useActivityHistoryActionsStore((state) => state?.setSelectedIdToPerformAction);
const useSetSelectedDetails = (): ((data: IAugmentedAHDetail | null) => void) =>
  useActivityHistoryActionsStore((state) => state?.setSelectedDetails);
const useSelectedDetails = (): IAugmentedAHDetail | null =>
  useActivityHistoryActionsStore((state) => state?.selectedDetails);
const useSelectedIdToPerformAction = (): string =>
  useActivityHistoryActionsStore((state) => state?.selectedIdToPerformAction);

function useActivityHistoryStore<T>(selector?: (state: IActivityHistoryStore) => T): T {
  const store = useContext(StoreContext);
  return useStore(
    store as StoreApi<IActivityHistoryStore>,
    selector as (state: IActivityHistoryStore) => T
  );
}

export default useActivityHistoryStore;
export {
  useShowModal,
  useSetShowModal,
  useSetSelectedIdToPerformAction,
  useSetSelectedDetails,
  useSelectedDetails,
  useSelectedIdToPerformAction
};
