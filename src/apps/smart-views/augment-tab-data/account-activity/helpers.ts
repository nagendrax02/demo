import { trackError } from 'common/utils/experience/utils/track-error';
import {
  defaultQuickActions,
  activityRowActions,
  actionKeys,
  platformSettingsSchemaMap,
  nonSortableFields,
  ActivityManageFilterConfig
} from './constants';
import { ICommonTabSettings, ISvActionConfig, IUserPermission } from '../../smartviews.types';
import { IActionConfig } from 'apps/entity-details/types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';
import {
  IMarvinData,
  IRecordType,
  IResponseFilterConfig,
  IRowActionConfig
} from '../../components/smartview-tab/smartview-tab.types';
import { ActivityBaseAttributeDataType, DataType, RenderType } from 'common/types/entity/lead';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import {
  FilterRenderType,
  DATE_FILTER
} from '../../components/smartview-tab/components/filter-renderer/constants';
import { ACCOUNT_SCHEMA_PREFIX, ConditionEntityType } from '../../constants/constants';
import {
  setActionProperties,
  getTooltipContent,
  updateGridDataAfterPause,
  isAccountSchemaName
} from '../../utils/utils';
import { IAugmentedSmartViewEntityMetadata } from '../common-utilities/common.types';
import { API_ROUTES } from 'common/constants';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { IDateOption } from 'common/component-lib/date-filter';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import {
  getDefaultFilterValue,
  getAccountFilterRenderType
} from '../common-utilities/tab-settings';
import { CHECKBOX_COLUMN, PLATFORM_DATE_OPTION } from '../common-utilities/constant';
import { removeSchemaPrefix } from '../../components/smartview-tab/utils';
import { getAccountActivityMetaData } from 'common/utils/entity-data-manager/account-activity';

import {
  getDateFilterValueFromSettings,
  getEntityRowActions,
  getSelectedValue
} from '../common-utilities/utils';
import { filterActionById } from '../common-utilities/actions';
import { getRestrictionMap } from 'common/utils/permission-manager/permission-manager';
import { IActionReducer } from './account-activity.types';
import { getUserNames } from 'common/component-lib/user-name';

export const canEnableDateTimePicker = (renderType: string, dataType?: string): boolean => {
  return (
    renderType?.toLowerCase() === RenderType.DateTime.toLowerCase() ||
    dataType?.toLowerCase() === DataType.DateTime.toLowerCase()
  );
};
export const handleUserInActivity = (
  records: IRecordType[],
  id: string,
  metaDataMap?: Record<string, IAugmentedSmartViewEntityMetadata>
): void => {
  const userIds: string[] = [];

  records?.forEach((rec) => {
    const schemas = Object.keys(rec);
    schemas?.forEach((schema) => {
      if (metaDataMap?.[schema]?.dataType === DataType.ActiveUsers && rec?.[schema]) {
        userIds.push(rec[schema] || '');
      }
    });
  });

  window[`USER_FIELDS_${id}`] = getUserNames(userIds, CallerSource.SmartViews);
};

export const getFilteredRowActions = (allowedActions?: string): IActionConfig[] => {
  return filterActionById([...activityRowActions], allowedActions);
};

