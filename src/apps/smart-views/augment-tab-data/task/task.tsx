import { trackError } from 'common/utils/experience/utils/track-error';
import {
  IGridConfig,
  IMarvinData,
  IPrimaryHeader,
  IRecordType,
  ISecondaryHeader,
  ITabConfig,
  ITabHeader,
  ITaskGetResponse,
  IColumn,
  IRowActionConfig,
  IFilterConfig,
  IOnFilterChange,
  IFilterData,
  TabView,
  IResponseFilterConfig,
  IColumnConfigMap
} from '../../components/smartview-tab/smartview-tab.types';
import { ICommonTabSettings, IFetchCriteria, ITabResponse } from '../../smartviews.types';
import { CallerSource } from 'src/common/utils/rest-client';
import fetchLeadAndTaskMetadata, { IAugmentedMetaDataForTasks } from './metadata';
import { handleTabDelete, isLeadSchema } from '../../utils/utils';
import { safeParseJson } from 'src/common/utils/helpers';
import { workAreaIds } from 'common/utils/process/constant';
import {
  ConditionEntityType,
  DEFAULT_MAX_ALLOWED,
  RowHeightType,
  TabTypeToNameMap,
  leadSchemaNamePrefix,
  leadSchemaNameMxPrefix,
  GROUPS,
  SCHEMA_NAMES
} from '../../constants/constants';
import { EntityType } from 'common/types';
import { EntityType as CustomActionEntityType } from 'common/utils/entity-data-manager/common-utils/common.types';
import { getTaskTabActions } from './header-action';
import { API_ROUTES } from 'common/constants';
import { generateCustomFilters } from '../../components/smartview-tab/utils';
import {
  customColumnDefs,
  COLUMN_RENDERER_MAP,
  defaultTaskFilters,
  PlatformSettingsLeadSchemaMap,
  taskDateTypeFilterMap,
  TASK_ACTION_KEYS,
  TASK_ACTION_CATEGORY,
  defaultTaskColumns,
  TASK_SCHEMA_NAME,
  TASK_HEADER_MENU_FEATURE_RESTRICTION_MAP,
  TASK_TAB_RENDER_TYPE_MAP,
  SortingSchema
} from './constants';
import { RenderType, DataType } from 'common/types/entity/lead';
import CellRenderer from '../../components/cell-renderers/CellRenderer';
import {
  getTaskRowActions,
  getTaskBulkActions,
  fetchUserPermissions,
  getUpdatedColumns,
  getRenderType,
  getDefaultFilterValue,
  filterRestrictedFields,
  fetchBulkActionRestriction,
  getViewInfo
} from './helpers';
import { getFilterMethods } from '../../components/smartview-tab/components/filter-renderer/utils';
import { FilterRenderType } from '../../components/smartview-tab/components/filter-renderer/constants';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IDateOption } from 'common/component-lib/date-filter';
import {
  getActionsWidth,
  getLDTypeConfigFromRawData,
  getSelectedValue,
  getSortConfig,
  getStatusRelatedFetchCriteria
} from '../common-utilities/utils';
import {
  IAugmentedSmartViewEntityMetadata,
  IColumnConfig,
  IGetColumnConfig
} from '../common-utilities/common.types';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { getTabSettings } from '../common-utilities/tab-settings';
import {
  ACTION_COLUMN_SCHEMA_NAME,
  DEFAULT_COLUMN_CONFIG_MAP,
  defaultMinWidthMap,
  defaultWidthMap
} from '../common-utilities/constant';
import {
  canEnableDateTimePicker,
  canIncludeSecondsForEndDate,
  fetchTaskProcessData
} from './utils';
import {
  getTabData,
  setFilterDataForSchema
} from '../../components/smartview-tab/smartview-tab.store';
import { getTaskTypeFilterValue } from '../../components/smartview-tab/components/filter-renderer/utils/task/generate-filter-value';
import { updateSmartViewsTab } from '../../smartviews-store';
import { TABS_CACHE_KEYS } from '../../components/custom-tabs/constants';
import {
  getSelectedFiltersFromCasa,
  getSelectedFilterValueFromCasa
} from 'common/utils/casa/utils';
import { getLeadTypeForManageTabsProcess } from '../../utils/sv-process';
import {
  addActionColumn,
  getColumnsConfig,
  getIsFixedColumn,
  getIsLastFixedColumn,
  getSortedColumnString
} from '../common-utilities/pin-utils';
import { getTaskExpandableConfig } from './expandable-config';

