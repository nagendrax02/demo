import { AssociatedEntity } from './common.types';

declare enum BulkSelectionType {
  Selected = 0,
  All = 1
}
export interface IGridData {
  IsSelectAll?: boolean;
  PageSize?: number;
  TotalRecords?: number;
  TotalPages?: number;
}

export interface IBulkSubmissionConfig extends IGridData {
  Ids: string[];
  AdvancedSearchCondition: string;
  CustomFilters?: string;
  Type: BulkSelectionType;
  TotalCount: number;
  AssociatedEntityTypeId?: string;
  AssociatedEntity?: AssociatedEntity;
  ListId?: string;
  SearchText?: string;
}
