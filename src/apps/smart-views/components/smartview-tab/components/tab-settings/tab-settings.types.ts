import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { ITabSettingsConfig } from './config';
import { IUseTabSettings } from './useTabSettings';
import { IFilterData } from '../../smartview-tab.types';
import { IFetchCriteria } from 'common/component-lib/entity-export/entity-export.types';
import { TabType } from 'apps/smart-views/constants/constants';
import { INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { IAvailableField } from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import { ExceptionType } from 'common/constants';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';

enum ExportType {
  AllFields = '0',
  SelectedFields = '1'
}

interface IRenderPanelContent {
  tabConfig: ITabSettingsConfig | null | undefined;
  maxAllowed: number;
  selectedAction: IMenuItem | null;
  data: IUseTabSettings;
  onFilterChange: (filterDataMap: Record<string, IFilterData>) => void;
  tabType: TabType;
  entityExportConfig?: IEntityExportConfig;
  entityCode?: string;
  entityRepName: IEntityRepresentationName;
}

interface IEntityExportConfig {
  maxExportAllowed?: number;
  fetchCriteria: IFetchCriteria;
  minRecordForAsyncRequest?: number;
  additionalEntityColumns: string;
  restrictionMessage: string;
}

interface IHandleEntityExport {
  entityExportConfig?: IEntityExportConfig;
  selectedExportType?: ExportType;
  selectedColumns: string[];
  tabType: TabType;
  setEntityExportSucceeded?: (isSucceeded: boolean) => void;
  showAlert?: (notification: INotification) => void;
  setSubmitButtonDisabled?: (disable: boolean) => void;
  setIsLoading?: (loading: boolean) => void;
  tabEntityCode?: string;
  selectedFields?: IAvailableField[];
  tabId?: string;
}

interface ILeadBody {
  SearchText?: string;
  SortOrder?: number;
  SortColumn?: string;
  AdvancedSearchTextNew?: string;
  LeadOnlyConditions?: string;
  ListId?: string;
  RetrieveColumns?: string;
  LeadType?: string;
}

interface ITaskExportPayloadProps {
  fetchCriteria?: IFetchCriteria;
  selectedExportType?: ExportType;
  column?: string[];
  minRecordForAsyncRequest?: number;
  tabId?: string;
}

interface IActivityExportPayload {
  ActivityEventCode?: string;
  SearchText?: string;
  AdvancedSearch?: string;
  ActivityOnlyConditions?: string;
  OpportunitySalesGroup?: string;
  SortColumn?: string;
  SortOrder?: number;
  ExportAllFields?: boolean;
  SelectedFields?: string;
  IsOpportunity?: boolean;
  ParentOpportunityEvent?: string;
  ParentOpportunityColumns?: string;
}
interface IOpportunityExportPayloadProps {
  fetchCriteria?: IFetchCriteria;
  selectedExportType?: ExportType;
  column?: string[];
}

interface IAccountExportPayload {
  CompanyTypeId: string;
  SearchText: string;
  Stage: string;
  OwnerId: string;
  Columns?: string;
  AdvancedSearch: string;
  DatePickerField: string;
  DatePickerFrom: string;
  DatePickerTo: string;
  ExportAllFields: boolean;
}

interface IActivityExportPayloadProps {
  fetchCriteria?: IFetchCriteria;
  selectedExportType?: ExportType;
  column?: string[];
  tabEntityCode?: string;
}

interface IAccountExportPayloadProps {
  fetchCriteria?: IFetchCriteria;
  selectedExportType?: ExportType;
  column?: string[];
}

type IEntityBody = ILeadBody | ITaskExportPayload | IActivityExportPayload | IAccountExportPayload;

export interface IResponse {
  Status: string;
  Message?: IMessage;
  ExceptionMessage?: string;
  ExceptionType?: ExceptionType;
}

export interface IMessage {
  IsSuccessful: boolean;
  Result: boolean;
}

export interface ITaskExportPayload {
  FetchCriteria?: ITaskFetchCriteria;
  ExportAllFields?: boolean;
  SelectedFields?: string;
  TaskTypes?: string;
  LeadType?: string;
}

export interface ITaskFetchCriteria {
  Parameter?: IParameter;
  Columns?: IColumns;
  Sorting?: ISorting;
  Paging?: IPaging;
  ParentOpportunityEvent?: number;
  SupportTaskCustomFilter?: boolean;
  TaskOnlyConditions?: string;
  LeadType?: string;
}

export interface IColumns {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Exclude_CSV?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Include_CSV?: string;
}

export interface IPaging {
  Offset?: number;
  RowCount?: number;
}

export interface IParameter {
  LookupName?: string;
  LookupValue?: string;
  From?: null;
  To?: null;
  StatusCode?: number;
  SearchText?: string;
  TypeName?: string;
  IncludeOverdue?: boolean;
  IncludeOnlyOverdue?: boolean;
  TaskRetrievalDataSource?: number;
  IncludeCanUpdate?: boolean;
  SelectedSalesGroupId?: string;
  IncludeSalesGroupFilter?: boolean;
  AdvancedSearchText?: string;
  FromDate?: string | null;
  ToDate?: string | null;
  SupportTaskCustomFilter?: boolean;
}

export interface ISorting {
  ColumnName?: string;
  Direction?: number;
}

export type {
  IRenderPanelContent,
  IEntityExportConfig,
  IHandleEntityExport,
  ILeadBody,
  IEntityBody,
  ITaskExportPayloadProps,
  IActivityExportPayloadProps,
  IActivityExportPayload,
  IAccountExportPayloadProps,
  IAccountExportPayload,
  IOpportunityExportPayloadProps
};

export { ExportType };