const generateFilterData = async (config: {
  selectedValue: IDateOption | IOption[];
  schema: string;
  renderType: FilterRenderType;
  tabData: ITabResponse;
  metadata: Record<string, IAugmentedMetaDataForTasks>;
  filterValues: IResponseFilterConfig;
}): Promise<IFilterData> => {
  const { schema, renderType, tabData, metadata, selectedValue, filterValues } = config;

  const filterType = schema?.startsWith(leadSchemaNamePrefix)
    ? ConditionEntityType.Lead
    : ConditionEntityType.Task;

  const replacedSchema = schema?.replace(leadSchemaNamePrefix, '');
  const filterValue =
    ((await (
      await getFilterMethods(filterType)
    )?.getFilterValue?.({
      selectedOption: selectedValue,
      schemaName: replacedSchema,
      tabType: tabData.Type,
      entityCode: tabData.EntityCode
    })) as IOnFilterChange) || {};

  return {
    ...filterValue,
    renderType,
    selectedValue,
    label: metadata[schema]?.displayName,
    enableDateTimePicker: canEnableDateTimePicker(schema),
    includeSecondsForEndDate: canIncludeSecondsForEndDate(schema),
    isPinned: filterValues?.[schema]?.isPinned
  };
};

const getCurrentUserOption = (): IOption[] => {
  const currentUser = getPersistedAuthConfig()?.User;
  return [{ label: '', value: currentUser?.Id || '' }];
};

const handleFilterSettings = (config: {
  schema: string;
  filterData: IFilterConfig;
  isCalendarView: boolean;
}): void => {
  const { schema, filterData, isCalendarView } = config;

  if (isCalendarView) {
    if (schema === SCHEMA_NAMES.OWNER_ID) {
      filterData[schema].isHidden = true; // will hide it from filters in tab, but not manage filters
      filterData[schema].isDisabled = true;
      filterData[schema].defaultOption = {
        selectedValue: getCurrentUserOption(),
        value: getCurrentUserOption()?.[0]?.value
      };
    }
    if (schema === TASK_SCHEMA_NAME.SCHEDULE) {
      filterData[schema].isHidden = true;
      filterData[schema].isNotCounted = true;
    }
  }
};

const handleCustomSelectedValue = async (config: {
  schema: string;
  currSelectedValue: IOption[] | IDateOption;
  isCalendarView: boolean;
}): Promise<IOption[] | IDateOption> => {
  const { schema, currSelectedValue, isCalendarView } = config;
  let selectedValue = currSelectedValue;

  // Adding currentUser as default option if selectedValue of owner not present in calendarView
  if (isCalendarView && schema === SCHEMA_NAMES.OWNER_ID) {
    selectedValue = (selectedValue as IOption[])?.length ? selectedValue : getCurrentUserOption();
  }

  const casaSelectedValue = await getSelectedFilterValueFromCasa(schema, selectedValue);

  return casaSelectedValue;
};

const handleTaskTypeFilter = async (
  schema: string,
  filterData: IFilterConfig,
  tabData: ITabResponse
): Promise<void> => {
  if (schema !== SCHEMA_NAMES.TASK_TYPE || tabData?.Id !== TABS_CACHE_KEYS.MANAGE_TASKS_TAB) {
    return;
  }
  filterData[schema].customCallbacks = {
    onChange: (option: IOption[]): IOnFilterChange | null => {
      try {
        const filterValue = getTaskTypeFilterValue(option);

        if (filterValue?.value !== filterData[schema]?.value) {
          const updatedFilter = { ...filterData[schema], ...filterValue };
          setFilterDataForSchema(tabData?.Id, updatedFilter, schema);
          // setTimeout is added to update cache after state update of all filters during clear filters action
          setTimeout(() => {
            updateSmartViewsTab(tabData?.Id, getTabData(tabData?.Id), true);
          }, 0);
        }
      } catch (error) {
        trackError(error);
      }
      return null;
    }
  };
};

