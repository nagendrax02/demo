import { trackError } from 'common/utils/experience/utils/track-error';
import { lazy } from 'react';
import { ICommonTabSettings, ITabResponse } from '../../smartviews.types';
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
  IFetchCriteria,
  IFilter,
  IRowActionConfig,
  IColumnConfigMap
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { getActionsConfig } from './header-action';
import {
  ACCOUNT_SCHEMA_PREFIX,
  ConditionEntityType,
  DEFAULT_MAX_ALLOWED,
  RowHeightType,
  TabType,
  TabTypeToNameMap
} from 'apps/smart-views/constants/constants';
import { API_ROUTES, DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import {
  ACTIVITY_DEFAULT_FILTERS,
  ACTIVITY_HEADER_MENU_FEATURE_RESTRICTION_MAP,
  COLUMN_RENDERER_MAP,
  customColumnDefs,
  platformSettingsSchemaMap
} from './constants';
import { safeParseJson } from 'common/utils/helpers';
import {
  getActivityRowActions,
  getActivityFieldRenderType,
  getInitialFilterSelectedValue,
  isSortable,
  getDefaultColumns,
  getEligibleFilterConfig,
  getUnRestrictedFields,
  fetchUserPermissions,
  canEnableDateTimePicker,
  getUpdatedColumns,
  handleUserInActivity
} from './helpers';
import { RenderType, DataType } from 'common/types/entity/lead';
import CellRenderer from 'apps/smart-views/components/cell-renderers/CellRenderer';
import { getFilterMethods } from '../../components/smartview-tab/components/filter-renderer/utils';
import { generateCustomFilters, removeSchemaPrefix } from '../../components/smartview-tab/utils';
import { EntityType } from 'common/types';
import { fetchActivityAndAccountMetaData } from './meta-data/combined';
import {
  IAugmentedSmartViewEntityMetadata,
  IColumnConfig,
  IGetColumnConfig
} from '../common-utilities/common.types';
import { handleTabDelete, isAccountSchemaName } from '../../utils/utils';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { FilterRenderType } from '../../components/smartview-tab/components/filter-renderer/constants';
import { getTabSettings } from '../common-utilities/tab-settings';
import {
  ACTION_COLUMN_SCHEMA_NAME,
  CHECKBOX_COLUMN,
  DEFAULT_COLUMN_CONFIG_MAP,
  defaultWidthMap
} from '../common-utilities/constant';
import { getActionsWidth, getSortConfig } from '../common-utilities/utils';
import { IDateOption } from 'common/component-lib/date-filter';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IAccountActivityGetResponse } from './account-activity.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import {
  addActionColumn,
  getColumnsConfig,
  getIsFixedColumn,
  getIsLastFixedColumn,
  getSortedColumnString
} from '../common-utilities/pin-utils';

const ActivityExpandableRow = withSuspense(
  lazy(() => import('./expandable-row/ActivityExpandableRow'))
);

export const getEventCodes = (
  tabData: ITabResponse
): {
  AccountEventCode: string;
  ActivityEventCode: string;
} => {
  const tabConfig = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.DefaultFilters
  ) as Record<string, string>;

  return {
    AccountEventCode: tabConfig?.AccountType,
    ActivityEventCode: tabConfig?.ActivityEventCode
  };
};

const getFilterValue = async ({
  conditionEntityType,
  accountEventCode,
  activityEventCode,
  selectedValue,
  tabType,
  schema
}: {
  conditionEntityType?: ConditionEntityType;
  tabType: TabType;
  accountEventCode: string;
  activityEventCode: string;
  selectedValue: IDateOption | IOption[];
  schema: string;
}): Promise<IOnFilterChange> => {
  return (
    ((await (
      await getFilterMethods(conditionEntityType)
    )?.getFilterValue?.({
      selectedOption: selectedValue,
      schemaName: removeSchemaPrefix(schema, ACCOUNT_SCHEMA_PREFIX),
      tabType: tabType,
      entityCode: isAccountSchemaName(schema) ? accountEventCode : activityEventCode
    })) as IOnFilterChange) || {}
  );
};

