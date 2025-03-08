import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { ICommonTabSettings, IFetchCriteria, ITabResponse } from '../../smartviews.types';
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
  IFilter,
  IHeaderAction,
  IColumnConfigMap
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { getActivityTabActions } from './header-action';
import {
  ACTIVITY_DATE_TYPE_FILTER,
  ACTIVITY_PRODUCT_TYPE_FILTER,
  activityReplaceableSchema,
  DEFAULT_MAX_ALLOWED,
  GROUPS,
  RowHeightType,
  TabTypeToNameMap
} from 'apps/smart-views/constants/constants';
import { API_ROUTES, DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { CallerSource } from 'common/utils/rest-client';
import {
  ACTIVITY_DEFAULT_FILTERS,
  ACTIVITY_HEADER_MENU_FEATURE_RESTRICTION_MAP,
  COLUMN_RENDERER_MAP,
  customColumnDefs,
  leadInfoColumns,
  leadSchemaNamePrefix,
  SALES_DEFAULT_FILTER
} from './constants';
import { safeParseJson } from 'common/utils/helpers';
import { workAreaIds } from 'common/utils/process/constant';
import {
  getActivtyRowActions,
  fetchUserPermissions,
  getActivityBulkActions,
  getActivityFieldRenderType,
  handleDefaultFilterForSalesActivity,
  getInitialFilterSelectedValue,
  isSortable,
  getActivityAdvancedSearch,
  getActivityDefaultColumns,
  getEligibleActivityFilterConfig,
  canEnableDateTimePickerInDateFilter,
  getUnRestrictedFields
} from './helpers';
import { RenderType, DataType, ActivityBaseAttributeDataType } from 'common/types/entity/lead';
import CellRenderer from '../../components/cell-renderers/CellRenderer';
import { getFilterMethods } from '../../components/smartview-tab/components/filter-renderer/utils';
import { generateCustomFilters } from '../../components/smartview-tab/utils';
import { EntityType } from 'common/types';
import RowDetail from '../../components/cell-renderers/row-details';
import { fetchActivityAndLeadMetaData } from './meta-data/combined';
import {
  IAugmentedSmartViewEntityMetadata,
  IColumnConfig,
  IGetColumnConfig
} from '../common-utilities/common.types';
import {
  addLeadTypeToRequiredColumns,
  fetchProcessData,
  handleTabDelete,
  isManageEntityAdvSearchEnabled,
  isManageTab,
  prependLeadSchemaPrefix
} from '../../utils/utils';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { FilterRenderType } from '../../components/smartview-tab/components/filter-renderer/constants';
import {
  getManageFilterFieldsForNonLeadType,
  getTabSettings
} from '../common-utilities/tab-settings';
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
import { isCallRecordingColumn } from './utils';
import { getManageActivityTabActions } from '../../components/custom-tabs/manage-activity-tab/augumentation';
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
  ignoreCache?: boolean;
}): Promise<IFilterConfig> => {
  const { defaultFilterArray, tabData, metaDataMap, ignoreCache } = config;

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
        const renderType = getActivityFieldRenderType(metaDataMap, filter);
        if (renderType === FilterRenderType.None) return;
        const filterMetaData = metaDataMap[filter];
        const selectedValue = getInitialFilterSelectedValue({
          schema: filter,
          filterValues,
          renderType,
          additionalData,
          parsedFilters,
          entityCode: tabData?.EntityCode,
          metadataMap: metaDataMap,
          isManageTab: isManageTab(tabData?.Id),
          ignoreCache: ignoreCache
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
          enableDateTimePicker: canEnableDateTimePickerInDateFilter(
            renderType,
            filterMetaData?.dataType,
            filterMetaData?.conditionEntityType
          ),
          avoidUTCFormatting:
            (!additionalData?.Marvin?.Exists || ignoreCache) && !isManageTab(tabData?.Id),
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

const handleDefaultDateFilterOn = (filters: string, dateFilterOn: string): string => {
  const activityDateFilterOn = ACTIVITY_DATE_TYPE_FILTER[dateFilterOn] as string;
  return activityDateFilterOn?.trim() ? `${filters},${activityDateFilterOn}` : filters;
};

const handleDefaultDateFilterForSVActivityTab = (filters: string): string => {
  const filterArray = filters?.split(',');
  return filterArray
    ?.map((filter) =>
      ACTIVITY_DATE_TYPE_FILTER[filter] ? ACTIVITY_DATE_TYPE_FILTER[filter] : filter
    )
    ?.join(',');
};

const handleProductFilterForSVActivityTab = (filters: string): string => {
  const filterArray = filters?.split(',');
  return filterArray
    ?.map((filter) =>
      ACTIVITY_PRODUCT_TYPE_FILTER[filter] ? ACTIVITY_PRODUCT_TYPE_FILTER[filter] : filter
    )
    ?.join(',');
};

const handleDefaultLeadFilters = (tabData: ITabResponse, filters: string): string => {
  const selectLeadFilters =
    tabData?.TabContentConfiguration?.FetchCriteria?.SelectedLeadFilters?.split(',')
      ?.map((leadFilter) => prependLeadSchemaPrefix(leadFilter))
      ?.join(',');

  return selectLeadFilters?.trim() ? `${filters},${selectLeadFilters}` : filters;
};

const getDefaultActivityFilters = (tabFetchCriteria: IFetchCriteria): string => {
  /* Updated default filter behavior for the activity tab

  - Changes were made to manage default filters from Smartviews settings for the activity tab.
  - Users can now remove all filters from the activity tab through manage filters.
  - If 'DontAddDefaultFiltersByDefault' is true, it means the user has modified the default filters from manage filters.
    In this case, we return 'SelectedFilters' from the tab config without adding additional filters from the frontend.
  - If 'DontAddDefaultFiltersByDefault' is false, we may need to apply additional filters to 'SelectedFilters' before returning.
  - If 'SelectedFilters' contains any of the filters in the 'defaultSelectedFilters' array, then the activity tab is newly created (i.e., created after these backend changes were pushed).
    In this case, we return 'SelectedFilters' from the tab config without adding additional filters from the frontend.
  - If 'SelectedFilters' does not contain any of the filters in the 'defaultSelectedFilters' array, then the activity tab is an existing tab (i.e., created before these backend changes were pushed).
    In this case, we need to add all the filters from 'defaultSelectedFilters' to 'SelectedFilters' before returning.
*/

  try {
    const selectedFilters = tabFetchCriteria?.SelectedFilters?.split(',');

    const defaultSelectedFilters = [
      'Status',
      'PACreatedOn',
      'PAModifiedOn',
      'ActivityCreatedOn',
      'ActivityModifiedOn'
    ];

    const dontAddDefaultFiltersByDefault = !!tabFetchCriteria?.DontAddDefaultFiltersByDefault;

    if (dontAddDefaultFiltersByDefault) {
      return selectedFilters?.join(',');
    } else {
      const selectedFilterContainsDefaultFilters = selectedFilters.some((item) =>
        defaultSelectedFilters.includes(item)
      );

      if (selectedFilterContainsDefaultFilters) {
        return selectedFilters?.join(',');
      } else {
        return [...selectedFilters, ...defaultSelectedFilters]?.join(',');
      }
    }
  } catch (err) {
    trackError(err);
    return '';
  }
};

const isUserDefinedSvTab = (tabData: ITabResponse): boolean => {
  return tabData?.TabConfiguration?.CanDelete;
};

const getDefaultFilters = (
  tabData: ITabResponse,
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>
): string => {
  let defaultFilters = '';
  const tabFetchCriteria = tabData?.TabContentConfiguration?.FetchCriteria;

  const manageTab = isManageTab(tabData.Id);

  if (manageTab) {
    const parsedFilters = safeParseJson(tabFetchCriteria?.Filters) as Record<string, string>;

    let uiDefaultFilter = ACTIVITY_DEFAULT_FILTERS?.join(',');

    if (tabData?.SharedBy?.trim()) {
      uiDefaultFilter = uiDefaultFilter?.replace('P_ProspectStage', '')?.replace('Owner', '');
    }

    defaultFilters = `${uiDefaultFilter},${tabFetchCriteria?.SelectedFilters || ''}`;

    defaultFilters = handleDefaultDateFilterOn(defaultFilters, parsedFilters?.DateFilterOn);
  } else {
    defaultFilters = getDefaultActivityFilters(tabFetchCriteria);
    defaultFilters = handleDefaultDateFilterForSVActivityTab(defaultFilters);
    defaultFilters = handleProductFilterForSVActivityTab(defaultFilters);
  }
  defaultFilters = handleDefaultLeadFilters(tabData, defaultFilters);

  if (manageTab || isUserDefinedSvTab(tabData))
    defaultFilters = handleDefaultFilterForSalesActivity(
      defaultFilters,
      tabData?.EntityCode,
      metaDataMap
    );

  return defaultFilters?.trim() || ACTIVITY_DEFAULT_FILTERS?.join(',');
};

const getEligibleFilters = (
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>,
  selectedFilters: string[]
): string[] => {
  const metaData = getEligibleActivityFilterConfig(metaDataMap);
  const leadMetaData = getManageFilterFieldsForNonLeadType(metaDataMap);

  return selectedFilters?.filter((filter) => metaData?.[filter] || leadMetaData?.[filter]);
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
    : getDefaultFilters(tabData, metaDataMap);

  let selectedFilterArray = Array.from(
    new Set(selectedFilters?.split(',')?.filter((filter) => filter))
  );

  selectedFilterArray = await getUnRestrictedFields(selectedFilterArray, tabData?.EntityCode);

  selectedFilterArray = getEligibleFilters(metaDataMap, selectedFilterArray);
  return {
    selectedFilters: selectedFilterArray,
    bySchemaName: await generateInitialFilterData({
      defaultFilterArray: selectedFilterArray,
      metaDataMap,
      tabData
    })
  };
};

const getSystemFilterConfig = async (
  tabData: ITabResponse,
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>
): Promise<IFilter> => {
  const selectedFilterArray = getDefaultFilters(tabData, metaDataMap)?.split(',');
  return {
    selectedFilters: selectedFilterArray,
    bySchemaName: await generateInitialFilterData({
      defaultFilterArray: selectedFilterArray,
      metaDataMap,
      tabData,
      ignoreCache: true
    })
  };
};

export const getHeaderConfig = async ({
  commonTabSettings,
  tabData,
  metaDataMap,
  allTabIds,
  leadRepName
}: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  allTabIds: string[];
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  leadRepName?: IEntityRepresentationName;
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

  const getActionConfiguration = async (): Promise<IHeaderAction[]> => {
    const commonParams = {
      tabId: tabData.Id,
      entityCode: tabData.EntityCode,
      visibilityConfig: await fetchActionPanelSetting(CallerSource.SmartViews),
      leadRepName: leadRepName
    };
    return isManageTab(tabData.Id)
      ? getManageActivityTabActions(commonParams)
      : getActivityTabActions(commonParams);
  };

  const secondaryHeader: ISecondaryHeader = {
    searchText: '',
    hideSearchBar: commonTabSettings?.hideSearchBar,
    filterConfig: {
      filters: await getFilterConfig(tabData, metaDataMap),
      maxAllowedFilters:
        (commonTabSettings?.maxFiltersAllowed?.[tabTypeName] as number) ||
        DEFAULT_MAX_ALLOWED?.Filters
    },
    actionConfiguration: await getActionConfiguration(),
    featureRestrictionConfigMap: ACTIVITY_HEADER_MENU_FEATURE_RESTRICTION_MAP
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
  CellRenderer: COLUMN_RENDERER_MAP[schemaData.schemaName] || CellRenderer,
  dataType: schemaData.dataType as DataType,
  renderType: schemaData.renderType as RenderType,
  isActivity: !isLeadSchemaName,
  cfsDisplayName: schemaData?.cfsDisplayName,
  isLeadFieldInNonLeadTab: isLeadSchemaName,
  entityType: isLeadSchemaName ? EntityType.Lead : EntityType.Activity
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
    const config = await fetchActivityAndLeadMetaData(code, tabId);
    metaDataMap = config.metaDataMap;
    leadRepName = config.leadRepName;
  }
  if (!Object.keys(metaDataMap).length) {
    return [];
  }

  // eslint-disable-next-line complexity
  return colArr.reduce((acc, schemaName: string) => {
    const isFixedColumn = getIsFixedColumn(schemaName, acc, columnConfigMap);
    const isLastFixedColumn = getIsLastFixedColumn(acc, columnConfigMap);
    const isLeadSchemaName = schemaName.startsWith('P_');
    const schemaData = metaDataMap?.[schemaName];
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
        sortable: isLeadSchemaName ? false : isSortable(schemaData, code),
        fixed: isFixedColumn,
        isLastFixedColumn: isLastFixedColumn,
        sortKey: activityReplaceableSchema[schemaName],
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
      } else if (!isLeadSchemaName && isCallRecordingColumn(schemaData, code)) {
        colDef.renderType = RenderType.MediaLink;
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

const augmentResponse = async (
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
      productHandler.addProductIds(item[SALES_DEFAULT_FILTER.Product] as string);

      return {
        ...item,
        id: item.ProspectActivityId,
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
  const updatedColumns = addAccountColumns(columns?.split(','), leadSchemaNamePrefix)
    ?.split(',')
    ?.filter((schema) => schema)
    ?.join(',');

  const gridColumns = await getGridColumns({
    columnString: updatedColumns,
    columnWidthConfig,
    actionsLength,
    code: entityCode ?? '',
    tabId,
    columnConfigMap
  });

  return { columns: updatedColumns, gridColumns };
};

const getDefaultColumns = (tabData: ITabResponse): string => {
  const selectedColumnsList =
    tabData?.TabContentConfiguration?.FetchCriteria?.SelectedColumns?.split(',');

  return addActionColumn(
    addAccountColumns(selectedColumnsList, leadSchemaNamePrefix) ||
      getActivityDefaultColumns(tabData.EntityCode)
  );
};

export const getActivityGridConfig = async ({
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

  const defaultColumns = getDefaultColumns(tabData);

  const fetchCriteria = {
    PageIndex: 1,
    Code: tabData.EntityCode,
    PageSize: parseInt(FetchCriteria.PageSize),
    Columns: defaultColumns,
    SearchText: '',
    CustomFilters: customFilters,
    IsOpportunity: false,
    SalesGroup: filterMap?.[`${leadSchemaNamePrefix}${GROUPS}`]?.value,
    AdvancedSearch: getActivityAdvancedSearch(tabData),
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
    DEFAULT_COLUMN_CONFIG_MAP.Activity,
    defaultColumns,
    additionalData?.Marvin?.columnConfigMap
  );

  const rowActions = await getActivtyRowActions({
    actionConfig: Actions,
    isMarvinTab: IsMarvinTab || !SharedBy,
    tabId: Id,
    activityType: tabData.EntityCode,
    userPermissions,
    commonTabSettings,
    isManageTab: isManageTab(tabData.Id)
  });

  const leadBulkActions = await getActivityBulkActions({
    userPermissions: userPermissions,
    activityType: tabData.EntityCode
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
    isManageEntityAdvancedSearchApplied: isManageEntityAdvSearchEnabled(tabData.Id)
      ? additionalData?.Marvin?.isManageEntityAdvancedSearchApplied
      : false,
    expandableComponent: ({ item }) => (
      <RowDetail item={item} entityType={EntityType.Activity} tabId={Id} />
    ),
    augmentResponse: (data) => {
      return augmentResponse(data, entityMetadata, Id);
    },
    columnConfigMap
  };

  return config;
};

const handleActivityAugmentation = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;
  window[`PROCESS_${tabData.Id}`] = fetchProcessData(
    workAreaIds.SMART_VIEWS.ACTIVITY_TAB,
    tabData.Id || ''
  );
  const [allMetaData, userPermissions] = await Promise.all([
    fetchActivityAndLeadMetaData(tabData?.EntityCode, tabData.Id),
    fetchUserPermissions(tabData.EntityCode)
  ]);

  const { metaDataMap, leadRepName } = allMetaData;
  const headerConfig = await getHeaderConfig({
    tabData,
    commonTabSettings,
    metaDataMap,
    allTabIds,
    leadRepName
  });

  const { selectedFilters, bySchemaName } = headerConfig?.secondary?.filterConfig?.filters || {};
  const leadTypeConfiguration = await getLDTypeConfigFromRawData(tabData.Id);

  const customFilters = generateCustomFilters({
    selectedFilters,
    bySchemaName,
    tabType: tabData?.Type,
    entityCode: tabData?.EntityCode,
    leadTypeConfiguration
  });
  const gridConfig = await getActivityGridConfig({
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
    tabSettings: getTabSettings({
      tabData,
      allTabIds,
      getSystemFilterConfig: () => getSystemFilterConfig(tabData, metaDataMap),
      getSystemColumns: () => getDefaultColumns(tabData)
    }),
    headerConfig,
    gridConfig,
    representationName: DEFAULT_ENTITY_REP_NAMES.activity,
    leadTypeConfiguration
  };

  return augmentedData;
};

export default handleActivityAugmentation;
export { getColumnConfig };