const generateInitialFilterData = async (config: {
  metadata: Record<string, IAugmentedMetaDataForTasks>;
  marvinData: IMarvinData;
  defaultFilters: string[];
  tabData: ITabResponse;
  parsedFilters: Record<string, string>;
  isCalendarView: boolean;
}): Promise<IFilterConfig> => {
  const { marvinData, defaultFilters, metadata, tabData, parsedFilters, isCalendarView } = config;
  const filterValues = marvinData?.Marvin?.FilterValues || {};
  const filterData: IFilterConfig = {};

  await Promise.all(
    defaultFilters?.map(async (schema) => {
      const renderType = getRenderType(metadata, schema);
      let selectedValue: IOption[] | IDateOption;

      // if filter data is already there in user personalization cache
      if (filterValues?.[schema]) {
        selectedValue = getSelectedValue(filterValues, schema, renderType);
      } else {
        // else generate filter data

        /* getDefaultFilterValue is used to generate `selectedValue` from default options selected in sv settings
           while creating the tab */
        selectedValue = getDefaultFilterValue({
          parsedFilters,
          renderType,
          schemaName: schema
        });
      }

      selectedValue = await handleCustomSelectedValue({
        isCalendarView,
        schema,
        currSelectedValue: selectedValue
      });

      filterData[schema] = await generateFilterData({
        schema,
        renderType,
        tabData,
        metadata,
        selectedValue,
        filterValues
      });

      handleFilterSettings({ schema, filterData, isCalendarView });
      handleTaskTypeFilter(schema, filterData, tabData);
    })
  );

  // ordering based on default filters as promise.all executes all promises parallely and filterData is getting jumbled up
  const orderedFilterData = {};
  defaultFilters?.forEach((schema) => (orderedFilterData[schema] = filterData[schema]));
  return orderedFilterData;
};

const getPrimaryHeader = (config: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  advanceSearchEnglish: string;
  allTabIds: string[];
}): IPrimaryHeader => {
  const { tabData, commonTabSettings, advanceSearchEnglish, allTabIds } = config;

  const primaryHeader = {
    title: tabData.TabConfiguration.Title,
    description: tabData.TabConfiguration.Description,
    advancedSearchEnglish: advanceSearchEnglish,
    modifiedByName: tabData.ModifiedByName,
    modifiedOn: tabData.ModifiedOn,
    autoRefreshTime: commonTabSettings.autoRefreshConfiguration
      ? commonTabSettings.autoRefreshConfiguration?.ActiveTabContentAutoRefreshInterval || 60
      : 0,
    onTabDelete: async (tabId: string): Promise<boolean> => {
      return handleTabDelete(tabId, allTabIds);
    }
  };

  return primaryHeader;
};

const getSelectedFilters = (config: {
  tabData: ITabResponse;
  marvinData: IMarvinData;
  parsedFilters: Record<string, string>;
  isCalendarView: boolean;
}): string[] => {
  const { tabData, marvinData, parsedFilters, isCalendarView } = config;
  let defaultFilters: string[] = [];

  // get filters from user personalization cache if exists
  if (marvinData?.Marvin?.Exists) {
    defaultFilters = Object.keys(marvinData?.Marvin?.FilterValues || {});
    if (isCalendarView) {
      defaultFilters?.push(TASK_SCHEMA_NAME.OWNER);
    }
  } else if (!defaultFilters?.length) {
    // else generate default filters
    const filtersFromTabData =
      tabData?.TabContentConfiguration?.FetchCriteria?.SelectedFilters?.split(',') || [];
    defaultFilters = filtersFromTabData?.map((schema) => {
      if (schema?.startsWith(leadSchemaNameMxPrefix) || PlatformSettingsLeadSchemaMap[schema]) {
        return `${leadSchemaNamePrefix}${schema}`;
      }
      return schema;
    });
    defaultFilters = [...defaultTaskFilters, ...defaultFilters];
    const dateFilterOn = taskDateTypeFilterMap[parsedFilters?.DateFilterType] as string;
    if (dateFilterOn) {
      defaultFilters?.push(dateFilterOn);
    }
  }

  // removes duplicate fields
  const defaultFiltersSet = new Set(defaultFilters.filter((schema) => schema));
  const augmentedFilters = getSelectedFiltersFromCasa(Array.from(defaultFiltersSet));

  return augmentedFilters;
};

