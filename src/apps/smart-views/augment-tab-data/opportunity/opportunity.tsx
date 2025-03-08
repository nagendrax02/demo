import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import {
  ICommonTabSettings,
  IFetchCriteria,
  ITabResponse,
  IUserPermission
} from '../../smartviews.types';
import {
  IColumn,
  ITabConfig,
  ITabHeader,
  IGridConfig,
  IRecordType,
  IFilterConfig,
  ISecondaryHeader,
  IMarvinData,
  IOnFilterChange,
  IActivityGetResponse,
  IGetGridConfig,
  IColumnConfigMap
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { getOpportunityTabActions } from './header-action';
import {
  DEFAULT_MAX_ALLOWED,
  GROUPS,
  RowHeightType,
  TabTypeToNameMap
} from 'apps/smart-views/constants/constants';
import { API_ROUTES } from 'common/constants';
import { CallerSource } from 'common/utils/rest-client';
import {
  OPPORTUNITY_HEADER_MENU_FEATURE_RESTRICTION_MAP,
  OPP_SCHEMA_NAMES,
  OpportunityDefaultFilters,
  customColumnDefs,
  leadInfoColumns,
  leadSchemaNamePrefix,
  replaceableSchema
} from './constants';
import { getSettingConfig, safeParseJson, settingKeys } from 'common/utils/helpers';
import { workAreaIds } from 'common/utils/process/constant';
import {
  getRowActions,
  getBulkActions,
  fetchUserPermissions,
  getOpportunityFieldRenderType,
  getInitialFilterSelectedValue,
  isSortable,
  getOpportunityAdvancedSearch,
  getOpportunityDefaultColumns
} from './helpers';
import { RenderType, DataType, ActivityBaseAttributeDataType } from 'common/types/entity/lead';
import CellRenderer from '../../components/cell-renderers/CellRenderer';
import { getFilterMethods } from '../../components/smartview-tab/components/filter-renderer/utils';
import { generateCustomFilters, removeSchemaPrefix } from '../../components/smartview-tab/utils';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import { EntityType } from 'common/types';
import RowDetail from '../../components/cell-renderers/row-details';
import { fetchOppAndLeadMetaData } from './meta-data/combined';
import {
  IAugmentedSmartViewEntityMetadata,
  IColumnConfig,
  IGetColumnConfig
} from '../common-utilities/common.types';
import {
  addLeadTypeToRequiredColumns,
  fetchProcessData,
  handleTabDelete,
  isLeadSchema,
  replaceTildeCharacter
} from '../../utils/utils';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getRestrictionMap } from 'src/common/utils/permission-manager/permission-manager';
import { FilterRenderType } from '../../components/smartview-tab/components/filter-renderer/constants';
import { getTabSettings } from '../common-utilities/tab-settings';
import {
  ACTION_COLUMN_SCHEMA_NAME,
  DEFAULT_COLUMN_CONFIG_MAP,
  defaultWidthMap
} from '../common-utilities/constant';
import { getUserNames } from 'common/component-lib/user-name';
import {
  addAccountColumns,
  getActionsWidth,
  getLDTypeConfigFromRawData,
  getSortConfig
} from '../common-utilities/utils';
import { productValueHandler } from 'common/utils/helpers/product-names';
import { fetchActionPanelSetting } from 'apps/smart-views/utils/entity-action-restriction/utils/fetch-data';
import {
  addActionColumn,
  getColumnsConfig,
  getIsFixedColumn,
  getIsLastFixedColumn,
  getSortedColumnString
} from '../common-utilities/pin-utils';

