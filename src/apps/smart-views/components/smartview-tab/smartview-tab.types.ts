import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  ConditionType,
  HeaderActionType,
  RowHeightType,
  TabType
} from 'apps/smart-views/constants/constants';
import { IActionConfig } from 'apps/entity-details/types';
import {
  IActionMenuItem,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { DataType, ILeadAttribute, RenderType } from 'common/types/entity/lead/metadata.types';
import { FilterRenderType } from 'apps/smart-views/components/smartview-tab/components/filter-renderer/constants';
import { IDateOption } from 'common/component-lib/date-filter/date-filter.types';
import { IWorkAreaConfig } from 'common/utils/process/process.types';
import {
  ICommonTabSettings,
  IGetIsFeatureRestriction,
  ILeadTypeConfiguration,
  ITabResponse,
  IUserPermission,
  ListType
} from '../../smartviews.types';
import { IAugmentedSmartViewEntityMetadata } from '../../augment-tab-data/common-utilities/common.types';
import { IBulkActionRestriction, IColumnDef } from '@lsq/nextgen-preact/grid/grid.types';
import { ITaskAttribute } from 'common/types/entity';
import { IFetchDropdownPayload } from 'common/utils/entity-data-manager/entity-data-manager.types';
import { FeatureRestrictionModuleTypes } from 'common/utils/feature-restriction/feature-restriction.types';
import { IQuickFilterResponse } from './components/header/search-filter/quick-filter/quick-filter.types';
import { EntityType } from 'common/types';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IPinActionConfig } from 'common/component-lib/sortable-list/sortable-list.types';

export interface IRowCondition {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  RSO_IsMailMerged: boolean;
  RSO: string;
  Operator: ConditionOperator;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  LSO_Type: ConditionOperatorType;
  LSO: string;
  SubConOp: ConditionType;
  IsMarvinRequest?: boolean;
}
export interface IGroupCondition {
  Type: ConditionEntityType;
  ConOp: ConditionType;
  RowCondition?: IRowCondition[];
}

export interface IAdvancedSearch {
  Conditions?: IGroupCondition[];
  GrpConOp: ConditionType;
  QueryTimeZone: string;
}
export interface IRecordType {
  id: string;
  [key: string]: string | null;
}

interface IGridActions {
  bulkActions?: IMenuItem[];
  rowActions: IRowActionConfig;
}

export interface IAccountCustomFilters {
  LookupName: string;
  LookupValues: string[];
}

export interface IColumn extends IColumnDef<IRecordType> {
  isLeadFieldInNonLeadTab?: boolean; // is used when schema name does not start with P_
  dataType?: DataType;
  renderType?: RenderType;
  isActivity?: boolean;
  cfsDisplayName?: string;
  entityType?: EntityType;
}

export interface IFetchCriteria {
  AdvancedSearch: string;
  Columns: string;
  CustomFilters: string | IAccountCustomFilters[];
  CustomDateFilters?: string;
  ListId?: string;
  PageIndex: number;
  PageSize: number;
  SearchText: string;
  SortBy: number;
  SortOn: string;
  refreshTimeStamp?: number;
  SalesGroup?: string;
  Status?: number;
  IncludeOverdue?: boolean;
  IncludeOnlyOverdue?: boolean;
  IsStarredList?: boolean;
  CreatedBy?: string;
  ListType?: ListType;
  ShowHidden?: boolean;
  SortColumn?: string;
  SortOrder?: number;
  tabId?: string;
  LeadType?: string;
}

export interface IRowActionConfig {
  moreActions: IActionMenuItem[];
  quickActions: IActionConfig[];
}

export interface IColumnConfigData {
  pinnedColumnConfig?: IPinActionConfig;
}

export type IColumnConfigMap = Record<string, IColumnConfigData>;