const getFilterConfig = async (config: {
  tabData: ITabResponse;
  metadata: Record<string, IAugmentedMetaDataForTasks>;
  marvinData: IMarvinData;
  isCalendarView: boolean;
}): Promise<{
  selectedFilters: string[];
  bySchemaName: IFilterConfig;
}> => {
  const { tabData, metadata, marvinData, isCalendarView } = config;
  const parsedFilters = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.Filters
  ) as Record<string, string>;

  let selectedFilters = await filterRestrictedFields(
    getSelectedFilters({ tabData, marvinData, parsedFilters, isCalendarView })
  );
  selectedFilters = selectedFilters.filter((schema) => !!metadata[schema]);

  return {
    selectedFilters,
    bySchemaName: await generateInitialFilterData({
      metadata,
      marvinData,
      defaultFilters: selectedFilters,
      tabData,
      parsedFilters,
      isCalendarView
    })
  };
};

const getSecondaryHeader = async (config: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  taskRepName: string;
  metadata: Record<string, IAugmentedMetaDataForTasks>;
  isCalendarView: boolean;
}): Promise<ISecondaryHeader> => {
  const { commonTabSettings, tabData, taskRepName, metadata, isCalendarView } = config;
  const tabTypeName = TabTypeToNameMap[tabData.Type]?.toLowerCase() as EntityType;

  const marvinData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
  ) as IMarvinData;

  const leadTypeForProcess = await getLeadTypeForManageTabsProcess(tabData.Id);
  return {
    searchText: '',
    filterConfig: {
      filters: await getFilterConfig({ tabData, metadata, marvinData, isCalendarView }),
      maxAllowedFilters:
        (commonTabSettings?.maxFiltersAllowed?.[tabTypeName] as number) ||
        DEFAULT_MAX_ALLOWED?.Filters
    },
    actionConfiguration: getTaskTabActions({
      taskRepName,
      tabId: tabData.Id,
      isCalendarView,
      leadTypeForProcess
    }),
    featureRestrictionConfigMap: TASK_HEADER_MENU_FEATURE_RESTRICTION_MAP
  };
};

export const getHeaderConfig = async (config: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  allTabIds: string[];
  taskRepName: string;
  metadata: Record<string, IAugmentedMetaDataForTasks>;
  isCalendarView: boolean;
}): Promise<ITabHeader> => {
  const { tabData, commonTabSettings, taskRepName, allTabIds, metadata, isCalendarView } = config;
  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;
  const advanceSearchEnglish =
    additionalData?.Marvin?.AdvancedSearchText_English ||
    tabData?.TabContentConfiguration?.FetchCriteria?.AdvancedSearchText_English;

  const primaryHeader = getPrimaryHeader({
    tabData,
    commonTabSettings,
    advanceSearchEnglish,
    allTabIds
  });

  const secondaryHeader: ISecondaryHeader = await getSecondaryHeader({
    commonTabSettings,
    tabData,
    taskRepName,
    metadata,
    isCalendarView
  });

  return {
    primary: primaryHeader,
    secondary: secondaryHeader
  };
};

const getAugmentedResponse = async (
  response: ITaskGetResponse,
  tabId: string
): Promise<{
  records: IRecordType[];
  totalRecordCount?: number;
}> => {
  const taskTypeSet = new Set<string>();
  const augmentedResponse =
    response?.TaskList?.map((item) => {
      taskTypeSet.add(item.TaskTypeId);
      return { ...item, id: item.UserTaskId };
    }) || [];

  const taskTypeIds = Array.from(taskTypeSet);
  window[`PROCESS_${tabId}`] = fetchTaskProcessData(
    workAreaIds.SMART_VIEWS.TASK_TAB,
    tabId || '',
    taskTypeIds
  );
  return { records: augmentedResponse };
};

const getTaskFieldRenderType = (schemaData: IAugmentedMetaDataForTasks): RenderType => {
  if (schemaData.renderType === RenderType.Textbox && schemaData.dataType === DataType.Date) {
    return RenderType.DateTime;
  }
  return TASK_TAB_RENDER_TYPE_MAP?.[schemaData.renderType] ?? (schemaData.renderType as RenderType);
};

