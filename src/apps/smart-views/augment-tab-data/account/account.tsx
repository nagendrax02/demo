import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { ICommonTabSettings, ITabResponse, IUserPermission } from '../../smartviews.types';
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
  IGetGridConfig,
  IAccountGetResponse,
  IColumnConfigMap
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { getAccountTabActions } from './header-action';
import { DEFAULT_MAX_ALLOWED, TabTypeToNameMap } from 'apps/smart-views/constants/constants';
import { API_ROUTES } from 'common/constants';
import {
  ACCOUNT_DEFAULT_FILTERS,
  cellRendererBasedOnSchema,
  accountDateTypeFilterMap,
  customColumnDefs,
  replaceableSchema,
  ACCOUNT_HEADER_MENU_FEATURE_RESTRICTION_MAP
} from './constants';
import { safeParseJson } from 'common/utils/helpers';
import {
  getAccountRowActions,
  fetchUserPermissions,
  getAccountBulkActions,
  getInitialFilterSelectedValue,
  getAccountAdvancedSearch,
  getAccountDefaultColumns,
  getUnRestrictedFields
} from './helpers';
import { DataType } from 'common/types/entity/lead';
import CellRenderer from '../../components/cell-renderers/CellRenderer';
import { getUpdatedColumns } from './helpers';
import { getFilterMethods } from '../../components/smartview-tab/components/filter-renderer/utils';
import { generateAccountFiltersForFetchCriteria } from '../../components/smartview-tab/utils';
import { EntityType } from 'common/types';
import {
  IAugmentedSmartViewEntityMetadata,
  IColumnConfig,
  IGetColumnConfig
} from '../common-utilities/common.types';
import { handleTabDelete } from '../../utils/utils';
import { FilterRenderType } from '../../components/smartview-tab/components/filter-renderer/constants';
import { getAccountFilterRenderType, getTabSettings } from '../common-utilities/tab-settings';
import {
  ACTION_COLUMN_SCHEMA_NAME,
  DEFAULT_COLUMN_CONFIG_MAP,
  defaultWidthMap
} from '../common-utilities/constant';
import { getActionsWidth, getSortConfig } from '../common-utilities/utils';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { fetchRepresentationName } from 'common/utils/entity-data-manager/lead/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { fetchSmartViewAccountMetadata } from '../common-utilities/meta-data/account-meta-data';
import {
  addActionColumn,
  getColumnsConfig,
  getIsFixedColumn,
  getIsLastFixedColumn,
  getSortedColumnString
} from '../common-utilities/pin-utils';
import { RowHeightType } from '@lsq/nextgen-preact/common/common.types';

const generateInitialFilterData = async (config: {
  defaultFilterArray: string[];
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  tabData: ITabResponse;
  parsedFilters: Record<string, string>;
  additionalData: IMarvinData;
}): Promise<IFilterConfig> => {
  const { defaultFilterArray, tabData, metaDataMap, parsedFilters, additionalData } = config;
  const filterValues = additionalData?.Marvin?.FilterValues || {};
  const filterData: IFilterConfig = {};

  await Promise.all(
    defaultFilterArray?.map(async (schemaName) => {
      try {
        const renderType = getAccountFilterRenderType(metaDataMap, schemaName);
        if (renderType === FilterRenderType.None) return;
        const filterMetaData = metaDataMap[schemaName];
        const selectedValue = getInitialFilterSelectedValue({
          schema: schemaName,
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
            schemaName,
            tabType: tabData?.Type,
            entityCode: tabData?.EntityCode
          })) as IOnFilterChange) || {};

        filterData[schemaName] = {
          ...filterValue,
          label: filterValues[schemaName]?.label || metaDataMap[schemaName]?.displayName,
          selectedValue: selectedValue,
          renderType,
          isPinned: filterValues?.[schemaName]?.isPinned
        };
      } catch (error) {
        trackError(error);
      }
    })
  );

  return filterData;
};