export type IAugmentResponse = (res) => Promise<{
  records: IRecordType[];
  totalRecordCount?: number;
}>;
export interface IGridConfig {
  apiRoute: string;
  columns: IColumn[];
  actions: IGridActions;
  rowHeight: RowHeightType;
  requiredColumns?: string;
  disableSelection?: boolean;
  allowRowSelection: boolean;
  fetchCriteria: IFetchCriteria;
  workAreaIds?: Record<string, number>;
  augmentResponse: IAugmentResponse;
  augmentFetchCriteria?: (
    fetchCriteria: IFetchCriteria,
    headerConfig: ITabHeader
  ) => IFetchCriteria;
  expandableComponent?: (props: { item: IRecordType }) => JSX.Element;
  onRowClick?: (props: { item: IRecordType }) => void;
  tabColumnsWidth?: Record<string, number>;
  apiRequestColumns?: string;
  bulkRestrictedDataPromise?: Promise<IBulkActionRestriction | undefined>;
  isManageEntityAdvancedSearchApplied?: boolean;
  columnConfigMap?: IColumnConfigMap;
}

export interface ITabSettings {
  isSystemTab?: boolean;
  allowDelete?: boolean;
  canEdit?: boolean;
  isOpportunityNameColumnRemoved?: boolean;
  getSystemFilterConfig?: () => Promise<IFilter>;
  getSystemColumns?: () => string;
  disableAutoRefresh?: boolean;
  disableTabInfo?: boolean;
  hideEntityCounter?: boolean;
  isLeadTypeEnabled?: boolean;
}

export interface IHeaderAction {
  id: string;
  actionType: HeaderActionType;
  title?: string;
  value?: string;
  workAreaConfig?: IWorkAreaConfig;
  disabled?: boolean;
  subMenu?: IMenuItem[];
  renderIcon?: () => JSX.Element;
  isLoading?: boolean;
  isActive?: boolean;
  toolTip?: string;
  leadRepName?: IEntityRepresentationName;
}

export interface IFilterData {
  selectedValue: IOption[] | IDateOption; // value used to render
  value: string; // value sent to api
  parentSchema?: string; //parent schema name for dependent dropdown
  childSchema?: string; //child schema name for dependent dropdown
  label: string;
  entityType: ConditionEntityType;
  filterOperator: ConditionOperator;
  filterOperatorType: ConditionOperatorType;
  renderType: FilterRenderType;
  isPinned?: boolean;
  disablePinAction?: boolean;
  disablePinActionTooltip?: string;
  dataType?: DataType;
  customCallbacks?: {
    fetchOptions?: (payload: IFetchDropdownPayload) => IOption[] | Promise<IOption[]>;
    // return null to not trigger grid api call, else send IOnFilterChange
    onChange?: (option: IOption[] | IDateOption) => IOnFilterChange | null;
  };
  isDisabled?: boolean;
  isDisabledTooltip?: string;
  isHidden?: boolean;
  isNotCounted?: boolean;
  isNonClearable?: boolean;
  defaultOption?: { selectedValue: IOption[] | IDateOption; value: string };
  enableDateTimePicker?: boolean;
  excludeFromApi?: boolean;
  entityCode?: string; //Can be used when multiple entity codes are present in a tab
  utcDateFormatEnabled?: boolean; // can be used when we need to send date in UTC format
  includeSecondsForEndDate?: boolean;
  avoidUTCFormatting?: boolean;
  isUserSingleSelect?: boolean; // will be used when need to render user dropdown as single select
}

export type IOnFilterChange = Pick<
  IFilterData,
  'selectedValue' | 'value' | 'entityType' | 'filterOperator' | 'filterOperatorType'
>;

export interface IFilterConfig {
  [schemaName: string]: IFilterData;
}

export interface IFetchOptionsRelatedData {
  entityType: EntityType;
  filterConfig: IFilterData;
  bySchemaName: IFilterConfig;
  leadType?: string;
}

export interface IFilter {
  filterToOpenOnMount?: string;
  selectedFilters: string[];
  bySchemaName: IFilterConfig;
  augmentationOnManageFilterSave?: (
    filterDataMap: Record<string, IFilterData>,
    tabData: ITabConfig
  ) => IFilter;
}