const getColumnDef = (schemaData: IAugmentedMetaDataForTasks, acc: IColumn[]): IColumn => ({
  id: schemaData.schemaName,
  displayName: schemaData.displayName,
  resizable: true,
  minWidth: defaultMinWidthMap?.[schemaData.schemaName] || 96,
  isFirstColumn: acc.length === 0,
  CellRenderer: CellRenderer,
  dataType: schemaData.dataType as DataType,
  renderType: getTaskFieldRenderType(schemaData),
  cfsDisplayName: (schemaData as IAugmentedSmartViewEntityMetadata)?.cfsDisplayName,
  isLeadFieldInNonLeadTab: isLeadSchema(schemaData.schemaName),
  sortKey: SortingSchema[schemaData.schemaName]
});

// eslint-disable-next-line max-lines-per-function
export const getGridColumns = async ({
  columnString,
  columnWidthConfig,
  tabId,
  actionsLength,
  entityCode,
  leadAndTaskMetadata,
  columnConfigMap
}: {
  columnString: string;
  columnWidthConfig?: Record<string, number>;
  tabId: string;
  actionsLength?: number;
  entityCode: string;
  leadAndTaskMetadata?: Record<string, IAugmentedMetaDataForTasks>;
  columnConfigMap?: IColumnConfigMap;
}): Promise<IColumn[]> => {
  let metadata = leadAndTaskMetadata;
  if (!metadata) {
    const metadataResponse = await fetchLeadAndTaskMetadata(
      entityCode,
      CallerSource.SmartViews,
      tabId
    );
    metadata = {
      ...metadataResponse?.metadata?.taskMetadata,
      ...metadataResponse?.metadata?.leadMetadata
    };
  }
  const colArr = getSortedColumnString(columnString, columnConfigMap)?.split(',') || [];
  if (!Object.keys(metadata).length) {
    return [];
  }
  // eslint-disable-next-line complexity
  return colArr.reduce((acc, schemaName: string) => {
    const isFixedColumn = getIsFixedColumn(schemaName, acc, columnConfigMap);
    const isLastFixedColumn = getIsLastFixedColumn(acc, columnConfigMap);
    const schemaData = metadata?.[schemaName];
    const customColumn = customColumnDefs[schemaName];
    if (schemaName === ACTION_COLUMN_SCHEMA_NAME) {
      const colWidth = getActionsWidth(actionsLength);
      acc.push({
        ...customColumnDefs.Actions,
        fixed: isFixedColumn,
        width: colWidth || customColumnDefs.Actions.width,
        minWidth: colWidth || customColumnDefs.Actions.minWidth,
        isLastFixedColumn: isLastFixedColumn
      });
    } else if (customColumn) {
      acc.push({
        ...customColumn,
        fixed: isFixedColumn,
        isFirstColumn: acc.length === 0,
        isLastFixedColumn: isLastFixedColumn,
        width: columnWidthConfig?.[schemaName] || customColumn.width
      });
    } else if (schemaData) {
      acc.push({
        ...getColumnDef(schemaData, acc),
        sortable: schemaData?.isSortable,
        fixed: isFixedColumn,
        isLastFixedColumn: isLastFixedColumn,
        width:
          columnWidthConfig?.[schemaName] ||
          defaultWidthMap[schemaData.renderType as string] ||
          148,
        CellRenderer: COLUMN_RENDERER_MAP[schemaName] || CellRenderer
      });
    }
    return acc;
  }, [] as IColumn[]);
};

