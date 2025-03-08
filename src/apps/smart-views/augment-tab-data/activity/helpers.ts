import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import {
  defaultQuickActions,
  PORTAL_ENTITY_CODE,
  NOTES_NOT_ALLOWED,
  OWNER_DROPDOWN_SCHEMA,
  activityRowActions,
  activityBulkActions,
  ActivityCodes,
  actionKeys,
  BulkActionKeys,
  allowedActivityActions,
  SALES_ACTIVITY_TAB,
  SALES_DEFAULT_FILTER,
  PlatformSettingsSchemaMap,
  nonSortableFields,
  nonSortableSalesActivityFields,
  ActivityManageFilterConfig,
  RESTRICT_ROW_ACTIONS_EVENT_CODES,
  RESTRICT_BULK_UPDATE_EVENT_CODES
} from './constants';
import { ICommonTabSettings, ISvActionConfig, ITabResponse } from '../../smartviews.types';
import { IActionConfig } from 'apps/entity-details/types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';
import {
  IMarvinData,
  IResponseFilterConfig,
  IRowActionConfig
} from '../../components/smartview-tab/smartview-tab.types';
import { getCustomActionsFromCache } from 'common/utils/entity-data-manager/lead/custom-actions';
import { ICustomActions, CustomActionsKeys } from 'common/types/entity/lead/custom-actions.types';
import {
  ActivityBaseAttributeDataType,
  DataType,
  IConnectorConfig
} from 'common/types/entity/lead';
import { RenderType } from 'common/types/entity/lead';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { isRestricted } from 'common/utils/permission-manager';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import {
  FilterRenderType,
  DATE_FILTER,
  OptionSeperator,
  NOT_SET
} from '../../components/smartview-tab/components/filter-renderer/constants';
import {
  ACTIVITY_DATE_TYPE_FILTER,
  ACTIVITY_DATE_VALUE_FILTER_MAP,
  ACTIVITY_PRODUCT_VALUE_TYPE_FILTER,
  ConditionEntityType,
  TabType
} from '../../constants/constants';
import { IUserPermission } from '../../smartviews.types';
import {
  setActionProperties,
  getTooltipContent,
  updateGridDataAfterPause,
  isSmartviewTab,
  appendProcessActions,
  isLeadSchema
} from '../../utils/utils';
import { EntityType } from 'common/utils/entity-data-manager/activity/activity.types';
import { IAugmentedSmartViewEntityMetadata } from '../common-utilities/common.types';
import { API_ROUTES } from 'common/constants';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { IDateOption } from 'common/component-lib/date-filter';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { getDefaultFilterValue, getLeadRenderType } from '../common-utilities/tab-settings';
import { getSettingConfig, safeParseJson, settingKeys } from 'common/utils/helpers';
import { ACTION } from 'apps/entity-details/constants';
import {
  ASSOCIATED_TO,
  PLATFORM_DATE_OPTION,
  PLATFORM_FILTER_SELECT_ALL_VALUE
} from '../common-utilities/constant';
import { getUserStandardTimeZone, removeSchemaPrefix } from '../../components/smartview-tab/utils';
import {
  getDateFilterOnValue,
  getDateFilterValueFromSettings,
  getLeadDefaultFilterValue,
  getNormalizedAdvancedSearch,
  getSelectedValue,
  hiddenProcessForms
} from '../common-utilities/utils';
import { filterActionById } from '../common-utilities/actions';
import { TABS_DEFAULT_ID } from 'src/apps/smart-views/constants/constants';
import activityDataManager from 'common/utils/entity-data-manager/activity';
import { getRestrictionMap } from 'common/utils/permission-manager/permission-manager';
import { OPTIONS_OBJ } from 'common/component-lib/date-filter/constants';
import { convertToISO } from '@lsq/nextgen-preact/date/utils';
import { manageActivityRowActions } from '../../components/custom-tabs/manage-activity-tab/constants';
// eslint-disable-next-line complexity
export const getFilteredRowActions = (
  entityCode: string,
  allowedActions?: string,
  isManageTab?: boolean
): IActionConfig[] => {
  let rowActions = isManageTab
    ? filterActionById([...manageActivityRowActions(entityCode)], allowedActions)
    : filterActionById([...activityRowActions], allowedActions);
  if (
    entityCode === ActivityCodes.SALES_ACTIVITY ||
    entityCode === ActivityCodes.CANCELLED_SALES_ACTIVITY
  ) {
    rowActions = rowActions.filter((action) => action.key !== actionKeys.delete);
  } else {
    rowActions = rowActions.filter((action) => action.key !== actionKeys.cancel);
  }
  if (entityCode && RESTRICT_ROW_ACTIONS_EVENT_CODES[entityCode]) {
    rowActions = [];
  }
  if (
    entityCode === ActivityCodes.SMS_SEND_ACTIVITY ||
    entityCode === ActivityCodes.SMS_RECEIVED_ACTIVITY
  ) {
    rowActions = rowActions.filter(
      (action) => action.key !== actionKeys.delete && action.key !== actionKeys.cancel
    );
  }
  if (!entityCode || !allowedActivityActions[entityCode]) return rowActions;

  const allowedActivityActionsList = allowedActivityActions[entityCode] || {};
  return rowActions.filter((rowAction) => {
    return (
      rowAction.id === ACTION.Converse ||
      allowedActivityActionsList?.allowedRowActions.some((key) => rowAction.key === key)
    );
  });
};