interface ISelectFilterPopupConfig {
  removeConfigureFields?: boolean;
  removePopup?: boolean;
}

export interface IHeaderFilterConfig {
  maxAllowedFilters?: number;
  filters: IFilter;
  selectFilterPopupConfig?: ISelectFilterPopupConfig;
}

export interface IQuickFilterConfig {
  quickFilter?: IQuickFilterResponse;
  IsStarredList?: boolean;
  //prevFilters will store the filters which are applied on manage tab initially (these will be stored as StarredLead has hardcoded filters), and then we switch to StarredLead filters
  prevFilters?: IFilter;
  ListId?: string;
  resetQuickFilterOptions?: number;
}

export interface ISecondaryHeader {
  searchText: string;
  filterConfig: IHeaderFilterConfig;
  actionConfiguration: IHeaderAction[];
  featureRestrictionConfigMap?: Record<string, string>;
  featureRestrictionModuleName?: FeatureRestrictionModuleTypes;
  hideSearchBar?: boolean;
  onToggleActionChange?: (actionId: string) => void;
  quickFilterConfig?: IQuickFilterConfig;
}

export interface IPrimaryHeader {
  title: string;
  description: string;
  advancedSearchEnglish: string;
  modifiedByName: string;
  modifiedOn: string;
  autoRefreshTime: number;
  onTabDelete?: (deletedTabId: string) => Promise<boolean>;
  canHide?: boolean;
  tabInfoHTML?: string;
  customType?: string;
  customTitle?: () => JSX.Element;
  onRefreshComponent?: ({
    setIsCustomRefreshTriggered
  }: {
    setIsCustomRefreshTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  }) => JSX.Element;
}

export interface ITabHeader {
  primary: IPrimaryHeader;
  secondary: ISecondaryHeader;
}

export enum TabView {
  List = 'list',
  CalendarView = 'calendar'
}

export enum CalendarView {
  Day = 'day',
  Week = 'week',
  Month = 'month'
}

export interface ITabProcessConfig {
  leadTypeNameForProcess?: string;
}
export interface ITabConfig {
  id: string;
  type: TabType;
  recordCount: number;
  entityCode?: string;
  sharedBy?: string;
  tabSettings: ITabSettings;
  headerConfig: ITabHeader;
  gridConfig: IGridConfig;
  representationName: IEntityRepresentationName;
  tabView?: TabView;
  calendarView?: CalendarView;
  relatedEntityCode?: string;
  isEntityManage?: boolean;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
  handleCaching?: (tabData: ITabConfig) => void;
  processConfig?: ITabProcessConfig;
}

interface ITabData {
  [id: string]: ITabConfig;
}

export interface IRefreshConfig {
  skipAuto: boolean;
  timeStamp: number;
  isGridUpdated: boolean;
  restartTimer: boolean;
}

export interface ISmartViewTabStore {
  tabs: ITabData;
  activeTabId: string;
  isGridInitialized: boolean;
  refreshConfig: IRefreshConfig;
  gridOverlay: boolean;
}

export interface ILeadFields {
  Attribute: string;
  Value: string | null;
  Fields: ILeadFields[];
}
export interface ILeadGetResponse {
  Leads: { LeadPropertyList: ILeadFields[] }[];
  RecordCount: number;
}

export interface IAccountGetResponse {
  Accounts: { Properties: ILeadFields[] }[];
  Total: number;
}

export interface IActivityData {
  ProspectId: string;
  ActivityType: string;
  ActivityEvent: string;
  ProspectActivityId: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  P_OwnerId: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  P_OwnerIdName: string;
  ProspectActivityAutoId: string;
  [key: string]: string | number | boolean | null;
}

export interface IActivityGetResponse {
  ActivityList: IActivityData[];
  RecordCount: number;
}

interface ITaskList {
  UserTaskId: string;
  TaskTypeId: string;
  [key: string]: string | number | null;
}

export interface ITaskGetResponse {
  TaskList: ITaskList[];
  RecordCount: number;
}

export enum FilterType {
  Dropdown = 'Dropdown',
  Date = 'Date'
}

