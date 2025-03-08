import { create } from 'zustand';
import { IDateFilter, IFormSubmissionConfig, ITaskItem, ITaskResponse } from './tasks.types';

const initialState = {
  isLoading: true,
  tasksList: [],
  totalTasks: 0,
  date: {
    startDate: undefined,
    endDate: undefined
  },
  refreshKey: undefined,
  statusCode: -1,
  formSubmissionConfig: { isSuccessful: false }
};

interface ITasksStore {
  isLoading: boolean;
  tasksList: ITaskItem[];
  totalTasks: number;
  date: IDateFilter;
  refreshKey: number | undefined;
  statusCode: number;
  formSubmissionConfig: IFormSubmissionConfig;
  setDate: (date: IDateFilter) => void;
  setTasksList: (data: ITaskResponse) => void;
  setIsLoading: (loading: boolean) => void;
  setRefresh: () => void;
  setStatusCode: (statusCode: number) => void;
  reset: () => void;
}

const useTasksStore = create<ITasksStore>((set) => ({
  ...initialState,

  setIsLoading: (loading: boolean): void => {
    set({ isLoading: loading });
  },

  setTasksList: (data: ITaskResponse): void => {
    set({ tasksList: data?.tasksList, totalTasks: data?.totalTasks });
  },

  setDate: (date: IDateFilter): void => {
    set({ date });
  },

  setRefresh: (): void => {
    set({ refreshKey: Math.random() });
  },

  setStatusCode: (statusCode: number): void => {
    set({ statusCode });
  },

  reset: (): void => {
    set({ ...initialState });
  }
}));

const formSubmissionConfig = useTasksStore.getState().formSubmissionConfig;

export default useTasksStore;
export { formSubmissionConfig };
