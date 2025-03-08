import { trackError } from 'common/utils/experience/utils/track-error';
import {
  ICommonTabSettings,
  ILeadTypeConfiguration,
  ITabResponse,
  IUserPermission
} from 'apps/smart-views/smartviews.types';
import {
  IAccountCustomFilters,
  IAdvancedSearch,
  IColumn,
  IFetchCriteria,
  IGridConfig,
  IHeaderAction,
  ILeadFields,
  ILeadGetResponse,
  IMarvinData,
  IRecordType,
  ITabConfig,
  ITabHeader
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { fetchUserPermissions } from 'apps/smart-views/augment-tab-data/lead/helpers';
import {
  getGridColumns,
  getGridConfig,
  getHeaderConfig
} from 'apps/smart-views/augment-tab-data/lead/lead';
import { generateCustomFilters } from 'apps/smart-views/components/smartview-tab/utils';
import { getTabSettings } from 'apps/smart-views/augment-tab-data/common-utilities/tab-settings';
import { workAreaIds } from 'common/utils/process';
import { fetchSmartViewLeadMetadata } from 'apps/smart-views/augment-tab-data/lead/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { DEFAULT_LEAD_REPRESENTATION_NAME } from 'common/component-lib/send-email/constants';
import { TABS_CACHE_KEYS } from '../constants';
import { getCommonTabSetting, postManageTabCache } from '../utils';
import { MANAGE_LEAD_FEATURE_RESTRICTION_MAP, STARRED_LEADS_FILTERS } from './constants';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { isFeatureRestricted } from 'common/utils/feature-restriction/utils/augment-data';
import { COLUMN_IDS, HeaderAction } from 'apps/smart-views/constants/constants';
import {
  IAugmentedSmartViewEntityMetadata,
  IColumnConfig,
  IGetColumnConfig
} from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import {
  augmentTabData as createRawTabDataToCache,
  fetchProcessData
} from 'apps/smart-views/utils/utils';

import { STARRED_LEAD } from '../../smartview-tab/components/header/search-filter/quick-filter/constant';
import { isQuickFilterEnabled } from '../../smartview-tab/components/header/search-filter/utils';
import { LeadActionIds } from 'apps/smart-views/augment-tab-data/lead/constants';
import { getDefaultAdvanceSearch, groupByCfsParentName } from './utils';
import { isMiP, safeParseJson } from 'common/utils/helpers';
import { API_ROUTES } from 'common/constants';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import {
  getLDTypeConfigFromRawData,
  addAccountColumns
} from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import { getLeadTypeForManageTabsProcess } from 'apps/smart-views/utils/sv-process';
import { isDefaultLeadType, isLeadTypeEnabled } from 'common/utils/lead-type/settings';

const getIsFeatureRestricted = async (actionName: string): Promise<boolean> => {
  try {
    const result = await isFeatureRestricted({
      actionName: actionName,
      moduleName: FeatureRestrictionModuleTypes.ManageLeads,
      callerSource: CallerSource.ManageLeads
    });
    return result;
  } catch (error) {
    trackError(error);
  }
  return true;
};

const handleFeatureRestriction = async (gridColumns: IColumn[]): Promise<IColumn[]> => {
  const [isSortRestricted, isRowActionRestricted] = await Promise.all([
    getIsFeatureRestricted(
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].Sorting
    ),
    getIsFeatureRestricted(
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].RowActions
    )
  ]);

  const updatedColumns: IColumn[] = [];
  gridColumns?.forEach((col) => {
    if (col.id === COLUMN_IDS.Actions && isRowActionRestricted) {
      return;
    } else if (isSortRestricted) {
      updatedColumns.push({ ...col, sortable: false });
    } else {
      updatedColumns.push(col);
    }
  });

  return updatedColumns;
};

const handleCaching = async (rawTabData: ITabResponse, tabData: ITabConfig): Promise<void> => {
  try {
    const quickFilter = tabData?.headerConfig?.secondary?.quickFilterConfig?.quickFilter;
    const updatedData = createRawTabDataToCache(rawTabData, tabData, quickFilter);
    postManageTabCache(updatedData);
  } catch (error) {
    trackError(error);
  }
};

