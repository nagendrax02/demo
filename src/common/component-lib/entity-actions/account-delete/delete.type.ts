import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';

export interface IAccountDeleteResponse {
  AffectedRows: number;
  CompanyName: string;
  AccountLeadCount: number;
  WithLeadDelete: boolean;
  IsAsyncRequest: boolean;
  LeadBulkActionResponse: null;
  LeadSyncActionResponse: null;
}

export interface IGridConfig {
  pageSize: number;
  isSelectAll: boolean;
  totalRecords: number;
  totalPages: number;
}

export interface ISearchParams {
  advancedSearchText: string;
}

export interface IDescription {
  isLoading: boolean;
  isDeleteDisabled: boolean;
  repName: IEntityRepresentationName;
  deleteAll: boolean;
  setDeleteAll: (data: boolean) => void;
  showAsyncRegMsg: boolean;
  gridConfig?: IGridConfig;
  entityIds?: string[];
}

export interface IDelete {
  handleClose: () => void;
  onSuccess?: () => void;
  customConfig?: Record<string, string>;
  entityIds?: string[];
  companyTypeId?: string;
  repName: IEntityRepresentationName;
  gridConfig?: IGridConfig;
  searchParams?: ISearchParams;
}