const generateInitialFilterData = async (config: {
  defaultFilterArray: string[];
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  tabData: ITabResponse;
}): Promise<IFilterConfig> => {
  const { defaultFilterArray, tabData, metaDataMap } = config;

  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;

  const filterValues = additionalData?.Marvin?.FilterValues || {};
  const filterData: IFilterConfig = {};
  const parsedFilters = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.Filters
  ) as Record<string, string>;

  await Promise.all(
    defaultFilterArray?.map(async (filter) => {
      try {
        const renderType = getOpportunityFieldRenderType(metaDataMap, filter);
        if (renderType === FilterRenderType.None) return;
        const filterMetaData = metaDataMap[filter];
        const selectedValue = getInitialFilterSelectedValue({
          schema: filter,
          filterValues,
          renderType,
          additionalData,
          parsedFilters,
          metadataMap: metaDataMap
        });

        if (!filterMetaData) return;
        const filterValue =
          ((await (
            await getFilterMethods(filterMetaData?.conditionEntityType)
          )?.getFilterValue?.({
            selectedOption: selectedValue,
            schemaName: filter?.startsWith(leadSchemaNamePrefix)
              ? filter?.replace(leadSchemaNamePrefix, '')
              : filter,
            tabType: tabData?.Type,
            entityCode: tabData?.EntityCode
          })) as IOnFilterChange) || {};

        filterData[filter] = {
          ...filterValue,
          label: filterValues[filter]?.label || metaDataMap[filter]?.displayName,
          dataType: metaDataMap[filter]?.dataType as DataType,
          selectedValue: selectedValue,
          renderType,
          isPinned: filterValues?.[filter]?.isPinned
        };
      } catch (error) {
        trackError(error);
      }
    })
  );

  // ordering based on default filters as promise.all executes all promises parallely and filterData is getting jumbled up
  const orderedFilterData = {};
  defaultFilterArray?.forEach((schema) => (orderedFilterData[schema] = filterData[schema]));
  return orderedFilterData;
};

const getSchemaNames = (filters: string[]): string[] =>
  filters?.map((schema) => removeSchemaPrefix(schema));

const getUnRestrictedFields = async (
  defaultFilters: string[],
  entityCode: string
): Promise<string[]> => {
  const [oppRestriction, leadRestriction, salesGroupFilterSetting] = await Promise.all([
    getRestrictionMap(getSchemaNames(defaultFilters), {
      entity: PermissionEntityType.Opportunity,
      action: ActionType.View,
      entityId: entityCode,
      callerSource: CallerSource.SmartViews
    }),
    getRestrictionMap(getSchemaNames(defaultFilters), {
      entity: PermissionEntityType.Lead,
      action: ActionType.View,
      callerSource: CallerSource.SmartViews
    }),
    getSettingConfig<string>(settingKeys.ShowSalesGroupFilterForSVOpp, CallerSource.SmartViews)
  ]);
  const isSalesGroupFilterEnabled = salesGroupFilterSetting === '1';

  const allowLeadFilterCondition = (schemaName: string): boolean => {
    const updatedSchema = removeSchemaPrefix(schemaName);
    if (updatedSchema === GROUPS) {
      return !leadRestriction[updatedSchema] && isSalesGroupFilterEnabled;
    }
    return !leadRestriction[updatedSchema];
  };

  return defaultFilters?.filter((filter) => {
    if (isLeadSchema(filter)) {
      return allowLeadFilterCondition(filter);
    }
    return !oppRestriction[filter];
  });
};

const getDefaultFilters = (tabData: ITabResponse): string => {
  let defaultFilters: string[] = [];
  const tabFetchCriteria = tabData?.TabContentConfiguration?.FetchCriteria;
  const parsedFilters = safeParseJson(tabFetchCriteria?.Filters) as Record<string, string>;
  const uiDefaultFilter = OpportunityDefaultFilters;

  defaultFilters = [...uiDefaultFilter, ...(tabFetchCriteria?.SelectedFilters?.split(',') || [])];
  defaultFilters.push(parsedFilters?.DateFilterOn);

  return defaultFilters?.join(',')?.trim();
};

// eslint-disable-next-line complexity
const getFilterConfig = async (
  tabData: ITabResponse,
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>
): Promise<{ selectedFilters: string[]; bySchemaName: IFilterConfig }> => {
  let selectedFilters: string = '';

  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;

  selectedFilters = additionalData?.Marvin?.Exists
    ? Object.keys(additionalData?.Marvin?.FilterValues || {})?.join(',')
    : getDefaultFilters(tabData);

  let selectedFilterArray = Array.from(
    new Set(selectedFilters?.split(',')?.filter((filter) => filter))
  );

  selectedFilterArray = await getUnRestrictedFields(selectedFilterArray, tabData?.EntityCode);
  selectedFilterArray = selectedFilterArray.filter((schema) => !!metaDataMap[schema]);

  return {
    selectedFilters: selectedFilterArray,
    bySchemaName: await generateInitialFilterData({
      defaultFilterArray: selectedFilterArray,
      metaDataMap,
      tabData
    })
  };
};

