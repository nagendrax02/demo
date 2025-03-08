export interface ITaskItem {
  ID: string;
  Type: number;
  Name: string;
  Description: string;
  Date: string;
  CreatedOn: string;
  OwnerID: string;
  OwnerName: string;
  CreatedBy: string;
  CreatedByName: string;
  Reminder: string;
  Attachment: string;
  TaskType: string;
  EndDate: string;
  Color: string;
  Status?: number;
  CompletedOn: string;
  CompletedOnString: string;
  OpenCompletedTasks: boolean;
  CreatedOnString: string;
  DateString: string;
  EndDateString: string;
  groupName?: string;
  Category?: number;
  CategoryType?: number;
  RelatedSubEntityId: string;
  ActivityEvent: string;
  OpportunityTitle: string;
  EntityType: string;
  OverdueText?: string | null;
  OpportunityEvent?: string;
  CompletedByName: string;
}

export interface ITaskRequestBody {
  Parameter: {
    FromDate: string | undefined;
    ToDate: string | undefined;
    StatusCode: number;
    Id: string;
    RelatedSubEntityId: string;
  };
  Sorting: {
    Direction: number;
  };
  Paging: {
    PageIndex: number;
    PageSize: 25;
  };
}

export interface IDateFilter {
  startDate: string | undefined;
  endDate: string | undefined;
}

export interface ITaskResponse {
  tasksList: ITaskItem[];
  totalTasks: number;
}

export interface IFormSubmissionConfig {
  isSuccessful: boolean;
}
