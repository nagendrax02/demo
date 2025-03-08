import { create } from 'zustand';
import { IAssignLeadsStore, IAssignedLeadsCols } from './assign-leads.types';

const initialState = {
  leadRecords: [],
  resetKey: Date.now(),
  selectedLeadsArray: [],
  showLeadGrid: false,
  disabledSave: true,
  isLoading: false,
  removedLeadsArray: []
};

const useAssignLeadsStore = create<IAssignLeadsStore>((set) => ({
  ...initialState,

  setLeadRecords: (data: IAssignedLeadsCols[]): void => {
    set({ leadRecords: data });
  },

  setSelectedLeadsArray: (data: Record<string, string>[]): void => {
    set({ selectedLeadsArray: data });
  },

  setRemovedLeadsArray: (data: string[]): void => {
    set({ removedLeadsArray: data });
  },

  setShowLeadGrid: (data: boolean): void => {
    set({ showLeadGrid: data });
  },

  setDisabledSave: (data: boolean): void => {
    set({ disabledSave: data });
  },

  setIsLoading: (data: boolean): void => {
    set({ isLoading: data });
  },

  resetAssignLeadsStore: (): void => {
    set({ ...initialState });
  }
}));

export const useSetLeadRecords = (): ((data: IAssignedLeadsCols[]) => void) =>
  useAssignLeadsStore((state) => state.setLeadRecords);

export const useLeadRecords = (): IAssignedLeadsCols[] =>
  useAssignLeadsStore((state) => state.leadRecords);

export const useSetSelectedLeadsArray = (): ((data: Record<string, string>[]) => void) =>
  useAssignLeadsStore((state) => state.setSelectedLeadsArray);

export const useSelectedLeadsArray = (): Record<string, string>[] =>
  useAssignLeadsStore((state) => state.selectedLeadsArray);

export const useSetRemovedLeadsArray = (): ((data: string[]) => void) =>
  useAssignLeadsStore((state) => state.setRemovedLeadsArray);

export const useRemovedLeadsArray = (): string[] =>
  useAssignLeadsStore((state) => state.removedLeadsArray);

export default useAssignLeadsStore;
