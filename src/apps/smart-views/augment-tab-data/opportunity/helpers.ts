import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import {
  defaultQuickActions,
  OWNER_DROPDOWN_SCHEMA,
  rowActions,
  opportunityBulkActions,
  actionKeys,
  BulkActionKeys,
  PlatformSettingsSchemaMap,
  nonSortableFields,
  ActivityManageFilterConfig
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
  OptionSeperator
} from '../../components/smartview-tab/components/filter-renderer/constants';
import { ConditionEntityType, TabType } from '../../constants/constants';
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
import { ASSOCIATED_TO, PLATFORM_FILTER_SELECT_ALL_VALUE } from '../common-utilities/constant';
import { getUserStandardTimeZone, removeSchemaPrefix } from '../../components/smartview-tab/utils';
import {
  getDateFilterOnValue,
  getLeadDefaultFilterValue,
  getNormalizedAdvancedSearch,
  getSelectedValue,
  hiddenProcessForms,
  replaceWithLeadRepresentationName
} from '../common-utilities/utils';
import { TABS_DEFAULT_ID } from 'src/apps/smart-views/constants/constants';
import oppDataManager from 'common/utils/entity-data-manager/opportunity';

export const updateRowAction = ({
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

export const actionsReducer = ({
  item,
  isMarvinTab,
  tabId,
  CanDelete,
  moreActions,
  actionConfig,
  quickActions,
  userPermissions,
  converseSetting,
  commonTabSettings
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
    if (item.id === ACTION.Converse && !converseSetting?.IsEnabled) return moreActions;
    if (item.workAreaConfig) {
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
  opportunityType
}: {
  customActions?: ICustomActions;
  moreActions: IActionMenuItem[];
  actionConfig?: ISvActionConfig;
  quickActions: IActionConfig[];
  isMarvinTab?: boolean;
  tabId?: string;
  opportunityType: string;
}): void => {
  if (customActions?.Single) {
    Object.keys(customActions?.Single)?.forEach((key) => {
      const actions = customActions?.Single?.[key] as IConnectorConfig[];
      if (actions?.length) {
        const actionSubmenu = [] as IActionMenuItem[];
        actions.forEach((item) => {
          if (!item?.OpportunityType || item?.OpportunityType === opportunityType)
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
    entity: PermissionEntityType.Opportunity,
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
    ActionType.Create,
    ActionType.Import
  ];

  const promises = actions.map((action) => fetchPermission(entityCode, action));
  promises?.push(
    isRestricted({
      entity: PermissionEntityType.Activity,
      action: ActionType.BULKCREATE,
      callerSource: CallerSource.SmartViews
    })
  );

  const results = await Promise.allSettled(promises);

  const permissions = results.map((result) =>
    result.status === 'fulfilled' ? result.value : null
  );

  return {
    update: !permissions[0],
    bulkUpdate: !permissions[1],
    delete: !permissions[2],
    bulkDelete: !permissions[3],
    createActivity: !permissions[4],
    import: !permissions[4] && !permissions[5],
    bulkCreateActivity: !permissions[6]
  };
};

export const getRowActions = async ({
  tabId,
  isMarvinTab,
  actionConfig,
  opportunityType,
  userPermissions,
  commonTabSettings
}: {
  tabId?: string;
  isMarvinTab?: boolean;
  opportunityType: string;
  userPermissions?: IUserPermission;
  actionConfig?: ISvActionConfig;
  commonTabSettings?: ICommonTabSettings;
}): Promise<IRowActionConfig> => {
  const quickActions: IActionConfig[] = [];
  const [customActions, converseSetting, metaData] = await Promise.all([
    getCustomActionsFromCache(CallerSource.SmartViews, EntityType.Opportunity),
    getSettingConfig(settingKeys.ConverseConfiguration, CallerSource.SmartViews),
    oppDataManager.fetchMetaData(CallerSource.SmartViews, opportunityType)
  ]);

  const { CanDelete = true } = metaData ?? {};
  const moreActions = rowActions.reduce((acc: IActionMenuItem[], item) => {
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
      CanDelete
    });
  }, [] as IActionMenuItem[]);

  appendCustomActions({
    moreActions,
    customActions,
    quickActions,
    tabId,
    isMarvinTab,
    actionConfig,
    opportunityType
  });
  return appendProcessActions({
    tabId,
    moreActions,
    quickActions,
    quickActionsOrder: actionConfig?.QuickActions || ''
  });
};

const getBulkCustomActions = async (opptype: string): Promise<IConnectorConfig[]> => {
  const customActions = await getCustomActionsFromCache(
    CallerSource.SmartViews,
    EntityType.Opportunity
  );
  let customActionsObj: IConnectorConfig[] = [];
  const bulkCustomActions = customActions?.Multiple || {};
  if (bulkCustomActions) {
    Object.keys(bulkCustomActions).forEach((key) => {
      const filteredOptions = (bulkCustomActions[key] as IConnectorConfig[]).filter(
        (item) => item.OpportunityType == opptype
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
  disabledBulkUpdate,
  disableBulkDelete,
  disableCreateActivity
}: {
  action: IMenuItem;
  disabledBulkUpdate: boolean;
  disableBulkDelete: boolean;
  disableCreateActivity: boolean;
}): IMenuItem => {
  let clonedAction = { ...action };
  switch (clonedAction.value) {
    case BulkActionKeys.BulkUpdate:
    case BulkActionKeys.ChangeStatusStage:
      clonedAction = setActionProperties(
        clonedAction,
        disabledBulkUpdate,
        getTooltipContent(disabledBulkUpdate)
      ) as IMenuItem;
      break;
    case BulkActionKeys.BulkDelete:
      clonedAction = setActionProperties(
        clonedAction,
        disableBulkDelete,
        getTooltipContent(disableBulkDelete)
      ) as IMenuItem;
      break;
    case BulkActionKeys.AddActivity:
      clonedAction = setActionProperties(
        clonedAction,
        disableCreateActivity,
        getTooltipContent(disableCreateActivity)
      ) as IMenuItem;
      break;
    default:
      break;
  }
  return clonedAction;
};

export const getBulkActions = async ({
  userPermissions,
  opportunityType
}: {
  userPermissions: IUserPermission;
  opportunityType: string;
}): Promise<IMenuItem[]> => {
  let bulkActions = opportunityBulkActions;
  const disabledBulkUpdate = !userPermissions?.bulkUpdate || !userPermissions?.update;
  const disableBulkDelete = !userPermissions?.bulkDelete || !userPermissions?.delete;

  bulkActions = bulkActions.map((action) => {
    return updateBulkAction({
      action,
      disabledBulkUpdate,
      disableBulkDelete,
      disableCreateActivity:
        !userPermissions?.createActivity || !userPermissions?.bulkCreateActivity
    });
  });
  const bulkCustomActions = await getBulkCustomActions(opportunityType);
  appendBulkCustomActions(bulkActions, bulkCustomActions);
  return bulkActions;
};

const customMetaDataForLead = (
  representationName: string
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  return {
    LeadIdentifier: {
      displayName: ASSOCIATED_TO,
      schemaName: 'LeadIdentifier',
      renderType: RenderType.Lead,
      conditionEntityType: ConditionEntityType.Lead,
      isSortable: true
    },
    ['P_OwnerIdName']: {
      displayName: replaceWithLeadRepresentationName('Lead Owner', representationName),
      schemaName: 'P_OwnerIdName',
      renderType: RenderType.Textbox,
      conditionEntityType: ConditionEntityType.Lead,
      isSortable: true
    }
  };
};

const getOpportunityFieldRenderType = (
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
  if ([DataType.Date, DataType.DateTime]?.includes(dataType as DataType)) {
    return FilterRenderType.DateTime;
  }
  if (
    [
      DataType.Select,
      DataType.MultiSelect,
      DataType.SearchableDropdown,
      DataType.Dropdown,
      DataType.LargeOptionSet,
      DataType.Product
    ].includes(dataType as DataType)
  ) {
    return FilterRenderType.MSWithoutSelectAll;
  }
  if (
    OWNER_DROPDOWN_SCHEMA[fieldMetaData?.schemaName] ||
    fieldMetaData?.dataType === DataType.ActiveUsers
  ) {
    return FilterRenderType.UserDropdown;
  }

  return FilterRenderType.None;
};

const handleDeleteActivity = async (customConfig?: Record<string, string>): Promise<void> => {
  const activityId = customConfig?.RelatedActivityId || customConfig?.ProspectActivityId || '';
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
      message: '1 Opportunity deleted successfully'
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

const getOpportunityDefaultColumns = (
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>,
  isOppNameColCustomizationEnabled?: boolean
): string => {
  const defaultColumns = ['mx_Custom_1', 'LeadIdentifier', 'Owner'];
  const tobeCheckedColumns = ['mx_Custom_10', 'mx_Custom_6', 'Status', 'mx_Custom_2'];

  if (isOppNameColCustomizationEnabled) {
    defaultColumns.shift(); // removes mx_Custom_1, which is oppName column
  }

  tobeCheckedColumns?.forEach((schema) => {
    if (metaDataMap[schema]) defaultColumns.push(schema);
  });

  return defaultColumns?.join(',');
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

const getOpportunityDefaultFilterValue = (config: {
  parsedFilters: Record<string, string>;
  renderType: FilterRenderType;
  schema: string;
  dataType: string;
}): IOption[] | IDateOption => {
  const { parsedFilters, renderType, schema, dataType } = config;
  if (dataType === DataType.Product) {
    return getProductValue(parsedFilters?.ProductCode);
  }

  const updatedSchema = (PlatformSettingsSchemaMap[schema] as string) || schema;

  const dateFilterValue = getDateFilterOnValue({
    dateFilterOnFrom: parsedFilters?.DateRangeFrom,
    dateFilterOnTo: parsedFilters?.DateRangeTo,
    dateFilterOnValue: parsedFilters?.CustomDateKey,
    parsedFilters,
    platformSettingsDateFilter: {},
    renderType,
    updatedSchema
  });

  return (
    dateFilterValue ||
    getDefaultFilterValue({
      renderType,
      value: parsedFilters[updatedSchema]
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

    if (isLeadSchema(schema)) {
      return getLeadDefaultFilterValue({
        parsedFilters,
        renderType,
        schemaName: removeSchemaPrefix(schema)
      });
    }

    return getOpportunityDefaultFilterValue({
      parsedFilters,
      dataType: config?.dataType || '',
      renderType,
      schema
    });
  }
  return renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
};

const isSortable = (attribute: IAugmentedSmartViewEntityMetadata): boolean => {
  if (attribute.parentSchemaName) {
    return !!attribute.isSortable;
  }
  return (
    !nonSortableFields[attribute.schemaName] &&
    attribute.dataType !== ActivityBaseAttributeDataType.ActiveUsers &&
    attribute.dataType !== ActivityBaseAttributeDataType.CustomObject
  );
};

export const getEntityCodes = (additionalData: IMarvinData, tabEntityCode: string): string => {
  return (
    (additionalData?.Marvin?.EntityCode || tabEntityCode || '-1').replaceAll(
      OptionSeperator.MXSeparator,
      ','
    ) || ''
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

  return getNormalizedAdvancedSearch(
    parsedFilters?.AdvancedSearch,
    entityCode,
    TabType.Opportunity
  );
};

const getOpportunityAdvancedSearch = (tabData: ITabResponse): string => {
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

const getEligibleOpportunityFilterConfig = (
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

export {
  isSortable,
  getOpportunityFieldRenderType,
  handleDeleteActivity,
  customMetaDataForLead,
  getOpportunityDefaultColumns,
  getInitialFilterSelectedValue,
  getOpportunityAdvancedSearch,
  getEligibleOpportunityFilterConfig
};
