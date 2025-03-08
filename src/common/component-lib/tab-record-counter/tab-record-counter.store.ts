import { create } from 'zustand';

export interface ITabRecordCounterStore {
  tabRecordCountMap: Record<string, number | undefined>;
  setTabRecordCountMap: (updatedMap: Record<string, number | undefined>) => void;
}

const useTabRecordCounterStore = create<ITabRecordCounterStore>((set) => ({
  tabRecordCountMap: {},
  setTabRecordCountMap: (updatedMap: Record<string, number | undefined>): void => {
    set((prevData) => {
      return {
        ...prevData,
        tabRecordCountMap: { ...prevData?.tabRecordCountMap, ...updatedMap }
      };
    });
  }
}));

export default useTabRecordCounterStore;