const updateRowAction = ({
  action,
  disableDelete,
  disableUpdate
}: {
  action: IActionConfig;
  disableDelete: boolean;
  disableUpdate: boolean;
}): IActionConfig => {
  let clonedAction = { ...action };
  switch (clonedAction?.key) {
    case actionKeys.delete:
      clonedAction = setActionProperties(
        clonedAction,
        disableDelete,
        getTooltipContent(disableDelete)
      ) as IActionConfig;
      break;
    case actionKeys.edit:
      clonedAction = setActionProperties(
        clonedAction,
        disableUpdate,
        getTooltipContent(disableUpdate)
      ) as IActionConfig;
      break;
    default:
      break;
  }
  return clonedAction;
};
const canExcludeConverseAction = (
  item: { id: string },
  converseSetting?: { IsEnabled?: boolean }
): boolean => {
  return item.id === ACTION.Converse && !converseSetting?.IsEnabled;
};

const actionsReducer = ({
  item,
  isMarvinTab,
  tabId,
  CanDelete,
  moreActions,
  actionConfig,
  quickActions,
  userPermissions,
  converseSetting,
  commonTabSettings,
  isManageTab
}: {
  item: IActionConfig;
  actionConfig?: ISvActionConfig;
  moreActions: IActionMenuItem[];
  quickActions: IActionConfig[];
  isMarvinTab?: boolean;
  tabId?: string;
  CanDelete?: boolean;
  userPermissions?: IUserPermission;
  converseSetting?: Record<string, boolean>;
  commonTabSettings?: ICommonTabSettings;
  isManageTab?: boolean;
}): IActionMenuItem[] => {
  item = updateRowAction({
    action: item,
    disableDelete: !userPermissions?.delete,
    disableUpdate: !userPermissions?.update
  });
  if (item.key) {
    if (item.key === actionKeys.delete && !CanDelete) {
      item.disabled = true;
      item.toolTip = 'Delete disabled for this activity';
    }
    if (canExcludeConverseAction(item, converseSetting)) return moreActions;
    if (item.workAreaConfig && !isManageTab) {
      item.workAreaConfig = {
        ...item.workAreaConfig,
        additionalData: tabId,
        fallbackAdditionalData: TABS_DEFAULT_ID
      };
    }
    const isQuickAction = actionConfig?.QuickActions?.split(',')?.includes(item.key);
    const isHiddenAction = actionConfig?.HiddenActions?.split(',')?.includes(item.key);
    const hiddenActionsMap = hiddenProcessForms(actionConfig);
    if (
      (!isMarvinTab && isQuickAction) ||
      (isMarvinTab && defaultQuickActions.includes(item.key)) ||
      commonTabSettings?.rowActions?.quickActions?.includes(item?.id)
    ) {
      quickActions.push({
        ...item,
        value: item.key,
        isQuickAction: true,
        hiddenActions: hiddenActionsMap,
        label: item.title
      });
    }
    if (!isHiddenAction) {
      moreActions.push({
        ...item,
        label: item.title,
        value: item.key,
        hiddenActions: hiddenActionsMap
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
  isMarvinTab,
  tabId,
  activityType
}: {
  customActions?: ICustomActions;
  moreActions: IActionMenuItem[];
  actionConfig?: ISvActionConfig;
  quickActions: IActionConfig[];
  isMarvinTab?: boolean;
  tabId?: string;
  activityType: string;
}): void => {
  if (customActions?.Single) {
    Object.keys(customActions?.Single)?.forEach((key) => {
      const actions = customActions?.Single?.[key] as IConnectorConfig[];
      if (actions?.length) {
        const actionSubmenu = [] as IActionMenuItem[];
        actions.forEach((item) => {
          if (item?.ActivityType == activityType)
            actionsReducer({
              item: {
                id: item.Id,
                title: item.Config.DisplayText,
                toolTip: item.Config.DisplayText,
                connectorConfig: item,
                key: item.Id,
                actionHandler: {}
              },
              tabId,
              isMarvinTab,
              quickActions,
              actionConfig,
              moreActions: actionSubmenu
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
              actionHandler: {}
            });
          }
        }
      }
    });
  }
};

const fetchPermission = async (entityId: string, action: ActionType): Promise<boolean> => {
  return isRestricted({
    entity: PermissionEntityType.Activity,
    entityId: entityId,
    action,
    callerSource: CallerSource.SmartViews
  });
};

export const fetchUserPermissions = async (entityCode: string): Promise<IUserPermission> => {
  const actions = [
    ActionType.Update,
    ActionType.BulkUpdate,
    ActionType.Delete,
    ActionType.BulkDelete,
    ActionType.Create
  ];

  const promises = actions.map((action) => fetchPermission(entityCode, action));

  const results = await Promise.allSettled(promises);

  const permissions = results.map((result) =>
    result.status === 'fulfilled' ? result.value : null
  );

  return {
    update: !permissions[0],
    bulkUpdate: !permissions[1],
    delete: !permissions[2],
    bulkDelete: !permissions[3],
    createActivity: !permissions[4]
  };
};

export const getActivtyRowActions = async ({
  tabId,
  isMarvinTab,
  actionConfig,
  activityType,
  userPermissions,
  commonTabSettings,
  isManageTab
}: {
  tabId?: string;
  isMarvinTab?: boolean;
  activityType: string;
  userPermissions?: IUserPermission;
  actionConfig?: ISvActionConfig;
  commonTabSettings?: ICommonTabSettings;
  isManageTab?: boolean;
}): Promise<IRowActionConfig> => {
  const quickActions: IActionConfig[] = [];
  const [customActions, converseSetting, activityMetaData] = await Promise.all([
    getCustomActionsFromCache(CallerSource.SmartViews, EntityType.Activity),
    getSettingConfig(settingKeys.ConverseConfiguration, CallerSource.SmartViews),
    activityDataManager.fetchMetaData(parseInt(activityType, 10), CallerSource.SmartViews)
  ]);

  const { CanDelete = true } = activityMetaData ?? {};
  const moreActions = getFilteredRowActions(
    activityType,
    commonTabSettings?.rowActions?.allowedActions,
    isManageTab
  ).reduce((acc: IActionMenuItem[], item) => {
    return actionsReducer({
      actionConfig,
      item,
      moreActions: acc,
      tabId,
      isMarvinTab,
      quickActions,
      userPermissions,
      converseSetting: safeParseJson(converseSetting as string) ?? {},
      commonTabSettings,
      CanDelete,
      isManageTab
    });
  }, [] as IActionMenuItem[]);

  appendCustomActions({
    moreActions,
    customActions,
    quickActions,
    tabId,
    isMarvinTab,
    actionConfig,
    activityType
  });
  return appendProcessActions({
    tabId,
    moreActions,
    quickActions,
    quickActionsOrder: actionConfig?.QuickActions || ''
  });
};

const getBulkCustomActions = async (activityType: string): Promise<IConnectorConfig[]> => {
  const customActions = await getCustomActionsFromCache(
    CallerSource.SmartViews,
    EntityType.Activity
  );
  let customActionsObj: IConnectorConfig[] = [];
  const bulkCustomActions = customActions?.Multiple || {};
  if (bulkCustomActions) {
    Object.keys(bulkCustomActions).forEach((key) => {
      const filteredOptions = (bulkCustomActions[key] as IConnectorConfig[]).filter(
        (item) => item.ActivityType == activityType
      );
      customActionsObj = customActionsObj.concat(filteredOptions);
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
      id: ACTION.CustomActions,
      value: CustomActionsKeys.CustomActions,
      connectorConfig: action
    });
  });
  Object.keys(categoryCustomActions).forEach((category) => {
    if (categoryCustomActions[category].length > 1 && bulkActions.length > 3) {
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
  disabledBulkUpdate
}: {
  action: IMenuItem;
  disabledBulkUpdate: boolean;
}): IMenuItem => {
  let clonedAction = { ...action };
  switch (clonedAction.value) {
    case BulkActionKeys.BulkUpdate:
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

export const getActivityBulkActions = async ({
  userPermissions,
  activityType
}: {
  userPermissions: IUserPermission;
  activityType: string;
}): Promise<IMenuItem[]> => {
  let bulkActions = activityBulkActions;
  const disabledBulkUpdate =
    !userPermissions?.bulkUpdate ||
    !userPermissions?.update ||
    RESTRICT_BULK_UPDATE_EVENT_CODES[activityType];
  bulkActions = bulkActions.map((action) => {
    return updateBulkAction({
      action,
      disabledBulkUpdate
    });
  });
  const bulkCustomActions = await getBulkCustomActions(activityType);
  appendBulkCustomActions(bulkActions, bulkCustomActions);
  return bulkActions;
};

const canAddOwner = (
  isOwnerIdNotPresent?: boolean
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  return isOwnerIdNotPresent
    ? {
        Owner: {
          displayName: 'Owner',
          schemaName: 'Owner',
          dataType: DataType.ActiveUsers,
          renderType: RenderType.Text,
          conditionEntityType: ConditionEntityType.Activity
        }
      }
    : {};
};

const canAddStatus = (
  isStatusNotPresent?: boolean
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  return isStatusNotPresent
    ? {
        Status: {
          displayName: 'Status',
          schemaName: 'Status',
          dataType: DataType.SearchableDropdown,
          renderType: RenderType.SearchableDropDown,
          conditionEntityType: ConditionEntityType.Activity
        }
      }
    : {};
};

const canAddNotes = (
  isNotesNotPresent?: boolean
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  return isNotesNotPresent
    ? {
        ['ActivityEvent_Note']: {
          displayName: 'Notes',
          schemaName: 'ActivityEvent_Note',
          dataType: DataType.String,
          renderType: RenderType.HTML,
          conditionEntityType: ConditionEntityType.Activity
        }
      }
    : {};
};

const customFormedActivityMetadata = ({
  code,
  isActivityNoteNotPresent,
  isOwnerIdNotPresent,
  statusNotPresent
}: {
  code: string;
  isOwnerIdNotPresent?: boolean;
  isActivityNoteNotPresent?: boolean;
  statusNotPresent?: boolean;
}): Record<string, IAugmentedSmartViewEntityMetadata> => {
  let customFields = {
    PACreatedOn: {
      displayName: 'Activity Date',
      schemaName: 'PACreatedOn',
      renderType: RenderType.DateTime,
      dataType: DataType.DateTime,
      conditionEntityType: ConditionEntityType.Activity,
      isSortable: true
    },
    PAModifiedOn: {
      displayName: 'Activity Modified On',
      schemaName: 'PAModifiedOn',
      renderType: RenderType.DateTime,
      dataType: DataType.DateTime,
      conditionEntityType: ConditionEntityType.Activity,
      isSortable: true
    },
    PACreatedByName: {
      displayName: 'Activity Added By ',
      schemaName: 'PACreatedByName',
      dataType: DataType.Lead,
      renderType: RenderType.Text,
      conditionEntityType: ConditionEntityType.Activity
    }
  };
  if (!PORTAL_ENTITY_CODE[code]) {
    customFields = {
      ...customFields,
      ...canAddOwner(isOwnerIdNotPresent),
      ...canAddStatus(statusNotPresent)
    };
  }

  if (!NOTES_NOT_ALLOWED[code]) {
    customFields = { ...customFields, ...canAddNotes(isActivityNoteNotPresent) };
  }

  return customFields;
};

const customMetaDataForLead = (): Record<string, IAugmentedSmartViewEntityMetadata> => {
  return {
    LeadIdentifier: {
      displayName: ASSOCIATED_TO,
      schemaName: 'LeadIdentifier',
      renderType: RenderType.Lead,
      conditionEntityType: ConditionEntityType.Lead,
      isSortable: true
    }
  };
};

const getActivityFieldRenderType = (
  metaData: Record<string, IAugmentedSmartViewEntityMetadata>,
  filter: string
): FilterRenderType => {
  const fieldMetaData = metaData[filter];
  const dataType = fieldMetaData?.dataType;

  if (isLeadSchema(fieldMetaData?.schemaName)) {
    return getLeadRenderType(metaData, filter);
  }
  // when dropdown is dependent, it will be rendered as grouped dropdown
  if (fieldMetaData?.parentField) {
    return FilterRenderType.GroupedMSWithoutSelectAll;
  }
  if ([DataType.Date, DataType?.DateTime]?.includes(dataType as DataType)) {
    return FilterRenderType.DateTime;
  }
  if (dataType === DataType.Product) {
    return FilterRenderType.SearchableSingleSelect;
  }
  if (
    [
      DataType.Select,
      DataType.MultiSelect,
      DataType?.SearchableDropdown,
      DataType?.Dropdown,
      DataType?.LargeOptionSet,
      DataType?.Product
    ].includes(dataType as DataType)
  ) {
    return FilterRenderType.MSWithoutSelectAll;
  }
  if (
    OWNER_DROPDOWN_SCHEMA[fieldMetaData?.schemaName] ||
    fieldMetaData?.dataType === DataType?.ActiveUsers
  ) {
    return FilterRenderType.UserDropdown;
  }

  return FilterRenderType.None;
};

const handleDeleteActivity = async (customConfig?: Record<string, string>): Promise<void> => {
  const activityId = customConfig?.ProspectActivityId || '';
  try {
    await httpPost({
      path: `${API_ROUTES.activityDelete}${activityId}`,
      module: Module.Marvin,
      body: {
        id: activityId
      },
      callerSource: CallerSource.SmartViews
    });
    showNotification({
      type: Type.SUCCESS,
      message: '1 Activity deleted successfully'
    });
    updateGridDataAfterPause();
  } catch (err) {
    trackError(err);
    showNotification({
      type: Type.ERROR,
      message: `${err?.response?.ExceptionMessage || err?.message || ERROR_MSG.generic}`
    });
  }
};

const getProductConfig = (
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>
): IAugmentedSmartViewEntityMetadata | null => {
  if (!metaDataMap) return null;

  let productConfig: IAugmentedSmartViewEntityMetadata | null = null;
  Object.values(metaDataMap)?.some((config) => {
    if (config?.dataType === DataType?.Product) {
      productConfig = config;
      return true;
    }
    return false;
  });

  return productConfig;
};

const handleDefaultFilterForSalesActivity = (
  filters: string,
  entityCode: string,
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>
): string => {
  let defaultFilters = filters;
  const isSalesActivityTab = !!SALES_ACTIVITY_TAB[entityCode];

  if (isSalesActivityTab) {
    defaultFilters = defaultFilters?.replaceAll('Owner', SALES_DEFAULT_FILTER?.Owner);
  }
  const productSchemaName = getProductConfig(metaDataMap);
  if (productSchemaName?.schemaName) {
    defaultFilters = `${defaultFilters},${productSchemaName?.schemaName}`;
  }
  return defaultFilters;
};

const getActivityDefaultColumns = (code: string = ''): string => {
  const defaultColumns = {
    [ActivityCodes.SALES_ACTIVITY]:
      'CheckBoxColumn,LeadIdentifier,mx_Custom_1,mx_Custom_2,mx_Custom_3,mx_Custom_4',
    [ActivityCodes.CANCELLED_SALES_ACTIVITY]:
      'CheckBoxColumn,LeadIdentifier,mx_Custom_1,mx_Custom_2,mx_Custom_3,mx_Custom_4',
    [ActivityCodes.INBOUND_PHONE_CALL_ACTIVITY]:
      'CheckBoxColumn,LeadIdentifier,mx_Custom_2,Status,mx_Custom_3,mx_Custom_4,Owner',
    [ActivityCodes.OUTBOUND_PHONE_CALL_ACTIVITY]:
      'CheckBoxColumn,LeadIdentifier,mx_Custom_2,Status,mx_Custom_3,mx_Custom_4,Owner',
    [ActivityCodes.PORTAL_REGISTRATION_CONSTANTS]:
      'CheckBoxColumn,LeadIdentifier,PACreatedOn,Owner,Status',
    [ActivityCodes.PORTAL_PUBLISHER_TRACKING_EVENT_CONSTANTS]:
      'CheckBoxColumn,LeadIdentifier,PACreatedOn,Owner,Status,ActivityEvent_Note',
    [ActivityCodes.SMS_RECEIVED_ACTIVITY]:
      'CheckBoxColumn,LeadIdentifier,mx_Custom_8,ActivityEvent_Note,PACreatedOn,Status'
  };

  return defaultColumns[code]
    ? defaultColumns[code]
    : 'CheckBoxColumn,LeadIdentifier,ActivityEvent_Note,PACreatedOn,Owner,Status';
};

const getUpdatedSchemaName = (schemaName: string, entityCode: string): string => {
  if (schemaName === SALES_DEFAULT_FILTER.Product && !SALES_ACTIVITY_TAB[entityCode])
    return schemaName;

  return (PlatformSettingsSchemaMap[schemaName] as string) || schemaName;
};

const getProductValue = (productValue: unknown): IOption[] => {
  const productStringValue = productValue?.toString() || '';
  if (PLATFORM_FILTER_SELECT_ALL_VALUE.includes(productStringValue?.toLowerCase())) {
    return [];
  }
  const product = productStringValue
    .replace('multiselect-all', '')
    ?.split(',')
    ?.filter((value) => value);

  return product?.map((option) => ({ label: '', value: option }));
};

const canEnableDateTimePickerInDateFilter = (
  renderType: FilterRenderType,
  dataType?: string,
  conditionEntityType?: ConditionEntityType
): boolean => {
  return !!(
    renderType === FilterRenderType.DateTime &&
    dataType?.toLowerCase() === DataType.DateTime?.toLowerCase() &&
    conditionEntityType === ConditionEntityType.Activity
  );
};

const getActivityDefaultFilterValue = (config: {
  parsedFilters: Record<string, string>;
  renderType: FilterRenderType;
  schema: string;
  entityCode: string;
  dataType: string;
}): IOption[] | IDateOption => {
  const { parsedFilters, renderType, schema, dataType, entityCode } = config;
  if (dataType === DataType.Product) {
    return getProductValue(parsedFilters?.ProductCode);
  }

  const updatedSchema = (PlatformSettingsSchemaMap[schema] as string) || schema;

  const dateFilterValue = getDateFilterOnValue({
    dateFilterOnFrom: `${parsedFilters?.DateRangeFrom} ${
      parsedFilters?.DateRangeFromTime || ''
    }`?.trim(),
    dateFilterOnTo: `${parsedFilters?.DateRangeTo} ${parsedFilters?.DateRangeToTime || ''}`?.trim(),
    dateFilterOnValue: parsedFilters?.CustomDateKey,
    parsedFilters,
    platformSettingsDateFilter: ACTIVITY_DATE_TYPE_FILTER,
    renderType,
    updatedSchema,
    isDateTimeCustomDate: canEnableDateTimePickerInDateFilter(
      renderType,
      dataType,
      ConditionEntityType.Activity
    )
  });

  return (
    dateFilterValue ||
    getDefaultFilterValue({
      renderType,
      value: parsedFilters[getUpdatedSchemaName(schema, entityCode)]
    })
  );
};

const getUpdatedActivitySchemaName = (schema: string): string => {
  if (ACTIVITY_DATE_VALUE_FILTER_MAP[schema]) return ACTIVITY_DATE_VALUE_FILTER_MAP[schema];
  if (ACTIVITY_PRODUCT_VALUE_TYPE_FILTER[schema]) return ACTIVITY_PRODUCT_VALUE_TYPE_FILTER[schema];
  return schema;
};

const getSmartviewsActivityDefaultFilterValue = (config: {
  parsedFilters: Record<string, string>;
  renderType: FilterRenderType;
  schema: string;
  entityCode: string;
  dataType: string;
}): IOption[] | IDateOption => {
  const { parsedFilters, renderType, schema } = config;

  const updatedSchema = getUpdatedActivitySchemaName(schema);

  const value = parsedFilters?.[updatedSchema];

  if (schema === 'Status' && value === '{{MXEmpty}}') {
    return [NOT_SET];
  }

  if (renderType === FilterRenderType.DateTime) {
    let from = '';
    let to = '';

    if (value === PLATFORM_DATE_OPTION.CUSTOM) {
      const dateValue = parsedFilters?.[`${updatedSchema}_dateRange`];
      const dateValueArray = dateValue?.split('-');
      [from, to] = dateValueArray;
      return {
        ...OPTIONS_OBJ.CUSTOM,
        startDate: convertToISO(from?.trim()),
        endDate: convertToISO(to?.trim())
      };
    }
    return getDateFilterValueFromSettings({
      value: value,
      from,
      to,
      isDateTimeCustomDate: false
    });
  }
  return getActivityDefaultFilterValue(config);
};

const findLeadDefaultFilterValues = ({
  parsedFilters,
  renderType,
  schema,
  isManageTab
}: {
  parsedFilters: Record<string, string>;
  renderType: FilterRenderType;
  schema: string;
  isManageTab?: boolean;
}): IDateOption | IOption[] => {
  const value = parsedFilters?.[schema];

  if (renderType === FilterRenderType.DateTime) {
    let from = '';
    let to = '';

    if (value === PLATFORM_DATE_OPTION.CUSTOM) {
      const dateValue = parsedFilters?.[`${schema}_dateRange`];
      const dateValueArray = dateValue?.split('-');
      [from, to] = dateValueArray;
      if (!isManageTab) {
        return {
          ...OPTIONS_OBJ.CUSTOM,
          startDate: convertToISO(from?.trim()),
          endDate: convertToISO(to?.trim())
        };
      }
    }
    return getDateFilterValueFromSettings({
      value: value,
      from,
      to,
      isDateTimeCustomDate: false
    });
  }
  return getLeadDefaultFilterValue({
    parsedFilters,
    renderType,
    schemaName: removeSchemaPrefix(schema)
  });
};

const getInitialFilterSelectedValue = ({
  schema,
  filterValues,
  renderType,
  metadataMap,
  additionalData,
  parsedFilters,
  entityCode,
  isManageTab,
  ignoreCache
}: {
  schema: string;
  filterValues: IResponseFilterConfig;
  renderType: FilterRenderType;
  metadataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  additionalData: IMarvinData;
  parsedFilters: Record<string, string>;
  entityCode: string;
  isManageTab?: boolean;
  ignoreCache?: boolean;
}): IOption[] | IDateOption => {
  // if filter data is already there in user personalization cache
  if (filterValues[schema] && !ignoreCache) {
    return getSelectedValue(filterValues, schema, renderType);
  }

  //if user personalization cache does not exist, then get the default values applied from SmartViews Settings
  if (!additionalData?.Marvin?.Exists || ignoreCache) {
    const config = metadataMap[schema];

    if (!config) return [];

    if (isLeadSchema(schema)) {
      return findLeadDefaultFilterValues({
        parsedFilters: parsedFilters,
        renderType: renderType,
        schema: removeSchemaPrefix(schema),
        isManageTab: isManageTab
      });
    }

    if (!isManageTab) {
      return getSmartviewsActivityDefaultFilterValue({
        parsedFilters,
        dataType: config?.dataType ?? '',
        entityCode: entityCode,
        renderType,
        schema
      });
    }

    return getActivityDefaultFilterValue({
      parsedFilters,
      dataType: config?.dataType || '',
      entityCode: entityCode,
      renderType,
      schema
    });
  }
  return renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
};
const isSortable = (attribute: IAugmentedSmartViewEntityMetadata, entityCode: string): boolean => {
  if (attribute?.parentSchemaName) {
    return !!attribute?.isSortable;
  }
  return (
    !nonSortableFields[attribute.schemaName] &&
    (!SALES_ACTIVITY_TAB[entityCode] || !nonSortableSalesActivityFields[attribute.schemaName]) &&
    attribute.dataType !== ActivityBaseAttributeDataType.ActiveUsers &&
    attribute.dataType !== ActivityBaseAttributeDataType.CustomObject
  );
};

const getAdvancedSearchText = (
  tabFilters: string,
  tabData: ITabResponse,
  additionalData: IMarvinData
): string => {
  const marvinData = additionalData?.Marvin;
  const entityCode = tabData?.EntityCode;

  if (marvinData && 'AdvancedSearchText' in marvinData) {
    return marvinData?.AdvancedSearchText;
  }

  const parsedFilters = (safeParseJson(tabFilters) || {}) as Record<string, string>;
  return getNormalizedAdvancedSearch(parsedFilters?.AdvancedSearch, entityCode, TabType.Activity);
};

export const getEntityCodes = (additionalData: IMarvinData, tabEntityCode: string): string => {
  return (
    (additionalData?.Marvin?.EntityCode || tabEntityCode || '-1').replaceAll(
      OptionSeperator.MXSeparator,
      ','
    ) || ''
  );
};

const getActivityAdvancedSearch = (tabData: ITabResponse): string => {
  const tabFetchCriteria = tabData?.TabContentConfiguration?.FetchCriteria;
  const additionalData = safeParseJson(tabFetchCriteria?.AdditionalData) as IMarvinData;

  const currentAdvancedSearchText = getAdvancedSearchText(
    tabFetchCriteria?.Filters,
    tabData,
    additionalData
  );

  if (!isSmartviewTab(tabData.Id)) {
    return currentAdvancedSearchText;
  }
  const advanceSearchValue = `{"GrpConOp":"And","Conditions":[{"Type":"Activity","ConOp":"and","RowCondition":[{"SubConOp":"And","LSO":"ActivityEvent","LSO_Type":"PAEvent","Operator":"eq","RSO":"${getEntityCodes(
    additionalData,
    tabData?.EntityCode
  )}"}]}],"QueryTimeZone":"${getUserStandardTimeZone()}"}`;

  if (tabFetchCriteria?.Filters?.indexOf(`AdvancedSearch":"`) > -1)
    return currentAdvancedSearchText || advanceSearchValue;

  return advanceSearchValue;
};

const getEligibleActivityFilterConfig = (
  activityMetaData: Record<string, IAugmentedSmartViewEntityMetadata>
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  const filteredMetaData = {};

  const { allowedDataType, disallowedFilter } = ActivityManageFilterConfig;

  Object.values(activityMetaData)?.map((config) => {
    const { schemaName, dataType, isCFS } = config;
    if (isCFS || disallowedFilter[schemaName]) {
      return;
    }
    if (allowedDataType?.[dataType || '']) {
      filteredMetaData[schemaName] = config;
    }
  });

  return filteredMetaData;
};

const getSchemaNames = (filters: string[]): string[] =>
  filters?.map((schema) => removeSchemaPrefix(schema));

const getUnRestrictedFields = async (
  schemaNames: string[],
  entityCode: string
): Promise<string[]> => {
  try {
    const [activityRestriction, leadRestriction] = await Promise.all([
      await getRestrictionMap(getSchemaNames(schemaNames), {
        entity: PermissionEntityType.Activity,
        action: ActionType.View,
        entityId: entityCode,
        callerSource: CallerSource.SmartViews
      }),
      await getRestrictionMap(getSchemaNames(schemaNames), {
        entity: PermissionEntityType.Lead,
        action: ActionType.View,
        callerSource: CallerSource.SmartViews
      })
    ]);

    return schemaNames?.filter((filter) => {
      if (isLeadSchema(filter)) {
        return !leadRestriction[removeSchemaPrefix(filter)];
      }
      return !activityRestriction[removeSchemaPrefix(filter)];
    });
  } catch (error) {
    trackError(error);
    return [];
  }
};

export {
  isSortable,
  customFormedActivityMetadata,
  getActivityFieldRenderType,
  handleDeleteActivity,
  customMetaDataForLead,
  handleDefaultFilterForSalesActivity,
  getActivityDefaultColumns,
  getInitialFilterSelectedValue,
  getActivityAdvancedSearch,
  getEligibleActivityFilterConfig,
  canEnableDateTimePickerInDateFilter,
  getUnRestrictedFields
};
