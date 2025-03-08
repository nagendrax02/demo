import { trackError } from 'common/utils/experience/utils/track-error';
import { safeParseJson } from 'common/utils/helpers';
import { commonTabData, TABS_CACHE_KEYS } from '../constants';
import { ILeadTypeConfiguration, ITabResponse } from 'apps/smart-views/smartviews.types';
import { TabType } from 'apps/smart-views/constants/constants';
import { IColumn, IMarvinData, ITabConfig } from '../../smartview-tab/smartview-tab.types';
import { getDefaultFilters, getManageTabCache } from '../utils';
import { defaultEntityLeadsSortOn } from '../related-leads-tab/constants';
import {
  augmentTabData as createRawTabData,
  updateGridDataAfterPause
} from 'apps/smart-views/utils/utils';
import { CallerSource, httpGet, httpPost, Module } from 'common/utils/rest-client';
import { HIDDEN_BULK_ACTIONS, NON_SORTABLE_COLUMNS, STATIC_FILTERS } from './constants';
import { ACTION } from 'apps/entity-details/constants';
import {
  IActionMenuItem,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { API_ROUTES, APP_ROUTE } from 'common/constants';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { getListId } from 'common/utils/helpers/helpers';
import { getColumns } from '../manage-lead-tab/utils';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IListDetails } from './list-details.types';
import { ICustomActions } from 'common/types/entity/lead/custom-actions.types';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { EntityType } from 'common/types';
import { ILeadTypeConfig } from 'common/utils/lead-type/lead-type.types';
import {
  getActiveAppTabId,
  updateTabConfig,
  ITabConfig as IAppTabConfig
} from 'common/component-lib/app-tabs-v2';
import { INTERNAL_LIST } from '../manage-lists/constants';
import { setLocation } from 'router/utils/helper';

const getAdditionalData = async ({
  cachedData,
  tabData,
  searchedText
}: {
  cachedData: IMarvinData;
  tabData: ITabResponse;
  searchedText?: string;
}): Promise<IMarvinData> => {
  return {
    Marvin: {
      ...(cachedData?.Marvin || {}),
      FilterValues: cachedData?.Marvin?.FilterValues || getDefaultFilters(STATIC_FILTERS),
      Exists: true,
      AdvancedSearchText: '',
      ['AdvancedSearchText_English']: '',
      Columns: await getColumns(tabData, cachedData),
      SearchText: searchedText ?? '',
      SearchSortedOn: cachedData?.Marvin?.SearchSortedOn ?? defaultEntityLeadsSortOn,
      tabColumnsWidth: cachedData?.Marvin?.tabColumnsWidth,
      RowHeightSelected: cachedData?.Marvin?.RowHeightSelected
    }
  };
};

export const getListLeadTabData = async (currTabData?: ITabConfig): Promise<ITabResponse> => {
  const tabsData = safeParseJson(JSON.stringify(commonTabData)) as ITabResponse;
  const rawTabData = currTabData
    ? createRawTabData(tabsData, currTabData)
    : await getManageTabCache(TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY, getListId() as string);

  const cachedData = safeParseJson(
    rawTabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData ?? ''
  ) as IMarvinData;
  const tabData = safeParseJson(JSON.stringify(commonTabData)) as ITabResponse;
  tabData.Type = TabType.Lead;
  tabData.Id = TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY;
  tabData.entityManage = false;
  tabData.TabConfiguration.Title = '';
  tabData.TabContentConfiguration.FetchCriteria.PageSize =
    rawTabData?.TabContentConfiguration?.FetchCriteria?.PageSize ?? '25';
  const location = window?.location?.search?.toLowerCase();
  const searchedText =
    (new URLSearchParams(location)?.get('key') ?? '') || cachedData?.Marvin?.SearchText;

  const additionalData: IMarvinData = await getAdditionalData({
    cachedData,
    tabData,
    searchedText
  });

  tabData.TabContentConfiguration.FetchCriteria.AdditionalData = JSON.stringify(additionalData);

  return tabData;
};

export const updateAppTabConfig = ({ augmentedData }: { augmentedData: ITabConfig }): void => {
  const appTabConfig: Partial<IAppTabConfig> = {};
  const activeTabId = getActiveAppTabId();

  appTabConfig.title = augmentedData?.headerConfig?.primary?.title;

  updateTabConfig(activeTabId, appTabConfig);
};

export const hideBulkMoreActions = (bulkActions?: IMenuItem[]): IMenuItem[] | undefined => {
  return bulkActions?.filter((action) => !HIDDEN_BULK_ACTIONS.includes(action?.id as string));
};

