interface IField {
  Key: string | undefined;
  Value: string;
}

interface IColumnField {
  ColumnName: string;
  ColumnValue: string;
}

interface ILeadRetrieveCriteria {
  LeadSearchParams: {
    SearchText: string;
    AdvancedSearchText: string;
    AdvancedSearchTextNew: string;
    LeadOnlyConditions: string | undefined;
    SortedOn: string | undefined;
    ListId?: string | undefined;
  };
  PageSize: number;
}

interface ILeadBody {
  LeadIds: string[];
  LeadFields: IField[];
  LeadRetrieveCriteria: ILeadRetrieveCriteria;
  UpdateAll: boolean;
  Nleads: number;
}

interface IUpdateAllEntityRecordsRetrieveCriteria {
  LeadSearchParams: {
    ListId: string;
  };
  PageSize: number;
}

interface IUpdateAllEntityRecordsBody {
  LeadIds: string[];
  LeadFields: IField[];
  UpdateAll: boolean;
  LeadRetrieveCriteria: IUpdateAllEntityRecordsRetrieveCriteria;
}

interface IActivityBody {
  ActivityIds: string[];
  ActivityFields: IColumnField[];
  UpdateAll: boolean;
  ActivityEventCode: number;
  IsOpportunity: boolean;
  ActivitySearchParams: string;
  SearchText: string;
  IsStatusUpdate: boolean;
}

interface IResponse {
  OperationStatus: string;
  Status: string;
  IsAsyncRequest: boolean;
  SuccessCount?: number;
  FailureCount?: number;
  ExceptionType?: string;
  ExceptionMessage?: string;
}

export type {
  ILeadBody,
  IResponse,
  IField,
  IColumnField,
  IActivityBody,
  ILeadRetrieveCriteria,
  IUpdateAllEntityRecordsBody,
  IUpdateAllEntityRecordsRetrieveCriteria
};