export interface IResponseDateFilter {
  label: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  start_date: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  end_date: string;
}

export interface IResponseFilterConfig {
  [schemaName: string]: {
    selectedValue: IOption[] | IResponseDateFilter;
    value: string;
    label: string;
    filterType: FilterType;
    entityType: ConditionEntityType;
    filterOperator: ConditionOperator;
    filterOperatorType: ConditionOperatorType;
    isPinned?: boolean;
  };
}

export interface ISystemTabConfig {
  columns: string;
}
export interface IMarvinData {
  Marvin?: {
    AdvancedSearchText: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    AdvancedSearchText_English: string;
    Columns: string[];
    Exists: boolean;
    SearchText: string;
    SearchSortedOn: string;
    RowHeightSelected?: string;
    FilterValues: IResponseFilterConfig;
    tabColumnsWidth?: Record<string, number>;
    EntityCode?: string;
    ActiveCalendarView?: string;
    ActiveTaskView?: string;
    quickFilter?: IQuickFilterResponse;
    ManageTasksTaskTypeColumn?: Record<string, string[] | undefined>;
    SystemTabConfig?: ISystemTabConfig;
    prevFilter?: IFilter;
    isStarredList?: boolean;
    listId?: string;
    ShowHidden?: boolean;
    isManageEntityAdvancedSearchApplied?: boolean;
    columnConfigMap?: IColumnConfigMap;
  };
}

export interface IBulkAction {
  action: IMenuItem;
  selectedRows: Record<string, unknown>;
}

export interface IBulkLeadDeleteResponse {
  RefrencedLeadIds?: string[];
  SuccessCount: number;
  FailureCount: number;
  ErrorMessage?: string;
}

export interface IGetGridConfig {
  tabData: ITabResponse;
  customFilters: string | IAccountCustomFilters[];
  customDateFilters?: string;
  userPermissions: IUserPermission;
  disableSelection?: boolean;
  entityMetadata?: Record<string, IAugmentedSmartViewEntityMetadata>;
  selectedColumns?: string[];
  representationName?: IEntityRepresentationName;
  filterMap?: IFilterConfig;
  commonTabSettings?: ICommonTabSettings;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
  featureRestrictionData?: IGetIsFeatureRestriction | null;
  isManageListRestricted?: boolean;
}

export interface IExportLeadConfig {
  SchemaNames: string[];
  Configs: IConfigs;
}

export interface IConfigs {
  MaxAllowedLeadColumns: string;
  MaxLeadsToExport: string;
}

export interface ITaskFieldConfig {
  LeadFields: ILeadAttribute[];
  TaskExportLimit: string;
  TaskFields: ITaskAttribute[];
  MaxTasksToExport: number;
}

export interface IExportActivityConfig {
  ActivitySchemaNames: string[];
  LeadSchemaNames: string[];
  MaxActivitiesToExport: number;
}

export enum RestrictExportForEntity {
  Disable = 'Disable',
  Remove = 'Remove'
}

export interface IAccountFiltersGeneration {
  customFilters: IAccountCustomFilters[];
  customDateFilters: IAdvancedSearch;
}

export interface ISetFetchCriteriaAndRouteForManageLead {
  tabId: string;
  isStarredList: boolean;
  listId: string;
  route: string;
  advancedSearch: string;
  quickFilter: IQuickFilterResponse;
  starredLeadFilters?: IFilter;
}

export interface IListsGetResponse {
  SimplifiedSQLDefinition: null;
  WildCardLimitExceeded: boolean;
  LeadType: null;
  ID: string;
  Name: string;
  Description: string;
  Definition: string;
  MemberCount: number;
  EntityName: string;
  OwnerID: string;
  CreatedBy: string;
  CreatedOn: string;
  ModifiedBy: string;
  ModifiedOn: string;
  OwnerIdName: string;
  CreatedByName: string;
  ModifiedByName: string;
  Total: number;
  InternalName: string;
  ListType: ListType;
  ScheduleEmailCount: number;
  disableRowSelection?: boolean;
}
