import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { PanelOrientation, TabType } from './constants/constants';
import { IEntityRepresentationName } from '../entity-details/types/entity-data.types';
import { EntityType } from 'common/types';

interface IMaxAllowedTabs {
  [role: string]: number;
}

interface IAutoRefreshConfig {
  ActiveTabContentAutoRefreshInterval: number;
  TabAutoRefreshInterval: number;
}

interface ICommonTabSettingRowAction {
  quickActions?: string;
  allowedActions?: string;
}
export interface ICommonTabSettings {
  maxAllowedTabs: number;
  maxFiltersAllowed?: Record<EntityType, number>;
  isCustomTabTypeEnabled?: boolean;
  showCount?: boolean;
  disableSelection?: boolean;
  autoRefreshConfiguration?: IAutoRefreshConfig;
  hidePrimaryHeader?: boolean;
  hideSearchBar?: boolean;
  rowActions?: ICommonTabSettingRowAction;
  isLeadTypeEnabled?: boolean;
  isLeadTypeEnabledGlobally?: boolean;
}

export enum ListType {
  ALL = -1,
  STATIC = 0,
  DYNAMIC = 1,
  REFRESHABLE = 2
}

export const LIST_TYPE_MAPPING: Record<ListType, string> = {
  [ListType.ALL]: 'All',
  [ListType.STATIC]: 'Static',
  [ListType.DYNAMIC]: 'Dynamic',
  [ListType.REFRESHABLE]: 'Refreshable'
};

export enum CreateListMode {
  Add = 'Add',
  Edit = 'Edit',
  Empty = 'Empty',
  AddMore = 'AddMore'
}

export interface IEditListConfig {
  listType: string;
  listID?: string;
  listName?: string;
}

interface IPanelSettings {
  options: IMenuItem[];
}

export interface ITabInfo {
  id: string;
  title: string;
  type: TabType;
  primaryColor: string;
  isHidden: boolean;
  count: number;
}

export interface IPanel {
  orientation: PanelOrientation;
  title: string;
  panelSettings: IPanelSettings;
}

// Root SV interface
export interface ISmartViews {
  smartViewId: string;
  panel: IPanel | null;
  commonTabSettings: ICommonTabSettings | null;
  allTabIds: string[];
  manageTabsIds: string[];
  rawTabData: Record<string, ITabResponse>;
  activeTabId: string;
  leadRepresentationName: IEntityRepresentationName;
}

export interface ILeadTypeConfiguration {
  LeadTypeName: string;
  LeadTypeInternalName: string;
  LeadTypeId: string;
  LeadTypePluralName: string;
}

// Below interfaces represents data received from API
export interface IFetchCriteria {
  AdvancedSearchText: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  AdvancedSearchText_English: string;
  FilterOnlyCondition: string;
  Filters: string;
  DefaultFilters: string;
  SelectedFilters: string;
  DefaultSelectedFilters: string;
  SelectedColumns: string;
  SortedOn: string;
  PageSize: string;
  ShowFiltersForMobileUsers: boolean;
  AdditionalData: string;
  DontAddDefaultFiltersByDefault: boolean;
  SelectedLeadFilters: string;
  IsOpportunityNameColumnRemoved?: boolean;
  LeadTypeConfiguration?: string;
  ListType?: ListType;
  ShowHidden?: boolean;
  CreatedBy?: string;
  SortedBy?: number;
}

export interface ISvActionConfig {
  HiddenActions?: string;
  QuickActions?: string;
}

interface ITabContentConfiguration {
  FetchCriteria: IFetchCriteria;
  Actions?: ISvActionConfig;
}

export interface IEntityTypeConfiguration {
  MaxAllowedFilters: number;
}

export interface IResponseFilterConfig {
  Lead: IEntityTypeConfiguration;
  Activity: IEntityTypeConfiguration;
  Task: IEntityTypeConfiguration;
  Account: IEntityTypeConfiguration;
  Opportunity: IEntityTypeConfiguration;
}

export interface ITabResponse {
  Id: string;
  Type: TabType;
  IsEnabled: boolean;
  TabConfiguration: {
    Title: string;
    Description: string;
    Position: number;
    IsDefault: boolean;
    IsHidden: boolean;
    CanDelete: boolean;
    CanHide: boolean;
    PrimaryColor: string;
    SecondaryColor: string;
    CanEdit: boolean;
    CustomType?: string;
    CustomTypeInfo?: string;
    IsMarvinTab: boolean;
  };
  TabContentConfiguration: ITabContentConfiguration;
  RestrictedRoles: string[];
  CreatedBy: string;
  CreatedByName: string;
  CreatedOn: string;
  ModifiedBy: string;
  ModifiedByName: string;
  ModifiedOn: string;
  Count: number;
  IsSubscribedForEmail: boolean;
  SharedBy: string;
  IsSystemTab: boolean;
  HideGridFilters: boolean;
  EntityCode: string;
  entityManage?: boolean;
}

export interface ITabMetaDataResponse {
  Tabs: ITabResponse[];
  Configuration: {
    AutoRefreshConfiguration: IAutoRefreshConfig;
    FilterCustomizationConfiguration: IResponseFilterConfig;
    MaxAllowedTabs: IMaxAllowedTabs;
    IsCustomTabTypeEnabled: boolean;
  };
  Id: string;
  ShowCount: boolean;
}

export interface IUserPermission {
  update?: boolean;
  bulkUpdate?: boolean;
  delete?: boolean;
  bulkDelete?: boolean;
  import?: boolean;
  createActivity?: boolean;
  create?: boolean;
  MarkComplete?: boolean;
  leadUpdate?: boolean;
  leadDelete?: boolean;
  bulkCreateActivity?: boolean;
}

export interface IGetIsFeatureRestriction {
  isFeatureRestrictedForSorting: boolean;
  isFeatureRestrictedForRowActions: boolean;
  isFeatureRestrictedForBulkActions: boolean;
  isManageLeadsViewRestricted: boolean;
  isManageTasksViewRestricted: boolean;
}

export interface ISVEndExperience {
  tabId: string;
  tabType: string;
  recordCount: number;
  fetchCriteria: unknown;
}