const getHeaderConfig = async ({
  commonTabSettings,
  tabData,
  metaDataMap,
  allTabIds,
  representationName,
  userPermissions,
  leadRepName
}: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  allTabIds: string[];
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName: IEntityRepresentationName;
  leadRepName?: IEntityRepresentationName;
  userPermissions: IUserPermission;
}): Promise<ITabHeader> => {
  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;
  const advanceSearchEnglish =
    additionalData?.Marvin?.AdvancedSearchText_English ||
    tabData?.TabContentConfiguration?.FetchCriteria?.AdvancedSearchText_English;
  const primaryHeader = {
    canHide: commonTabSettings?.hidePrimaryHeader,
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
  const tabTypeName = TabTypeToNameMap[tabData.Type]?.toLowerCase() as EntityType;

  const secondaryHeader: ISecondaryHeader = {
    searchText: '',
    hideSearchBar: commonTabSettings?.hideSearchBar,
    filterConfig: {
      filters: await getFilterConfig(tabData, metaDataMap),
      maxAllowedFilters:
        (commonTabSettings?.maxFiltersAllowed?.[tabTypeName] as number) ||
        DEFAULT_MAX_ALLOWED?.Filters
    },
    actionConfiguration: getOpportunityTabActions({
      tabId: tabData.Id,
      representationName,
      userPermissions,
      leadRepName,
      visibilityConfig: await fetchActionPanelSetting(CallerSource.SmartViews)
    }),
    featureRestrictionConfigMap: OPPORTUNITY_HEADER_MENU_FEATURE_RESTRICTION_MAP
  };

  return {
    primary: primaryHeader,
    secondary: secondaryHeader
  };
};

const getColumnDef = (
  schemaData: IAugmentedSmartViewEntityMetadata,
  acc: IColumn[],
  isLeadSchemaName: boolean
): IColumn => ({
  id: schemaData.schemaName,
  displayName: schemaData.displayName,
  resizable: true,
  minWidth: 96,
  isFirstColumn: acc.length === 0,
  CellRenderer: CellRenderer,
  dataType: schemaData.dataType as DataType,
  renderType: schemaData.renderType as RenderType,
  isActivity: !isLeadSchemaName,
  cfsDisplayName: schemaData?.cfsDisplayName,
  isLeadFieldInNonLeadTab: isLeadSchemaName
});

export const getGridColumns = async ({
  columnString,
  columnWidthConfig,
  tabId,
  actionsLength,
  code,
  metaDataMap,
  leadRepName,
  columnConfigMap
}: {
  code: string;
  columnString: string;
  tabId: string;
  columnWidthConfig?: Record<string, number>;
  actionsLength?: number;
  metaDataMap?: Record<string, IAugmentedSmartViewEntityMetadata>;
  leadRepName?: IEntityRepresentationName;
  columnConfigMap?: IColumnConfigMap;
}): Promise<IColumn[]> => {
  const colArr = getSortedColumnString(columnString, columnConfigMap)?.split(',') || [];
  if (!metaDataMap || !leadRepName) {
    const config = await fetchOppAndLeadMetaData(code, tabId);
    metaDataMap = config.metaDataMap;
    leadRepName = config.leadRepName;
  }
  if (!Object.keys(metaDataMap).length) {
    return [];
  }

  // eslint-disable-next-line complexity
  return colArr.reduce((acc, schemaName: string) => {
    const isLeadSchemaName = schemaName.startsWith('P_');
    const schemaData = metaDataMap?.[schemaName];
    const isFixedColumn = getIsFixedColumn(schemaName, acc, columnConfigMap);
    const isLastFixedColumn = getIsLastFixedColumn(acc, columnConfigMap);
    const customColumn = customColumnDefs[schemaName];
    if (schemaName === ACTION_COLUMN_SCHEMA_NAME) {
      const colWidth = getActionsWidth(actionsLength);
      acc.push({
        ...customColumnDefs.Actions,
        fixed: isFixedColumn,
        width: colWidth || customColumnDefs.Actions.width,
        minWidth: colWidth || customColumnDefs.Actions.minWidth,
        className: 'grid-row-actions-cell',
        isLastFixedColumn: isLastFixedColumn
      });
    } else if (customColumn) {
      acc.push({
        ...customColumn,
        displayName: schemaData?.displayName || customColumn.displayName,
        fixed: isFixedColumn,
        isFirstColumn: acc.length === 0,
        isLastFixedColumn: isLastFixedColumn,
        width: columnWidthConfig?.[schemaName] || customColumn.width
      });
    } else if (schemaData) {
      const colDef = {
        ...getColumnDef(schemaData, acc, isLeadSchemaName),
        id: schemaName || schemaData.schemaName,
        fixed: isFixedColumn,
        isLastFixedColumn: isLastFixedColumn,
        sortable: isLeadSchemaName ? false : isSortable(schemaData),
        sortKey: replaceableSchema[schemaName],
        width:
          columnWidthConfig?.[schemaName] || defaultWidthMap[schemaData.renderType as string] || 148
      };
      if (
        !isLeadSchemaName &&
        schemaData?.schemaName &&
        schemaData?.dataType === ActivityBaseAttributeDataType.ActiveUsers
      ) {
        colDef.id = schemaData?.schemaName + 'Name';
        colDef.dataType = DataType.Text;
      }
      acc.push(colDef);
    }
    return acc;
  }, [] as IColumn[]);
};

const handleUserInActivity = (
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

export const augmentResponse = async (
  response: IActivityGetResponse,
  entityMetadata: Record<string, IAugmentedSmartViewEntityMetadata> | undefined,
  id: string
): Promise<{
  records: IRecordType[];
  totalRecordCount?: number;
}> => {
  const productHandler = productValueHandler();

  const augmentedResponse =
    response?.ActivityList?.map((item) => {
      productHandler.addProductIds(item[OPP_SCHEMA_NAMES.Product] as string);

      if (!item?.mx_Custom_1) {
        item.showDefaultOppName = true;
      }

      return {
        ...item,
        id: item.ProspectActivityId,
        isOpportunity: 'true',
        ['P_OwnerId']: item.P_OwnerIdName || item.P_OwnerId
      };
    }) || [];

  productHandler.startApi(CallerSource.SmartViews);
  handleUserInActivity(augmentedResponse, id, entityMetadata);
  return { records: augmentedResponse };
};

const getColumnConfig = async ({
  entityCode,
  columns,
  actionsLength,
  columnWidthConfig,
  tabId,
  columnConfigMap
}: IGetColumnConfig): Promise<IColumnConfig> => {
  const updatedColumns = addAccountColumns(columns?.split(','), 'P_')
    ?.split(',')
    ?.filter((schema) => schema)
    ?.join(',');

  const gridColumns = await getGridColumns({
    columnString: updatedColumns,
    columnWidthConfig,
    tabId,
    actionsLength,
    code: entityCode ?? '',
    columnConfigMap
  });

  return { columns: updatedColumns, gridColumns };
};

const getDefaultOpportunityColumns = (
  fetchCriteria: IFetchCriteria,
  entityMetadata?: Record<string, IAugmentedSmartViewEntityMetadata>
): string => {
  const selectedColumnsList = replaceTildeCharacter(fetchCriteria.SelectedColumns)?.split(',');

  return addActionColumn(
    addAccountColumns(selectedColumnsList, leadSchemaNamePrefix) ||
      getOpportunityDefaultColumns(entityMetadata || {})
  );
};

export const getGridConfig = async ({
  tabData,
  customFilters,
  selectedColumns,
  commonTabSettings,
  entityMetadata,
  representationName,
  filterMap,
  userPermissions
}: IGetGridConfig): Promise<IGridConfig> => {
  const {
    Id,
    SharedBy,
    TabContentConfiguration: { FetchCriteria, Actions },
    TabConfiguration: { IsMarvinTab }
  } = tabData;

  const additionalData = (safeParseJson(FetchCriteria.AdditionalData || '') as IMarvinData) || {};

  const defaultColumns = getDefaultOpportunityColumns(FetchCriteria, entityMetadata);

  const fetchCriteria = {
    PageIndex: 1,
    Code: tabData.EntityCode,
    PageSize: parseInt(FetchCriteria.PageSize),
    Columns: defaultColumns,
    SearchText: '',
    CustomFilters: customFilters,
    IsOpportunity: true,
    SalesGroup: filterMap?.[`${leadSchemaNamePrefix}${GROUPS}`]?.value,
    AdvancedSearch: getOpportunityAdvancedSearch(tabData),
    ...getSortConfig(FetchCriteria.SortedOn || '', customColumnDefs)
  };

  if (additionalData?.Marvin?.Exists) {
    const marvinData = { ...additionalData.Marvin };
    fetchCriteria.SearchText = marvinData.SearchText;
    fetchCriteria.Columns = addActionColumn(
      addAccountColumns(selectedColumns?.length ? selectedColumns : marvinData.Columns, 'P_')
    );
    const sortConfig = { ...getSortConfig(marvinData.SearchSortedOn || '', customColumnDefs) };
    if (sortConfig) {
      fetchCriteria.SortOn = sortConfig.SortOn;
      fetchCriteria.SortBy = sortConfig.SortBy;
    }
  }

  const columnConfigMap = getColumnsConfig(
    DEFAULT_COLUMN_CONFIG_MAP.Opportunity,
    defaultColumns,
    additionalData?.Marvin?.columnConfigMap
  );

  const rowActions = await getRowActions({
    actionConfig: Actions,
    isMarvinTab: IsMarvinTab || !SharedBy,
    tabId: Id,
    opportunityType: tabData.EntityCode,
    userPermissions,
    commonTabSettings
  });

  const leadBulkActions = await getBulkActions({
    userPermissions: userPermissions,
    opportunityType: tabData.EntityCode
  });

  const config: IGridConfig = {
    apiRoute: API_ROUTES.smartviews.activityGet,
    disableSelection: commonTabSettings?.disableSelection,
    allowRowSelection: true,
    fetchCriteria,
    requiredColumns: addLeadTypeToRequiredColumns(leadInfoColumns, true),
    workAreaIds: workAreaIds.SMART_VIEWS.LEAD_TAB,
    rowHeight: RowHeightType.Default,
    tabColumnsWidth: additionalData?.Marvin?.tabColumnsWidth,
    actions: { rowActions: { ...rowActions }, bulkActions: [...leadBulkActions] },
    columns: await getGridColumns({
      columnString: fetchCriteria.Columns,
      columnWidthConfig: additionalData?.Marvin?.tabColumnsWidth,
      actionsLength: rowActions?.quickActions?.length,
      code: tabData.EntityCode,
      metaDataMap: entityMetadata,
      leadRepName: representationName,
      tabId: tabData.Id,
      columnConfigMap
    }),
    expandableComponent: ({ item }) => (
      <RowDetail item={item} entityType={EntityType.Opportunity} tabId={Id} />
    ),
    augmentResponse: (data) => {
      return augmentResponse(data, entityMetadata, Id);
    },
    columnConfigMap
  };

  return config;
};

const handleOpportunityAugmentation = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;
  window[`PROCESS_${tabData.Id}`] = fetchProcessData(
    workAreaIds.SMART_VIEWS.OPPORTUNITY_TAB,
    tabData.Id || ''
  );

  const leadTypeConfiguration = await getLDTypeConfigFromRawData(tabData.Id);

  const [allMetaData, userPermissions] = await Promise.all([
    fetchOppAndLeadMetaData(tabData?.EntityCode, tabData.Id),
    fetchUserPermissions(tabData.EntityCode)
  ]);

  const { metaDataMap, leadRepName, representationName } = allMetaData;
  const headerConfig = await getHeaderConfig({
    tabData,
    commonTabSettings,
    metaDataMap,
    allTabIds,
    userPermissions,
    representationName,
    leadRepName
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
    customFilters,
    commonTabSettings,
    entityMetadata: metaDataMap,
    representationName: leadRepName,
    filterMap: bySchemaName,
    userPermissions
  });

  const augmentedData: ITabConfig = {
    id: tabData.Id,
    type: tabData.Type,
    recordCount: tabData.Count,
    entityCode: tabData.EntityCode,
    sharedBy: tabData.SharedBy,
    tabSettings: {
      ...getTabSettings({ tabData, allTabIds }),
      isOpportunityNameColumnRemoved:
        tabData?.TabContentConfiguration?.FetchCriteria?.IsOpportunityNameColumnRemoved,
      getSystemColumns: () =>
        getDefaultOpportunityColumns(tabData?.TabContentConfiguration?.FetchCriteria, metaDataMap)
    },
    headerConfig,
    gridConfig,
    representationName: representationName,
    leadTypeConfiguration
  };

  return augmentedData;
};

export default handleOpportunityAugmentation;
export { getColumnConfig };
