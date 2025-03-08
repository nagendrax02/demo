import { trackError } from 'common/utils/experience/utils/track-error';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { CallerSource, Module, httpGet, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { safeParseJson } from 'common/utils/helpers';
import { IResponseFilterConfig, ITabConfig, TabView } from '../smartview-tab/smartview-tab.types';
import { generateFiltersCache } from '../../utils/utils';
import { RowHeightType } from '../../constants/constants';
import {
  CacheKeyMap,
  OBJECT_TYPE_ENABLED_MANAGE_ENTITY,
  TABS_CACHE_KEYS,
  TASK_VIEW_IN_CACHE
} from './constants';
import { ANY_OPPORTUNITY } from './lead-opportunity-tab/constants';
import {
  ICommonTabSettings,
  ITabResponse,
  LIST_TYPE_MAPPING,
  ListType
} from '../../smartviews.types';
import { EntityType } from 'common/types';
import { HTTP_HEADERS } from 'common/utils/rest-client/constant';
import { IQuickFilterResponse } from '../smartview-tab/components/header/search-filter/quick-filter/quick-filter.types';
import { getLeadTypeInternalNameFromUrl } from '../../augment-tab-data/common-utilities/utils';
import {
  fetchLeadTypeConfig,
  isLeadTypeEnabled as getIsLeadTypeEnabled,
  isLeadTypeSupportedInManageEntity
} from 'common/utils/lead-type/settings';
import { MANAGE_ENTITY_LEAD_TYPE } from '../../augment-tab-data/common-utilities/constant';
import { ILeadTypeConfig } from 'common/utils/lead-type/lead-type.types';
import { BadgeStatus } from '@lsq/nextgen-preact/v2/badge/badge.types';

export interface ICacheConfig {
  leadOpportunityType: { [key: string]: string };
  filters: IResponseFilterConfig;
  searchText: string;
  rowHeight: RowHeightType;
  selectedColumns?: string[];
  selectedFilters?: string[];
  sortedOn: string;
  tabWidthConfig?: Record<string, number>;
  defaultValues: { defaultFilters: string[]; defaultColumns: string[] };
  AdvancedSearchText?: string | undefined;
  AdvancedSearchTextEnglish?: string | undefined;
  opportunityType?: string;
  activeTaskView?: string;
  quickFilter?: IQuickFilterResponse;
  pageSize?: number;
}

type ITabCache = ICacheConfig | Record<string, ICacheConfig>;

const CALLER_SOURCE_MAP = {
  [TABS_CACHE_KEYS.MANAGE_LEADS_TAB]: CallerSource.ManageLeads,
  [TABS_CACHE_KEYS.MANAGE_TASKS_TAB]: CallerSource.ManageTasks,
  [TABS_CACHE_KEYS.MANAGE_LISTS_TAB]: CallerSource.ManageLists,
  [TABS_CACHE_KEYS.MANAGE_ACTIVITIES]: CallerSource.ManageActivities,
  [TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY]: CallerSource.ListDetails
};

export const fetchTabData = async (
  cacheKey: string,
  callerSource: CallerSource
): Promise<ITabCache> => {
  const tabs: Record<string, ITabCache> = getItem(StorageKey.CustomSmartViewTabs) ?? {};
  if (tabs[cacheKey]) {
    return tabs[cacheKey];
  } else {
    try {
      const response = await httpGet({
        path: `${API_ROUTES.cacheGet}${cacheKey}`,
        module: Module.Cache,
        callerSource
      });
      tabs[cacheKey] = safeParseJson(response as string) as ITabCache;
      setItem(StorageKey.CustomSmartViewTabs, tabs);
      return tabs[cacheKey];
    } catch (err) {
      trackError(err);
    }
    return {};
  }
};

const getCachedDataFromLS = (tabData: ITabConfig): ICacheConfig => {
  const tabs = getItem(StorageKey.CustomSmartViewTabs) ?? {};
  if (tabData?.id === TABS_CACHE_KEYS.LEAD_OPPORTUNITY_TAB) {
    return (tabs[tabData.id]?.[tabData?.entityCode || ANY_OPPORTUNITY] as ICacheConfig) ?? {};
  }
  return (tabs[tabData.id] as ICacheConfig) ?? {};
};

const setCachedDataToLS = (
  tabData: ITabConfig,
  dataToCache: ICacheConfig
): Record<string, ITabCache> => {
  const tabs = (getItem(StorageKey.CustomSmartViewTabs) as Record<string, ITabCache>) ?? {};
  if (tabData?.id === TABS_CACHE_KEYS.LEAD_OPPORTUNITY_TAB) {
    if (!tabs[tabData.id]) {
      tabs[tabData.id] = {};
    }
    tabs[tabData.id].opportunityType = tabData?.entityCode;
    tabs[tabData.id][tabData?.entityCode || ANY_OPPORTUNITY] = dataToCache;
  } else {
    tabs[tabData.id] = dataToCache;
  }
  setItem(StorageKey.CustomSmartViewTabs, tabs);
  return tabs;
};

const getSortOrder = (order: number): string => (order === 0 ? 'asc' : 'desc');

export const postTabData = (tabData: ITabConfig, callerSource: CallerSource): void => {
  let cacheData = getCachedDataFromLS(tabData);

  const {
    gridConfig: { fetchCriteria },
    headerConfig: { secondary }
  } = tabData;
  const sortedOn = `${fetchCriteria?.SortBy === 2 ? '' : fetchCriteria?.SortOn}-${getSortOrder(
    fetchCriteria?.SortBy
  )}`;

  cacheData = {
    ...cacheData,
    selectedColumns: fetchCriteria.Columns?.split(','),
    searchText: fetchCriteria.SearchText,
    selectedFilters: secondary.filterConfig?.filters?.selectedFilters,
    filters: generateFiltersCache(tabData),
    tabWidthConfig: tabData.gridConfig.tabColumnsWidth,
    rowHeight: tabData.gridConfig.rowHeight,
    sortedOn,
    activeTaskView:
      tabData?.tabView === TabView.CalendarView
        ? TASK_VIEW_IN_CACHE.CALENDAR
        : TASK_VIEW_IN_CACHE.LIST,
    AdvancedSearchText: fetchCriteria?.AdvancedSearch,
    quickFilter: secondary?.quickFilterConfig?.quickFilter,
    pageSize: fetchCriteria?.PageSize
  };
  const tabs = setCachedDataToLS(tabData, cacheData);
  httpPost({
    path: API_ROUTES.cachePost,
    module: Module.Cache,
    callerSource,
    body: {
      key: tabData.id,
      Value: JSON.stringify(tabs[tabData?.id]) || false,
      ExpiryType: 3,
      ExpireIn: 31
    }
  });
};

export const getDefaultFilters = (defaultFilters: string[]): IResponseFilterConfig => {
  return defaultFilters.reduce((acc, curr) => {
    acc[curr] = {};
    return acc;
  }, {});
};

export const getCommonTabSetting = (commonTabSettings: ICommonTabSettings): ICommonTabSettings => {
  if (!commonTabSettings?.maxAllowedTabs) {
    return {
      maxAllowedTabs: 0,
      showCount: true,
      autoRefreshConfiguration: {
        ActiveTabContentAutoRefreshInterval: NaN,
        TabAutoRefreshInterval: NaN
      },
      maxFiltersAllowed: {
        [EntityType.Lead]: 30,
        [EntityType.Activity]: 30,
        [EntityType.Task]: 30,
        [EntityType.Account]: 30,
        [EntityType.Opportunity]: 30,
        [EntityType.AccountActivity]: 30,
        [EntityType.Lists]: 30,
        [EntityType.Ticket]: 30
      }
    };
  }
  return commonTabSettings;
};

const getLeadTypeConfigForManageEntity = async (
  callerSource: CallerSource
): Promise<Record<string, ILeadTypeConfig> | null> => {
  try {
    const [isLeadTypeEnabled, leadTypeConfig] = await Promise.all([
      getIsLeadTypeEnabled(callerSource),
      fetchLeadTypeConfig(callerSource)
    ]);

    if (isLeadTypeEnabled && leadTypeConfig) {
      return leadTypeConfig;
    }
  } catch (error) {
    trackError(error);
  }
  return null;
};

const updateUrlSearchParams = (key: string, value: string): void => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
  } catch (error) {
    trackError(error);
  }
};

