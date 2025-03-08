import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { isRestricted, getRestrictedData } from 'common/utils/permission-manager';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import { CallerSource } from 'common/utils/rest-client';
import { ICustomActions, CustomActionsKeys } from 'common/types/entity/lead/custom-actions.types';
import { DataType, IConnectorConfig, RenderType } from 'common/types/entity/lead';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import {
  DefaultFilterValue,
  PlatformSettingsLeadSchemaMap,
  PlatformSettingsTaskSchemaMap,
  defaultQuickActions,
  TASK_SCHEMA_NAME,
  LEAD_SCHEMA_NAME,
  PlatformSettingsCalendarSchemaMap,
  TASK_VIEW,
  RowActionKeys,
  TAB_VIEW_MAP,
  CALENDAR_VIEW_MAP_CACHE,
  CALENDAR_VIEW_MAP_PLATFORM,
  PlatformSettingsDateMap
} from './constants';
import { ISvActionConfig, ITabResponse } from '../../smartviews.types';
import { IActionConfig } from 'apps/entity-details/types';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';
import {
  CalendarView,
  IMarvinData,
  IRowActionConfig,
  TabView
} from '../../components/smartview-tab/smartview-tab.types';
import { getCustomActionsFromCache } from 'common/utils/entity-data-manager/lead/custom-actions';
import { taskRowActions, taskBulkActions, BulkActionKeys } from './constants';
import { IUserPermission } from '../../smartviews.types';
import {
  setActionProperties,
  getTooltipContent,
  appendProcessActions,
  addLeadTypeToRequiredColumns
} from '../../utils/utils';
import { ACTION } from 'apps/entity-details/constants';
import {
  DATE_FILTER,
  FilterRenderType,
  OptionSeperator
} from '../../components/smartview-tab/components/filter-renderer/constants';
import {
  GROUPS,
  SCHEMA_NAMES,
  TABS_DEFAULT_ID,
  TaskStatusOptions,
  leadSchemaNamePrefix
} from '../../constants/constants';
import { IAugmentedMetaDataForTasks, IAugmentedTaskMetaData } from './metadata';
import { TaskAttributeDataType } from 'common/types/entity/task/metadata.types';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IDateOption } from 'common/component-lib/date-filter';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { IAuthenticationConfig } from 'common/types';
import { getRestrictionMap } from 'common/utils/permission-manager/permission-manager';
import { IAugmentedSmartViewEntityMetadata } from '../common-utilities/common.types';
import { IBulkActionRestriction, IRestriction } from '@lsq/nextgen-preact/grid/grid.types';
import { Module, httpGet } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { getSettingConfig, safeParseJson, settingKeys } from 'common/utils/helpers';
import {
  getDateFilterValueFromSettings,
  hiddenProcessForms,
  sortMetadataByDisplayName
} from '../common-utilities/utils';
import { IAvailableField } from './tab-settings';
import { removeSchemaPrefix } from '../../components/smartview-tab/utils';
import { getLeadDeleteActionConfig } from '../common-utilities/actions';
import { EntityType } from 'common/utils/entity-data-manager/common-utils/common.types';

const fetchTaskPermission = async (action: ActionType, schemaName?: string): Promise<boolean> => {
  return isRestricted({
    entity: PermissionEntityType.Task,
    action,
    callerSource: CallerSource.SmartViews,
    schemaName: schemaName,
    skipTaskUserValidation: true
  });
};

const fetchLeadPermission = async (action: ActionType): Promise<boolean> => {
  return isRestricted({
    entity: PermissionEntityType.Lead,
    action,
    callerSource: CallerSource.SmartViews
  });
};

export const fetchUserPermissions = async (): Promise<IUserPermission> => {
  const taskActions = [
    ActionType.Update,
    ActionType.BulkUpdate,
    ActionType.Delete,
    ActionType.BulkDelete,
    ActionType.MarkComplete
  ];

  const leadActions = [ActionType.Update, ActionType.Delete];

  const taskPromises = taskActions.map((action) => fetchTaskPermission(action));
  const leadPromises = leadActions.map((action) => fetchLeadPermission(action));
  const results = await Promise.allSettled([...taskPromises, ...leadPromises]);

  const permissions = results.map((result) =>
    result.status === 'fulfilled' ? result.value : null
  );
  return {
    update: !permissions[0],
    bulkUpdate: !permissions[1],
    delete: !permissions[2],
    bulkDelete: !permissions[3],
    MarkComplete: !permissions[4],
    leadUpdate: !permissions[5],
    leadDelete: !permissions[6]
  };
};