const updateRowAction = ({
  action,
  disableDelete,
  disableUpdate,
  canDeleteFromSetting
}: {
  action: IActionConfig;
  disableDelete: boolean;
  disableUpdate: boolean;
  canDeleteFromSetting?: boolean;
}): IActionConfig => {
  let clonedAction = { ...action };

  switch (clonedAction?.key) {
    case actionKeys.delete:
      clonedAction = setActionProperties(
        clonedAction,
        !!(disableDelete || !canDeleteFromSetting),
        !canDeleteFromSetting
          ? 'Delete disabled for this activity'
          : getTooltipContent(disableDelete)
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

const canBeQuickAction = ({
  isMarvinTab,
  action,
  commonTabSettings,
  isQuickAction
}: {
  action: IActionConfig;
  isQuickAction?: boolean;
  isMarvinTab?: boolean;
  commonTabSettings?: ICommonTabSettings;
}): boolean => {
  if (!isMarvinTab) return !!isQuickAction;
  if (isMarvinTab && action.key) return defaultQuickActions.includes(action.key);
  return !!commonTabSettings?.rowActions?.quickActions?.includes(action?.id);
};

const actionsReducer = ({
  item,
  isMarvinTab,
  canDelete,
  moreActions,
  actionConfig,
  quickActions,
  userPermissions,
  commonTabSettings
}: IActionReducer): IActionMenuItem[] => {
  item = updateRowAction({
    action: item,
    disableDelete: !userPermissions?.delete,
    disableUpdate: !userPermissions?.update,
    canDeleteFromSetting: canDelete
  });

  if (item.key) {
    const isQuickAction = actionConfig?.QuickActions?.split(',')?.includes(item.key);
    const isHiddenAction = actionConfig?.HiddenActions?.split(',')?.includes(item.key);
    if (canBeQuickAction({ isMarvinTab, action: item, commonTabSettings, isQuickAction })) {
      quickActions.push({
        ...item,
        value: item.key,
        isQuickAction: true,
        label: item.title
      });
    }
    //Both edit and delete actions will be part of quick action for Marvin tabs
    if (!isHiddenAction && !isMarvinTab) {
      moreActions.push({
        ...item,
        label: item.title,
        value: item.key
      });
    }
  }
  return moreActions;
};

export const fetchUserPermissions = async (): Promise<IUserPermission> => {
  return {
    update: true,
    bulkUpdate: true,
    delete: true,
    bulkDelete: true,
    createActivity: true
  };
};

export const getActivityRowActions = async ({
  isMarvinTab,
  actionConfig,
  activityEventCode,
  userPermissions,
  commonTabSettings
}: {
  isMarvinTab?: boolean;
  activityEventCode: string;
  userPermissions?: IUserPermission;
  actionConfig?: ISvActionConfig;
  commonTabSettings?: ICommonTabSettings;
}): Promise<IRowActionConfig> => {
  const activityMetaData = await getAccountActivityMetaData(
    Number(activityEventCode),
    CallerSource.SmartViews
  );

  const { CanDelete } = activityMetaData ?? {};

  const actions = filterActionById(
    [...activityRowActions],
    commonTabSettings?.rowActions?.allowedActions
  );

  const quickActions: IActionConfig[] = [];
  const moreActions = actions.reduce((acc: IActionMenuItem[], item) => {
    return actionsReducer({
      actionConfig,
      item,
      moreActions: acc,
      isMarvinTab,
      quickActions,
      userPermissions,
      commonTabSettings,
      canDelete: CanDelete
    });
  }, [] as IActionMenuItem[]);

  return getEntityRowActions({
    moreActions,
    quickActions
  });
};

export const getUpdatedColumns = (columns: string[]): string => {
  return columns?.join(',')?.replaceAll(`${CHECKBOX_COLUMN},`, '');
};

export const customActivityFields = (): Record<string, IAugmentedSmartViewEntityMetadata> => {
  const ActivityDate = 'ActivityDate';
  const modifiedOn = 'ModifiedOn';
  const createdBy = 'CreatedBy';
  const modifiedBy = 'ModifiedBy';
  return {
    [ActivityDate]: {
      displayName: 'Activity Date',
      schemaName: ActivityDate,
      renderType: RenderType.DateTime,
      dataType: DataType.DateTime,
      conditionEntityType: ConditionEntityType.CompanyActivity,
      isSortable: true
    },
    [modifiedOn]: {
      displayName: 'Activity Modified On',
      schemaName: modifiedOn,
      renderType: RenderType.DateTime,
      dataType: DataType.DateTime,
      conditionEntityType: ConditionEntityType.CompanyActivity,
      isSortable: true
    },
    [createdBy]: {
      displayName: 'Activity Added By',
      schemaName: createdBy,
      dataType: DataType.ActiveUsers,
      renderType: RenderType.Text,
      conditionEntityType: ConditionEntityType.CompanyActivity
    },
    [modifiedBy]: {
      displayName: 'Activity Modified By',
      schemaName: modifiedBy,
      dataType: DataType.ActiveUsers,
      renderType: RenderType.ActiveUsers,
      conditionEntityType: ConditionEntityType.CompanyActivity
    }
  };
};

const getActivityFieldRenderType = (
  metaData: Record<string, IAugmentedSmartViewEntityMetadata>,
  filter: string
): FilterRenderType => {
  const fieldMetaData = metaData[filter];
  const dataType = fieldMetaData?.dataType;
  if (isAccountSchemaName(fieldMetaData?.schemaName)) {
    return getAccountFilterRenderType(metaData, filter);
  }
  // when dropdown is dependent, it will be rendered as grouped dropdown
  if (fieldMetaData?.parentField) {
    return FilterRenderType.GroupedMSWithoutSelectAll;
  }
  if ([DataType.Date, DataType?.DateTime]?.includes(dataType as DataType)) {
    return FilterRenderType.DateTime;
  }
  if ([DataType?.SearchableDropdown].includes(dataType as DataType)) {
    return FilterRenderType.MSWithoutSelectAll;
  }
  if (fieldMetaData?.dataType === DataType?.ActiveUsers) {
    return FilterRenderType.UserDropdown;
  }

  return FilterRenderType.None;
};

const handleDeleteActivity = async (customConfig?: Record<string, string>): Promise<void> => {
  const activityId = customConfig?.CompanyActivityId;
  try {
    await httpPost({
      path: `${API_ROUTES.AccountActivityHistoryActivityDelete}${activityId}`,
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

const getDefaultColumns = (): string => {
  return `${ACCOUNT_SCHEMA_PREFIX}CompanyName,ActivityEvent_Note,ActivityDate,Owner,Status`;
};

const getUpdatedSchemaName = (schemaName: string): string => {
  return platformSettingsSchemaMap[schemaName] || schemaName;
};

const findDefaultFilterValues = (
  parsedFilters: Record<string, string>,
  renderType: FilterRenderType,
  schema: string
): IDateOption | IOption[] => {
  const value = parsedFilters?.[schema];
  let from = '';
  let to = '';

  if (renderType === FilterRenderType.DateTime) {
    if (value === PLATFORM_DATE_OPTION.CUSTOM) {
      const dateValue = parsedFilters?.[`${schema}_dateRange`];
      const dateValueArray = dateValue?.split('-');
      [from, to] = dateValueArray;
    }

    return getDateFilterValueFromSettings({
      value: value,
      from: from?.trim(),
      to: to?.trim(),
      isDateTimeCustomDate: !isAccountSchemaName(schema)
    });
  }
  return getDefaultFilterValue({
    renderType,
    value: parsedFilters[schema]
  });
};

const getInitialFilterSelectedValue = ({
  schema,
  cachedFilterValues,
  renderType,
  metadataMap,
  additionalData,
  parsedFilters,
  ignoreMarvinCache
}: {
  schema: string;
  cachedFilterValues: IResponseFilterConfig;
  renderType: FilterRenderType;
  metadataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  additionalData: IMarvinData;
  parsedFilters: Record<string, string>;
  ignoreMarvinCache: boolean;
}): IOption[] | IDateOption => {
  // if filter data is already there in user personalization cache
  if (!ignoreMarvinCache && cachedFilterValues[schema]) {
    return getSelectedValue(cachedFilterValues, schema, renderType);
  }

  //if user personalization cache does not exist, then get the default values applied from SmartViews Settings
  if (ignoreMarvinCache || !additionalData?.Marvin?.Exists) {
    const config = metadataMap[schema];

    if (!config) return [];

    return findDefaultFilterValues(parsedFilters, renderType, getUpdatedSchemaName(schema));
  }

  return renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
};
const isSortable = (attribute: IAugmentedSmartViewEntityMetadata): boolean => {
  if (nonSortableFields[attribute.schemaName]) return false;
  if (isAccountSchemaName(attribute.schemaName)) return !!attribute?.isSortable;

  return attribute.dataType !== ActivityBaseAttributeDataType.ActiveUsers;
};

export const getAccountMetaDataForFilters = (
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  const filteredMetaData = {};
  const allowedDataTypes = [
    DataType.Select,
    DataType.Date,
    DataType.MultiSelect,
    DataType.ActiveUsers
  ];

  Object.keys(metaDataMap)?.map((schemaName) => {
    if (allowedDataTypes.includes(metaDataMap?.[schemaName]?.dataType as DataType)) {
      filteredMetaData[schemaName] = metaDataMap?.[schemaName];
    }
  });

  return filteredMetaData;
};

const getEligibleFilterConfig = (
  allMetaData: Record<string, IAugmentedSmartViewEntityMetadata>
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  const filteredMetaData = {};

  const { allowedDataType } = ActivityManageFilterConfig;

  Object.values(allMetaData)?.map((config) => {
    const { schemaName, dataType } = config;

    if (!dataType) return;

    if (allowedDataType?.[dataType] || isAccountSchemaName(schemaName)) {
      filteredMetaData[schemaName] = config;
    }
  });

  return filteredMetaData;
};

const getSchemaNames = (filters: string[]): string[] =>
  filters?.map((schema) => removeSchemaPrefix(schema, ACCOUNT_SCHEMA_PREFIX));

const getUnRestrictedFields = async (
  schemaNames: string[],
  entityCode: string
): Promise<string[]> => {
  try {
    const accountRestriction = await getRestrictionMap(getSchemaNames(schemaNames), {
      entity: PermissionEntityType.Accounts,
      action: ActionType.View,
      callerSource: CallerSource.SmartViews,
      entityId: entityCode
    });

    return schemaNames?.filter((filter) => {
      return isAccountSchemaName(filter)
        ? !accountRestriction[removeSchemaPrefix(filter, ACCOUNT_SCHEMA_PREFIX)]
        : true;
    });
  } catch (error) {
    trackError(error);
    return [];
  }
};

export {
  isSortable,
  getActivityFieldRenderType,
  handleDeleteActivity,
  getDefaultColumns,
  getInitialFilterSelectedValue,
  getEligibleFilterConfig,
  getUnRestrictedFields
};