const getDefaultFilters = (
  tabData: ITabResponse,
  parsedFilters: Record<string, string>
): string => {
  let defaultFilters = '';
  const tabFetchCriteria = tabData?.TabContentConfiguration?.FetchCriteria;
  const uiDefaultFilter = ACCOUNT_DEFAULT_FILTERS.join(',');
  defaultFilters = `${uiDefaultFilter},${tabFetchCriteria?.SelectedFilters || ''}`;
  const dateFilterOn = accountDateTypeFilterMap[parsedFilters?.DateFilterOn] as string;

  if (dateFilterOn) {
    defaultFilters += `,${dateFilterOn}`;
  }
  return defaultFilters?.trim();
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

  const parsedFilters = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.Filters
  ) as Record<string, string>;

  selectedFilters = additionalData?.Marvin?.Exists
    ? Object.keys(additionalData?.Marvin?.FilterValues || {})?.join(',')
    : getDefaultFilters(tabData, parsedFilters);

  let selectedFilterArray = Array.from(
    new Set(selectedFilters?.split(',')?.filter((schema) => schema && !!metaDataMap[schema]))
  );

  selectedFilterArray = await getUnRestrictedFields(selectedFilterArray, tabData?.EntityCode);

  return {
    selectedFilters: selectedFilterArray,
    bySchemaName: await generateInitialFilterData({
      defaultFilterArray: selectedFilterArray,
      metaDataMap,
      tabData,
      parsedFilters,
      additionalData
    })
  };
};

const getHeaderConfig = async ({
  commonTabSettings,
  tabData,
  metaDataMap,
  allTabIds,
  representationName,
  userPermissions
}: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  allTabIds: string[];
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName: IEntityRepresentationName;
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
    actionConfiguration: getAccountTabActions({
      tabId: tabData.Id,
      representationName,
      userPermissions
    }),
    featureRestrictionConfigMap: ACCOUNT_HEADER_MENU_FEATURE_RESTRICTION_MAP
  };

  return {
    primary: primaryHeader,
    secondary: secondaryHeader
  };
};

const getColumnDef = (schemaData: IAugmentedSmartViewEntityMetadata, acc: IColumn[]): IColumn => ({
  id: schemaData.schemaName,
  displayName: schemaData.displayName,
  resizable: true,
  minWidth: 96,
  sortable: schemaData.isSortable,
  isFirstColumn: acc.length === 0,
  CellRenderer: cellRendererBasedOnSchema[schemaData.schemaName] ?? CellRenderer,
  dataType: schemaData.dataType as DataType,
  renderType: schemaData.renderType,
  entityType: EntityType.Account
});

export const getGridColumns = async ({
  columnString,
  columnWidthConfig,
  actionsLength,
  code,
  metaDataMap,
  columnConfigMap
}: {
  code: string;
  columnString: string;
  columnWidthConfig?: Record<string, number>;
  actionsLength?: number;
  metaDataMap?: Record<string, IAugmentedSmartViewEntityMetadata>;
  columnConfigMap?: IColumnConfigMap;
}): Promise<IColumn[]> => {
  const colArr = getSortedColumnString(columnString, columnConfigMap)?.split(',') || [];
  if (!metaDataMap) {
    const config = await fetchSmartViewAccountMetadata(code);
    metaDataMap = config.metaDataMap;
  }
  if (!Object.keys(metaDataMap).length) {
    return [];
  }
  // eslint-disable-next-line complexity
  return colArr.reduce((acc, schemaName: string) => {
    const isFixedColumn = getIsFixedColumn(schemaName, acc, columnConfigMap);
    const isLastFixedColumn = getIsLastFixedColumn(acc, columnConfigMap);
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
        ...getColumnDef(schemaData, acc),
        fixed: isFixedColumn,
        isLastFixedColumn: isLastFixedColumn,
        id: schemaName || schemaData.schemaName,
        sortKey: replaceableSchema[schemaName],
        width:
          columnWidthConfig?.[schemaName] || defaultWidthMap[schemaData.renderType as string] || 148
      };
      acc.push(colDef);
    }
    return acc;
  }, [] as IColumn[]);
};

const augmentResponse = async (
  response: IAccountGetResponse,
  entityCode: string
): Promise<{
  records: IRecordType[];
  totalRecordCount?: number;
}> => {
  const augmentedRecords: IRecordType[] = [];
  response?.Accounts?.forEach((item) => {
    const augmentedItem = item?.Properties?.reduce((acc, record) => {
      acc[record.Attribute] = record.Value;
      if (record.Attribute === 'CompanyId') {
        acc.id = record.Value || '';
      }
      return acc;
    }, {} as IRecordType);
    augmentedRecords.push({ ...augmentedItem, entityCode });
  });
  return { records: augmentedRecords };
};

const getColumnConfig = async ({
  entityCode,
  columns,
  actionsLength,
  columnWidthConfig,
  columnConfigMap
}: IGetColumnConfig): Promise<IColumnConfig> => {
  const updatedColumns = getUpdatedColumns(columns?.split(','))
    ?.split(',')
    ?.filter((schema) => schema)
    ?.join(',');

  const gridColumns = await getGridColumns({
    columnString: updatedColumns,
    columnWidthConfig,
    actionsLength,
    code: entityCode ?? '',
    columnConfigMap
  });

  return { columns: updatedColumns, gridColumns };
};