const updateRowAction = ({
  action,
  userPermissions
}: {
  action: IActionConfig;
  userPermissions?: IUserPermission;
}): IActionConfig => {
  let clonedAction = { ...action };
  const disableLeadDelete = !userPermissions?.leadDelete;
  const disableLeadUpdate = !userPermissions?.leadUpdate;

  switch (clonedAction?.key) {
    case RowActionKeys.Delete:
      clonedAction = setActionProperties(
        clonedAction,
        disableLeadDelete,
        getTooltipContent(disableLeadDelete)
      ) as IActionConfig;
      break;
    case RowActionKeys.ChangeOwner:
      clonedAction = setActionProperties(
        clonedAction,
        disableLeadUpdate,
        getTooltipContent(disableLeadUpdate)
      ) as IActionConfig;
      break;
    case RowActionKeys.ChangeStage:
      clonedAction = setActionProperties(
        clonedAction,
        disableLeadUpdate,
        getTooltipContent(disableLeadUpdate)
      ) as IActionConfig;
      break;
    default:
      break;
  }
  return clonedAction;
};

const actionsReducer = ({
  item,
  isMarvinTab,
  tabId,
  moreActions,
  actionConfig,
  leadRepName,
  quickActions,
  userPermissions,
  converseSetting,
  customActionEntityType
}: {
  item: IActionConfig;
  actionConfig?: ISvActionConfig;
  moreActions: IActionMenuItem[];
  quickActions: IActionConfig[];
  isMarvinTab?: boolean;
  tabId?: string;
  userPermissions?: IUserPermission;
  leadRepName: string;
  converseSetting?: Record<string, boolean>;
  customActionEntityType?: EntityType;
}): IActionMenuItem[] => {
  item = updateRowAction({
    action: item,
    userPermissions
  });
  if (item.id === ACTION.Converse && !converseSetting?.IsEnabled) return moreActions;
  if (item.key) {
    if (item.workAreaConfig) {
      item.workAreaConfig = {
        ...item.workAreaConfig,
        additionalData: tabId,
        fallbackAdditionalData: TABS_DEFAULT_ID
      };
    }
    if (item.id === ACTION.Delete) {
      item.actionHandler = getLeadDeleteActionConfig({
        SingularName: leadRepName,
        PluralName: leadRepName
      });
    }
    const isQuickAction = actionConfig?.QuickActions?.split(',')?.includes(item.key);
    const isHiddenAction = actionConfig?.HiddenActions?.split(',')?.includes(item.key);
    const hiddenActionsMap = hiddenProcessForms(actionConfig);
    if (
      (!isMarvinTab && isQuickAction) ||
      (isMarvinTab && defaultQuickActions.includes(item.key))
    ) {
      quickActions.push({
        ...item,
        value: item.key,
        isQuickAction: true,
        hiddenActions: hiddenActionsMap,
        label: item.title,
        entityType: customActionEntityType
      });
    }
    if (!isHiddenAction) {
      moreActions.push({
        ...item,
        label: item.title,
        value: item.key,
        hiddenActions: hiddenActionsMap,
        entityType: customActionEntityType
      });
    }
  }
  return moreActions;
};

