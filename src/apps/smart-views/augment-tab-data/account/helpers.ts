import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import {
  defaultQuickActions,
  accountRowActions,
  accountBulkActions,
  PlatformSettingsSchemaMap,
  NOT_ALLOWED_COLUMNS,
  accountDateTypeFilterMap,
  actionKeys
} from './constants';
import {
  ICommonTabSettings,
  IFetchCriteria,
  ISvActionConfig,
  ITabResponse,
  IUserPermission
} from '../../smartviews.types';
import { IActionConfig } from 'apps/entity-details/types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import {
  IActionMenuItem,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import {
  IMarvinData,
  IResponseFilterConfig,
  IRowActionConfig
} from '../../components/smartview-tab/smartview-tab.types';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { isRestricted } from 'common/utils/permission-manager';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import {
  FilterRenderType,
  DATE_FILTER
} from '../../components/smartview-tab/components/filter-renderer/constants';
import { BulkActionKeys } from './constants';
import {
  setActionProperties,
  getTooltipContent,
  updateGridDataAfterPause,
  sortQuickActions
} from '../../utils/utils';
import { IAugmentedSmartViewEntityMetadata } from '../common-utilities/common.types';
import { API_ROUTES } from 'common/constants';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { IDateOption } from 'common/component-lib/date-filter';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { getDefaultFilterValue } from '../common-utilities/tab-settings';
import { safeParseJson } from 'common/utils/helpers';
import {
  augmentForQuickActions,
  getDateFilterOnValue,
  getEntityRowActions,
  getSelectedValue
} from '../common-utilities/utils';
import { TABS_DEFAULT_ID } from 'apps/smart-views/constants/constants';
import { getRestrictionMap } from 'common/utils/permission-manager/permission-manager';
import { addActionColumn } from '../common-utilities/pin-utils';

const updateRowAction = ({
  action,
  disableDelete,
  disableUpdate,
  leadRepName
}: {
  action: IActionConfig;
  disableDelete: boolean;
  disableUpdate: boolean;
  leadRepName?: IEntityRepresentationName;
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
    case actionKeys.changeOwner:
    case actionKeys.changeStage:
      clonedAction = setActionProperties(
        clonedAction,
        disableUpdate,
        getTooltipContent(disableUpdate)
      ) as IActionConfig;
      break;
    case actionKeys.addLead:
      clonedAction.title = `Add ${leadRepName?.SingularName}`;
      clonedAction.toolTip = `Add ${leadRepName?.SingularName}`;
      break;
    case actionKeys.assignLead:
      clonedAction.title = `Assign ${leadRepName?.SingularName}`;
      clonedAction.toolTip = `Assign ${leadRepName?.SingularName}`;
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
  quickActions,
  userPermissions,
  commonTabSettings,
  leadRepName
}: {
  item: IActionConfig;
  actionConfig?: ISvActionConfig;
  moreActions: IActionMenuItem[];
  quickActions: IActionConfig[];
  isMarvinTab?: boolean;
  tabId?: string;
  userPermissions?: IUserPermission;
  commonTabSettings?: ICommonTabSettings;
  leadRepName?: IEntityRepresentationName;
}): IActionMenuItem[] => {
  item = updateRowAction({
    action: item,
    disableDelete: !userPermissions?.delete,
    disableUpdate: !userPermissions?.update,
    leadRepName: leadRepName
  });
  if (item.key) {
    if (item.workAreaConfig) {
      item.workAreaConfig = {
        ...item.workAreaConfig,
        additionalData: tabId,
        fallbackAdditionalData: TABS_DEFAULT_ID
      };
    }
    const isQuickAction = actionConfig?.QuickActions?.split(',')?.includes(item.key);
    const isHiddenAction = actionConfig?.HiddenActions?.split(',')?.includes(item.key);
    if (
      (!isMarvinTab && isQuickAction) ||
      (isMarvinTab && defaultQuickActions.includes(item.key)) ||
      commonTabSettings?.rowActions?.quickActions?.includes(item?.id)
    ) {
      quickActions.push({ ...item, value: item.key, label: item.title, isQuickAction: true });
    }
    if (!isHiddenAction) {
      moreActions.push({ ...item, label: item.title, value: item.key });
    }
  }
  return moreActions;
};

