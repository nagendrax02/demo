import { create } from 'zustand';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { InputId } from './add-new-tab.types';

interface IAddNewTab {
  events: IOption[];
  tabName: string;
  isDefault: boolean;
  error: InputId;
  setError: (error: InputId) => void;
  setTabName: (data: string) => void;
  setIsDefault: (data: boolean) => void;
  setEvents: (data: IOption[]) => void;
  reset: () => void;
}

const initValues = {
  events: [],
  tabName: '',
  isDefault: false,
  error: InputId.Invalid
};
const initialState: IAddNewTab = {
  ...initValues,
  setEvents: () => {},
  setTabName: () => {},
  setIsDefault: () => {},
  setError: () => {},
  reset: () => {}
};
const useAddNewTab = create<IAddNewTab>((set) => ({
  ...initialState,

  setEvents: (options: IOption[]): void => {
    set({ events: options, error: InputId.Invalid });
  },

  setTabName: (name: string): void => {
    set({ tabName: name, error: InputId.Invalid });
  },

  setIsDefault: (isDefault: boolean): void => {
    set({ isDefault });
  },

  setError: (id: InputId): void => {
    set({ error: id });
  },

  reset: (): void => {
    set({ ...initValues });
  }
}));

export default useAddNewTab;