const appendCustomActions = ({
  customActions,
  moreActions,
  quickActions,
  actionConfig,
  leadRepName,
  isMarvinTab,
  tabId,
  customActionEntityType
}: {
  customActions?: ICustomActions;
  moreActions: IActionMenuItem[];
  actionConfig?: ISvActionConfig;
  quickActions: IActionConfig[];
  isMarvinTab?: boolean;
  leadRepName: string;
  tabId?: string;
  customActionEntityType: EntityType;
}): void => {
  if (customActions?.Single) {
    Object.keys(customActions?.Single)?.forEach((key) => {
      const actions = customActions?.Single?.[key] as IConnectorConfig[];
      if (actions?.length) {
        const actionSubmenu = [] as IActionMenuItem[];
        actions.forEach((item) => {
          actionsReducer({
            item: {
              id: item.Id,
              title: item.Config.DisplayText,
              connectorConfig: item,
              key: item.Id,
              actionHandler: {},
              taskType: item?.TaskType,
              isConnectorAction: true
            },
            tabId,
            isMarvinTab,
            quickActions,
            leadRepName,
            actionConfig,
            moreActions: actionSubmenu,
            customActionEntityType
          });
        });
        if (actionSubmenu.length) {
          if (actionSubmenu.length === 1) {
            moreActions.push({
              ...actionSubmenu[0]
            });
          } else {
            moreActions.push({
              label: key,
              value: key,
              subMenu: [...actionSubmenu],
              id: key,
              title: key,
              actionHandler: {},
              entityType: customActionEntityType,
              isConnectorAction: true
            });
          }
        }
      }
    });
  }
};

const updateActionDisplayNamesWithLeadRepName = (leadRepName: string): IActionConfig[] => {
  const updatedActions = taskRowActions.map((action) => {
    switch (action.id) {
      case ACTION.ChangeOwner:
        action.title = `Change ${leadRepName} Owner`;
        action.toolTip = `Change ${leadRepName} Owner`;
        break;
      case ACTION.ChangeStage:
        action.title = `Change ${leadRepName} Stage`;
        action.toolTip = `Change ${leadRepName} Stage`;
        break;
      case ACTION.Delete:
        action.title = `${leadRepName} Delete`;
        action.toolTip = `${leadRepName} Delete`;
        break;
      case ACTION.Edit:
        action.title = `Edit ${leadRepName}`;
        action.toolTip = `Edit ${leadRepName}`;
        break;
      case ACTION.AddActivityForLead:
        action.title = `Add Activity For ${leadRepName}`;
        action.toolTip = `Add Activity For ${leadRepName}`;
        break;
      case ACTION.AddTaskForLead:
        action.title = `Add Task For ${leadRepName}`;
        action.toolTip = `Add Task For ${leadRepName}`;
        break;
    }
    return action;
  });
  return updatedActions;
};

export const getTaskRowActions = async ({
  tabId,
  isMarvinTab,
  actionConfig,
  userPermissions,
  leadRepName
}: {
  tabId?: string;
  isMarvinTab?: boolean;
  userPermissions?: IUserPermission;
  isOpportunityEnabled?: boolean;
  workAreaIds?: Record<string, number>;
  actionConfig?: ISvActionConfig;
  leadRepName: string;
}): Promise<IRowActionConfig> => {
  const quickActions: IActionConfig[] = [];
  const rowActions = updateActionDisplayNamesWithLeadRepName(leadRepName);
  const converseSetting = await getSettingConfig(
    settingKeys.ConverseConfiguration,
    CallerSource.SmartViews
  );
  const moreActions = rowActions.reduce((acc: IActionMenuItem[], item) => {
    return actionsReducer({
      actionConfig,
      item,
      moreActions: acc,
      tabId,
      isMarvinTab,
      quickActions,
      leadRepName,
      userPermissions,
      converseSetting: safeParseJson(converseSetting as string) ?? {}
    });
  }, [] as IActionMenuItem[]);
  const [leadCustomActions, taskCustomActions] = await Promise.all([
    getCustomActionsFromCache(CallerSource.SmartViews),
    getCustomActionsFromCache(CallerSource.SmartViews, EntityType.Task)
  ]);

  appendCustomActions({
    moreActions,
    customActions: leadCustomActions,
    quickActions,
    tabId,
    isMarvinTab,
    leadRepName,
    actionConfig,
    customActionEntityType: EntityType.Lead
  });

  appendCustomActions({
    moreActions,
    customActions: taskCustomActions,
    quickActions,
    tabId,
    isMarvinTab,
    leadRepName,
    actionConfig,
    customActionEntityType: EntityType.Task
  });

  return appendProcessActions({
    tabId,
    moreActions,
    quickActions,
    quickActionsOrder: actionConfig?.QuickActions || ''
  });
};

