import { create } from 'zustand';
import { IDate, INotesItem } from './notes.types';

const initialState = {
  isLoading: true,
  notesList: [],
  totalNotes: 0,
  page: 1,
  date: {
    startDate: undefined,
    endDate: undefined
  },
  refreshKey: 0
};

interface IUserNotesStore {
  isLoading: boolean;
  notesList: INotesItem[];
  totalNotes: number;
  page: number;
  date: IDate;
  refreshKey: number;
  setPage: (page: number) => void;
  setNotesList: (data: INotesItem[]) => void;
  updateNotesItem: (data: INotesItem) => void;
  setIsLoading: (loading: boolean) => void;
  setDate: (date: IDate) => void;
  setRefresh: () => void;
  reset: () => void;
}

const useNotesStore = create<IUserNotesStore>((set) => ({
  // state
  ...initialState,

  setIsLoading: (loading: boolean): void => {
    set({ isLoading: loading });
  },

  setNotesList: (data: INotesItem[]): void => {
    set({ notesList: data, totalNotes: data?.length });
  },

  updateNotesItem: (data: INotesItem): void => {
    const notesList = useNotesStore.getState().notesList;
    const itemIndex = notesList.findIndex((item) => item.ProspectNoteId === data.ProspectNoteId);
    if (itemIndex !== -1) {
      notesList[itemIndex] = data;
    }

    set({ notesList: notesList });
  },

  setPage: (page: number): void => {
    set({ page });
  },

  setDate: (date: IDate): void => {
    set({ date });
  },

  setRefresh: (): void => {
    set({ refreshKey: Math.random() });
  },

  reset: (): void => {
    set({ ...initialState });
  }
}));

export default useNotesStore;
