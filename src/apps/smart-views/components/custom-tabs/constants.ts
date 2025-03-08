import { TabType } from '../../constants/constants';
import { ITabResponse } from '../../smartviews.types';

export const TABS_CACHE_KEYS = {
  LEADS_CACHE_KEY: 'entity-leads-tab',
  LIST_LEAD_CACHE_KEY: 'list-leads-tab',
  RELATED_LEADS_CACHE_KEY: 'related-leads-tab',
  SEARCH_RESULTS_CACHE_KEY: 'search-results-tab',
  SALES_ACTIVITY_TAB: 'sales-activity-tab',
  MANAGE_LEADS_TAB: 'manage-leads',
  LEAD_OPPORTUNITY_TAB: 'lead-opportunity-tab',
  MANAGE_TASKS_TAB: 'manage-tasks', // it will be dynamic cache key for lead type =>  manage-tasks-LeadTypeInternalName
  MANAGE_ACTIVITIES: 'manage-activities',
  MANAGE_LISTS_TAB: 'manage-lists'
};

export const commonTabData: ITabResponse = {
  Type: 0 as TabType,
  IsEnabled: false,
  RestrictedRoles: [],
  SharedBy: '',
  TabConfiguration: {
    Title: '',
    Description: '',
    Position: 1,
    IsDefault: false,
    IsHidden: false,
    CanDelete: false,
    CanHide: false,
    IsMarvinTab: false,
    PrimaryColor: 'rgb(var(--marvin-primary))',
    SecondaryColor: '',
    CanEdit: false
  },
  TabContentConfiguration: {
    FetchCriteria: {
      Filters: '',
      DefaultFilters: '',
      AdvancedSearchText: '',
      ['AdvancedSearchText_English']: '',
      FilterOnlyCondition: '',
      DefaultSelectedFilters: '',
      SelectedLeadFilters: '',
      AdditionalData: '',
      DontAddDefaultFiltersByDefault: false,
      SelectedFilters: '',
      SelectedColumns: '',
      SortedOn: '',
      PageSize: '25',
      ShowFiltersForMobileUsers: false
    }
  },
  CreatedBy: '0',
  CreatedByName: '',
  CreatedOn: '',
  ModifiedBy: '',
  ModifiedByName: '',
  ModifiedOn: '',
  Count: 0,
  IsSubscribedForEmail: false,
  IsSystemTab: false,
  HideGridFilters: false,
  EntityCode: '-1',
  Id: ''
};

export const TASK_VIEW_IN_CACHE = {
  CALENDAR: 'calendar',
  LIST: 'list'
};

export const CacheKeyMap = {
  [TABS_CACHE_KEYS.MANAGE_LEADS_TAB]: 'MANAGE_LEADS',
  [TABS_CACHE_KEYS.MANAGE_TASKS_TAB]: 'MANAGE_TASKS',
  [TABS_CACHE_KEYS.MANAGE_LISTS_TAB]: 'MANAGE_LISTS',
  [TABS_CACHE_KEYS.MANAGE_ACTIVITIES]: 'MANAGE_ACTIVITIES',
  [TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY]: 'list-leads-tab'
};

//Record<Cache-key: Boolean>
export const OBJECT_TYPE_ENABLED_MANAGE_ENTITY = {
  MANAGE_LEADS: true,
  MANAGE_TASKS: true,
  MANAGE_LISTS: true
};