const getBulkCustomActions = async (): Promise<IConnectorConfig[]> => {
  const customActions = await getCustomActionsFromCache(CallerSource.SmartViews);
  let customActionsObj: IConnectorConfig[] = [];
  const bulkCustomActions = customActions?.Multiple || {};
  if (bulkCustomActions) {
    Object.keys(bulkCustomActions).forEach((key) => {
      customActionsObj = customActionsObj.concat(bulkCustomActions[key] || []);
    });
  }
  return customActionsObj;
};

const appendBulkCustomActions = (
  bulkActions: IMenuItem[],
  bulkCustomActions: IConnectorConfig[]
): void => {
  const categoryCustomActions: { [key: string]: IMenuItem[] } = {};
  bulkCustomActions.forEach((action) => {
    if (!categoryCustomActions[action.Category]) {
      categoryCustomActions[action.Category] = [];
    }
    categoryCustomActions[action.Category].push({
      label: action.Config.DisplayText,
      value: CustomActionsKeys.CustomActions,
      connectorConfig: action,
      id: ACTION.CustomActions
    });
  });
  Object.keys(categoryCustomActions).forEach((category) => {
    if (categoryCustomActions[category].length > 1) {
      bulkActions.push({
        label: category,
        value: category,
        subMenu: categoryCustomActions[category]
      });
    } else {
      bulkActions.push(...categoryCustomActions[category]);
    }
  });
};

const updateBulkAction = ({
  action,
  userPermissions
}: {
  action: IMenuItem;
  userPermissions: IUserPermission;
}): IMenuItem => {
  let clonedAction = { ...action };
  const disabledBulkDelete = !userPermissions?.bulkDelete || !userPermissions?.delete;
  const disabledBulkUpdate = !userPermissions?.bulkUpdate || !userPermissions?.update;
  const disableMarkComplete = !userPermissions?.MarkComplete;

  switch (clonedAction.value) {
    case BulkActionKeys.MarkOpen:
    case BulkActionKeys.MarkComplete:
      clonedAction = setActionProperties(
        clonedAction,
        disableMarkComplete,
        getTooltipContent(disableMarkComplete)
      ) as IMenuItem;
      break;
    case BulkActionKeys.Delete:
      clonedAction = setActionProperties(
        clonedAction,
        disabledBulkDelete,
        getTooltipContent(disabledBulkDelete)
      ) as IMenuItem;
      break;
    case BulkActionKeys.Cancel:
      clonedAction = setActionProperties(
        clonedAction,
        disabledBulkUpdate,
        getTooltipContent(disabledBulkUpdate)
      ) as IMenuItem;
      break;
    case BulkActionKeys.ChangeTaskOwner:
      clonedAction = setActionProperties(
        clonedAction,
        disabledBulkUpdate,
        getTooltipContent(disabledBulkUpdate)
      ) as IMenuItem;
      break;
    default:
      break;
  }
  return clonedAction;
};

export const getTaskBulkActions = async ({
  userPermissions,
  customGetBulkCustomActions
}: {
  userPermissions: IUserPermission;
  customGetBulkCustomActions?: () => Promise<IConnectorConfig[]>;
}): Promise<IMenuItem[]> => {
  let bulkActions = taskBulkActions;

  bulkActions = bulkActions.map((action) => {
    return updateBulkAction({
      action,
      userPermissions
    });
  });
  const bulkCustomActions = customGetBulkCustomActions
    ? await customGetBulkCustomActions()
    : await getBulkCustomActions();
  appendBulkCustomActions(bulkActions, bulkCustomActions);
  return bulkActions;
};