const getLeadTypeInternalName = async (callerSource: CallerSource): Promise<string | null> => {
  /*
    if lead type is enabled
      1. return lead type internal name from url when it is valid lead type        
      2. if lead type not present in url or it is invalid  then return default lead type internal name and update the url search params
    
  */

  const leadTypeConfig = await getLeadTypeConfigForManageEntity(callerSource);

  if (!leadTypeConfig) return null;

  const leadTypeInternalNameFromUrl = getLeadTypeInternalNameFromUrl();

  if (leadTypeInternalNameFromUrl && leadTypeConfig?.[leadTypeInternalNameFromUrl]) {
    return leadTypeInternalNameFromUrl;
  }

  const defaultLeadTypeInternalName =
    Object.values(leadTypeConfig)?.find((config) => config?.IsDefault)?.InternalName ?? null;

  if (defaultLeadTypeInternalName) {
    updateUrlSearchParams(MANAGE_ENTITY_LEAD_TYPE, defaultLeadTypeInternalName);
    return defaultLeadTypeInternalName;
  }

  return null;
};

const getCacheKeyWithSuffix = (cacheKey: string, keySuffix: string): string => {
  return `${cacheKey}_${keySuffix}`;
};
export const getManageEntityCacheKey = async (
  defaultCacheKey: string,
  callerSource: CallerSource
): Promise<string> => {
  if (!isLeadTypeSupportedInManageEntity()) return defaultCacheKey;

  const leadTypeInternalName = OBJECT_TYPE_ENABLED_MANAGE_ENTITY[defaultCacheKey]
    ? await getLeadTypeInternalName(callerSource)
    : null;
  return defaultCacheKey + (leadTypeInternalName ? `-${leadTypeInternalName}` : '');
};

