import { IDateOption } from 'common/component-lib/date-filter';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IEntityDetailsCoreData } from '../entity-details/types/entity-data.types';

interface ITypeFilter {
  selectedValue?: IOption[];
  filterOptions: IOption[];
}

interface IDateFilter {
  selectedValue?: IDateOption;
}

interface IAuditTrailFilters {
  typeFilter: ITypeFilter;
  dateFilter: IDateFilter;
}

interface IAuditTrailRawEventLogData {
  AuditLogAutoId: number;
  CorrelationId: string;
  CustomObjectFieldSchemaName: string;
  EntityId: string;
  EntityType: number;
  EventCapturedOn: string;
  EventLoggedOn: string;
  EventPerformedBy: string;
  EventPerformedOn: string;
  EventSource: string;
  EventSourceDescription: string;
  EventType: number;
  FieldDisplayName: string;
  FieldSchemaName: string;
  IsCFSField: boolean;
  NewValue: string;
  OldValue: string;
}

interface IAuditTrailRawRecordData {
  CorrelationId: string;
  DoesEventContainMoreLogs: boolean;
  EventPerformedBy: string;
  EventPerformedByEmailAddress: string;
  EventPerformedByUserName: string;
  EventPerformedOn: string;
  EventLogs: IAuditTrailRawEventLogData[];
}

interface IAuditTrailRawData {
  FetchedLogsCount: number;
  TotalRecordCount: number;
  Records: IAuditTrailRawRecordData[];
}

interface IRelatedChangeRecordConfig {
  showRecord: boolean;
  visibility: 'show' | 'hide';
}

interface IAuditTrailAugmentedData {
  id: string;
  modifiedOn: string;
  modifiedByUserName: string;
  eventType: number;
  displayName: string;
  schemaName: string;
  oldValue: string;
  newValue: string;
  showModifiedOnCell?: boolean;
  modifiedOnCellRowSpan?: number;
  customClassName?: string;
  relatedChangeRecordConfig?: IRelatedChangeRecordConfig;
}

export enum SortType {
  Ascend = 0,
  Descend = 1
}

interface IAuditTrailFetchCriteria {
  pageCountArray: number[];
  sortOrder: SortType;
  totalRecordCount: number;
  pageNumber: number;
}

interface IEntityAuditTrailStore {
  entityCoreData: IEntityDetailsCoreData;
  isFilterLoading: boolean;
  isGridLoading: boolean;
  filters: IAuditTrailFilters;
  rawAuditTrailData: IAuditTrailRawData;
  augmentedAuditTrailData: Record<string, IAuditTrailAugmentedData[]>;
  fetchCriteria: IAuditTrailFetchCriteria;
  // setData
  setFetchCriteria: (data: Partial<IAuditTrailFetchCriteria>) => void;
  setRawAuditTrailData: (data: IAuditTrailRawData) => void;
  setAugmentedAuditTrailData: (data: Record<string, IAuditTrailAugmentedData[]>) => void;
  setEntityCoreData: (data: IEntityDetailsCoreData) => void;
  setIsFilterLoading: (state: boolean) => void;
  setIsGridLoading: (state: boolean) => void;
  setTypeFilterSelectedValue: (selectedValue: IOption[]) => void;
  setTypeFilterOptions: (filterOptions: IOption[]) => void;
  setDateFilterSelectedValue: (selectedValue: IDateOption) => void;
}

enum AuditTrailEventType {
  LeadCreated = 1
}

export type {
  ITypeFilter,
  IDateFilter,
  IEntityAuditTrailStore,
  IAuditTrailFilters,
  IAuditTrailRawData,
  IAuditTrailRawRecordData,
  IAuditTrailRawEventLogData,
  IAuditTrailAugmentedData,
  IAuditTrailFetchCriteria,
  IRelatedChangeRecordConfig
};

export { AuditTrailEventType };