export const getUpdatedColumns = (columns: string[]): string => {
  const columnsSet = new Set(columns);

  const addColumn = (column: string): void => {
    if (!columnsSet.has(column)) {
      columnsSet.add(column);
    }
  };

  if (columnsSet.has('Name')) {
    addColumn('Color');
    addColumn('IsRecurring');
  }

  if (columnsSet.has('StatusCode') || columnsSet.has('Status')) {
    addColumn('DueDate');
    addColumn('EndDate');
  }

  if (columnsSet.has('EffortEstimate')) {
    addColumn('EffortEstimateUnit');
  }

  if (columnsSet.has('Reminder')) {
    addColumn('NotifyBy');
    addColumn('Category');
    addColumn('ReminderBeforeDays');
    addColumn('ReminderTime');
  }

  if (columnsSet.has('P_OwnerId')) {
    addColumn('P_OwnerIdName');
  }

  if (columnsSet.has('P_RelatedCompanyId')) {
    addColumn('P_RelatedCompanyIdName');
    addColumn('P_CompanyType');
  }

  addColumn(LEAD_SCHEMA_NAME.DO_NOT_EMAIL);
  addColumn(LEAD_SCHEMA_NAME.EMAIL_ADDRESS);
  addColumn(TASK_SCHEMA_NAME.STATUS_CODE);
  addColumn(TASK_SCHEMA_NAME.CREATED_BY);
  addColumn(TASK_SCHEMA_NAME.OWNER);
  addColumn('RelatedEntityId');
  addColumn('P_ProspectID');

  columnsSet.add('HasDeletePermission');
  columnsSet.add('OpenCompletedTasks');
  columnsSet.add('CanUpdate');
  columnsSet.add('HasMarkCompletePermission');
  columnsSet.add('HasUpdatePermission');
  columnsSet.add('TaskTypeId');
  columnsSet.add('P_Phone');
  columnsSet.add('P_DoNotCall');
  columnsSet.add('P_ProspectActivityId_Max');

  return addLeadTypeToRequiredColumns(Array.from(columnsSet).join(','), true);
};

export const replaceWithTaskRepresentationName = (
  originalName: string,
  replacer: string | undefined
): string => {
  if (!originalName) {
    return '';
  }

  if (!replacer) {
    return originalName;
  }

  return originalName?.replace('Task', replacer);
};

const getLeadRenderType = (fieldMetaData: IAugmentedSmartViewEntityMetadata): FilterRenderType => {
  const updatedSchemaName = fieldMetaData?.schemaName?.replace(leadSchemaNamePrefix, '');

  // when dropdown is dependent, it will be rendered as grouped dropdown
  if (fieldMetaData?.parentField) {
    return FilterRenderType.GroupedMSWithoutSelectAll;
  }
  if (fieldMetaData?.dataType === DataType.Date) {
    return FilterRenderType.DateTime;
  }
  if ([DataType.Select, DataType.MultiSelect].includes(fieldMetaData?.dataType as DataType)) {
    return FilterRenderType.MSWithoutSelectAll;
  }
  if ([SCHEMA_NAMES.CREATED_BY_NAME, SCHEMA_NAMES.OWNER_ID].includes(updatedSchemaName)) {
    return FilterRenderType.UserDropdown;
  }
  if (updatedSchemaName === GROUPS) {
    return FilterRenderType.MSWithoutSelectAll;
  }
  return FilterRenderType.None;
};

const getTaskRenderType = (fieldMetaData: IAugmentedTaskMetaData): FilterRenderType => {
  const schemaName = fieldMetaData?.schemaName;

  if ([SCHEMA_NAMES.CREATED_BY, SCHEMA_NAMES.OWNER_ID].includes(schemaName)) {
    return FilterRenderType.UserDropdown;
  }
  if (SCHEMA_NAMES.TASK_TYPE === schemaName) {
    return FilterRenderType.TaskType;
  }

  const dateTimeFilterSchemaNames = [SCHEMA_NAMES.CREATED_ON, SCHEMA_NAMES.COMPLETED_ON];
  if (dateTimeFilterSchemaNames.includes(schemaName)) {
    return FilterRenderType.DateTime;
  }
  if (
    [TaskAttributeDataType.Select, TaskAttributeDataType.MultiSelect].includes(
      fieldMetaData?.dataType as TaskAttributeDataType
    )
  ) {
    return FilterRenderType.MSWithoutSelectAll;
  }
  if (fieldMetaData?.dataType === TaskAttributeDataType.Date) {
    return FilterRenderType.DateTime;
  }
  return FilterRenderType.None;
};

export const getRenderType = (
  metadata: Record<string, IAugmentedMetaDataForTasks>,
  schemaName: string
): FilterRenderType => {
  if (schemaName.startsWith(leadSchemaNamePrefix)) {
    return getLeadRenderType(metadata[schemaName] as IAugmentedSmartViewEntityMetadata);
  }
  return getTaskRenderType(metadata[schemaName] as IAugmentedTaskMetaData);
};

