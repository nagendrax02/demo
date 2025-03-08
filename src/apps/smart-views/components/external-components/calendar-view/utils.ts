import { trackError } from 'common/utils/experience/utils/track-error';
import { EventMessage } from 'common/utils/marvin-helper/constants';
import {
  IFilterConfig,
  IFilterData,
  IOnFilterChange,
  ITabConfig,
  ITabProcessConfig
} from '../../smartview-tab/smartview-tab.types';
import { SCHEMA_NAMES, TabType } from 'apps/smart-views/constants/constants';
import {
  CALENDAR_VIEW_MAP_CACHE_REVERSE,
  TASK_SCHEMA_NAME
} from 'apps/smart-views/augment-tab-data/task/constants';
import {
  getFilterDataForSchema,
  getTabData,
  setCustomFilters,
  setFilterDataForSchema,
  setRecordCount
} from '../../smartview-tab/smartview-tab.store';
import { IReceivedMessage } from './calendar-view.types';
import { getCommonTabSettings, updateSmartViewsTab } from 'apps/smart-views/smartviews-store';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { TABS_CACHE_KEYS } from '../../custom-tabs/constants';
import { openEntityDetailsPage } from 'common/utils/helpers/helpers';
import { EntityType } from 'common/types';
import { getLeadTypeCondition } from '../../smartview-tab/utils';

interface IGenerateCalendarViewPayload {
  tabDetails: {
    currentTab: string;
    smartviewId: string;
    entityCode: string;
    entityManage?: boolean;
    processConfig?: ITabProcessConfig;
  };
  tabType: TabType;
  fetchCriteria: {
    advancedSearch: string;
    filterValues: IFilterConfig;
    searchtext: string;
    isLeadTypeEnabledGlobally: boolean;
  };
}

export const generateInitCalendarViewPayload = (config: {
  tabData: ITabConfig;
  smartviewId: string;
}): IGenerateCalendarViewPayload => {
  const { tabData, smartviewId } = config;
  const fetchCriteria = tabData?.gridConfig?.fetchCriteria;
  const fetchCriteriaToSend = {
    advancedSearch: fetchCriteria?.AdvancedSearch,
    filterValues: tabData?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName,
    searchtext: fetchCriteria?.SearchText,
    timeFrame: CALENDAR_VIEW_MAP_CACHE_REVERSE[tabData?.calendarView ?? ''] as string,
    leadTypeRowCondition: tabData?.leadTypeConfiguration?.length
      ? getLeadTypeCondition(tabData?.leadTypeConfiguration)
      : undefined,
    isLeadTypeEnabledGlobally: getCommonTabSettings()?.isLeadTypeEnabledGlobally ?? false
  };

  return {
    tabDetails: {
      currentTab: tabData?.id,
      smartviewId,
      entityCode: tabData?.entityCode || '',
      entityManage: tabData?.id === TABS_CACHE_KEYS.MANAGE_TASKS_TAB,
      processConfig: tabData?.processConfig
    },
    tabType: tabData?.type,
    fetchCriteria: fetchCriteriaToSend
  };
};

const getFilterValues = (tabData: ITabConfig): IFilterConfig => {
  const filters = { ...tabData?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName };
  delete filters[TASK_SCHEMA_NAME.SCHEDULE];
  return filters;
};

export const generateSendMessage = (tabData: ITabConfig): string => {
  const fetchCriteria = tabData?.gridConfig?.fetchCriteria;
  const payload = {
    advancedSearch: fetchCriteria?.AdvancedSearch,
    filterValues: getFilterValues(tabData),
    searchtext: fetchCriteria?.SearchText,
    timeFrame: CALENDAR_VIEW_MAP_CACHE_REVERSE[tabData?.calendarView ?? ''] as string,
    leadTypeRowCondition: tabData.leadTypeConfiguration?.length
      ? getLeadTypeCondition(tabData.leadTypeConfiguration)
      : undefined,
    isLeadTypeEnabledGlobally: getCommonTabSettings()?.isLeadTypeEnabledGlobally ?? false
  };

  const message = {
    type: EventMessage.Type.CalendarUpdate,
    message: payload
  };

  return JSON.stringify(message);
};

export const handleSetOwnerFilter = (tabData: ITabConfig, data: IReceivedMessage): void => {
  let filterData = {
    ...getFilterDataForSchema(tabData?.id, SCHEMA_NAMES.OWNER_ID),
    ...(data?.message || {})
  };
  if (!((data?.message as IOnFilterChange)?.selectedValue as IOption[])?.length) {
    filterData = {
      ...filterData,
      selectedValue: [{ label: '', value: getPersistedAuthConfig()?.User?.Id || '' }],
      value: getPersistedAuthConfig()?.User?.Id || ''
    };
  }

  setFilterDataForSchema(tabData?.id, filterData as IFilterData, SCHEMA_NAMES.OWNER_ID);
  setCustomFilters(tabData?.id);
  updateSmartViewsTab(tabData?.id, getTabData(tabData?.id));
};

export const handleSetRecordCount = (tabData: ITabConfig, data: IReceivedMessage): void => {
  setRecordCount(tabData?.id, data?.message as number);
};

export const getBooleanValue = (value: string): boolean => {
  return value === 'true' ? true : false;
};

export const handleOpenEntityDetails = (data: IReceivedMessage): void => {
  try {
    const message = data?.message as { entityType: string; id: string; eventCode: string };
    const entityType = message?.entityType?.toLowerCase() as EntityType;
    openEntityDetailsPage({ entityType, id: message?.id, eventCode: message?.eventCode });
  } catch (error) {
    trackError(error);
  }
};
