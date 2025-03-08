import { trackError } from 'common/utils/experience/utils/track-error';
import fetchLeadAndTaskMetadata, {
  IAugmentedMetaDataForTasks
} from 'apps/smart-views/augment-tab-data/task/metadata';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import {
  IFilterConfig,
  IGridConfig,
  IMarvinData,
  IRecordType,
  IRowActionConfig,
  ITaskGetResponse
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { CallerSource } from 'common/utils/rest-client';
import { safeParseJson } from 'common/utils/helpers';
import {
  fetchBulkActionRestriction,
  fetchUserPermissions,
  getTaskBulkActions,
  getUpdatedColumns
} from 'apps/smart-views/augment-tab-data/task/helpers';
import {
  getSortConfig,
  getStatusRelatedFetchCriteria
} from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import {
  customColumnDefs,
  defaultManageTaskColumns
} from 'apps/smart-views/augment-tab-data/task/constants';
import {
  ALL,
  ALL_TASKS_TYPES_CACHE_KEY,
  GROUPS,
  leadSchemaNamePrefix,
  RowHeightType,
  SCHEMA_NAMES
} from 'apps/smart-views/constants/constants';
import { API_ROUTES } from 'common/constants';
import { getGridColumns } from 'apps/smart-views/augment-tab-data/task/task';
import { workAreaIds } from 'common/utils/process';
import { getTaskExpandableConfig } from 'apps/smart-views/augment-tab-data/task/expandable-config';
import { taskRowActions } from './constants';
import { IActionConfig } from 'apps/entity-details/types';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';
import { fetchTaskProcessData, getTaskFilterValueFromAdditionalData } from './utils';
import { getCustomActionsFromCache } from 'common/utils/entity-data-manager/lead/custom-actions';
import { IConnectorConfig } from 'common/types/entity/lead';
import { EntityType } from 'common/utils/entity-data-manager/activity/activity.types';
import {
  addActionColumn,
  getColumnsConfig
} from '../../../augment-tab-data/common-utilities/pin-utils';
import { DEFAULT_COLUMN_CONFIG_MAP } from '../../../augment-tab-data/common-utilities/constant';

const appendCustomActions = async (rowActions: IRowActionConfig): Promise<void> => {
  const customActions = await getCustomActionsFromCache(CallerSource.SmartViews, EntityType.Task);
  if (!customActions?.Single) {
    return;
  }

  Object.keys(customActions?.Single)?.forEach((key) => {
    const actions = customActions?.Single?.[key] as IConnectorConfig[];
    const actionSubmenu = [] as IActionMenuItem[];
    actions?.forEach((item) => {
      actionSubmenu.push({
        id: item?.Id,
        label: item?.Config?.DisplayText,
        value: item?.Id,
        title: item?.Config?.DisplayText,
        connectorConfig: item,
        key: item?.Id,
        taskType: item?.TaskType
      });
    });
    if (actionSubmenu.length) {
      if (actionSubmenu.length === 1) {
        rowActions.moreActions.push({
          ...actionSubmenu[0]
        });
      } else {
        rowActions.moreActions.push({
          label: key,
          value: key,
          subMenu: [...actionSubmenu],
          id: key,
          title: key
        });
      }
    }
  });
};

const getTaskRowActions = (): IRowActionConfig => {
  const updatedTaskRowActions = taskRowActions.reduce(
    (acc: IRowActionConfig, action: IActionConfig | IActionMenuItem) => {
      if (action.isQuickAction) {
        acc.quickActions.push(action);
      } else {
        const updatedAction = { ...action };
        updatedAction.label = action.title;
        updatedAction.value = action.id;
        acc.moreActions.push(updatedAction as IActionMenuItem);
      }

      return acc;
    },
    { quickActions: [], moreActions: [] } as IRowActionConfig
  );
  return updatedTaskRowActions;
};

const getAugmentedResponse = async (
  response: ITaskGetResponse,
  tabId: string,
  leadTypeInternalNames?: string
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
  window[`PROCESS_${tabId}`] = fetchTaskProcessData({
    workAreas: workAreaIds.MANAGE_TASKS,
    tabId: tabId || '',
    taskTypeIds,
    leadTypeInternalNames
  });
  return { records: augmentedResponse };
};

const getBulkCustomActions = async (tabData: ITabResponse): Promise<IConnectorConfig[]> => {
  const currSelectedTaskType = getTaskFilterValueFromAdditionalData(tabData);
  let finalCustomActions: IConnectorConfig[] = [];
  const customActions = await getCustomActionsFromCache(CallerSource.SmartViews, EntityType.Task);
  const bulkCustomActions = customActions?.Multiple ?? {};

  const customActionsFilter = (item: IConnectorConfig): boolean => {
    return [ALL, currSelectedTaskType].includes(item.TaskType?.toLowerCase() || '');
  };

  Object.keys(bulkCustomActions).forEach((key) => {
    finalCustomActions = finalCustomActions
      .concat(bulkCustomActions[key] || [])
      ?.filter(customActionsFilter);
  });
  return finalCustomActions;
};

const getColumnsFromCache = (marvinData: IMarvinData['Marvin'], currColumns: string): string => {
  try {
    if (!marvinData) {
      return currColumns;
    }
    const taskFilterValue = (
      marvinData?.FilterValues?.[SCHEMA_NAMES.TASK_TYPE]?.value || null
    )?.split(',');
    const cacheKey =
      taskFilterValue?.length === 1 ? taskFilterValue?.[0] : ALL_TASKS_TYPES_CACHE_KEY;

    return (
      marvinData?.ManageTasksTaskTypeColumn?.[cacheKey]?.join(',') || marvinData?.Columns?.join(',')
    );
  } catch (error) {
    trackError(error);
    return currColumns;
  }
};

const getEntityCode = (tabData: ITabResponse): string => {
  const taskFilterValue = getTaskFilterValueFromAdditionalData(tabData);
  return taskFilterValue || tabData?.EntityCode;
};

// eslint-disable-next-line complexity, max-lines-per-function
export const getGridConfig = async ({
  tabData,
  metadata,
  customFilters,
  selectedColumns,
  filterMap,
  leadRepName,
  oppRepName,
  leadTypeInternalNamesForProcess
}: {
  tabData: ITabResponse;
  metadata: Record<string, IAugmentedMetaDataForTasks>;
  customFilters: string;
  selectedColumns?: string[];
  filterMap?: IFilterConfig;
  leadRepName: string;
  oppRepName: string;
  leadTypeInternalNamesForProcess?: string;
}): Promise<IGridConfig> => {
  let taskAndLeadMetadata = metadata;
  if (!taskAndLeadMetadata) {
    const metadataResponse = await fetchLeadAndTaskMetadata(
      getEntityCode(tabData),
      CallerSource.ManageTasks,
      tabData.Id
    );
    taskAndLeadMetadata = {
      ...metadataResponse?.metadata?.taskMetadata,
      ...metadataResponse?.metadata?.leadMetadata
    };
  }

  const {
    Id,
    TabContentConfiguration: { FetchCriteria }
  } = tabData;

  const rowActions = getTaskRowActions();
  appendCustomActions(rowActions);
  const additionalData = (safeParseJson(FetchCriteria.AdditionalData || '') as IMarvinData) || {};
  const userPermissions = await fetchUserPermissions();
  const taskBulkActions = await getTaskBulkActions({
    userPermissions: userPermissions,
    customGetBulkCustomActions: () => {
      return getBulkCustomActions(tabData);
    }
  });
  const bulkRestrictedDataPromise = fetchBulkActionRestriction();

  const defaultColumns = addActionColumn(
    FetchCriteria.SelectedColumns?.replaceAll('CheckBoxColumn,', '') || defaultManageTaskColumns,
    4
  );

  const fetchCriteria = {
    PageIndex: 1,
    PageSize: parseInt(FetchCriteria.PageSize),
    Columns: defaultColumns,
    SearchText: '',
    CustomFilters: customFilters,
    SalesGroup: filterMap?.[`${leadSchemaNamePrefix}${GROUPS}`]?.value,
    AdvancedSearch: FetchCriteria.AdvancedSearchText,
    Type: getEntityCode(tabData),
    ...getStatusRelatedFetchCriteria(tabData, filterMap),
    ...getSortConfig(FetchCriteria.SortedOn || '', customColumnDefs)
  };

  if (additionalData?.Marvin?.Exists) {
    const marvinData = { ...additionalData.Marvin };
    fetchCriteria.AdvancedSearch = marvinData.AdvancedSearchText;
    fetchCriteria.SearchText = marvinData.SearchText;
    fetchCriteria.Columns = addActionColumn(
      selectedColumns?.length
        ? selectedColumns.join(',')
        : getColumnsFromCache(marvinData, fetchCriteria.Columns),
      4
    );
    const sortConfig = {
      ...getSortConfig(marvinData.SearchSortedOn || '', customColumnDefs)
    };
    if (sortConfig) {
      fetchCriteria.SortOn = sortConfig.SortOn;
      fetchCriteria.SortBy = sortConfig.SortBy;
    }
  }

  const columnConfigMap = getColumnsConfig(
    DEFAULT_COLUMN_CONFIG_MAP.ManageTask,
    defaultColumns,
    additionalData?.Marvin?.columnConfigMap
  );

  const config: IGridConfig = {
    apiRoute: API_ROUTES.smartviews.taskGet,
    allowRowSelection: true,
    fetchCriteria,
    rowHeight: RowHeightType.Default,
    tabColumnsWidth: additionalData?.Marvin?.tabColumnsWidth,
    actions: {
      rowActions: rowActions,
      bulkActions: taskBulkActions
    },
    columns: await getGridColumns({
      columnString: fetchCriteria.Columns,
      columnWidthConfig: additionalData?.Marvin?.tabColumnsWidth,
      actionsLength: rowActions?.quickActions?.length,
      entityCode: getEntityCode(tabData),
      leadAndTaskMetadata: taskAndLeadMetadata,
      tabId: tabData.Id,
      columnConfigMap
    }),
    augmentResponse: (response: ITaskGetResponse) =>
      getAugmentedResponse(response, Id, leadTypeInternalNamesForProcess),
    expandableComponent: getTaskExpandableConfig(leadRepName, oppRepName, Id),
    bulkRestrictedDataPromise,
    columnConfigMap
  };

  config.apiRequestColumns = getUpdatedColumns(fetchCriteria?.Columns?.split(',') || []);

  return config;
};