export const getUpdatedSchemaName = (schemaName: string, isCalendarView: boolean): string => {
  let finalSchemaName = '';
  const replacedSchema = schemaName?.replace(leadSchemaNamePrefix, '');
  if (schemaName?.startsWith(leadSchemaNamePrefix)) {
    finalSchemaName = PlatformSettingsLeadSchemaMap[replacedSchema] as string;
  } else {
    finalSchemaName = PlatformSettingsTaskSchemaMap[replacedSchema] as string;
  }

  if (isCalendarView) {
    finalSchemaName = PlatformSettingsCalendarSchemaMap[replacedSchema] as string;
  }
  return finalSchemaName || replacedSchema;
};

const isValueNotSelected = (schema: string, value: string): boolean => {
  return (
    DefaultFilterValue.NO_SELECT_OPTIONS.includes(value?.toLowerCase()) ||
    (schema === PlatformSettingsTaskSchemaMap.TaskType &&
      value === DefaultFilterValue.ALL_TASK_TYPE_VALUE)
  );
};

const getAugmentedValue = (
  parsedFilters: Record<string, string>,
  value: string,
  schema: string
): string => {
  if (!parsedFilters && !schema) {
    return value;
  }

  let augmentedValue = value;
  if (schema === PlatformSettingsTaskSchemaMap.status) {
    augmentedValue = augmentedValue.replace('Tasks', '').toLowerCase();
    if (augmentedValue === TaskStatusOptions.Pending) {
      const includeOnlyOverdueTasks = parsedFilters.IncludeOnlyOverdueTasks;
      const includeOverdueTasks = parsedFilters.IncludeOverdueTasks;
      if (!includeOverdueTasks && includeOnlyOverdueTasks) {
        return TaskStatusOptions.Overdue;
      }
      if (includeOverdueTasks && !includeOnlyOverdueTasks) {
        return `${TaskStatusOptions.Pending};${TaskStatusOptions.Overdue}`;
      }
      return TaskStatusOptions.Pending;
    }
  }

  return augmentedValue;
};

const getDefaultDate = (schema: string, parsedFilters: Record<string, string>): IDateOption => {
  if (schema === parsedFilters?.DateFilterType) {
    const value = parsedFilters?.[PlatformSettingsDateMap[schema].value];
    const from = parsedFilters?.[PlatformSettingsDateMap[schema].from];
    const to = parsedFilters?.[PlatformSettingsDateMap[schema].to];
    return getDateFilterValueFromSettings({ value, from, to });
  }

  return DATE_FILTER.DEFAULT_OPTION;
};

/* Returns options without labels, dropdown components based on RenderType will take care 
   of getting labels for these options */
export const getDefaultFilterValue = (config: {
  parsedFilters: Record<string, string>;
  renderType: FilterRenderType;
  schemaName: string;
}): IOption[] | IDateOption => {
  const { renderType, parsedFilters, schemaName } = config;
  try {
    const isCalendarView = parsedFilters?.ActiveTaskView === TASK_VIEW.CALENDAR;
    const updatedSchema = getUpdatedSchemaName(schemaName, isCalendarView);
    const value = getAugmentedValue(parsedFilters, parsedFilters?.[updatedSchema], updatedSchema);

    if (
      [PlatformSettingsTaskSchemaMap.DueDate, PlatformSettingsTaskSchemaMap.EndDate].includes(
        updatedSchema
      )
    ) {
      return getDefaultDate(updatedSchema, parsedFilters);
    }

    // Below condition is same as options not being selected
    if (isValueNotSelected(schemaName, value)) {
      return [];
    }
    if (value === DefaultFilterValue.CURRENT_USER) {
      const { User: currentUser } = (getItem(StorageKey.Auth) || {}) as IAuthenticationConfig;
      return [{ label: '', value: currentUser?.Id }];
    }
    if (value?.split(OptionSeperator.MXSeparator)?.length > 1) {
      const options = value.split(OptionSeperator.MXSeparator);
      return options?.map((option) => ({ label: '', value: option }));
    }
    if (value?.split(OptionSeperator.SemicolonSeparator)?.length > 1) {
      const options = value.split(OptionSeperator.SemicolonSeparator);
      return options?.map((option) => ({ label: '', value: option }));
    }
    if (value?.split(OptionSeperator.CommaSeparator)?.length > 1) {
      const options = value.split(OptionSeperator.CommaSeparator);
      return options?.map((option) => ({ label: '', value: option }));
    }
    if (value) return [{ label: '', value }];
  } catch (error) {
    trackError(error);
  }
  return renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
};