const getAccountGridConfig = async ({
  tabData,
  customFilters,
  customDateFilters,
  selectedColumns,
  commonTabSettings,
  entityMetadata,
  userPermissions,
  leadRepName
}: IGetGridConfig & { leadRepName?: IEntityRepresentationName }): Promise<IGridConfig> => {
  const {
    Id,
    SharedBy,
    TabContentConfiguration: { FetchCriteria, Actions },
    TabConfiguration: { IsMarvinTab }
  } = tabData;

  const additionalData = (safeParseJson(FetchCriteria.AdditionalData || '') as IMarvinData) || {};

  const platformColumns = getAccountDefaultColumns(FetchCriteria);

  const fetchCriteria = {
    PageIndex: 1,
    Type: tabData.EntityCode,
    PageSize: parseInt(FetchCriteria.PageSize),
    Columns: platformColumns,
    SearchText: '',
    CustomFilters: customFilters,
    CustomDateFilters: customDateFilters,
    AdvancedSearch: getAccountAdvancedSearch(tabData),
    ...getSortConfig(FetchCriteria.SortedOn, customColumnDefs)
  };

  if (additionalData?.Marvin?.Exists) {
    const marvinData = { ...additionalData.Marvin };
    fetchCriteria.SearchText = marvinData.SearchText;
    fetchCriteria.Columns = addActionColumn(
      getUpdatedColumns(
        selectedColumns?.length
          ? selectedColumns
          : platformColumns
            ? platformColumns.split(',')
            : marvinData.Columns
      )
    );
    const sortConfig = { ...getSortConfig(marvinData.SearchSortedOn || '', customColumnDefs) };
    if (sortConfig.SortOn) {
      fetchCriteria.SortOn = sortConfig.SortOn;
      fetchCriteria.SortBy = sortConfig.SortBy;
    }
  }

  const columnConfigMap = getColumnsConfig(
    DEFAULT_COLUMN_CONFIG_MAP.Account,
    platformColumns,
    additionalData?.Marvin?.columnConfigMap
  );

  const rowActions = await getAccountRowActions({
    actionConfig: Actions,
    isMarvinTab: IsMarvinTab || !SharedBy,
    tabId: Id,
    userPermissions,
    commonTabSettings,
    leadRepName
  });

  const bulkActions = await getAccountBulkActions({
    userPermissions: userPermissions
  });

  const config: IGridConfig = {
    apiRoute: API_ROUTES.smartviews.accountGet,
    disableSelection: commonTabSettings?.disableSelection,
    allowRowSelection: true,
    fetchCriteria,
    rowHeight: RowHeightType.Default,
    requiredColumns: 'CompanyId',
    tabColumnsWidth: additionalData?.Marvin?.tabColumnsWidth,
    actions: { rowActions: { ...rowActions }, bulkActions: [...bulkActions] },
    columns: await getGridColumns({
      columnString: fetchCriteria.Columns,
      columnWidthConfig: additionalData?.Marvin?.tabColumnsWidth,
      actionsLength: rowActions?.quickActions?.length,
      code: tabData.EntityCode,
      metaDataMap: entityMetadata,
      columnConfigMap
    }),
    augmentResponse: (response) => augmentResponse(response, tabData.EntityCode),
    columnConfigMap
  };

  return config;
};

const handleAccountAugmentation = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;
  const [allMetaData, userPermissions, leadRepName] = await Promise.all([
    fetchSmartViewAccountMetadata(tabData?.EntityCode),
    fetchUserPermissions(tabData.EntityCode),
    fetchRepresentationName(CallerSource.SmartViews)
  ]);

  const { metaDataMap, representationName } = allMetaData;
  const headerConfig = await getHeaderConfig({
    tabData,
    commonTabSettings,
    metaDataMap,
    allTabIds,
    representationName,
    userPermissions
  });

  const { selectedFilters, bySchemaName } = headerConfig?.secondary?.filterConfig?.filters || {};
  const { customFilters, customDateFilters } = generateAccountFiltersForFetchCriteria({
    selectedFilters,
    bySchemaName,
    tabType: tabData?.Type
  });
  const gridConfig = await getAccountGridConfig({
    tabData,
    customFilters,
    customDateFilters,
    commonTabSettings,
    entityMetadata: metaDataMap,
    userPermissions,
    leadRepName
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
      getSystemColumns: () =>
        getAccountDefaultColumns(tabData?.TabContentConfiguration?.FetchCriteria)
    }),
    headerConfig,
    gridConfig,
    representationName: representationName
  };

  return augmentedData;
};

export default handleAccountAugmentation;
export { getColumnConfig };
