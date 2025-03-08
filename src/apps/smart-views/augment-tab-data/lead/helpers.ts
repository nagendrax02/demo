import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { IEntityRepresentationConfig } from 'apps/entity-details/types/entity-store.types';
import {
  defaultQuickActions,
  leadRowActions,
  leadBulkActions,
  defaultHiddenActions,
  manageLeadRowActions,
  defaultLeadColumns
} from './constants';
import { ISvActionConfig, ITabResponse, IUserPermission } from '../../smartviews.types';
import { IActionConfig } from 'apps/entity-details/types';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import {
  IActionMenuItem,
  IEntityRepresentationName,
  IOppRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { IRowActionConfig } from '../../components/smartview-tab/smartview-tab.types';
import { getCustomActionsFromCache } from 'common/utils/entity-data-manager/lead/custom-actions';
import { ICustomActions, CustomActionsKeys } from 'common/types/entity/lead/custom-actions.types';
import { DataType, IConnectorConfig } from 'common/types/entity/lead';
import { RenderType } from 'common/types/entity/lead';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { isRestricted } from 'common/utils/permission-manager';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import { BulkActionKeys, RowActionKeys } from './constants';
import {
  setActionProperties,
  getTooltipContent,
  appendProcessActions,
  isManageTab,
  updateGridDataAfterPause,
  isDetailsPage as isListDetailsPage
} from '../../utils/utils';
import { ACTION } from 'apps/entity-details/constants';
import { IAugmentedSmartViewEntityMetadata } from '../common-utilities/common.types';
import {
  getOpportunityRepresentationName,
  getSettingConfig,
  safeParseJson,
  settingKeys
} from 'common/utils/helpers';
import {
  addAccountColumns,
  hiddenProcessForms,
  replaceWithLeadRepresentationName
} from '../common-utilities/utils';
import { TABS_CACHE_KEYS } from '../../components/custom-tabs/constants';
import {
  ColumnRenderWorkArea,
  ConditionEntityType,
  SCHEMA_NAMES,
  TABS_DEFAULT_ID
} from '../../constants/constants';
import { getRestrictionMap } from 'common/utils/permission-manager/permission-manager';
import { isLeadTypeEnabled } from 'common/utils/lead-type/settings';
import { getLeadDeleteActionConfig } from '../common-utilities/actions';
import { getSalesActivitySettings } from 'common/utils/helpers/sales-activity';
import { IDisableSalesActivitySetting } from 'common/types/sales-activity.types';
import { addActionColumn } from '../common-utilities/pin-utils';
import { getListId } from 'common/utils/helpers/helpers';
import { API_ROUTES } from 'common/constants';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { Variant } from '@lsq/nextgen-preact/button/button.types';
import { IActionHandler } from 'apps/entity-details/types/action-handler.types';

const getLeadIds = (customConfig: Record<string, string | Record<string, string>>): string[] => {
  if (customConfig?.id) {
    return [customConfig?.id as string];
  } else {
    return Object.keys(customConfig ?? {})?.reduce(
      (idArr: string[], recordKey: string): string[] => {
        if ((customConfig[recordKey] as Record<string, string>)?.id) {
          idArr.push((customConfig[recordKey] as Record<string, string>)?.id);
        }
        return idArr;
      },
      []
    );
  }
};

export const handleRemoveFromList = async ({
  customConfig,
  representationName,
  isBulkAction
}: {
  customConfig: Record<string, string>;
  representationName?: IEntityRepresentationName;
  isBulkAction?: boolean;
}): Promise<void> => {
  const listId = getListId();
  try {
    const response: Record<string, string> = await httpPost({
      path: API_ROUTES.removeFromList,
      module: Module.Marvin,
      body: {
        LeadIds: getLeadIds(customConfig),
        ListId: listId
      },
      callerSource: CallerSource.SmartViews
    });
    updateGridDataAfterPause();
    showNotification({
      type: response?.OperationStatus === 'Success' ? Type.SUCCESS : Type.ERROR,
      message:
        response?.OperationStatus === 'Success'
          ? `${isBulkAction ? Object.keys(customConfig ?? {})?.length : ''} ${
              representationName?.SingularName ?? 'Lead'
            } removed successfully`
          : ERROR_MSG.generic
    });
  } catch (err) {
    trackError(err);
    showNotification({
      type: Type.ERROR,
      message: `${err?.response?.ExceptionMessage || err?.message || ERROR_MSG.generic}`
    });
  }
};

export const getRemoveFromListActionHandler = (): IActionHandler => {
  return {
    getTitle: (): string => 'Remove {{repSingular}}',
    customeText: 'Yes, Remove',
    variant: Variant.Error,
    getDescription: (
      customConfig?: Record<string, string>,
      isBulkAction?: boolean
    ): Promise<string> => {
      return Promise.resolve(
        isBulkAction
          ? `Are you sure you want to remove ${
              Object.keys(customConfig ?? {})?.length ?? ''
            } {{repPluralName}} from this list`
          : `Are you sure you want to remove ${customConfig?.FirstName ?? ''} ${
              customConfig?.LastName ?? ''
            } from this list`
      );
    },
    handleDelete: (
      customConfig: Record<string, string>,
      representationName?: IEntityRepresentationName,
      isBulkAction?: boolean
    ): Promise<void> => handleRemoveFromList({ customConfig, representationName, isBulkAction })
  };
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
    case RowActionKeys.Delete:
      clonedAction = setActionProperties(
        clonedAction,
        disableDelete,
        getTooltipContent(disableDelete)
      ) as IActionConfig;
      break;
    case RowActionKeys.ChangeOwner:
      clonedAction = setActionProperties(
        clonedAction,
        disableUpdate,
        getTooltipContent(disableUpdate)
      ) as IActionConfig;
      break;
    case RowActionKeys.ChangeStage:
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

const actionsReducer = ({
  item,
  isMarvinTab,
  tabId,
  moreActions,
  actionConfig,
  quickActions,
  isOpportunityEnabled,
  userPermissions,
  repName,
  oppRepName,
  converseSetting
}: {
  item: IActionConfig;
  actionConfig?: ISvActionConfig;
  moreActions: IActionMenuItem[];
  quickActions: IActionConfig[];
  isMarvinTab?: boolean;
  tabId?: string;
  oppRepName?: IOppRepresentationName;
  isOpportunityEnabled?: boolean;
  userPermissions?: IUserPermission;
  repName?: IEntityRepresentationName;
  converseSetting?: Record<string, boolean>;
}): IActionMenuItem[] => {
  item = updateRowAction({
    action: item,
    disableDelete: !userPermissions?.delete,
    disableUpdate: !userPermissions?.update
  });
  if (item.key) {
    if (
      item.key === RowActionKeys.AddOpportunity &&
      oppRepName?.OpportunityRepresentationSingularName
    ) {
      item.title = `Add ${oppRepName.OpportunityRepresentationSingularName}`;
      item.toolTip = `Add ${oppRepName.OpportunityRepresentationSingularName}`;
    }
    if (
      (!isOpportunityEnabled && item.key === RowActionKeys.AddOpportunity) ||
      // show SetAsPrimaryContact option only inside lead details tab = 'entity-leads-tab'
      (item.key === RowActionKeys.SetAsPrimaryContact &&
        tabId !== TABS_CACHE_KEYS.RELATED_LEADS_CACHE_KEY &&
        tabId !== TABS_CACHE_KEYS.LEADS_CACHE_KEY) ||
      (item.id === ACTION.Converse && !converseSetting?.IsEnabled) ||
      (!isListDetailsPage(tabId ?? '') && defaultHiddenActions.includes(item.id)) // show RemoveFromList action only in ListDetails Page
    )
      return moreActions;
    if (item.id === ACTION.Delete) {
      item.actionHandler = getLeadDeleteActionConfig(repName, oppRepName);
    }
    if (item.workAreaConfig) {
      item.workAreaConfig = {
        ...item.workAreaConfig,
        additionalData:
          tabId === TABS_CACHE_KEYS.MANAGE_LEADS_TAB ||
          tabId === TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY
            ? ''
            : tabId,
        fallbackAdditionalData:
          tabId === TABS_CACHE_KEYS.MANAGE_LEADS_TAB ||
          tabId === TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY
            ? ''
            : TABS_DEFAULT_ID
      };
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
  tabId
}: {
  customActions?: ICustomActions;
  moreActions: IActionMenuItem[];
  actionConfig?: ISvActionConfig;
  quickActions: IActionConfig[];
  isMarvinTab?: boolean;
  tabId?: string;
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

const fetchPermission = async (action: ActionType, schemaName?: string): Promise<boolean> => {
  return isRestricted({
    entity: PermissionEntityType.Lead,
    action,
    callerSource: CallerSource.SmartViews,
    schemaName: schemaName
  });
};

export const fetchUserPermissions = async (): Promise<IUserPermission> => {
  const actions = [
    ActionType.Update,
    ActionType.BulkUpdate,
    ActionType.Delete,
    ActionType.BulkDelete,
    ActionType.Import
  ];

  const promises = actions.map((action) => fetchPermission(action));
  promises.push(
    isRestricted({
      entity: PermissionEntityType.Activity,
      action: ActionType.Create,
      callerSource: CallerSource.SmartViews
    }),
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
    import: !permissions[4],
    createActivity: !permissions[5],
    bulkCreateActivity: !permissions[6]
  };
};

const handleSalesActivity = ({
  tabId,
  salesActivityConfig
}: {
  tabId: string;
  salesActivityConfig: IDisableSalesActivitySetting | null;
}): IActionConfig[] => {
  const actions =
    tabId === TABS_CACHE_KEYS.MANAGE_LEADS_TAB || tabId === TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY
      ? manageLeadRowActions
      : leadRowActions;
  if (salesActivityConfig?.Settings?.RetrictUsersFromNewActivity) {
    return actions.filter((action) => action.id !== ACTION.SalesActivity);
  }
  return actions;
};

export const getLeadRowActions = async ({
  tabId,
  isMarvinTab,
  actionConfig,
  isOpportunityEnabled,
  userPermissions,
  repName
}: {
  tabId: string;
  isMarvinTab?: boolean;
  userPermissions?: IUserPermission;
  isOpportunityEnabled?: boolean;
  actionConfig?: ISvActionConfig;
  oppRepName?: IEntityRepresentationConfig;
  repName?: IEntityRepresentationName;
}): Promise<IRowActionConfig> => {
  const quickActions: IActionConfig[] = [];
  const [customActions, converseSetting, oppRepName, salesActivityConfig] = await Promise.all([
    getCustomActionsFromCache(CallerSource.SmartViews),
    getSettingConfig(settingKeys.ConverseConfiguration, CallerSource.SmartViews),
    getOpportunityRepresentationName(CallerSource.SmartViews),
    getSalesActivitySettings(CallerSource.SmartViews)
  ]);
  const augmentedActions = handleSalesActivity({ tabId, salesActivityConfig });

  const moreActions = augmentedActions.reduce((acc: IActionMenuItem[], item) => {
    return actionsReducer({
      actionConfig,
      item,
      moreActions: acc,
      tabId,
      isMarvinTab,
      quickActions,
      isOpportunityEnabled,
      userPermissions,
      repName,
      oppRepName,
      converseSetting: safeParseJson(converseSetting as string) ?? {}
    });
  }, [] as IActionMenuItem[]);

  appendCustomActions({
    moreActions,
    customActions,
    quickActions,
    tabId,
    isMarvinTab,
    actionConfig
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
  disabledBulkDelete,
  disabledBulkUpdate,
  disabledCreateActivity
}: {
  action: IMenuItem;
  disabledBulkDelete: boolean;
  disabledBulkUpdate: boolean;
  disabledCreateActivity: boolean;
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
    case BulkActionKeys.BulkUpdate:
      clonedAction = setActionProperties(
        clonedAction,
        disabledBulkUpdate,
        getTooltipContent(disabledBulkUpdate)
      ) as IMenuItem;
      break;
    case BulkActionKeys.ChangeOwner:
      clonedAction = setActionProperties(
        clonedAction,
        disabledBulkUpdate,
        getTooltipContent(disabledBulkUpdate)
      ) as IMenuItem;
      break;
    case BulkActionKeys.ChangeStage:
      clonedAction = setActionProperties(
        clonedAction,
        disabledBulkUpdate,
        getTooltipContent(disabledBulkUpdate)
      ) as IMenuItem;
      break;
    case BulkActionKeys.AddActivity:
      clonedAction = setActionProperties(
        clonedAction,
        disabledCreateActivity,
        getTooltipContent(disabledCreateActivity)
      ) as IMenuItem;
      break;
    default:
      break;
  }
  return clonedAction;
};

export const getLeadBulkActions = async ({
  userPermissions,
  isOppEnabled,
  leadRepName,
  tabId
}: {
  userPermissions: IUserPermission;
  isOppEnabled: boolean;
  tabId?: string;
  leadRepName?: IEntityRepresentationName;
}): Promise<IMenuItem[]> => {
  let bulkActions = leadBulkActions;
  if (!isOppEnabled) {
    bulkActions = bulkActions.filter((action) => action.value !== BulkActionKeys.AddOpportunity);
  }
  const disabledBulkDelete = !userPermissions?.bulkDelete || !userPermissions?.delete;
  const disabledBulkUpdate = !userPermissions?.bulkUpdate || !userPermissions?.update;
  const oppRepName = await getOpportunityRepresentationName(CallerSource.SmartViews);
  if (!isListDetailsPage(tabId ?? '')) {
    // show RemoveFromList action only in ListDetails Page
    bulkActions = bulkActions.filter((action) => action?.id !== ACTION.RemoveFromList);
  }
  bulkActions = bulkActions.map((action) => {
    if (action.id === ACTION.AddOpportunity) {
      action.label = `Add ${oppRepName.OpportunityRepresentationSingularName}`;
    }
    if (action.id === ACTION.MergeLeads) {
      action.label = `Merge ${leadRepName?.PluralName ?? 'Leads'}`;
    }
    return updateBulkAction({
      action,
      disabledBulkDelete,
      disabledBulkUpdate,
      disabledCreateActivity:
        !userPermissions?.createActivity || !userPermissions?.bulkCreateActivity
    });
  });
  const bulkCustomActions = await getBulkCustomActions();
  appendBulkCustomActions(bulkActions, bulkCustomActions);
  return bulkActions;
};

const customFormedMetadata = (
  representationName: string
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  return {
    LeadIdentifier: {
      displayName: replaceWithLeadRepresentationName('Lead Name', representationName),
      schemaName: 'LeadIdentifier',
      renderType: RenderType.Lead
    },
    OwnerIdName: {
      displayName: replaceWithLeadRepresentationName('Lead Owner', representationName),
      schemaName: 'OwnerIdName',
      isSortable: true,
      renderType: RenderType.Text
    },
    OwnerId: {
      displayName: replaceWithLeadRepresentationName('Lead Owner', representationName),
      schemaName: 'OwnerId',
      renderType: RenderType.Text
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ProspectActivityDate_Max: {
      displayName: 'Last Activity Date',
      schemaName: 'ProspectActivityDate_Max',
      isSortable: true,
      dataType: DataType.Date,
      renderType: RenderType.Datetime
    },
    CompanyTypeName: {
      displayName: 'Account Type',
      schemaName: 'CompanyTypeName',
      renderType: RenderType.URL
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ProspectActivityName_Max: {
      displayName: 'Last Activity',
      isSortable: true,
      schemaName: 'ProspectActivityName_Max',
      renderType: RenderType.Text
    }
  };
};

const getUnRestrictedFields = async (schemaNames: string[]): Promise<string[]> => {
  try {
    const restrictionMap = await getRestrictionMap(schemaNames, {
      entity: PermissionEntityType.Lead,
      action: ActionType.View,
      callerSource: CallerSource.SmartViews
    });

    return schemaNames?.filter((schema) => !restrictionMap?.[schema]);
  } catch (error) {
    trackError(error);
    return [];
  }
};

const getDefaultLeadTabColumns = async ({
  tabData,
  leadMetaData,
  columnRenderWorkArea,
  isSmartviewTab
}: {
  tabData: ITabResponse;
  leadMetaData: Record<string, IAugmentedSmartViewEntityMetadata>;
  columnRenderWorkArea: ColumnRenderWorkArea;
  isSmartviewTab?: boolean;
}): Promise<string> => {
  try {
    const adminSelectedColumns = isSmartviewTab
      ? tabData?.TabContentConfiguration?.FetchCriteria?.SelectedColumns || defaultLeadColumns
      : defaultLeadColumns;
    const defaultColumns = adminSelectedColumns
      .split(',')
      .filter((schema) => !!leadMetaData[schema])
      ?.join(',');

    const {
      TabContentConfiguration: { FetchCriteria },
      TabConfiguration: { CanEdit }
    } = tabData;
    const isUserDefinedTab = !!CanEdit;
    const leadTypeEnabled = await isLeadTypeEnabled(CallerSource.SmartViews);

    if (leadTypeEnabled && (isUserDefinedTab || isManageTab(tabData.Id))) {
      const leadTypeSelectedColumns = await (
        await import('common/utils/lead-type/fetch-default-columns')
      )?.getLeadTypeBasedDefaultColumns(tabData);
      return addActionColumn(leadTypeSelectedColumns || defaultColumns);
    }

    if (columnRenderWorkArea === ColumnRenderWorkArea.SelectColumns) {
      return addActionColumn(defaultColumns);
    }

    const selectedColumnsList = FetchCriteria.SelectedColumns?.split(',');

    return addActionColumn(addAccountColumns(selectedColumnsList) || defaultColumns);
  } catch (err) {
    trackError(err);
  }
  return defaultLeadColumns;
};

const getConditionEntityType = (schemaName: string): ConditionEntityType => {
  const AccountConditionEntityType = {
    [SCHEMA_NAMES.COMPANY_TYPE_NAME]: ConditionEntityType.Account,
    [SCHEMA_NAMES.RELATED_COMPANY_ID]: ConditionEntityType.Account
  };

  return AccountConditionEntityType[schemaName] ?? ConditionEntityType.Lead;
};

export {
  customFormedMetadata,
  getUnRestrictedFields,
  getDefaultLeadTabColumns,
  getConditionEntityType
};
