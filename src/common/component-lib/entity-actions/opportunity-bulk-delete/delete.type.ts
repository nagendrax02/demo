import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';

export interface IGridConfig {
  pageSize: number;
  isSelectAll: boolean;
  totalRecords: number;
  totalPages: number;
}

export interface ISearchParams {
  activitySearchCondition: string;
  searchText: string;
}

export interface IBody {
  repName: IEntityRepresentationName;
  deleteAll: boolean;
  entityIds: string[];
  setDeleteAll: (data: boolean) => void;
  partialMessage: { successCount: number; failureCount: number };
  isAsyncReq: boolean;
  gridConfig?: IGridConfig;
}

export interface IDelete {
  entityIds: string[];
  handleClose: () => void;
  onSuccess?: () => void;
  gridConfig?: IGridConfig;
  searchParams?: ISearchParams;
  eventCode: string;
}

export interface IResponse {
  IsSuccess: boolean;
  FailureCount: number;
  IsAsyncRequest: boolean;
  SuccessCount: number;
}
