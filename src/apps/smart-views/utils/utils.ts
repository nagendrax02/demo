import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpGet, httpPost } from 'common/utils/rest-client';
import {
  IFetchCriteria,
  ISVEndExperience,
  ITabMetaDataResponse,
  ITabResponse
} from '../smartviews.types';
import { API_ROUTES, FIELD_SEPARATOR } from 'common/constants';
import {
  FilterType,
  IGridConfig,
  IMarvinData,
  IRecordType,
  IResponseFilterConfig,
  IRowActionConfig,
  ISystemTabConfig,
  ITabConfig,
  ITabHeader
} from '../components/smartview-tab/smartview-tab.types';
import { isMiP, safeParseJson, sleep } from 'common/utils/helpers';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import {
  IActionConfig,
  IActionMenuItem,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import {
  getCommonTabSettings,
  getDefaultTabId,
  setAllTabIds,
  setDefaultTabId
} from '../smartviews-store';
import {
  getUpdatedDefaultTab,
  saveDefaultTab,
  saveDeletedTabs
} from '../components/panel/components/manage-tabs/utils';
import {
  ACCOUNT_SCHEMA_PREFIX,
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  PanelOrientation,
  SCHEMA_NAMES,
  TABS_DEFAULT_ID,
  TabType,
  entityDetailsTabs,
  entityTypeMap,
  leadSchemaNamePrefix,
  tabsNotToCache
} from '../constants/constants';
import { IWorkAreaConfig } from 'common/utils/process/process.types';
import { ACTION } from 'apps/entity-details/constants';
import {
  getTabData,
  refreshGrid,
  skipAutoRefresh
} from '../components/smartview-tab/smartview-tab.store';
import {
  CALENDAR_VIEW_MAP_CACHE_REVERSE,
  TAB_VIEW_MAP_REVERSE
} from '../augment-tab-data/task/constants';
import { workAreaIds } from 'common/utils/process';
import { HTTP_HEADERS } from 'common/utils/rest-client/constant';
import { getExperienceKey, getNavigationTimings } from 'common/utils/experience/utils/utils';
import {
  endExperience,
  endExperienceEvent,
  startExperience,
  startExperienceEvent
} from 'common/utils/experience';
import { ExperienceType, SmartViewsEvents } from 'common/utils/experience/experience-modules';
import {
  augmentForQuickActions,
  getEntityRowActions,
  getNormalizedAdvancedSearch
} from '../augment-tab-data/common-utilities/utils';
import { TABS_CACHE_KEYS } from '../components/custom-tabs/constants';
import { getFromDB, setInDB, StorageKey } from 'common/utils/storage-manager';
import { IQuickFilterResponse } from '../components/smartview-tab/components/header/search-filter/quick-filter/quick-filter.types';
import { isQuickFilterEnabled } from '../components/smartview-tab/components/header/search-filter/utils';
import { logModuleUsage } from 'common/utils/experience/utils/log-module-usage';
import { DEFAULT_COLUMNS as DEFAULT_LIST_COLUMNS } from '../components/custom-tabs/manage-lists/constants';
import { PERMISSION_ERROR_MSG } from 'common/utils/permission-manager/constant';

const OPTED_OUT = '1';

const isSendEmailActionDisabled = (record: IRecordType): boolean => {
  if (record?.TaskTypeId) {
    return record?.P_DoNotEmail === OPTED_OUT || !record?.P_EmailAddress;
  }
  return record?.DoNotEmail === OPTED_OUT || !record?.EmailAddress;
};

const isCallActionDisabled = (record: IRecordType): boolean => {
  if (record?.TaskTypeId) {
    return record?.P_DoNotCall === OPTED_OUT || !record?.P_Phone;
  }
  return record?.DoNotCall === OPTED_OUT || !record?.Phone;
};

const isLeadActionDisabled = (lead: IRecordType, leadPermission: boolean): boolean => {
  return lead?.CanUpdate === 'false' || leadPermission;
};

const isSmartviewTab = (tabId: string): boolean => {
  return !tabsNotToCache[tabId.split('_')?.[0] || ''];
};
const isEntityDetailTab = (tabId: string): boolean => {
  return entityDetailsTabs.includes(tabId);
};

const isManageTab = (activeTab: string): boolean => {
  return [
    TABS_CACHE_KEYS.MANAGE_LEADS_TAB,
    TABS_CACHE_KEYS.MANAGE_TASKS_TAB,
    TABS_CACHE_KEYS.MANAGE_ACTIVITIES,
    TABS_CACHE_KEYS.MANAGE_LISTS_TAB
  ].includes(activeTab);
};

const isDetailsPage = (tabId: string): boolean => {
  return tabId === TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY;
};

const isManageListTab = (activeTab: string): boolean => {
  return activeTab === TABS_CACHE_KEYS.MANAGE_LISTS_TAB;
};

const isManageEntityAdvSearchEnabled = (activeTab: string): boolean => {
  return [TABS_CACHE_KEYS.MANAGE_ACTIVITIES].includes(activeTab);
};

const startSVExpEvent = (eventName: string, tabId: string): void => {
  //Tab id requires in SV Load experience
  const experienceConfig = getExperienceKey();
  startExperienceEvent({
    module: experienceConfig.module,
    experience: ExperienceType.SVTabSwitch,
    event: eventName,
    key: tabId || experienceConfig?.key,
    relatedExperience: {
      experience: ExperienceType.Load,
      module: experienceConfig.module,
      key: experienceConfig.key
    }
  });
};

const endSVExpEvent = (eventName: string, tabId: string, hasException?: boolean): void => {
  const experienceConfig = getExperienceKey();
  //Tab id requires in SV Load experience
  endExperienceEvent({
    module: experienceConfig.module,
    experience: ExperienceType.SVTabSwitch,
    event: eventName,
    key: tabId || experienceConfig?.key,
    relatedExperience: {
      experience: ExperienceType.Load,
      module: experienceConfig.module,
      key: experienceConfig.key
    },
    hasException
  });
};

const endSVLoadExperience = ({
  fetchCriteria,
  recordCount,
  tabId,
  tabType
}: ISVEndExperience): void => {
  const experienceConfig = getExperienceKey();
  endExperience({
    experience: ExperienceType.Load,
    key: experienceConfig.key,
    module: experienceConfig.module,
    startTime: isMiP() ? getNavigationTimings()?.responseEnd : undefined,
    logServerResponseTime: true,
    additionalData: { tabId, tabType, recordCount, fetchCriteria }
  });
  // endLoadExperience(ExperienceModule.SmartViews);
};

const startSVTabLoadExperience = (tabId: string): void => {
  const experienceConfig = getExperienceKey();
  startExperience({
    module: experienceConfig.module,
    experience: ExperienceType.SVTabSwitch,
    key: tabId,
    relatedExperience: {
      experience: ExperienceType.Load,
      module: experienceConfig.module,
      key: experienceConfig.key
    }
  });
};

const endSVTabLoadExperience = ({
  fetchCriteria,
  recordCount,
  tabId,
  tabType
}: ISVEndExperience): void => {
  const experienceConfig = getExperienceKey();
  endExperience({
    experience: ExperienceType.SVTabSwitch,
    key: tabId,
    module: experienceConfig.module,
    relatedExperience: {
      experience: ExperienceType.Load,
      module: experienceConfig.module,
      key: experienceConfig.key
    },
    additionalData: { tabId, tabType, recordCount, fetchCriteria }
  });
};

const endAllSvExperience = (tabData: ITabConfig): void => {
  const additionalConfig = {
    tabId: tabData?.id,
    tabType: entityTypeMap[tabData?.type],
    recordCount: tabData?.recordCount,
    fetchCriteria: tabData?.gridConfig?.fetchCriteria
  };
  endSVTabLoadExperience(additionalConfig);
  endSVLoadExperience(additionalConfig);
};

export const getTabMetaData = async (): Promise<ITabMetaDataResponse> => {
  startSVExpEvent(SmartViewsEvents.TabMetaDataApi, '');

  const cachedMetadata = (await getFromDB(StorageKey.SmartviewMetaData)) as ITabMetaDataResponse;
  if (cachedMetadata) {
    return cachedMetadata;
  }

  const url = API_ROUTES.smartviews.tabMetaData;
  const response = await httpGet({
    path: url,
    module: Module.SmartViews,
    callerSource: CallerSource.SmartViews,
    requestConfig: { headers: { [HTTP_HEADERS.cacheControl]: 'no-cache' } }
  });
  setInDB(StorageKey.SmartviewMetaData, response, true);

  endSVExpEvent(SmartViewsEvents.TabMetaDataApi, '');

  return response as ITabMetaDataResponse;
};

const getSortOrder = (order: number): string => (order === 0 ? 'asc' : 'desc');

export const generateFiltersCache = (tabData: ITabConfig): IResponseFilterConfig => {
  const filters = tabData?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName;
  const augmentedFilters = {};

  Object.keys(filters)?.forEach((schema) => {
    const filterData = filters?.[schema];
    const selectedValue = filterData?.selectedValue;

    const augmentedFilterData = {
      selectedValue: filterData?.selectedValue,
      value: filterData?.value,
      entityType:
        filterData?.entityType === ConditionEntityType.Opportunity
          ? ConditionEntityType.Activity
          : filterData?.entityType,
      filterOperator: filterData?.filterOperator,
      filterOperatorType: filterData?.filterOperatorType,
      filterType: FilterType.Dropdown,
      isPinned: filterData?.isPinned
    };
    augmentedFilters[schema] = augmentedFilterData;

    if (selectedValue && 'startDate' in selectedValue) {
      augmentedFilters[schema].selectedValue = {
        label: selectedValue?.label,
        value: selectedValue?.value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        start_date: selectedValue?.startDate,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        end_date: selectedValue?.endDate
      };
      augmentedFilters[schema].filterType = FilterType.Date;
    }
  });

  return augmentedFilters as IResponseFilterConfig;
};

const DEFAULT_COLUMNS = {
  CheckBoxColumn: 'CheckBoxColumn',
  ProspectID: 'ProspectID',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  P_Prospect: 'P_ProspectID'
};

interface IAugmentedSelectedColumns {
  selectedColumns: string;
  checkBoxSchemaName?: string;
  prospectIdSchemaName?: string;
  doNotAddDefaultSchemas?: boolean;
}

const augmentedSelectedColumns = ({
  selectedColumns,
  checkBoxSchemaName,
  prospectIdSchemaName,
  doNotAddDefaultSchemas
}: IAugmentedSelectedColumns): string => {
  const defaultCheckBoxColumn = checkBoxSchemaName || DEFAULT_COLUMNS.CheckBoxColumn;
  const defaultProspectId = prospectIdSchemaName || DEFAULT_COLUMNS.ProspectID;

  const defaultColumns = doNotAddDefaultSchemas
    ? defaultCheckBoxColumn
    : `${defaultCheckBoxColumn},${defaultProspectId}`;

  if (!selectedColumns?.length) {
    return defaultColumns;
  }

  const augmentSelectedColumns = selectedColumns
    ?.replace(defaultCheckBoxColumn, '')
    .replace(defaultProspectId, '')
    ?.replace(DEFAULT_COLUMNS.ProspectID, '');

  const selectedCols = doNotAddDefaultSchemas
    ? `${augmentSelectedColumns}`
    : `${augmentSelectedColumns},${defaultProspectId}`;

  const data = augmentSelectedColumns?.length
    ? `${defaultCheckBoxColumn},${selectedCols}`
        .split(',')
        ?.filter((item) => item?.length)
        ?.join(',')
    : defaultColumns;

  return data;
};

const generateSelectColumns = (selectedColumns: string, tabType: TabType): string => {
  switch (tabType) {
    case TabType.Lead:
      return augmentedSelectedColumns({ selectedColumns: selectedColumns });
    case TabType.Task:
    case TabType.Activity:
      return augmentedSelectedColumns({
        selectedColumns: selectedColumns,
        prospectIdSchemaName: DEFAULT_COLUMNS.P_Prospect
      });
    case TabType.AccountActivity:
      return augmentedSelectedColumns({
        selectedColumns: selectedColumns,
        doNotAddDefaultSchemas: true
      });
    case TabType.Lists:
      return DEFAULT_LIST_COLUMNS.join(',');
    default:
      return augmentedSelectedColumns({ selectedColumns: selectedColumns });
  }
};

const getCalendarView = (tabData: ITabConfig, oldMarvinData: IMarvinData): string => {
  return (
    (CALENDAR_VIEW_MAP_CACHE_REVERSE[tabData?.calendarView || ''] as string) ||
    oldMarvinData?.Marvin?.ActiveCalendarView ||
    ''
  );
};

const getTabView = (tabData: ITabConfig, oldMarvinData: IMarvinData): string => {
  return (
    (TAB_VIEW_MAP_REVERSE[tabData?.tabView || ''] as string) ||
    oldMarvinData?.Marvin?.ActiveTaskView ||
    ''
  );
};

const generateAdvSearchCache = (rawData: ITabResponse, tabData: ITabConfig): string => {
  const isSystemTab = !tabData?.tabSettings?.canEdit;
  const tabType = tabData?.type;

  if (isManageEntityAdvSearchEnabled(tabData.id)) {
    return tabData.gridConfig.fetchCriteria.AdvancedSearch;
  }

  if (isSystemTab && [TabType.Activity, TabType.Opportunity].includes(tabType)) {
    const parsedFilters = safeParseJson(
      rawData?.TabContentConfiguration?.FetchCriteria?.Filters
    ) as Record<string, string>;
    return (
      getNormalizedAdvancedSearch(
        parsedFilters?.AdvancedSearch,
        tabData?.entityCode || '',
        tabData?.type
      ) || ''
    );
  }

  return rawData?.TabContentConfiguration?.FetchCriteria?.AdvancedSearchText;
};

const generateAdvSearchEnglishCache = (rawData: ITabResponse, tabData: ITabConfig): string => {
  const isSystemTab = !tabData?.tabSettings?.canEdit;
  const tabType = tabData?.type;
  if (isSystemTab && [TabType.Activity, TabType.Opportunity].includes(tabType)) {
    const parsedFilters = safeParseJson(
      rawData?.TabContentConfiguration?.FetchCriteria?.Filters
    ) as Record<string, string>;
    return parsedFilters?.AdvancedSearchEnglish || '';
  }
  return tabData?.headerConfig?.primary?.advancedSearchEnglish;
};

interface IGenerateCacheData {
  rawData: ITabResponse;
  tabData: ITabConfig;
  oldMarvinData: IMarvinData;
  quickLeadFilterItem?: IQuickFilterResponse;
}

const getSystemTabConfigs = (rawData: ITabResponse): ISystemTabConfig => {
  const additionalData = safeParseJson(
    rawData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;

  return {
    columns:
      additionalData?.Marvin?.SystemTabConfig?.columns ||
      rawData?.TabContentConfiguration.FetchCriteria.SelectedColumns
  };
};

const generateCacheData = (props: IGenerateCacheData): IMarvinData => {
  const { rawData, tabData, oldMarvinData, quickLeadFilterItem } = props;
  const { gridConfig, headerConfig } = tabData || {};
  const sortBy = gridConfig?.fetchCriteria?.SortBy;
  return {
    Marvin: {
      Exists: true,
      SearchSortedOn: `${sortBy === 2 ? '' : gridConfig?.fetchCriteria?.SortOn}-${getSortOrder(
        sortBy
      )}`,
      RowHeightSelected: gridConfig?.rowHeight,
      SearchText: gridConfig?.fetchCriteria?.SearchText || '',
      tabColumnsWidth: gridConfig?.tabColumnsWidth,
      FilterValues: generateFiltersCache(tabData),
      AdvancedSearchText:
        quickLeadFilterItem?.Definition ?? generateAdvSearchCache(rawData, tabData),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      AdvancedSearchText_English: generateAdvSearchEnglishCache(rawData, tabData),
      Columns:
        generateSelectColumns(tabData?.gridConfig?.fetchCriteria?.Columns, rawData?.Type)?.split(
          ','
        ) ||
        oldMarvinData?.Marvin?.Columns ||
        [],
      ActiveTaskView: getTabView(tabData, oldMarvinData),
      ActiveCalendarView: getCalendarView(tabData, oldMarvinData),
      quickFilter: quickLeadFilterItem,
      ManageTasksTaskTypeColumn: oldMarvinData?.Marvin?.ManageTasksTaskTypeColumn,
      prevFilter: headerConfig?.secondary?.quickFilterConfig?.prevFilters,
      isStarredList: headerConfig?.secondary?.quickFilterConfig?.IsStarredList,
      listId: headerConfig?.secondary?.quickFilterConfig?.ListId,
      SystemTabConfig: getSystemTabConfigs(rawData),
      ShowHidden: gridConfig?.fetchCriteria?.ShowHidden,
      isManageEntityAdvancedSearchApplied: tabData?.gridConfig?.isManageEntityAdvancedSearchApplied,
      columnConfigMap: tabData?.gridConfig?.columnConfigMap
    }
  };
};

const getDefinition = (
  gridConfig: IGridConfig,
  quickLeadFilterItem?: IQuickFilterResponse
): string => {
  return quickLeadFilterItem?.Definition ?? gridConfig?.fetchCriteria?.AdvancedSearch;
};

const getName = (headerConfig: ITabHeader, quickLeadFilterItem?: IQuickFilterResponse): string => {
  return (
    quickLeadFilterItem?.Name ??
    (headerConfig?.secondary?.quickFilterConfig?.quickFilter?.Name || '')
  );
};

const getID = (headerConfig: ITabHeader, quickLeadFilterItem?: IQuickFilterResponse): string => {
  return (
    quickLeadFilterItem?.ID ?? (headerConfig?.secondary?.quickFilterConfig?.quickFilter?.ID || '')
  );
};

const getInternalName = (
  headerConfig: ITabHeader,
  quickLeadFilterItem?: IQuickFilterResponse
): string => {
  return (
    quickLeadFilterItem?.InternalName ??
    (headerConfig?.secondary?.quickFilterConfig?.quickFilter?.InternalName || '')
  );
};

const getAugmentedQuickFilterItem = ({
  gridConfig,
  headerConfig,
  quickLeadFilterItem,
  tabId
}: {
  gridConfig: IGridConfig;
  headerConfig: ITabHeader;
  quickLeadFilterItem?: IQuickFilterResponse;
  tabId: string;
}): IQuickFilterResponse | undefined => {
  if (isQuickFilterEnabled(tabId)) {
    return {
      Definition: getDefinition(gridConfig, quickLeadFilterItem),
      Name: getName(headerConfig, quickLeadFilterItem),
      ID: getID(headerConfig, quickLeadFilterItem),
      InternalName: getInternalName(headerConfig, quickLeadFilterItem)
    };
  }
  return undefined;
};

export const augmentTabData = (
  rawData: ITabResponse,
  tabData: ITabConfig,
  quickLeadFilterItem?: IQuickFilterResponse
): ITabResponse => {
  const {
    TabContentConfiguration: { FetchCriteria }
  } = safeParseJson(JSON.stringify(rawData)) as ITabResponse;
  const oldMarvinData = safeParseJson(FetchCriteria?.AdditionalData || '') as IMarvinData;
  const { gridConfig, headerConfig } = tabData;

  const marvinData = generateCacheData({
    rawData,
    tabData,
    oldMarvinData,
    quickLeadFilterItem: getAugmentedQuickFilterItem({
      gridConfig,
      headerConfig,
      quickLeadFilterItem,
      tabId: tabData?.id || ''
    })
  });
  FetchCriteria.PageSize = `${gridConfig.fetchCriteria.PageSize}`;
  FetchCriteria.AdditionalData = JSON.stringify(marvinData);
  if (isManageEntityAdvSearchEnabled(tabData.id)) {
    FetchCriteria.AdvancedSearchText = gridConfig.fetchCriteria.AdvancedSearch;
  }
  FetchCriteria.SelectedColumns = generateSelectColumns(
    gridConfig?.fetchCriteria?.Columns,
    rawData?.Type
  );

  return {
    ...rawData,
    TabContentConfiguration: {
      ...rawData.TabContentConfiguration,
      FetchCriteria
    }
  };
};

const getAugmentedFetchCriteria = (tab: ITabResponse): IFetchCriteria => {
  const additionalData = safeParseJson(
    tab?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;
  const fetchCriteria = tab?.TabContentConfiguration?.FetchCriteria;
  const advSearch = additionalData?.Marvin?.AdvancedSearchText;
  const advSearchEnglish = additionalData?.Marvin?.AdvancedSearchText_English;

  if (fetchCriteria) {
    fetchCriteria.AdvancedSearchText = advSearch ?? fetchCriteria.AdvancedSearchText;
    fetchCriteria.AdvancedSearchText_English =
      advSearchEnglish ?? fetchCriteria.AdvancedSearchText_English;
  }

  return fetchCriteria;
};

export const getTooltipContent = (disabled: boolean): string => {
  return disabled ? PERMISSION_ERROR_MSG : '';
};

export const setActionProperties = (
  action: IMenuItem | IActionConfig,
  disabled: boolean,
  tooltipContent: string
): IMenuItem | IActionConfig => {
  const clonedAction = { ...action };
  clonedAction.disabled = disabled;
  clonedAction.toolTip = tooltipContent || action.toolTip || '';
  return clonedAction;
};

const handleTabDelete = async (tabId: string, allTabIds: string[]): Promise<boolean> => {
  try {
    const currDefaultTab = getDefaultTabId();
    const updatedDefaultTabId = getUpdatedDefaultTab(currDefaultTab, [tabId], allTabIds);
    await saveDeletedTabs([tabId]);
    if (currDefaultTab !== updatedDefaultTabId) {
      await saveDefaultTab(updatedDefaultTabId);
    }
    const updatedTabIds = allTabIds?.filter((id) => id !== tabId);
    setAllTabIds(updatedTabIds);
    setDefaultTabId({
      currentDefaultTabId: updatedDefaultTabId,
      newDefaultTabId: updatedDefaultTabId
    });
    return true;
  } catch (error) {
    trackError(error);
    return false;
  }
};

export const getPanelOrientation = (): PanelOrientation => {
  return isMiP() ? PanelOrientation.Top : PanelOrientation.Left;
};

export const cachePanelOrientation = async (panelOrientation: PanelOrientation): Promise<void> => {
  setInDB(StorageKey.SmartViewsPanelOrientation, panelOrientation, true);
  await httpPost({
    path: API_ROUTES.cachePost,
    module: Module.Cache,
    callerSource: CallerSource.SmartViews,
    body: {
      key: StorageKey.SmartViewsPanelOrientation,
      Value: panelOrientation
    }
  });
};

export const getCachedPanelOrientation = async (): Promise<PanelOrientation> => {
  try {
    const cachedPanelState = await getFromDB<PanelOrientation>(
      StorageKey.SmartViewsPanelOrientation
    );
    if (cachedPanelState !== undefined && cachedPanelState !== null) {
      return cachedPanelState;
    }

    const response = await httpGet<PanelOrientation>({
      path: `${API_ROUTES.cacheGet}${StorageKey.SmartViewsPanelOrientation}`,
      module: Module.Cache,
      callerSource: CallerSource.SmartViews,
      requestConfig: { headers: { [HTTP_HEADERS.cacheControl]: 'no-cache' } }
    });
    if (response !== undefined && response !== null) {
      setInDB(StorageKey.SmartViewsPanelOrientation, response, true);
      return response;
    }
    await cachePanelOrientation(PanelOrientation.Top);
    return PanelOrientation.Top;
  } catch (error) {
    trackError(error);
    await cachePanelOrientation(PanelOrientation.Top);
    return PanelOrientation.Top;
  }
};

// Below function is temporary, this is done to revert backend issue in marvin (need to check if this can be removed)
const IsMarvinRequest = (operatorValue: string, operatorType: string): boolean => {
  try {
    if (
      (operatorType === ConditionOperatorType.DateTime ||
        operatorType === ConditionOperatorType.Date) &&
      operatorValue !== ConditionOperator.BETWEEN
    )
      return false;
  } catch (error) {
    trackError(error);
    return false;
  }
  return true;
};

const isLeadSchema = (schema: string): boolean => {
  if (schema === 'LeadIdentifier') return true;
  return schema?.startsWith(leadSchemaNamePrefix);
};

export const isAccountSchemaName = (schemaName: string): boolean => {
  return schemaName?.startsWith(ACCOUNT_SCHEMA_PREFIX);
};

const prependLeadSchemaPrefix = (schema: string): string => {
  return `${leadSchemaNamePrefix}${schema}`;
};

const getAdditionalData = ({
  tabId,
  isSvTab,
  isManageEntityTab,
  leadTypeInternalNames
}: {
  tabId?: string;
  isSvTab: boolean;
  isManageEntityTab: boolean;
  leadTypeInternalNames?: string;
}): string => {
  if (tabId !== undefined && isSvTab && !isManageEntityTab) {
    return tabId;
  }
  if (leadTypeInternalNames && isManageEntityTab) {
    return leadTypeInternalNames;
  }
  return '';
};

const createWorkAreaConfig = ({
  workAreaId,
  tabId,
  isSvTab,
  isManageEntityTab,
  leadTypeInternalNames
}: {
  workAreaId: number;
  tabId?: string;
  isSvTab: boolean;
  isManageEntityTab: boolean;
  leadTypeInternalNames?: string;
}): IWorkAreaConfig[] => {
  const additionalData = getAdditionalData({
    tabId,
    isSvTab,
    isManageEntityTab,
    leadTypeInternalNames
  });
  const configs: IWorkAreaConfig[] = [{ workAreaId, additionalData }];

  if (tabId !== undefined && isSvTab && !isManageEntityTab) {
    configs.push({ workAreaId, additionalData: TABS_DEFAULT_ID });
  }

  return configs;
};

const fetchProcessData = async (
  workAreas: Record<string, number>,
  tabId?: string,
  leadTypeInternalNames?: string
): Promise<void> => {
  try {
    const isSvTab = isSmartviewTab(tabId ?? '');
    const isManageEntityTab = isManageTab(tabId ?? '');
    const workAreasIds = [...Object.values(workAreas), workAreaIds.NA];

    const workAreaConfig: IWorkAreaConfig[] = workAreasIds?.flatMap((workAreaId) =>
      createWorkAreaConfig({ workAreaId, tabId, isSvTab, isManageEntityTab, leadTypeInternalNames })
    );

    const fetchData = (await import('common/utils/process/process'))
      .fetchMultipleWorkAreaProcessForms;
    await fetchData(workAreaConfig, CallerSource.SmartViews);
  } catch (err) {
    trackError(err);
  }
};

const generateActionforQuickAction = (quickActions?: string, tabid?: string): IActionConfig[] => {
  return (
    quickActions?.split(',')?.reduce((acc: IActionConfig[], item) => {
      const actionsInfo = item.split('_');
      if (actionsInfo.length < 2) {
        return acc;
      }
      if (actionsInfo) {
        acc.push({
          id: ACTION.Form,
          title: '',
          key: item,
          isQuickAction: true,
          value: actionsInfo[1],
          formId: actionsInfo[2],
          workAreaConfig: {
            workAreaId: parseInt(actionsInfo[0]),
            additionalData: tabid || ''
          }
        });
      }
      return acc;
    }, []) ?? []
  );
};

const sortQuickActions = (actionIds: string, quickActions: IActionConfig[]): IActionConfig[] => {
  if (actionIds) {
    return actionIds.split(',')?.reduce((acc: IActionConfig[], id) => {
      const action = quickActions.find((item) => item.key === id);
      if (action) {
        acc.push(action);
      }
      return acc;
    }, []);
  }
  return quickActions;
};

export const appendProcessActions = ({
  tabId,
  moreActions,
  quickActions,
  quickActionsOrder
}: {
  tabId?: string;
  quickActionsOrder: string;
  quickActions: IActionConfig[];
  moreActions: IActionMenuItem[];
}): IRowActionConfig => {
  const processActions = generateActionforQuickAction(quickActionsOrder, tabId);
  const combinedActions = sortQuickActions(quickActionsOrder, [...quickActions, ...processActions]);
  const augmentedQuickActions = augmentForQuickActions(combinedActions.splice(0, 3));
  const augmentedMoreActions = [...combinedActions, ...moreActions] as IActionMenuItem[];
  return getEntityRowActions({
    moreActions: augmentedMoreActions,
    quickActions: augmentedQuickActions
  });
};

const updateGridDataAfterPause = async (sleepTime?: number): Promise<void> => {
  skipAutoRefresh(false);
  await sleep(sleepTime || 1000);
  refreshGrid();
};

const getOpportunityRepName = async (): Promise<IEntityRepresentationName> => {
  const oppRename = await (
    await import('common/utils/helpers')
  ).getOpportunityRepresentationName(CallerSource.LeadDetails);

  return {
    SingularName: oppRename.OpportunityRepresentationSingularName,
    PluralName: oppRename.OpportunityRepresentationPluralName
  } as IEntityRepresentationName;
};

const updateSVMetadataCache = async (updatedData: ITabResponse): Promise<void> => {
  const cachedMetadata = (await getFromDB(StorageKey.SmartviewMetaData)) as ITabMetaDataResponse;
  if (cachedMetadata?.Tabs) {
    const index = cachedMetadata.Tabs.findIndex((tabData) => tabData.Id === updatedData.Id);
    if (index === -1) {
      cachedMetadata.Tabs.push(updatedData);
    } else {
      cachedMetadata.Tabs[index] = updatedData;
    }
    setInDB(StorageKey.SmartviewMetaData, cachedMetadata, true);
  }
};

const clearSVMetadataCache = async (): Promise<void> => {
  setInDB(StorageKey.SmartviewMetaData, null, true);
};

export const addLeadTypeToRequiredColumns = (
  currentRequiredColumns: string,
  addPrefix?: boolean
): string => {
  try {
    const isLeadTypeEnabled = getCommonTabSettings()?.isLeadTypeEnabledGlobally;
    if (isLeadTypeEnabled) {
      return [
        ...currentRequiredColumns.split(','),
        addPrefix ? `${leadSchemaNamePrefix}${SCHEMA_NAMES.LEAD_TYPE}` : SCHEMA_NAMES.LEAD_TYPE
      ].join(',');
    }
  } catch (error) {
    trackError(error);
  }
  return currentRequiredColumns;
};

export const isCustomTypeTab = (rawTabData: ITabResponse): boolean => {
  return rawTabData?.Type === TabType.Custom;
};

// eslint-disable-next-line complexity
export const getCustomConfig = (record: IRecordType): IRecordType & Record<string, string> => {
  return {
    ...record,
    EntityType: record?.TaskTypeId || record.ActivityEvent || '',
    TaskId: record?.UserTaskId || '',
    LeadId: record?.ProspectID || record?.ProspectId || record?.P_ProspectID || '',
    OpportunityId: record?.O_mx_Custom_1
      ? (record.RelatedActivityId as string)
      : record?.ProspectActivityId || ''
  };
};

const logSVModuleUsage = (
  tabId: string,
  workArea: string,
  additionalConfig?: { subWorkArea?: string | number; workAreaValue?: string | number }
): void => {
  try {
    if (isSmartviewTab(tabId) || isManageTab(tabId)) {
      logModuleUsage({
        workArea: workArea,
        subWorkArea: additionalConfig?.subWorkArea,
        workAreaValue: additionalConfig?.workAreaValue,
        entityType: tabId ? entityTypeMap[getTabData(tabId)?.type]?.toUpperCase() : undefined
      });
    }
  } catch (error) {
    trackError(error);
  }
};

const replaceTildeCharacter = (prevString: string): string => {
  // sometimes in older tenants '~' character gets replaced by '_x007E_'. This util will replace it back to '~'
  // TODO: Remove '_x007E_' for SmartViews from backend - https://leadsquared.atlassian.net/browse/SW-6224
  return prevString?.replaceAll(FIELD_SEPARATOR, '~');
};

export {
  OPTED_OUT,
  isManageTab,
  isLeadSchema,
  endSVExpEvent,
  isSmartviewTab,
  IsMarvinRequest,
  isManageListTab,
  startSVExpEvent,
  handleTabDelete,
  sortQuickActions,
  fetchProcessData,
  isEntityDetailTab,
  endAllSvExperience,
  endSVLoadExperience,
  isLeadActionDisabled,
  clearSVMetadataCache,
  isCallActionDisabled,
  generateSelectColumns,
  getOpportunityRepName,
  updateSVMetadataCache,
  endSVTabLoadExperience,
  prependLeadSchemaPrefix,
  startSVTabLoadExperience,
  updateGridDataAfterPause,
  getAugmentedFetchCriteria,
  isSendEmailActionDisabled,
  logSVModuleUsage,
  isManageEntityAdvSearchEnabled,
  isDetailsPage,
  replaceTildeCharacter
};