const fetchPermission = async (accountTypeId: string, action: ActionType): Promise<boolean> => {
  return isRestricted({
    entity: PermissionEntityType.Accounts,
    entityId: accountTypeId,
    action,
    callerSource: CallerSource.SmartViews
  });
};

export const fetchUserPermissions = async (accountTypeId: string): Promise<IUserPermission> => {
  const actions = [
    ActionType.Update,
    ActionType.BulkUpdate,
    ActionType.Delete,
    ActionType.BulkDelete,
    ActionType.Import,
    ActionType.Create
  ];

  const promises = actions.map((action) => fetchPermission(accountTypeId, action));

  const results = await Promise.allSettled(promises);

  const permissions = results.map((result) =>
    result.status === 'fulfilled' ? result.value : null
  );

  return {
    update: !permissions[0],
    bulkUpdate: !permissions[1],
    delete: !permissions[2],
    bulkDelete: !permissions[3],
    import: !permissions[4] && !permissions[5],
    create: !permissions[5]
  };
};

export const getAccountRowActions = async ({
  tabId,
  isMarvinTab,
  actionConfig,
  userPermissions,
  commonTabSettings,
  leadRepName
}: {
  tabId?: string;
  isMarvinTab?: boolean;
  userPermissions?: IUserPermission;
  workAreaIds?: Record<string, number>;
  actionConfig?: ISvActionConfig;
  commonTabSettings?: ICommonTabSettings;
  leadRepName?: IEntityRepresentationName;
}): Promise<IRowActionConfig> => {
  let quickActions: IActionConfig[] = [];
  const HiddenActions = safeParseJson(actionConfig?.HiddenActions ?? '{}') as Record<
    number,
    string
  >;
  const QuickActions = safeParseJson(actionConfig?.QuickActions ?? '{}') as Record<number, string>;
  const updatedActionConfig = { HiddenActions: HiddenActions[0], QuickActions: QuickActions[0] };
  const moreActions = accountRowActions.reduce((acc: IActionMenuItem[], item) => {
    return actionsReducer({
      actionConfig: updatedActionConfig,
      item,
      moreActions: acc,
      tabId,
      isMarvinTab,
      quickActions,
      userPermissions,
      commonTabSettings,
      leadRepName
    });
  }, []);
  quickActions = sortQuickActions(updatedActionConfig?.QuickActions || '', quickActions);

  const augmentedQuickActions = augmentForQuickActions(quickActions.splice(0, 3));
  const augmentedMoreActions = [...quickActions, ...moreActions] as IActionMenuItem[];
  return getEntityRowActions({
    moreActions: augmentedMoreActions,
    quickActions: augmentedQuickActions
  });
};