const getColumnConfig = async ({
  columns,
  tabId,
  actionsLength,
  columnWidthConfig,
  columnConfigMap
}: IGetColumnConfig): Promise<IColumnConfig> => {
  const updatedColumns = addAccountColumns(columns?.split(','));

  const gridColumns = await getGridColumns({
    columnString: updatedColumns,
    tabId,
    columnWidthConfig,
    actionsLength,
    columnConfigMap
  });

  const updatedGridColumns = await handleFeatureRestriction(gridColumns);

  return {
    columns: updatedColumns,
    gridColumns: updatedGridColumns
  };
};

const filterActions = (actions: IHeaderAction[]): IHeaderAction[] => {
  return actions?.map((action) => {
    if (action?.id === LeadActionIds.MORE_ACTIONS) {
      return {
        ...action,
        subMenu: action?.subMenu?.filter((item) => item.value !== HeaderAction.ImportLeads)
      };
    } else if (action?.id === LeadActionIds.GEAR_ACTIONS) {
      return {
        ...action,
        subMenu: action?.subMenu?.filter((item) => item.value !== HeaderAction.ManageFilters)
      };
    }
    return action;
  });
};

export const configureNonSmartviewAndDetailsTabs = (
  currentActionConfiguration: IHeaderAction[],
  selectedQuickFilter: string,
  tabId: string
): IHeaderAction[] => {
  //removing Import leads and manage filter section from manage leads tab when starred leads is selected from quick lead filter
  if (selectedQuickFilter === STARRED_LEAD && isQuickFilterEnabled(tabId))
    return filterActions(currentActionConfiguration);
  return currentActionConfiguration;
};

const getAugmentedCustomFilterForStarredLead = (
  customFilter: string | IAccountCustomFilters[]
): string => {
  const parsedFilter = safeParseJson(customFilter as string) as IAdvancedSearch;
  const updatedFilter = {
    ...parsedFilter,
    Conditions: parsedFilter?.Conditions?.map?.((condition) => ({
      ...condition,
      RowCondition: condition?.RowCondition?.filter((row) => row.LSO !== 'LeadType')
    }))
  };
  return JSON.stringify(updatedFilter);
};

const getAugmentedFetchCriteria = (
  fetchCriteria: IFetchCriteria,
  headerConfig: ITabHeader
): IFetchCriteria => {
  if (headerConfig?.secondary?.quickFilterConfig?.IsStarredList) {
    //Send only cfs parent name to api for Starred Leads
    fetchCriteria.Columns = groupByCfsParentName(fetchCriteria.Columns);
    fetchCriteria.CustomFilters = getAugmentedCustomFilterForStarredLead(
      fetchCriteria.CustomFilters
    );
  }
  return fetchCriteria;
};

const augmentLeadField = (leadPropertyList: ILeadFields[], parentName?: string): IRecordType => {
  return leadPropertyList?.reduce((acc, record) => {
    if (record?.Fields?.length) {
      const cfsFields = augmentLeadField(record.Fields, record.Attribute);
      Object.assign(acc, cfsFields);
    } else {
      const attribute = parentName ? `${parentName}~${record?.Attribute}` : record?.Attribute;
      acc[attribute] = record?.Value;
      if (attribute === 'ProspectID') {
        acc.id = record?.Value || '';
      }
    }
    return acc;
  }, {} as IRecordType);
};

export const augmentLeadResponse = async (
  response: ILeadGetResponse
): Promise<{ records: IRecordType[]; totalRecordCount?: number }> => {
  return {
    records: response?.Leads?.map((item) => augmentLeadField(item?.LeadPropertyList)) || []
  };
};

const clearGlobalSearchText = (): void => {
  const searchTextKey = 'mipGlobalSearchText';
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete(searchTextKey);
  window.history.pushState({}, '', newUrl);
};

const getGlobalSearchText = (): string | undefined => {
  try {
    const globalSearchText = new URLSearchParams(location.search)?.get('mipGlobalSearchText');
    if (isMiP() && globalSearchText) {
      return globalSearchText;
    }
    return undefined;
  } catch (err) {
    trackError(err);
    return undefined;
  }
};

export const updateSearchTextForGlobalSearch = async (
  tabData: ITabResponse
): Promise<ITabResponse> => {
  try {
    const globalSearchText = getGlobalSearchText();
    if (globalSearchText) {
      const newTabData = { ...tabData };
      const additionalData =
        (safeParseJson(
          newTabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
        ) as IMarvinData) || {};
      if (additionalData?.Marvin && additionalData?.Marvin?.SearchText !== globalSearchText) {
        additionalData.Marvin.SearchText = globalSearchText;
        newTabData.TabContentConfiguration.FetchCriteria.AdditionalData =
          JSON.stringify(additionalData);
        await postManageTabCache(newTabData);
        clearGlobalSearchText();
        return newTabData;
      }
    }
  } catch (err) {
    trackError(err);
  }

  return tabData;
};

