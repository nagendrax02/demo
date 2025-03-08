import { ICommonTabSettings, ITabResponse, IUserPermission } from '../../smartviews.types';
import {
  IColumn,
  ITabConfig,
  ITabHeader,
  IGridConfig,
  IRecordType,
  IFilterConfig,
  ISecondaryHeader,
  ILeadGetResponse,
  IMarvinData,
  IOnFilterChange,
  IGetGridConfig,
  IColumnConfigMap
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { getLeadTabActions } from './header-action';
import {
  ColumnRenderWorkArea,
  DEFAULT_MAX_ALLOWED,
  dependentSchemaNames,
  PlatformSettingsLeadDateFilter,
  RowHeightType,
  SCHEMA_NAMES,
  TabTypeToNameMap
} from 'apps/smart-views/constants/constants';
import { API_ROUTES } from 'common/constants';
import { CallerSource } from 'common/utils/rest-client';
import {
  COLUMN_RENDERER_MAP,
  customColumnDefs,
  LEAD_HEADER_ACTION_FEATURE_RESTRICTION_MAP
} from './constants';
import { getEntityId, safeParseJson } from 'common/utils/helpers';
import { workAreaIds } from 'common/utils/process/constant';
import {
  getLeadRowActions,
  getLeadBulkActions,
  fetchUserPermissions,
  getUnRestrictedFields,
  getDefaultLeadTabColumns,
  getConditionEntityType
} from './helpers';
import { DataType } from 'common/types/entity/lead';
import CellRenderer from '../../components/cell-renderers/CellRenderer';
import { fetchSmartViewLeadMetadata } from './metadata';
import { getFilterMethods } from '../../components/smartview-tab/components/filter-renderer/utils';
import { generateCustomFilters } from '../../components/smartview-tab/utils';
import { EntityType } from 'common/types';
import { isOpportunityEnabled } from 'common/utils/helpers';
import {
  addLeadTypeToRequiredColumns,
  fetchProcessData,
  handleTabDelete,
  isSmartviewTab
} from '../../utils/utils';
import { DEFAULT_LEAD_REPRESENTATION_NAME } from 'common/component-lib/send-email/constants';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import {
  IAugmentedSmartViewEntityMetadata,
  IColumnConfig,
  IGetColumnConfig
} from '../common-utilities/common.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import {
  addAccountColumns,
  getActionsWidth,
  getLDTypeConfigFromRawData,
  getLeadDefaultFilterValue,
  getSelectedValue,
  getSortConfig
} from '../common-utilities/utils';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IDateOption } from 'common/component-lib/date-filter';
import { getLeadRenderType, getTabSettings } from '../common-utilities/tab-settings';
import {
  ACTION_COLUMN_SCHEMA_NAME,
  DEFAULT_COLUMN_CONFIG_MAP,
  defaultWidthMap
} from '../common-utilities/constant';
import { fetchActionPanelSetting } from 'apps/smart-views/utils/entity-action-restriction/utils/fetch-data';
import { isDefaultLeadType } from 'common/utils/lead-type/settings';
import { getLeadTypeForManageTabsProcess } from '../../utils/sv-process';
import {
  addActionColumn,
  getColumnsConfig,
  getIsFixedColumn,
  getIsLastFixedColumn,
  getSortedColumnString
} from '../common-utilities/pin-utils';
import { isFeatureRestricted } from 'common/utils/feature-restriction/utils/augment-data';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { ACTION } from 'apps/entity-details/constants';