export const filterRestrictedFields = async (schemaNames: string[]): Promise<string[]> => {
  try {
    const leadSchemas = schemaNames?.map((schema) => {
      return removeSchemaPrefix(schema);
    });

    const restrictionMap = await getRestrictionMap(leadSchemas, {
      entity: PermissionEntityType.Lead,
      action: ActionType.View,
      callerSource: CallerSource.SmartViews
    });

    return schemaNames.filter((schema) => !restrictionMap?.[removeSchemaPrefix(schema)]);
  } catch (error) {
    trackError(error);
    return [];
  }
};

const getBulkRestrictedTaskTypeWhenProcess = async (): Promise<string[]> => {
  try {
    const response = await httpGet({
      path: API_ROUTES.getTasksDefinedForProcess,
      module: Module.V1,
      callerSource: CallerSource.SmartViews
    });
    return response as string[];
  } catch (ex) {
    console.log('Error in getBulkUpdateRestrictedTaskType', ex);
    return [];
  }
};

export const fetchBulkActionRestriction = async (): Promise<IBulkActionRestriction | undefined> => {
  try {
    const promises = [
      getRestrictedData({
        entityType: PermissionEntityType.Task,
        actionType: ActionType.BulkDelete,
        callerSource: CallerSource.SmartViews
      }),
      getRestrictedData({
        entityType: PermissionEntityType.Task,
        actionType: ActionType.BulkUpdate,
        callerSource: CallerSource.SmartViews
      }),
      getBulkRestrictedTaskTypeWhenProcess()
    ];

    const results = await Promise.allSettled(promises);

    const permissions = results?.map((result) =>
      result.status === 'fulfilled' ? result.value : null
    );

    return {
      delete: permissions?.[0] as IRestriction,
      update: permissions?.[1] as IRestriction,
      processBulkRestrictedTaskTypeIds: permissions?.[2] as string[]
    };
  } catch (error) {
    trackError(error);
  }
};

export const getViewInfo = (
  tabData: ITabResponse
): { tabView: TabView; calendarView: CalendarView } => {
  try {
    let tabView = TabView.List;
    let calendarView = CalendarView.Month;

    const marvinData = safeParseJson(
      tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
    ) as IMarvinData;
    const parsedFilters = safeParseJson(
      tabData?.TabContentConfiguration?.FetchCriteria?.Filters
    ) as Record<string, string>;

    if (marvinData?.Marvin?.ActiveCalendarView && marvinData?.Marvin?.ActiveTaskView) {
      tabView = TAB_VIEW_MAP[marvinData?.Marvin?.ActiveTaskView?.toLowerCase() || ''] as TabView;
      calendarView = CALENDAR_VIEW_MAP_CACHE[
        marvinData?.Marvin?.ActiveCalendarView || ''
      ] as CalendarView;
    } else {
      tabView = TAB_VIEW_MAP[parsedFilters?.ActiveTaskView?.toLowerCase() || ''] as TabView;
      calendarView = CALENDAR_VIEW_MAP_PLATFORM[parsedFilters?.ActiveCalendarView] as CalendarView;
    }

    return { tabView: tabView || TabView.List, calendarView: calendarView || CalendarView.Month };
  } catch (error) {
    trackError(error);
    return { tabView: TabView.List, calendarView: CalendarView.Month };
  }
};

export const appendAdditionalFieldsToAvailableFields = (
  filteredTaskFields: IAvailableField[]
): IAvailableField[] => {
  const isOppEnabled =
    (getItem(StorageKey.Setting) as Record<string, string>)?.IsOMEnabled === '1' || false;

  if (isOppEnabled) {
    filteredTaskFields?.push({
      dataType: DataType.Select,
      displayName: 'Associated Opportunity',
      renderType: RenderType.Textbox,
      schemaName: 'RelatedOpportunityId',
      id: 'RelatedOpportunityId',
      label: 'Associated Opportunity',
      isRemovable: true
    });
    return sortMetadataByDisplayName(filteredTaskFields || []);
  }
  return filteredTaskFields;
};
