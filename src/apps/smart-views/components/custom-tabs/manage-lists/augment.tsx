import {
  ICommonTabSettings,
  ITabResponse,
  LIST_TYPE_MAPPING,
  ListType
} from 'apps/smart-views/smartviews.types';
import {
  ITabConfig,
  IMarvinData,
  ITabHeader,
  IPrimaryHeader,
  ISecondaryHeader,
  IGetGridConfig,
  IGridConfig,
  IRecordType,
  IColumn,
  IListsGetResponse,
  IFilterConfig,
  IOnFilterChange
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { fetchSmartViewLeadMetadata } from 'apps/smart-views/augment-tab-data/lead/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { safeParseJson } from 'common/utils/helpers';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import {
  IAugmentedSmartViewEntityMetadata,
  IGetColumnConfig,
  IColumnConfig
} from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import {
  ConditionEntityType,
  RowHeightType,
  SCHEMA_NAMES
} from 'apps/smart-views/constants/constants';
import { getListTabActions } from './header-action';
import { generateCustomFilters } from '../../smartview-tab/utils';
import {
  customColumnDefs,
  DEFAULT_FILTERS,
  DEFAULT_LIST_COLUMNS,
  DEFAULT_LISTS_REPRESENTATION_NAME,
  INTERNAL_LIST
} from './constants';
import {
  getLDTypeConfigFromRawData,
  getLeadDefaultFilterValue,
  getSelectedValue,
  getSortConfig
} from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import { API_ROUTES } from 'common/constants';
import { getTabSettings } from 'apps/smart-views/augment-tab-data/common-utilities/tab-settings';
import { getListBulkAction, getListRowAction } from './helpers';
import { augmentTabData as createRawTabDataToCache } from 'apps/smart-views/utils/utils';
import { getScheduledEmailCount, postManageTabCache } from '../utils';
import { trackError } from 'common/utils/experience';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import { IAuthenticationConfig } from 'common/types';
import { FilterRenderType } from '../../smartview-tab/components/filter-renderer/constants';
import { IDateOption } from 'common/component-lib/date-filter';
import { getFilterMethods } from '../../smartview-tab/components/filter-renderer/utils';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { fetchUserPermissions, getListsConfigurations } from './utils';
import { isLeadTypeEnabled } from 'common/utils/lead-type/settings';
import RowActions from '../../cell-renderers/row-actions/RowActions';
import { getWithZValue } from 'common/utils/helpers/helpers';

const getPrimaryHeader = (config: {
  tabData: ITabResponse;
  advanceSearchEnglish: string;
}): IPrimaryHeader => {
  const { tabData, advanceSearchEnglish } = config;

  const primaryHeader = {
    title: tabData.TabConfiguration.Title,
    description: tabData.TabConfiguration.Description,
    advancedSearchEnglish: advanceSearchEnglish,
    modifiedByName: tabData.ModifiedByName,
    modifiedOn: tabData.ModifiedOn,
    autoRefreshTime: 0
  };

  return primaryHeader;
};

export const getListFilterRenderType = (filter: string): FilterRenderType => {
  switch (filter) {
    case SCHEMA_NAMES.CREATED_BY:
      return FilterRenderType.UserDropdown;
    case SCHEMA_NAMES.LIST_TYPE:
      return FilterRenderType.SearchableSingleSelect;
  }

  return FilterRenderType.None;
};

const getDisplayName = (filter: string): string => {
  switch (filter) {
    case SCHEMA_NAMES.CREATED_BY:
      return 'Created By';
    case SCHEMA_NAMES.LIST_TYPE:
      return 'List Type';
  }
  return '';
};

