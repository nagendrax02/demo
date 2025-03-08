export interface ITaskTypeFilter {
  appointmentId: string[];
  category: string[];
  todoId: string[];
}

export interface ICasaData {
  filters?: {
    [key: string]: Record<string, string> | ITaskTypeFilter;
  };
  searchText?: string;
}