const getManageLeadGridConfig = async ({
  userPermissions,
  commonTabSettings,
  leadMetadata,
  tabData,
  representationName,
  additionalData,
  customFilters,
  isManageListRestricted
}: {
  tabData: ITabResponse;
  customFilters: string;
  commonTabSettings: ICommonTabSettings;
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName?: IEntityRepresentationName;
  userPermissions: IUserPermission;
  additionalData: IMarvinData;
  isManageListRestricted: boolean;
}): Promise<IGridConfig> => {
  const gridConfig = await getGridConfig({
    tabData,
    entityMetadata: leadMetadata,
    customFilters,
    representationName,
    disableSelection: commonTabSettings?.disableSelection,
    userPermissions,
    isManageListRestricted: isManageListRestricted
  });
  const isLeadTypeGloballyEnabled = await isLeadTypeEnabled(CallerSource.ManageLeads, true);
  if (isLeadTypeGloballyEnabled) {
    const requiredColumns = gridConfig.requiredColumns?.split(',') ?? [];
    if (!requiredColumns.includes('LeadType')) {
      requiredColumns.push('LeadType');
      gridConfig.requiredColumns = requiredColumns.join(',');
    }
  }

  if (additionalData.Marvin?.isStarredList) {
    gridConfig.apiRoute = API_ROUTES.smartviews.starredLeadsGet;
    gridConfig.fetchCriteria.IsStarredList = true;
    gridConfig.fetchCriteria.ListId = additionalData?.Marvin?.listId;
  }
  gridConfig.fetchCriteria.AdvancedSearch =
    additionalData?.Marvin?.AdvancedSearchText || getDefaultAdvanceSearch();
  gridConfig.augmentFetchCriteria = getAugmentedFetchCriteria;
  gridConfig.augmentResponse = augmentLeadResponse;

  return gridConfig;
};

const getAugmentedManageLeadHeaderConfig = async (config: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  allTabIds: string[];
  repName: IEntityRepresentationName;
  userPermissions: IUserPermission;
  leadTypeConfiguration: ILeadTypeConfiguration[] | undefined;
}): Promise<ITabHeader> => {
  const {
    tabData,
    commonTabSettings,
    leadMetadata,
    allTabIds,
    repName,
    userPermissions,
    leadTypeConfiguration
  } = config;

  let isDefaultLeadTypeTab = false;

  if (leadTypeConfiguration?.length)
    isDefaultLeadTypeTab = await isDefaultLeadType(
      leadTypeConfiguration[0]?.LeadTypeInternalName,
      CallerSource.SmartViews
    );

  const headerConfig = await getHeaderConfig({
    tabData,
    commonTabSettings: getCommonTabSetting(commonTabSettings),
    leadMetadata,
    allTabIds,
    repName: repName,
    userPermissions,
    isDefaultLeadTypeTab
  });

  headerConfig.primary.title = leadTypeConfiguration?.length
    ? `Manage ${leadTypeConfiguration?.[0]?.LeadTypePluralName}`
    : headerConfig.primary.title;
  return headerConfig;
};

const handleFilterConfig = (headerConfig: ITabHeader): void => {
  if (headerConfig?.secondary?.quickFilterConfig?.IsStarredList) {
    headerConfig.secondary.filterConfig.filters = STARRED_LEADS_FILTERS;
    headerConfig.secondary.filterConfig = {
      ...headerConfig.secondary.filterConfig,
      selectFilterPopupConfig: { removePopup: true }
    };
  } else {
    headerConfig.secondary.filterConfig = {
      ...headerConfig.secondary.filterConfig,
      selectFilterPopupConfig: { removePopup: false }
    };
  }
};