const updateBulkAction = ({
  action,
  disabledBulkUpdate,
  disabledBulkDelete
}: {
  action: IMenuItem;
  disabledBulkUpdate: boolean;
  disabledBulkDelete: boolean;
}): IMenuItem => {
  let clonedAction = { ...action };
  switch (clonedAction.value) {
    case BulkActionKeys.Delete:
      clonedAction = setActionProperties(
        clonedAction,
        disabledBulkDelete,
        getTooltipContent(disabledBulkDelete)
      ) as IMenuItem;
      break;
    case BulkActionKeys.ChangeOwner:
    case BulkActionKeys.ChangeStage:
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

export const getAccountBulkActions = async ({
  userPermissions
}: {
  userPermissions: IUserPermission;
}): Promise<IMenuItem[]> => {
  let bulkActions = accountBulkActions;
  const disabledBulkUpdate = !userPermissions?.bulkUpdate || !userPermissions?.update;
  const disabledBulkDelete = !userPermissions?.bulkDelete || !userPermissions?.delete;
  bulkActions = bulkActions.map((action) => {
    return updateBulkAction({
      action,
      disabledBulkUpdate,
      disabledBulkDelete
    });
  });

  return bulkActions;
};

export const getUpdatedColumns = (columns: string[]): string => {
  return columns.filter((col) => !NOT_ALLOWED_COLUMNS[col]).join(',');
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
    updateGridDataAfterPause();
  } catch (err) {
    trackError(err);
    showNotification({
      type: Type.ERROR,
      message: `${err?.response?.ExceptionMessage || err?.message || ERROR_MSG.generic}`
    });
  }
};

const getAccountDefaultColumns = (fetchCriteria: IFetchCriteria): string => {
  return addActionColumn(
    fetchCriteria.SelectedColumns?.replaceAll('CheckBoxColumn,', '') ||
      'ExpandCollapse,CompanyName,Stage,OwnerName,Phone,ModifiedOn,CompanyId,CompanyId'
  );
};

const getUpdatedSchemaName = (schemaName: string): string => {
  return (PlatformSettingsSchemaMap[schemaName] as string) || schemaName;
};

const getAccountDefaultFilterValue = (config: {
  parsedFilters: Record<string, string>;
  renderType: FilterRenderType;
  schema: string;
}): IOption[] | IDateOption => {
  const { parsedFilters, renderType, schema } = config;

  const dateFilterOnValue = getDateFilterOnValue({
    dateFilterOnFrom: parsedFilters?.DateRangeFrom,
    dateFilterOnTo: parsedFilters?.DateRangeTo,
    dateFilterOnValue: parsedFilters?.DateRange,
    parsedFilters,
    platformSettingsDateFilter: accountDateTypeFilterMap,
    renderType,
    updatedSchema: schema
  });

  return (
    dateFilterOnValue ||
    getDefaultFilterValue({
      renderType,
      value: parsedFilters[getUpdatedSchemaName(schema)]
    })
  );
};

const getInitialFilterSelectedValue = ({
  schema,
  filterValues,
  renderType,
  metadataMap,
  additionalData,
  parsedFilters
}: {
  schema: string;
  filterValues: IResponseFilterConfig;
  renderType: FilterRenderType;
  metadataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  additionalData: IMarvinData;
  parsedFilters: Record<string, string>;
}): IOption[] | IDateOption => {
  // if filter data is already there in user personalization cache
  if (filterValues[schema]) {
    return getSelectedValue(filterValues, schema, renderType);
  }

  //if user personalization cache does not exist, then get the default values applied from SmartViews Settings
  if (!additionalData?.Marvin?.Exists) {
    const config = metadataMap[schema];

    if (!config) return [];

    return getAccountDefaultFilterValue({
      parsedFilters,
      renderType,
      schema
    });
  }
  return renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
};

const getAdvancedSearchText = (
  additionalData: IMarvinData,
  fetchCriteriaAdvancedSearchText: string
): string => {
  const marvinData = additionalData?.Marvin;

  return marvinData && 'AdvancedSearchText' in marvinData
    ? marvinData?.AdvancedSearchText || ''
    : fetchCriteriaAdvancedSearchText || '';
};

const getAccountAdvancedSearch = (tabData: ITabResponse): string => {
  const tabFetchCriteria = tabData?.TabContentConfiguration?.FetchCriteria;
  const additionalData = safeParseJson(tabFetchCriteria?.AdditionalData) as IMarvinData;

  return getAdvancedSearchText(additionalData, tabFetchCriteria?.AdvancedSearchText);
};

const getUnRestrictedFields = async (
  schemaNames: string[],
  entityCode: string
): Promise<string[]> => {
  try {
    const restrictionMap = await getRestrictionMap(schemaNames, {
      entity: PermissionEntityType.Accounts,
      action: ActionType.View,
      callerSource: CallerSource.SmartViews,
      entityId: entityCode
    });

    return schemaNames.filter((schema) => !restrictionMap?.[schema]);
  } catch (error) {
    trackError(error);
    return [];
  }
};

export {
  handleDeleteActivity,
  getAccountDefaultColumns,
  getInitialFilterSelectedValue,
  getAccountAdvancedSearch,
  getUnRestrictedFields
};