export const getListDetails = async (callerSource: CallerSource): Promise<IListDetails> => {
  const listId = getListId();
  try {
    return await httpGet({
      path: `${API_ROUTES.listDetails}?Id=${listId}`,
      module: Module.Marvin,
      callerSource: callerSource
    });
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchCustomActions = async (callerSource: CallerSource): Promise<ICustomActions> => {
  try {
    const response = await httpGet<string>({
      path: API_ROUTES.getListCustomActions,
      module: Module.Marvin,
      callerSource
    });
    if (response) {
      let actionsMap = safeParseJson(response);
      if (typeof actionsMap === 'string') {
        actionsMap = safeParseJson(actionsMap);
      }
      return actionsMap as ICustomActions;
    }
  } catch (err) {
    trackError(err);
  }
  return {} as ICustomActions;
};

export const getCustomActionsFromCache = async (
  callerSource: CallerSource,
  entityType?: EntityType
): Promise<ICustomActions> => {
  try {
    const type = entityType ?? EntityType.Lists;
    const actions = getItem(StorageKey.ListsCustomActions) as Record<EntityType, ICustomActions>;
    if (!actions?.[type]) {
      const response = await fetchCustomActions(callerSource);
      const cacheData = { ...(actions || {}), [type]: response };
      setItem(StorageKey.ListsCustomActions, cacheData);
      return response;
    }
    return actions[type];
  } catch (err) {
    trackError(err);
  }
  return {} as ICustomActions;
};

const deleteListErrorMessage = (
  response: Record<string, string>[],
  customConfig: Record<string, string>
): string => {
  if (!response?.[0]?.IsSuccessful) {
    return `List '${customConfig?.Name ?? ''}' is engaged with some ${
      response?.[0]?.EntityEngagedName ? response?.[0]?.EntityEngagedName : 'entities'
    }. Hence it cannot be Deleted`;
  }

  return `List '${customConfig?.Name ?? ''}' deleted successfully`;
};

export const handleDeleteList = async (customConfig: Record<string, string>): Promise<void> => {
  const listId = getListId();
  try {
    const response: Record<string, string>[] = await httpPost({
      path: API_ROUTES.listDelete,
      module: Module.Marvin,
      body: {
        ListIds: [listId]
      },
      callerSource: CallerSource.ListDetails
    });
    showNotification({
      type: response?.[0]?.IsSuccessful ? Type.SUCCESS : Type.ERROR,
      message: deleteListErrorMessage(response, customConfig)
    });
    if (response?.[0]?.IsSuccessful) {
      setTimeout(() => {
        setLocation(APP_ROUTE.platformManageLists);
      }, 1000);
    }
  } catch (err) {
    trackError(err);
    showNotification({
      type: Type.ERROR,
      message: `${err?.response?.ExceptionMessage || err?.message || ERROR_MSG.generic}`
    });
  }
};

export const getLeadTypeConfiguration = (
  listDetails: IListDetails,
  leadTypeConfig: Record<string, ILeadTypeConfig>
): ILeadTypeConfiguration[] | undefined => {
  if (listDetails?.LeadType) {
    return [
      {
        LeadTypeName: leadTypeConfig[listDetails?.LeadType]?.Name,
        LeadTypeInternalName: leadTypeConfig[listDetails?.LeadType]?.InternalName,
        LeadTypeId: leadTypeConfig[listDetails?.LeadType]?.LeadTypeId,
        LeadTypePluralName: leadTypeConfig[listDetails?.LeadType]?.PluralName
      }
    ];
  }

  return undefined;
};

export const getListTitle = (
  listDetails: IListDetails,
  repName?: IEntityRepresentationName
): string => {
  if (listDetails?.InternalName === INTERNAL_LIST.ALL_LEADS) {
    return `All ${repName?.PluralName}`;
  } else if (listDetails?.InternalName === INTERNAL_LIST.STARRED_LEADS) {
    return `Starred ${repName?.PluralName}`;
  }

  return listDetails?.Name;
};

export const handleAddToList = async (leadId: string): Promise<void> => {
  const listId = getListId();
  try {
    await httpPost({
      path: API_ROUTES.addToList,
      module: Module.Marvin,
      body: {
        LeadIds: [leadId],
        ListId: listId
      },
      callerSource: CallerSource.ListDetails
    });
    updateGridDataAfterPause();
  } catch (err) {
    trackError(err);
  }
};

export const filterRemoveFromListActionConfig = (
  actionsConfig: IActionMenuItem[] | IMenuItem[]
): IActionMenuItem[] | IMenuItem[] => {
  return actionsConfig?.filter((action) => action?.id !== ACTION.RemoveFromList);
};

export const updateNonSortableColumn = (columns: IColumn[]): IColumn[] => {
  return columns?.map((col) => {
    if (NON_SORTABLE_COLUMNS.includes(col?.id)) {
      return {
        ...col,
        sortable: false
      };
    }
    return col;
  });
};