export const generateInitialFilterData = async (config: {
  additionalData: IMarvinData;
  defaultFilters: string[];
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  tabData: ITabResponse;
  parsedFilters: Record<string, string>;
}): Promise<IFilterConfig> => {
  const { additionalData, defaultFilters, leadMetadata, tabData, parsedFilters } = config;
  const filterValues = additionalData?.Marvin?.FilterValues || {};
  const filterData: IFilterConfig = {};

  await Promise.all(
    defaultFilters?.map(async (filter) => {
      const renderType = getLeadRenderType(leadMetadata, filter);
      let selectedValue: IOption[] | IDateOption;

      // if filter data is already there in user personalization cache
      if (filterValues?.[filter]) {
        selectedValue = getSelectedValue(filterValues, filter, renderType);
      } else {
        // else generate filter value

        /* getDefaultFilterValue is used to generate `selectedValue` from default options selected in sv settings
        while creating the tab */
        selectedValue = getLeadDefaultFilterValue({
          parsedFilters,
          schemaName: filter,
          renderType
        });
      }

      const filterValue =
        ((await (
          await getFilterMethods(getConditionEntityType(filter))
        )?.getFilterValue?.({
          selectedOption: selectedValue,
          schemaName: filter,
          tabType: tabData?.Type,
          utcDateFormatEnabled: additionalData?.Marvin?.isStarredList
        })) as IOnFilterChange) || {};

      filterData[filter] = {
        ...filterValue,
        renderType,
        selectedValue,
        label: leadMetadata[filter]?.displayName,
        utcDateFormatEnabled: additionalData?.Marvin?.isStarredList,
        parentSchema: dependentSchemaNames?.[filter]?.parent,
        childSchema: dependentSchemaNames?.[filter]?.child,
        isPinned: filterValues?.[filter]?.isPinned
      };
    })
  );

  // ordering based on default filters as promise.all executes all promises parallely and filterData is getting jumbled up
  const orderedFilterData = {};
  defaultFilters?.forEach((schema) => (orderedFilterData[schema] = filterData[schema]));
  return orderedFilterData;
};

export const getFilterConfig = async (
  tabData: ITabResponse,
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
  additionalData: IMarvinData
): Promise<{ selectedFilters: string[]; bySchemaName: IFilterConfig }> => {
  let defaultFilters: string[] = [];
  const parsedFilters = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.Filters
  ) as Record<string, string>;

  // get filters from user personalization cache if exists
  if (additionalData?.Marvin?.Exists) {
    defaultFilters = Object.keys(additionalData?.Marvin?.FilterValues || {});
  } else if (!defaultFilters?.length) {
    // else generate default filters
    defaultFilters = tabData?.TabContentConfiguration?.FetchCriteria?.SelectedFilters?.split(
      ','
    )?.map((schemaName) => {
      if (schemaName && schemaName === SCHEMA_NAMES.SALES_GROUP) {
        return SCHEMA_NAMES.GROUP;
      }
      return schemaName;
    });

    if (!defaultFilters?.length) {
      defaultFilters = [];
    }

    // date filter added from sv settings
    const dateFilterOn =
      (PlatformSettingsLeadDateFilter[parsedFilters?.DateFilterOn] as string) ||
      parsedFilters?.DateFilterOn;
    if (dateFilterOn) {
      defaultFilters?.push(dateFilterOn);
    }
  }

  defaultFilters = await getUnRestrictedFields(defaultFilters);
  defaultFilters = defaultFilters.filter((schema) => !!leadMetadata[schema]);

  return {
    selectedFilters: defaultFilters,
    bySchemaName: await generateInitialFilterData({
      additionalData,
      defaultFilters,
      leadMetadata,
      tabData,
      parsedFilters
    })
  };
};