const getGroupRowActions = (rowActions: IRowActionConfig): IRowActionConfig => {
  const taskRowAction: IActionMenuItem = {
    id: TASK_ACTION_CATEGORY.TASK_ACTION,
    title: 'Task Actions',
    label: 'Task Actions',
    value: TASK_ACTION_CATEGORY.TASK_ACTION,
    children: []
  };
  const leadRowAction: IActionMenuItem = {
    id: TASK_ACTION_CATEGORY.LEAD_ACTION,
    title: 'Lead Actions',
    label: 'Lead Actions',
    value: TASK_ACTION_CATEGORY.LEAD_ACTION,
    children: []
  };
  rowActions.moreActions.forEach((action) => {
    const key = action.key ?? '';
    const targetRowAction =
      TASK_ACTION_KEYS.includes(key) || action.entityType === CustomActionEntityType.Task
        ? taskRowAction
        : leadRowAction;
    targetRowAction.children?.push(action);
  });

  const moreActions: IActionMenuItem[] = [];
  if (taskRowAction?.children?.length) {
    moreActions.push(taskRowAction);
  }
  if (leadRowAction?.children?.length) {
    moreActions.push(leadRowAction);
  }
  return { ...rowActions, moreActions };
};

const getDefaultTaskColumns = (fetchCriteria: IFetchCriteria): string => {
  return addActionColumn(
    fetchCriteria.SelectedColumns?.replaceAll('CheckBoxColumn,', '') || defaultTaskColumns
  );
};

const getColumnConfig = async ({
  entityCode,
  columns,
  actionsLength,
  columnWidthConfig,
  tabId,
  columnConfigMap
}: IGetColumnConfig): Promise<IColumnConfig> => {
  const updatedColumns = columns;

  const gridColumns = await getGridColumns({
    columnString: updatedColumns,
    columnWidthConfig,
    actionsLength,
    entityCode: entityCode ?? '',
    tabId,
    columnConfigMap
  });

  return { columns: updatedColumns, gridColumns };
};

const getTaskSortedConfig = (sortedOn: string): { SortOn: string; SortBy: number } => {
  const { SortBy, SortOn } = getSortConfig(sortedOn, customColumnDefs);
  return {
    SortBy: SortBy,
    SortOn: SortingSchema[SortOn] ?? SortOn
  };
};

// eslint-disable-next-line max-lines-per-function, complexity
export const getGridConfig = async ({
  tabData,
  metadata,
  customFilters,
  selectedColumns,
  filterMap,
  leadRepName,
  oppRepName
}: {
  tabData: ITabResponse;
  metadata: Record<string, IAugmentedMetaDataForTasks>;
  customFilters: string;
  selectedColumns?: string[];
  filterMap?: IFilterConfig;
  leadRepName: string;
  oppRepName: string;
}): Promise<IGridConfig> => {
  let taskAndLeadMetadata = metadata;
  if (!taskAndLeadMetadata) {
    const metadataResponse = await fetchLeadAndTaskMetadata(
      tabData?.EntityCode,
      CallerSource.SmartViews,
      tabData.Id
    );
    taskAndLeadMetadata = {
      ...metadataResponse?.metadata?.taskMetadata,
      ...metadataResponse?.metadata?.leadMetadata
    };
  }

  const {
    Id,
    // SharedBy represent system tab
    SharedBy,
    TabContentConfiguration: { FetchCriteria, Actions },
    TabConfiguration: { IsMarvinTab }
  } = tabData;

  const additionalData = (safeParseJson(FetchCriteria.AdditionalData || '') as IMarvinData) || {};

  const userPermissions = await fetchUserPermissions();
  const taskRowActionsPromise = getTaskRowActions({
    workAreaIds: workAreaIds.SMART_VIEWS.TASK_TAB,
    actionConfig: Actions,
    isMarvinTab: IsMarvinTab || !SharedBy,
    tabId: Id,
    userPermissions,
    leadRepName
  });
  const bulkRestrictedDataPromise = fetchBulkActionRestriction();

  const [taskRowActions, taskBulkActions] = await Promise.all([
    taskRowActionsPromise,
    getTaskBulkActions({
      userPermissions: userPermissions
    })
  ]);

  const groupedTaskRowActions = getGroupRowActions(taskRowActions);

  const defaultColumns = getDefaultTaskColumns(FetchCriteria);

  const fetchCriteria = {
    PageIndex: 1,
    PageSize: parseInt(FetchCriteria.PageSize),
    Columns: defaultColumns,
    SearchText: '',
    CustomFilters: customFilters,
    SalesGroup: filterMap?.[`${leadSchemaNamePrefix}${GROUPS}`]?.value,
    AdvancedSearch: FetchCriteria.AdvancedSearchText,
    Type: tabData?.EntityCode,
    ...getStatusRelatedFetchCriteria(tabData),
    ...getTaskSortedConfig(FetchCriteria.SortedOn ?? '')
  };

  if (additionalData?.Marvin?.Exists) {
    const marvinData = { ...additionalData.Marvin };
    fetchCriteria.AdvancedSearch = marvinData.AdvancedSearchText;
    fetchCriteria.SearchText = marvinData.SearchText;
    fetchCriteria.Columns = addActionColumn(
      selectedColumns?.length ? selectedColumns.join(',') : marvinData.Columns.join(',')
    );
    const sortConfig = {
      ...getTaskSortedConfig(marvinData.SearchSortedOn ?? '')
    };
    if (sortConfig) {
      fetchCriteria.SortOn = sortConfig.SortOn;
      fetchCriteria.SortBy = sortConfig.SortBy;
    }
  }

  const columnConfigMap = getColumnsConfig(
    DEFAULT_COLUMN_CONFIG_MAP.Task,
    defaultColumns,
    additionalData?.Marvin?.columnConfigMap
  );

  const config: IGridConfig = {
    apiRoute: API_ROUTES.smartviews.taskGet as string,
    allowRowSelection: true,
    fetchCriteria,
    rowHeight: RowHeightType.Default,
    tabColumnsWidth: additionalData?.Marvin?.tabColumnsWidth,
    actions: { rowActions: { ...groupedTaskRowActions }, bulkActions: [...taskBulkActions] },
    columns: await getGridColumns({
      columnString: fetchCriteria.Columns,
      columnWidthConfig: additionalData?.Marvin?.tabColumnsWidth,
      actionsLength: groupedTaskRowActions?.quickActions?.length,
      entityCode: tabData.EntityCode,
      leadAndTaskMetadata: taskAndLeadMetadata,
      tabId: tabData.Id,
      columnConfigMap
    }),
    augmentResponse: (response: ITaskGetResponse) => getAugmentedResponse(response, Id),
    expandableComponent: getTaskExpandableConfig(leadRepName, oppRepName, Id),
    bulkRestrictedDataPromise,
    columnConfigMap
  };

  config.apiRequestColumns = getUpdatedColumns(fetchCriteria?.Columns?.split(',') || []);

  return config;
};