export const getManageLeadHeaderConfig = async ({
  tabData,
  commonTabSettings,
  leadMetadata,
  allTabIds,
  repName,
  userPermissions,
  additionalData
}: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  allTabIds: string[];
  repName: IEntityRepresentationName;
  userPermissions: IUserPermission;
  additionalData: IMarvinData;
}): Promise<ITabHeader> => {
  const leadTypeConfiguration = await getLDTypeConfigFromRawData(tabData.Id);

  const headerConfig = await getAugmentedManageLeadHeaderConfig({
    tabData,
    commonTabSettings: getCommonTabSetting(commonTabSettings),
    leadMetadata,
    allTabIds,
    repName: repName,
    userPermissions,
    leadTypeConfiguration
  });

  if (headerConfig?.secondary?.quickFilterConfig) {
    if (additionalData?.Marvin?.isStarredList) {
      headerConfig.secondary.quickFilterConfig.IsStarredList = true;
      headerConfig.secondary.quickFilterConfig.ListId = additionalData?.Marvin?.listId;
    }
    headerConfig.secondary.quickFilterConfig.quickFilter = additionalData?.Marvin?.quickFilter;
    headerConfig.secondary.quickFilterConfig.prevFilters = additionalData?.Marvin?.prevFilter;
  }

  handleFilterConfig(headerConfig);
  return headerConfig;
};

const handleHeaderSecondaryConfig = (headerConfig: ITabHeader): ITabHeader => {
  if (headerConfig?.secondary) {
    headerConfig.secondary.featureRestrictionConfigMap = MANAGE_LEAD_FEATURE_RESTRICTION_MAP;
    headerConfig.secondary.featureRestrictionModuleName = FeatureRestrictionModuleTypes.ManageLeads;
  }
  return headerConfig;
};

const augmentedMangeLeadTabData = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;

  const [
    leadMetaData,
    userPermissions,
    isBulkActionRestricted,
    leadTypeNameForProcess,
    isManageListRestricted
  ] = await Promise.all([
    fetchSmartViewLeadMetadata(CallerSource.SmartViews, tabData.Id),
    fetchUserPermissions(),
    getIsFeatureRestricted(
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].BulkActions
    ),
    getLeadTypeForManageTabsProcess(tabData.Id),
    isFeatureRestricted({
      actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLists].View,
      moduleName: FeatureRestrictionModuleTypes.ManageLists,
      callerSource: CallerSource.ManageLeads
    })
  ]);

  window[`PROCESS_${tabData.Id}`] = fetchProcessData(
    workAreaIds.MANAGE_LEADS,
    TABS_CACHE_KEYS.MANAGE_LEADS_TAB,
    leadTypeNameForProcess
  );

  const leadTypeConfiguration = await getLDTypeConfigFromRawData(tabData.Id);

  const { metaDataMap: leadMetadata, representationName } = leadMetaData;
  const additionalData =
    (safeParseJson(
      tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
    ) as IMarvinData) || {};

  let headerConfig = await getManageLeadHeaderConfig({
    tabData,
    commonTabSettings: getCommonTabSetting(commonTabSettings),
    leadMetadata,
    allTabIds,
    repName: representationName || {
      SingularName: 'Lead',
      PluralName: 'Leads'
    },
    userPermissions,
    additionalData
  });

  headerConfig = handleHeaderSecondaryConfig(headerConfig);

  const { selectedFilters, bySchemaName } = headerConfig?.secondary?.filterConfig?.filters || {};
  const customFilters = generateCustomFilters({
    selectedFilters,
    bySchemaName,
    tabType: tabData?.Type,
    entityCode: tabData?.EntityCode,
    leadTypeConfiguration
  });
  const gridConfig = await getManageLeadGridConfig({
    additionalData,
    commonTabSettings,
    customFilters,
    leadMetadata,
    tabData,
    userPermissions,
    representationName,
    isManageListRestricted
  });

  gridConfig.columns = await handleFeatureRestriction(gridConfig?.columns);
  gridConfig.disableSelection = isBulkActionRestricted;

  const augmentedData: ITabConfig = {
    id: tabData.Id,
    type: tabData.Type,
    recordCount: tabData.Count,
    entityCode: tabData.EntityCode,
    sharedBy: tabData.SharedBy,
    tabSettings: getTabSettings({ tabData, allTabIds }),
    headerConfig,
    gridConfig,
    representationName: representationName || DEFAULT_LEAD_REPRESENTATION_NAME,
    isEntityManage: true,
    handleCaching: (newTabData: ITabConfig) => {
      handleCaching(tabData, newTabData);
    },
    leadTypeConfiguration,
    processConfig: {
      leadTypeNameForProcess
    }
  };

  return augmentedData;
};
export { getColumnConfig, augmentedMangeLeadTabData };