export const postManageTabCache = async (
  tabData: ITabResponse,
  keySuffix?: string
): Promise<void> => {
  try {
    const callerSource = CALLER_SOURCE_MAP[tabData?.Id];
    let cacheKey = CacheKeyMap[tabData.Id];
    if (keySuffix) cacheKey = getCacheKeyWithSuffix(cacheKey, keySuffix);
    const key = await getManageEntityCacheKey(cacheKey, callerSource);

    httpPost({
      path: API_ROUTES.cachePost,
      module: Module.Cache,
      callerSource,
      body: {
        key,
        Value: JSON.stringify(tabData),
        ExpiryType: 3,
        ExpireIn: 365
      }
    });
  } catch (error) {
    trackError(error);
  }
};

export const getManageTabCache = async (
  tabId: string,
  keySuffix?: string
): Promise<ITabResponse | null> => {
  try {
    const callerSource = CALLER_SOURCE_MAP[tabId];
    let cacheKey = CacheKeyMap[tabId];
    if (keySuffix) cacheKey = getCacheKeyWithSuffix(cacheKey, keySuffix);
    const key = await getManageEntityCacheKey(cacheKey, callerSource);

    const response = (await httpGet({
      path: `${API_ROUTES.cacheGet}${key}`,
      module: Module.Cache,
      callerSource,
      requestConfig: { headers: { [HTTP_HEADERS.cacheControl]: 'no-cache' } }
    })) as string;
    return safeParseJson(response) as ITabResponse;
  } catch (error) {
    trackError(error);
    return null;
  }
};

export const getScheduledEmailCount = async ({
  listIds,
  callerSource
}: {
  listIds: string[];
  callerSource: CallerSource;
}): Promise<Record<string, number>> => {
  try {
    return await httpPost({
      path: API_ROUTES.smartviews.scheduleEmailCount,
      module: Module.Marvin,
      callerSource: callerSource,
      body: listIds
    });
  } catch (error) {
    trackError(error);
  }
  return {};
};

export const getBadgeStateMap = (type: string): BadgeStatus => {
  const listTypeMap: Record<string, BadgeStatus> = {
    [LIST_TYPE_MAPPING[ListType.STATIC]]: 'neutral',
    [LIST_TYPE_MAPPING[ListType.DYNAMIC]]: 'basic',
    [LIST_TYPE_MAPPING[ListType.REFRESHABLE]]: 'basic'
  };
  return listTypeMap[type];
};