export const getHeaderConfig = async (config: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  allTabIds: string[];
  repName: IEntityRepresentationName;
  userPermissions?: IUserPermission;
  isDefaultLeadTypeTab?: boolean;
}): Promise<ITabHeader> => {
  const {
    tabData,
    commonTabSettings,
    leadMetadata,
    allTabIds,
    repName,
    userPermissions,
    isDefaultLeadTypeTab
  } = config;
  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;
  const advanceSearchEnglish =
    additionalData?.Marvin?.AdvancedSearchText_English ||
    tabData?.TabContentConfiguration?.FetchCriteria?.AdvancedSearchText_English;

  const primaryHeader = {
    title: tabData.TabConfiguration.Title,
    canHide: commonTabSettings?.hidePrimaryHeader,
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

  //to-do: when lead type rep name is required for all places then we can remove this condition and do the changes at higher level
  const [leadTypeConfiguration, leadTypeForProcess] = await Promise.all([
    getLDTypeConfigFromRawData(tabData.Id),
    getLeadTypeForManageTabsProcess(tabData.Id)
  ]);

  const secondaryHeader: ISecondaryHeader = {
    searchText: '',
    filterConfig: {
      filters: await getFilterConfig(tabData, leadMetadata, additionalData),
      maxAllowedFilters:
        (commonTabSettings?.maxFiltersAllowed?.[tabTypeName] as number) ||
        DEFAULT_MAX_ALLOWED?.Filters
    },
    actionConfiguration: getLeadTabActions({
      tabId: tabData.Id,
      repName,
      userPermissions,
      visibilityConfig: await fetchActionPanelSetting(CallerSource.SmartViews),
      isDefaultLeadTypeTab,
      leadTypeConfiguration,
      leadTypeForProcess
    }),
    featureRestrictionConfigMap: LEAD_HEADER_ACTION_FEATURE_RESTRICTION_MAP,
    quickFilterConfig: {}
  };
  return {
    primary: primaryHeader,
    secondary: secondaryHeader
  };
};

const getColumnDef = (schemaData: IAugmentedSmartViewEntityMetadata, acc: IColumn[]): IColumn => ({
  id: schemaData.schemaName,
  displayName: schemaData.displayName,
  cfsDisplayName: schemaData?.cfsDisplayName,
  resizable: true,
  minWidth: 96,
  isFirstColumn: acc.length === 0,
  CellRenderer: COLUMN_RENDERER_MAP?.[schemaData.schemaName] || CellRenderer,
  dataType: schemaData.dataType as DataType,
  renderType: schemaData.renderType || schemaData.dataType,
  entityType: EntityType.Lead
});

export const getGridColumns = async ({
  columnString,
  tabId,
  columnWidthConfig,
  actionsLength,
  entityMetadata,
  columnConfigMap
}: {
  columnString: string;
  tabId: string;
  columnWidthConfig?: Record<string, number>;
  actionsLength?: number;
  entityMetadata?: Record<string, IAugmentedSmartViewEntityMetadata>;
  columnConfigMap?: IColumnConfigMap;
}): Promise<IColumn[]> => {
  let leadMetadata = entityMetadata;
  if (!leadMetadata) {
    const metaDataConfig = await fetchSmartViewLeadMetadata(CallerSource.SmartViews, tabId);
    leadMetadata = metaDataConfig?.metaDataMap;
  }

  const colArr = getSortedColumnString(columnString, columnConfigMap)?.split(',') || [];
  if (!Object.keys(leadMetadata).length) {
    return [];
  }
  // eslint-disable-next-line complexity
  return colArr.reduce((acc, schemaName: string) => {
    const isFixedColumn = getIsFixedColumn(schemaName, acc, columnConfigMap);
    const isLastFixedColumn = getIsLastFixedColumn(acc, columnConfigMap);
    const schemaData = leadMetadata?.[schemaName];
    const customColumn = customColumnDefs[schemaName];
    if (schemaName === ACTION_COLUMN_SCHEMA_NAME) {
      const colWidth = getActionsWidth(actionsLength);
      acc.push({
        ...customColumnDefs.Actions,
        fixed: isFixedColumn,
        width: colWidth || customColumnDefs.Actions.width,
        minWidth: colWidth || customColumnDefs.Actions.minWidth,
        isLastFixedColumn: isLastFixedColumn
      });
    } else if (customColumn) {
      acc.push({
        ...customColumn,
        displayName: schemaData?.displayName || '',
        fixed: isFixedColumn,
        isFirstColumn: acc.length === 0,
        isLastFixedColumn: isLastFixedColumn,
        width: columnWidthConfig?.[schemaName] || customColumn.width
      });
    } else if (schemaData) {
      acc.push({
        ...getColumnDef(schemaData, acc),
        sortable: schemaData?.isSortable,
        fixed: isFixedColumn,
        isLastFixedColumn: isLastFixedColumn,
        width:
          columnWidthConfig?.[schemaName] || defaultWidthMap[schemaData.renderType as string] || 148
      });
    }
    return acc;
  }, [] as IColumn[]);
};

const getColumnConfig = async ({
  columns,
  actionsLength,
  tabId,
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

  return { columns: updatedColumns, gridColumns };
};

export const augmentResponse = async (
  response: ILeadGetResponse
): Promise<{
  records: IRecordType[];
  totalRecordCount?: number;
}> => {
  const augmentedRecords: IRecordType[] = [];
  response?.Leads?.forEach((item) => {
    const augmentedItem = item?.LeadPropertyList?.reduce((acc, record) => {
      acc[record.Attribute] = record.Value;
      if (record.Attribute === 'ProspectID') {
        acc.id = record.Value || '';
      }
      return acc;
    }, {} as IRecordType);
    const leadId = getEntityId();
    if (leadId === augmentedItem.id) {
      response.RecordCount -= 1;
    } else {
      augmentedRecords.push(augmentedItem);
    }
  });
  return { records: augmentedRecords };
};

// eslint-disable-next-line complexity
export const getGridConfig = async ({
  tabData,
  customFilters,
  entityMetadata,
  selectedColumns,
  disableSelection,
  representationName,
  userPermissions,
  isManageListRestricted
}: IGetGridConfig): Promise<IGridConfig> => {
  let leadMetadataMap = entityMetadata;
  if (!leadMetadataMap || !representationName) {
    const { metaDataMap, representationName: repName } = await fetchSmartViewLeadMetadata(
      CallerSource.SmartViews,
      tabData.Id
    );
    representationName = repName;
    leadMetadataMap = metaDataMap;
  }

  const {
    Id,
    SharedBy,
    TabContentConfiguration: { FetchCriteria, Actions },
    TabConfiguration: { IsMarvinTab }
  } = tabData;

  const additionalData = (safeParseJson(FetchCriteria.AdditionalData || '') as IMarvinData) || {};

  const defaultLeadTabColumns = await getDefaultLeadTabColumns({
    tabData,
    leadMetaData: leadMetadataMap,
    columnRenderWorkArea: ColumnRenderWorkArea.GridColumns,
    isSmartviewTab: isSmartviewTab(Id)
  });

  const fetchCriteria = {
    PageIndex: 1,
    PageSize: parseInt(FetchCriteria.PageSize),
    Columns: defaultLeadTabColumns,
    SearchText: '',
    CustomFilters: customFilters,
    AdvancedSearch: FetchCriteria.AdvancedSearchText,
    ...getSortConfig(FetchCriteria.SortedOn || '', customColumnDefs)
  };

  if (additionalData?.Marvin?.Exists) {
    const marvinData = { ...additionalData.Marvin };
    fetchCriteria.AdvancedSearch = marvinData.AdvancedSearchText;
    fetchCriteria.SearchText = marvinData.SearchText;
    fetchCriteria.Columns = addActionColumn(
      addAccountColumns(selectedColumns?.length ? selectedColumns : marvinData.Columns)
    );
    const sortConfig = { ...getSortConfig(marvinData.SearchSortedOn || '', customColumnDefs) };
    if (sortConfig.SortOn) {
      fetchCriteria.SortOn = sortConfig.SortOn;
      fetchCriteria.SortBy = sortConfig.SortBy;
    }
  }

  const columnConfigMap = getColumnsConfig(
    DEFAULT_COLUMN_CONFIG_MAP.Lead,
    defaultLeadTabColumns,
    additionalData?.Marvin?.columnConfigMap
  );

  const isOppEnabled = await isOpportunityEnabled(CallerSource.SmartViews);

  let leadRowActions = await getLeadRowActions({
    actionConfig: Actions,
    isMarvinTab: IsMarvinTab || !SharedBy,
    tabId: Id,
    isOpportunityEnabled: isOppEnabled,
    userPermissions,
    repName: representationName
  });

  if (isManageListRestricted) {
    leadRowActions = {
      ...leadRowActions,
      quickActions: leadRowActions?.quickActions?.filter(
        (action) => action.id !== ACTION.AddToList
      ),
      moreActions: leadRowActions?.moreActions?.filter((action) => action.id !== ACTION.AddToList)
    };
  }

  let leadBulkActions = await getLeadBulkActions({
    userPermissions: userPermissions,
    isOppEnabled,
    tabId: Id,
    leadRepName: representationName
  });

  if (isManageListRestricted) {
    leadBulkActions = leadBulkActions.filter((action) => action.id !== ACTION.AddToList);
  }

  const config: IGridConfig = {
    disableSelection,
    apiRoute: API_ROUTES.smartviews.leadGet,
    allowRowSelection: true,
    fetchCriteria,
    requiredColumns: addLeadTypeToRequiredColumns(LEAD_SCHEMA_NAME.PROSPECT_STAGE),
    workAreaIds: workAreaIds.SMART_VIEWS.LEAD_TAB,
    rowHeight: RowHeightType.Default,
    tabColumnsWidth: additionalData?.Marvin?.tabColumnsWidth,
    actions: { rowActions: { ...leadRowActions }, bulkActions: [...leadBulkActions] },
    columns: await getGridColumns({
      columnString: fetchCriteria.Columns,
      tabId: tabData.Id,
      columnWidthConfig: additionalData?.Marvin?.tabColumnsWidth,
      actionsLength: leadRowActions?.quickActions?.length,
      entityMetadata: leadMetadataMap,
      columnConfigMap
    }),
    augmentResponse,
    columnConfigMap
  };

  return config;
};

const handleLeadAugmentation = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;
  window[`PROCESS_${tabData.Id}`] = fetchProcessData(
    workAreaIds.SMART_VIEWS.LEAD_TAB,
    tabData.Id || ''
  );
  const leadTypeConfiguration = await getLDTypeConfigFromRawData(tabData.Id);
  let isDefaultLeadTypeTab = false;

  if (leadTypeConfiguration && leadTypeConfiguration.length > 0)
    isDefaultLeadTypeTab = await isDefaultLeadType(
      leadTypeConfiguration[0].LeadTypeInternalName,
      CallerSource.SmartViews
    );

  const [leadMetaData, userPermissions, isManageListRestricted] = await Promise.all([
    fetchSmartViewLeadMetadata(CallerSource.SmartViews, tabData.Id),
    fetchUserPermissions(),
    isFeatureRestricted({
      actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLists].View,
      moduleName: FeatureRestrictionModuleTypes.ManageLists,
      callerSource: CallerSource.SmartViews
    })
  ]);
  const { metaDataMap: leadMetadata, representationName } = leadMetaData;

  const headerConfig = await getHeaderConfig({
    tabData,
    commonTabSettings,
    leadMetadata,
    allTabIds,
    repName: representationName || {
      SingularName: 'Lead',
      PluralName: 'Leads'
    },
    userPermissions,
    isDefaultLeadTypeTab
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
    entityMetadata: leadMetadata,
    customFilters,
    representationName,
    disableSelection: commonTabSettings?.disableSelection,
    userPermissions,
    isManageListRestricted
  });

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
    leadTypeConfiguration
  };
  return augmentedData;
};
export { getColumnConfig };
export type { IGetGridConfig };
export default handleLeadAugmentation;