const generateInitialFilterData = async (config: {
  defaultFilterArray: string[];
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  tabData: ITabResponse;
  ignoreMarvinCache: boolean;
}): Promise<IFilterConfig> => {
  const { defaultFilterArray, tabData, metaDataMap, ignoreMarvinCache } = config;

  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;

  const cachedFilterValues = additionalData?.Marvin?.FilterValues || {};
  const filterData: IFilterConfig = {};
  const parsedFilters = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.Filters
  ) as Record<string, string>;

  const entityCodes = getEventCodes(tabData);
  await Promise.all(
    defaultFilterArray?.map(async (filter) => {
      try {
        const renderType = getActivityFieldRenderType(metaDataMap, filter);
        if (renderType === FilterRenderType.None) return;
        const filterMetaData = metaDataMap[filter];
        if (!filterMetaData) return;

        const selectedValue = getInitialFilterSelectedValue({
          schema: filter,
          cachedFilterValues,
          renderType,
          additionalData,
          parsedFilters,
          metadataMap: metaDataMap,
          ignoreMarvinCache
        });

        const filterValue = await getFilterValue({
          accountEventCode: entityCodes.AccountEventCode,
          activityEventCode: entityCodes.ActivityEventCode,
          conditionEntityType: filterMetaData.conditionEntityType,
          schema: filter,
          selectedValue,
          tabType: tabData.Type
        });

        filterData[filter] = {
          ...filterValue,
          label: cachedFilterValues[filter]?.label || metaDataMap[filter]?.displayName,
          dataType: metaDataMap[filter]?.dataType as DataType,
          selectedValue: selectedValue,
          renderType,
          enableDateTimePicker: canEnableDateTimePicker(
            filterMetaData.renderType,
            filterMetaData.dataType
          ),
          entityCode: isAccountSchemaName(filter)
            ? entityCodes?.AccountEventCode
            : entityCodes?.ActivityEventCode,
          isPinned: cachedFilterValues?.[filter]?.isPinned
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

const getSystemDefaultFilters = (tabData: ITabResponse): string => {
  let defaultFilters = '';
  const tabFetchCriteria = tabData?.TabContentConfiguration?.FetchCriteria;

  defaultFilters = `${tabFetchCriteria?.SelectedFilters || ''}`;

  return defaultFilters?.trim();
};

const getEligibleFilters = (
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>,
  selectedFilters: string[]
): string[] => {
  const eligibleMetadataForFilters = getEligibleFilterConfig(metaDataMap);

  return selectedFilters?.filter((filter) => eligibleMetadataForFilters?.[filter]);
};

const getFilterConfig = async ({
  metaDataMap,
  selectedFilters,
  tabData,
  ignoreMarvinCache = false
}: {
  tabData: ITabResponse;
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  selectedFilters: string;
  ignoreMarvinCache?: boolean;
}): Promise<IFilter> => {
  let selectedFilterArray = Array.from(
    new Set(selectedFilters?.split(',')?.filter((filter) => filter))
  );

  selectedFilterArray = await getUnRestrictedFields(
    selectedFilterArray,
    getEventCodes(tabData).AccountEventCode
  );

  selectedFilterArray = getEligibleFilters(metaDataMap, selectedFilterArray);
  return {
    selectedFilters: selectedFilterArray,
    bySchemaName: await generateInitialFilterData({
      defaultFilterArray: selectedFilterArray,
      metaDataMap,
      tabData,
      ignoreMarvinCache
    })
  };
};

const getFilters = async (
  tabData: ITabResponse,
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>
): Promise<IFilter> => {
  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;

  const selectedFilters = additionalData?.Marvin?.Exists
    ? Object.keys(additionalData?.Marvin?.FilterValues || {})?.join(',')
    : getSystemDefaultFilters(tabData) || ACTIVITY_DEFAULT_FILTERS?.join(',');

  const filterConfig = await getFilterConfig({ tabData, metaDataMap, selectedFilters });
  return filterConfig;
};

const getTabInfo = (activityRepName: string, accountRepName: string): string => {
  return `<div class='condition-wrapper'>Activity is <span class='condition'>${activityRepName}</span></div>
    <div>
    <span class='condition-operator'>And</span>
    <div class='condition-wrapper'>Account is <span class='condition'>${accountRepName}</span> </div>
    </div>
    `;
};

const getHeaderConfig = async ({
  commonTabSettings,
  tabData,
  metaDataMap,
  allTabIds,
  accountRepName,
  activityRepName
}: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  allTabIds: string[];
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  activityRepName: IEntityRepresentationName;
  accountRepName: IEntityRepresentationName;
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
    },
    tabInfoHTML: getTabInfo(activityRepName.SingularName, accountRepName.SingularName)
  };
  const tabTypeName = TabTypeToNameMap[tabData.Type]?.toLowerCase() as EntityType;

  const secondaryHeader: ISecondaryHeader = {
    searchText: '',
    hideSearchBar: commonTabSettings?.hideSearchBar,
    filterConfig: {
      filters: await getFilters(tabData, metaDataMap),
      maxAllowedFilters:
        (commonTabSettings?.maxFiltersAllowed?.[tabTypeName] as number) ||
        DEFAULT_MAX_ALLOWED?.Filters
    },
    actionConfiguration: await getActionsConfig({
      activityRepName: activityRepName
    }),
    featureRestrictionConfigMap: ACTIVITY_HEADER_MENU_FEATURE_RESTRICTION_MAP
  };

  return {
    primary: primaryHeader,
    secondary: secondaryHeader
  };
};

const getColumnDef = (
  schemaData: IAugmentedSmartViewEntityMetadata,
  currentColumnLength: number
): IColumn => ({
  id: schemaData.schemaName,
  displayName: schemaData.displayName,
  resizable: true,
  minWidth: 96,
  isFirstColumn: currentColumnLength === 0,
  CellRenderer:
    COLUMN_RENDERER_MAP[schemaData.schemaName] ||
    ((props): JSX.Element => <CellRenderer {...props} canHaveEmptyValuesForFieldName />),
  dataType: schemaData.dataType as DataType,
  renderType: schemaData.renderType as RenderType,
  cfsDisplayName: schemaData?.cfsDisplayName,
  entityType: isAccountSchemaName(schemaData.schemaName)
    ? EntityType.Account
    : EntityType.AccountActivity
});

const getColumnWidth = ({
  customColumn,
  renderType,
  schemaName,
  columnWidthConfig
}: {
  schemaName: string;
  renderType?: string;
  customColumn?: IColumn;
  columnWidthConfig?: Record<string, number>;
}): number => {
  if (customColumn) return columnWidthConfig?.[schemaName] || (customColumn.width as number);
  return columnWidthConfig?.[schemaName] || defaultWidthMap[renderType || ''] || 148;
};

const getColumn = ({
  acc,
  schemaName,
  columnWidthConfig,
  metaDataMap,
  currentColumnLength,
  columnConfigMap
}: {
  acc: IColumn[];
  schemaName: string;
  activityEventCode: string;
  currentColumnLength: number;
  columnWidthConfig?: Record<string, number>;
  metaDataMap?: Record<string, IAugmentedSmartViewEntityMetadata>;
  columnConfigMap?: IColumnConfigMap;
}): IColumn | undefined => {
  const schemaData = metaDataMap?.[schemaName];
  const customColumn = customColumnDefs[schemaName];
  const isFixedColumn = getIsFixedColumn(schemaName, acc, columnConfigMap);
  const isLastFixedColumn = getIsLastFixedColumn(acc, columnConfigMap);

  if (!schemaData) return;

  if (customColumn) {
    return {
      ...customColumn,
      displayName: schemaData?.displayName || customColumn.displayName,
      fixed: isFixedColumn,
      isFirstColumn: currentColumnLength === 0,
      isLastFixedColumn: isLastFixedColumn,
      width: getColumnWidth({ schemaName, customColumn })
    };
  }

  const colDef = {
    ...getColumnDef(schemaData, currentColumnLength),
    id: schemaName || schemaData.schemaName,
    sortable: isSortable(schemaData),
    fixed: isFixedColumn,
    isLastFixedColumn: isLastFixedColumn,
    sortKey: schemaName,
    width: getColumnWidth({
      schemaName,
      renderType: schemaData.renderType as string,
      columnWidthConfig
    })
  };

  return colDef;
};

export const getGridColumns = async ({
  columnString,
  columnWidthConfig,
  actionsLength,
  activityEventCode,
  accountEventCode,
  metaDataMap,
  accountRepName,
  canShowActionColumn,
  columnConfigMap
}: {
  activityEventCode: string;
  columnString: string;
  accountEventCode: string;
  canShowActionColumn: boolean;
  columnWidthConfig?: Record<string, number>;
  actionsLength?: number;
  metaDataMap?: Record<string, IAugmentedSmartViewEntityMetadata>;
  accountRepName?: IEntityRepresentationName;
  columnConfigMap?: IColumnConfigMap;
}): Promise<IColumn[]> => {
  const colArr = getSortedColumnString(columnString, columnConfigMap)?.split(',') || [];
  if (!metaDataMap || !accountRepName) {
    const config = await fetchActivityAndAccountMetaData(accountEventCode, activityEventCode);
    metaDataMap = config.metaDataMap;
    accountRepName = config.accountRepName;
  }
  if (!Object.keys(metaDataMap).length) {
    return [];
  }

  return colArr.reduce((acc, schemaName: string) => {
    const schema = platformSettingsSchemaMap[schemaName] || schemaName;

    const colDef = getColumn({
      acc,
      activityEventCode,
      schemaName: schema,
      columnWidthConfig,
      metaDataMap,
      currentColumnLength: acc.length,
      columnConfigMap
    });

    if (schemaName === ACTION_COLUMN_SCHEMA_NAME && canShowActionColumn) {
      const colWidth = getActionsWidth(actionsLength);
      acc.push({
        ...customColumnDefs.Actions,
        width: colWidth || customColumnDefs.Actions.width,
        minWidth: colWidth || customColumnDefs.Actions.minWidth,
        className: 'grid-row-actions-cell',
        fixed: getIsFixedColumn(schemaName, acc, columnConfigMap),
        isLastFixedColumn: getIsLastFixedColumn(acc, columnConfigMap)
      });
    } else if (colDef) {
      acc.push(colDef);
    }

    return acc;
  }, [] as IColumn[]);
};

const augmentResponse = async (
  response: IAccountActivityGetResponse,
  entityMetadata: Record<string, IAugmentedSmartViewEntityMetadata> | undefined,
  id: string
): Promise<{
  records: IRecordType[];
  totalRecordCount?: number;
}> => {
  const augmentedResponse =
    response?.Activities?.map((item) => {
      return {
        ...item,
        id: item.CompanyActivityId
      };
    }) || [];
  handleUserInActivity(augmentedResponse, id, entityMetadata);
  return { records: augmentedResponse };
};

const getColumnConfig = async ({
  entityCode,
  columns,
  actionsLength,
  columnWidthConfig,
  relatedEntityCode,
  canShowActionColumn,
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
    accountEventCode: relatedEntityCode || '',
    activityEventCode: entityCode || '',
    canShowActionColumn: canShowActionColumn ?? true,
    columnConfigMap
  });

  return { columns: updatedColumns, gridColumns };
};

const populateMarvinCache = ({
  additionalData,
  fetchCriteria,
  selectedColumns
}: {
  additionalData: IMarvinData;
  fetchCriteria: IFetchCriteria;
  selectedColumns?: string[];
}): void => {
  if (additionalData?.Marvin?.Exists) {
    const marvinData = { ...additionalData.Marvin };
    fetchCriteria.SearchText = marvinData.SearchText;
    fetchCriteria.Columns = addActionColumn(
      getUpdatedColumns(selectedColumns?.length ? selectedColumns : marvinData.Columns)
    );
    const sortConfig = {
      ...getSortConfig(marvinData.SearchSortedOn || '', customColumnDefs, platformSettingsSchemaMap)
    };
    if (sortConfig) {
      fetchCriteria.SortOn = sortConfig.SortOn;
      fetchCriteria.SortBy = sortConfig.SortBy;
    }
  }
};

const getColumnsList = (tabData: ITabResponse, retrieveSystemColumns = false): (() => string) => {
  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;

  let columns = tabData?.TabContentConfiguration.FetchCriteria.SelectedColumns;

  if (retrieveSystemColumns) {
    columns = additionalData?.Marvin?.SystemTabConfig?.columns || columns;
  }

  return (): string =>
    columns
      ?.split(',')
      .reduce((acc: string[], curr) => {
        if (curr === `${CHECKBOX_COLUMN}`) return acc;
        acc?.push(platformSettingsSchemaMap[curr] || curr);
        return acc;
      }, [])
      ?.join(',');
};

const canShowActionColumns = (rowActions: IRowActionConfig): boolean => {
  return !!(rowActions?.quickActions?.length || rowActions?.moreActions?.length);
};

const getGridConfig = async ({
  tabData,
  customFilters,
  selectedColumns,
  commonTabSettings,
  entityMetadata,
  representationName,
  userPermissions
}: IGetGridConfig): Promise<IGridConfig> => {
  const {
    Id,
    SharedBy,
    TabContentConfiguration: { FetchCriteria, Actions },
    TabConfiguration: { IsMarvinTab }
  } = tabData;

  const eventCodes = getEventCodes(tabData);
  const additionalData = (safeParseJson(FetchCriteria.AdditionalData || '') as IMarvinData) || {};

  const defaultColumns = addActionColumn(getColumnsList(tabData)() || getDefaultColumns());

  const fetchCriteria = {
    PageIndex: 1,
    ActivityEventCode: eventCodes.ActivityEventCode,
    AccountType: eventCodes.AccountEventCode,
    PageSize: parseInt(FetchCriteria.PageSize),
    Columns: defaultColumns,
    SearchText: '',
    CustomFilters: customFilters,
    AdvancedSearch: '',
    ...getSortConfig(FetchCriteria.SortedOn || '', customColumnDefs, platformSettingsSchemaMap)
  };

  const columnConfigMap = getColumnsConfig(
    DEFAULT_COLUMN_CONFIG_MAP.AccountActivity,
    defaultColumns,
    additionalData?.Marvin?.columnConfigMap
  );

  populateMarvinCache({ additionalData, fetchCriteria, selectedColumns });

  const rowActions = await getActivityRowActions({
    actionConfig: Actions,
    isMarvinTab: IsMarvinTab || !SharedBy,
    activityEventCode: getEventCodes(tabData).ActivityEventCode,
    userPermissions,
    commonTabSettings
  });

  const config: IGridConfig = {
    apiRoute: API_ROUTES.smartviews.accountActivityGet,
    disableSelection: true,
    allowRowSelection: false,
    fetchCriteria,
    rowHeight: RowHeightType.Default,
    tabColumnsWidth: additionalData?.Marvin?.tabColumnsWidth,
    actions: { rowActions: rowActions },
    columns: await getGridColumns({
      columnString: fetchCriteria.Columns,
      columnWidthConfig: additionalData?.Marvin?.tabColumnsWidth,
      actionsLength: rowActions?.quickActions?.length,
      canShowActionColumn: canShowActionColumns(rowActions),
      activityEventCode: eventCodes.ActivityEventCode,
      accountEventCode: eventCodes.AccountEventCode,
      metaDataMap: entityMetadata,
      accountRepName: representationName,
      columnConfigMap
    }),
    expandableComponent: ({ item }) => <ActivityExpandableRow item={item} tabId={Id} />,
    augmentResponse: (data) => {
      return augmentResponse(data, entityMetadata, Id);
    },
    requiredColumns: 'C_CompanyName,C_Website,C_Phone,C_City,C_State,C_Country,C_Stage', //These values are required for inline details.
    columnConfigMap
  };

  return config;
};

const getSystemFilterConfigGenerator = (
  tabData: ITabResponse,
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>
): (() => Promise<IFilter>) | undefined => {
  const systemFilters = getSystemDefaultFilters(tabData);
  if (!systemFilters) return undefined;

  return async (): Promise<IFilter> => {
    const filterConfig = await getFilterConfig({
      tabData,
      metaDataMap,
      selectedFilters: systemFilters,
      ignoreMarvinCache: true
    });
    return filterConfig;
  };
};
const handleAugmentation = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;

  const eventCodes = getEventCodes(tabData);

  const [allMetadata, userPermissions] = await Promise.all([
    fetchActivityAndAccountMetaData(eventCodes.AccountEventCode, eventCodes.ActivityEventCode),
    fetchUserPermissions()
  ]);

  const { metaDataMap, accountRepName, activityRepName } = allMetadata;
  const headerConfig = await getHeaderConfig({
    tabData,
    commonTabSettings,
    metaDataMap,
    allTabIds,
    accountRepName,
    activityRepName
  });

  const { selectedFilters, bySchemaName } = headerConfig?.secondary?.filterConfig?.filters || {};
  const customFilters = generateCustomFilters({
    selectedFilters,
    bySchemaName,
    tabType: tabData?.Type,
    entityCode: tabData?.EntityCode
  });
  const gridConfig = await getGridConfig({
    tabData,
    customFilters,
    commonTabSettings,
    entityMetadata: metaDataMap,
    representationName: accountRepName,
    filterMap: bySchemaName,
    userPermissions: userPermissions
  });

  const augmentedData: ITabConfig = {
    id: tabData.Id,
    type: tabData.Type,
    recordCount: tabData.Count,
    entityCode: eventCodes.ActivityEventCode,
    relatedEntityCode: eventCodes?.AccountEventCode,
    sharedBy: tabData.SharedBy,
    tabSettings: getTabSettings({
      tabData,
      allTabIds,
      getSystemFilterConfig: getSystemFilterConfigGenerator(tabData, metaDataMap),
      getSystemColumns: tabData.TabConfiguration.IsMarvinTab
        ? undefined
        : getColumnsList(tabData, true)
    }),
    headerConfig,
    gridConfig,
    representationName: DEFAULT_ENTITY_REP_NAMES.activity
  };

  return augmentedData;
};

export default handleAugmentation;
export { getColumnConfig };