export const handleTaskAugmentation = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;

  const { metadata, taskRepName, leadRepName, oppRepName } =
    (await fetchLeadAndTaskMetadata(tabData?.EntityCode, CallerSource.SmartViews, tabData.Id)) ||
    {};
  const taskAndLeadMetadata = { ...metadata?.leadMetadata, ...metadata?.taskMetadata };
  const { tabView, calendarView } = getViewInfo(tabData);
  const leadTypeConfiguration = await getLDTypeConfigFromRawData(tabData.Id);

  const headerConfig = await getHeaderConfig({
    tabData,
    commonTabSettings,
    allTabIds,
    taskRepName,
    metadata: taskAndLeadMetadata,
    isCalendarView: tabView === TabView.CalendarView
  });

  const { selectedFilters, bySchemaName } = headerConfig?.secondary?.filterConfig?.filters || {};
  const customFilters = generateCustomFilters({
    selectedFilters,
    bySchemaName,
    tabType: tabData?.Type,
    entityCode: tabData?.EntityCode,
    leadTypeConfiguration
  });
  const gridConfig = await getGridConfig({
    tabData,
    metadata: taskAndLeadMetadata,
    customFilters,
    filterMap: bySchemaName,
    leadRepName,
    oppRepName
  });

  const augmentedData: ITabConfig = {
    id: tabData.Id,
    type: tabData.Type,
    recordCount: tabData.Count,
    entityCode: tabData.EntityCode,
    sharedBy: tabData.SharedBy,
    tabSettings: getTabSettings({
      tabData,
      allTabIds,
      getSystemColumns: () => getDefaultTaskColumns(tabData?.TabContentConfiguration?.FetchCriteria)
    }),
    headerConfig,
    gridConfig,
    representationName: { PluralName: 'Tasks', SingularName: taskRepName || 'Task' },
    tabView,
    calendarView,
    leadTypeConfiguration
  };

  return augmentedData;
};

export default handleTaskAugmentation;
export { getColumnConfig };