const generateInitialFilterData = async (config: {
  defaultFilters: string[];
  tabData: ITabResponse;
  parsedFilters: Record<string, string>;
}): Promise<IFilterConfig> => {
  const { defaultFilters, tabData, parsedFilters } = config;

  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;

  const filterValues = additionalData?.Marvin?.FilterValues || {};

  // the reason for below check, is because from marvin when we select filter, those filter are single select and we maintain only value (which is string) whatever was selected. but in SWlite the selected value is always an array, so we are basically converting string option to array
  if (
    filterValues?.ListType?.selectedValue &&
    typeof filterValues?.ListType?.selectedValue === 'string'
  ) {
    filterValues.ListType.selectedValue = [
      {
        label: LIST_TYPE_MAPPING[filterValues.ListType.selectedValue],
        value: filterValues.ListType.selectedValue
      }
    ];
  }
  if (
    filterValues?.CreatedBy?.selectedValue &&
    typeof filterValues?.CreatedBy?.selectedValue === 'string'
  ) {
    filterValues.CreatedBy.selectedValue = [
      {
        label: filterValues?.CreatedBy?.label,
        value: filterValues.CreatedBy?.value
      }
    ];
  }

  const filterData: IFilterConfig = {};

  await Promise.all(
    defaultFilters?.map(async (filter) => {
      const renderType = getListFilterRenderType(filter);
      let selectedValue: IOption[] | IDateOption;

      if (filterValues?.[filter]) {
        selectedValue = getSelectedValue(filterValues, filter, renderType);
      } else {
        selectedValue = getLeadDefaultFilterValue({
          parsedFilters,
          schemaName: filter,
          renderType
        });
      }

      const conditionEntityType = {
        [SCHEMA_NAMES.CREATED_BY]: ConditionEntityType.Lead,
        [SCHEMA_NAMES.LIST_TYPE]: ConditionEntityType.Lists
      };

      const filterValue =
        ((await (
          await getFilterMethods(conditionEntityType[filter])
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
        label: getDisplayName(filter),
        isUserSingleSelect: true,
        isPinned: true
      };
    })
  );
  // ordering based on default filters as promise.all executes all promises parallely and filterData is getting jumbled up
  const orderedFilterData = {};
  defaultFilters?.forEach((schema) => (orderedFilterData[schema] = filterData[schema]));
  return orderedFilterData;
};

const getSecondaryHeader = async (config: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  taskRepName: string;
  metadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  isCalendarView: boolean;
}): Promise<ISecondaryHeader> => {
  const { tabData } = config;

  const isHiddenListSelected = (
    safeParseJson(
      tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
    ) as IMarvinData
  )?.Marvin?.ShowHidden;

  return {
    searchText: '',
    filterConfig: {
      filters: {
        selectedFilters: [SCHEMA_NAMES.LIST_TYPE, SCHEMA_NAMES.CREATED_BY],
        bySchemaName: await generateInitialFilterData({
          defaultFilters: DEFAULT_FILTERS,
          tabData,
          parsedFilters: {}
        })
      },
      maxAllowedFilters: 0,
      selectFilterPopupConfig: {
        removePopup: true
      }
    },
    actionConfiguration: getListTabActions(isHiddenListSelected)
  };
};

const getManageListsHeaderConfig = async (config: {
  tabData: ITabResponse;
  commonTabSettings: ICommonTabSettings;
  allTabIds: string[];
  representationName: IEntityRepresentationName | undefined;
  metadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  additionalData: IMarvinData;
}): Promise<ITabHeader> => {
  const { tabData, commonTabSettings, metadata } = config;
  return {
    primary: getPrimaryHeader({
      tabData,
      advanceSearchEnglish: ''
    }),
    secondary: await getSecondaryHeader({
      tabData,
      commonTabSettings,
      taskRepName: '',
      metadata,
      isCalendarView: false
    })
  };
};

const getPattern = (timeFormat: string): string => {
  const userDetails = getItem(StorageKey.Auth) as IAuthenticationConfig;
  const formatToApply = timeFormat;
  const dateTimeFormatToApply = `${userDetails?.User?.DateFormat} ${formatToApply}`?.replace(
    'mm',
    'MM'
  );
  return dateTimeFormatToApply;
};

export const augmentResponse = async (
  response: IListsGetResponse[],
  representationName: IEntityRepresentationName | undefined
): Promise<{
  records: IRecordType[];
  totalRecordCount?: number;
}> => {
  const module = await import('@lsq/nextgen-preact/date/utils');

  const listIds: string[] = [];
  const augmentedRecords = response?.map((item) => {
    const { ID, ...props } = item;
    listIds.push(ID);
    if (props?.CreatedOn) {
      props.CreatedOn = module.format({
        originalDate: getWithZValue(props.CreatedOn),
        pattern: getPattern('hh:mm a')
      });
    }
    if (props?.ModifiedOn) {
      props.ModifiedOn = module.format({
        originalDate: getWithZValue(props.ModifiedOn),
        pattern: getPattern('hh:mm a')
      });
    }
    if (props?.InternalName === INTERNAL_LIST.STARRED_LEADS) {
      props.Name = `Starred ${representationName?.PluralName ?? 'Leads'}`;
      props.disableRowSelection = true;
    }
    if (props?.InternalName === INTERNAL_LIST.ALL_LEADS) {
      props.disableRowSelection = true;
      props.Name = `All ${representationName?.PluralName ?? 'Leads'}`;
    }
    return { ...props, id: ID, FirstName: props.Name };
  });
  const scheduledEmailCount = await getScheduledEmailCount({
    listIds,
    callerSource: CallerSource.ManageLeads
  });

  augmentedRecords?.forEach((record) => {
    record.ScheduleEmailCount = scheduledEmailCount?.[record.id] || 0;
  });

  return {
    records: augmentedRecords as unknown as IRecordType[],
    totalRecordCount: augmentedRecords?.[0]?.Total
  };
};

const getAugmentedColumns = (
  representationName: IEntityRepresentationName | undefined,
  columnWidthConfig: Record<string, number> | undefined
): IColumn[] => {
  return DEFAULT_LIST_COLUMNS.map((column) => {
    column.displayName = column.displayName.replace(
      'Lead',
      representationName?.SingularName ?? 'Lead'
    );
    if (column.id === 'Actions' && !column.CellRenderer) {
      column.CellRenderer = RowActions;
    }
    column.width = columnWidthConfig?.[column?.id] ?? column.width;
    return column;
  });
};

// eslint-disable-next-line complexity
export const getGridConfig = async ({
  tabData,
  disableSelection,
  representationName,
  leadTypeConfiguration
}: IGetGridConfig): Promise<IGridConfig> => {
  if (!representationName) {
    const { representationName: repName } = await fetchSmartViewLeadMetadata(
      CallerSource.SmartViews,
      tabData.Id
    );
    representationName = repName;
  }

  const {
    Id,
    TabContentConfiguration: { FetchCriteria }
  } = tabData;

  const additionalData = (safeParseJson(FetchCriteria.AdditionalData || '') as IMarvinData) || {};

  const shortingConfig = getSortConfig(FetchCriteria.SortedOn || '', customColumnDefs);

  const fetchCriteriaSortConfig = {
    SortColumn: shortingConfig.SortOn,
    SortOrder: shortingConfig.SortBy,
    ...shortingConfig
  };

  const fetchCriteria = {
    PageIndex: 1,
    PageSize: parseInt(FetchCriteria.PageSize),
    SearchText: '',
    AdvancedSearch: '',
    CreatedBy: '',
    ListType:
      (additionalData?.Marvin?.FilterValues?.ListType?.value as unknown as ListType) ||
      ListType.ALL,

    ShowHidden: false,
    ...fetchCriteriaSortConfig,
    Columns: '',
    CustomFilters: '',
    LeadType: leadTypeConfiguration?.[0]?.LeadTypeInternalName ?? ''
  };

  if (additionalData?.Marvin?.Exists) {
    const marvinData = { ...additionalData.Marvin };
    fetchCriteria.SearchText = marvinData.SearchText;
    fetchCriteria.CreatedBy = marvinData?.FilterValues?.CreatedBy?.value || '';
    fetchCriteria.ListType =
      (marvinData?.FilterValues?.ListType?.value as unknown as ListType) || ListType.ALL;
    //todo: this ShowHidden need to be handled from quick filter itself
    fetchCriteria.ShowHidden = marvinData.ShowHidden || false;
    const sortConfig = { ...getSortConfig(marvinData.SearchSortedOn || '', customColumnDefs) };
    if (sortConfig.SortOn) {
      fetchCriteria.SortOn = sortConfig.SortOn;
      fetchCriteria.SortColumn = sortConfig.SortOn;
      fetchCriteria.SortBy = sortConfig.SortBy;
      fetchCriteria.SortOrder = sortConfig.SortBy;
    }
  }

  const leadRowActions = await getListRowAction({
    tabId: Id,
    isHiddenListSelected: additionalData?.Marvin?.ShowHidden || false
  });

  const listBulkActions = getListBulkAction(additionalData?.Marvin?.ShowHidden || false);

  const config: IGridConfig = {
    disableSelection,
    apiRoute: API_ROUTES.smartviews.listGet,
    allowRowSelection: true,
    fetchCriteria,
    rowHeight: RowHeightType.Default,
    tabColumnsWidth: additionalData?.Marvin?.tabColumnsWidth,
    actions: {
      rowActions: {
        ...leadRowActions
      },
      bulkActions: listBulkActions
    },
    columns: getAugmentedColumns(representationName, additionalData?.Marvin?.tabColumnsWidth),
    augmentResponse: (response: IListsGetResponse[]) =>
      augmentResponse(response, representationName)
  };

  return config;
};

const handleCaching = async (rawTabData: ITabResponse, tabData: ITabConfig): Promise<void> => {
  try {
    const updatedData = createRawTabDataToCache(rawTabData, tabData);
    postManageTabCache(updatedData);
  } catch (error) {
    trackError(error);
  }
};

const augmentedManageListsTabData = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;

  const [leadMetaData, userPermissions, leadTypeEnabled] = await Promise.all([
    fetchSmartViewLeadMetadata(CallerSource.SmartViews, tabData.Id),
    fetchUserPermissions(),
    isLeadTypeEnabled(CallerSource.ManageLists),
    getListsConfigurations()
  ]);

  const leadTypeConfiguration = await getLDTypeConfigFromRawData(tabData.Id);

  const { metaDataMap: leadMetadata, representationName } = leadMetaData;

  const additionalData =
    (safeParseJson(
      tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
    ) as IMarvinData) || {};

  const headerConfig = await getManageListsHeaderConfig({
    tabData,
    commonTabSettings: commonTabSettings,
    allTabIds,
    representationName,
    metadata: leadMetadata,
    additionalData
  });

  const { selectedFilters, bySchemaName } = headerConfig?.secondary?.filterConfig?.filters || {};

  const customFilters = generateCustomFilters({
    selectedFilters,
    bySchemaName,
    tabType: tabData?.Type,
    leadTypeConfiguration
  });

  const gridConfig = await getGridConfig({
    tabData,
    customFilters,
    representationName,
    disableSelection: commonTabSettings?.disableSelection,
    userPermissions,
    leadTypeConfiguration
  });

  const augmentedData: ITabConfig = {
    id: tabData.Id,
    type: tabData.Type,
    recordCount: tabData.Count,
    sharedBy: tabData.SharedBy,
    tabSettings: getTabSettings({
      tabData,
      allTabIds,
      disableAutoRefresh: true,
      disableTabInfo: true,
      isLeadTypeEnabled: leadTypeEnabled
    }),
    headerConfig,
    gridConfig,
    representationName: representationName ?? DEFAULT_LISTS_REPRESENTATION_NAME,
    isEntityManage: true,
    handleCaching: (newTabData: ITabConfig) => {
      handleCaching(tabData, newTabData);
    },
    leadTypeConfiguration
  };

  return augmentedData;
};

const getColumnConfig = async ({ columns }: IGetColumnConfig): Promise<IColumnConfig> => {
  return {
    columns,
    gridColumns: []
  };
};

export default augmentedManageListsTabData;

export { getColumnConfig };
