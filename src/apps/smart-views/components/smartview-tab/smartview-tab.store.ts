import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  CalendarView,
  IAccountCustomFilters,
  IColumn,
  IColumnConfigMap,
  IFilter,
  IFilterConfig,
  IFilterData,
  IGridConfig,
  IHeaderAction,
  IPrimaryHeader,
  IRefreshConfig,
  IRowActionConfig,
  ISecondaryHeader,
  ISetFetchCriteriaAndRouteForManageLead,
  ISmartViewTabStore,
  ITabConfig,
  ITabHeader,
  RestrictExportForEntity
} from './smartview-tab.types';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IResizeConfig, ISortConfig } from '@lsq/nextgen-preact/grid/grid.types';
import getSVAugmenter, { ITabAugmenter } from 'apps/smart-views/augment-tab-data';
import { augmentTabData as createLatestRawTabData } from 'apps/smart-views/utils/utils';
import {
  FETCH_CRITERIA_SALES_GROUP_TABS,
  GROUPS,
  HeaderAction,
  SCHEMA_NAMES,
  TabType,
  entityTypeMap,
  leadSchemaNamePrefix
} from '../../constants/constants';
import {
  generateAccountFiltersForFetchCriteria,
  generateCustomFilters,
  getUserStandardTimeZone,
  handleRestrictionFromPermissionTemplate,
  handleRestrictionFromTenantManagement,
  resetDependentFilterValues
} from './utils';
import { DATE_FILTER, FilterRenderType } from './components/filter-renderer/constants';
import { getRawTabData, updateSmartViewsTab } from '../../smartviews-store';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { EntityType } from 'common/types';
import { getStandaloneSVAugmenter } from '../custom-tabs';

import {
  QUICK_FILTER_DEFAULT_OPTION,
  STARRED_LEAD
} from './components/header/search-filter/quick-filter/constant';
import { isQuickFilterEnabled } from './components/header/search-filter/utils';
import { API_ROUTES } from 'common/constants';
import { IQuickFilterResponse } from './components/header/search-filter/quick-filter/quick-filter.types';
import { getStatusRelatedFetchCriteria } from '../../augment-tab-data/common-utilities/utils';
import {
  isManageEntityAdvSearchEnabled,
  logSVModuleUsage,
  isManageListTab
} from '../../utils/utils';
import { SVUsageWorkArea } from 'common/utils/experience/experience-modules';
import { getDefaultAdvanceSearch } from '../custom-tabs/manage-activity-tab/utils';
import { ListType } from '../../smartviews.types';
import { getListBulkAction, getListRowAction } from '../custom-tabs/manage-lists/helpers';
import { getListTabActions } from '../custom-tabs/manage-lists/header-action';

const initialState = {
  tabs: {},
  activeTabId: '',
  isGridInitialized: false,
  refreshConfig: {
    skipAuto: false,
    timeStamp: 0,
    isGridUpdated: true,
    restartTimer: false
  },
  gridOverlay: false
};

const useSmartViewTabStore = create<ISmartViewTabStore>()(
  immer(() => ({
    // state
    ...initialState
  }))
);

const resetSmartViewsTabStore = (): void => {
  useSmartViewTabStore.setState(initialState);
};

const setTabData = (tabId: string, tabData: ITabConfig): void => {
  useSmartViewTabStore.setState((state) => {
    if (state.tabs) {
      state.tabs[tabId] = tabData;
    }
  });
};

const setActiveTab = (id: string): void => {
  useSmartViewTabStore.setState((state) => {
    if (id) state.activeTabId = id;
  });
};

const getActiveTab = (): string => {
  return useSmartViewTabStore.getState().activeTabId;
};

const setUpdatedHeaderAction = (
  tabId: string,
  configurableOptions: RestrictExportForEntity
): void => {
  useSmartViewTabStore.setState((state) => {
    if (
      state.tabs[tabId]?.headerConfig?.secondary?.actionConfiguration &&
      configurableOptions === RestrictExportForEntity.Disable
    ) {
      //this case will handle for when restricted from permission template

      state.tabs[tabId].headerConfig.secondary.actionConfiguration =
        handleRestrictionFromPermissionTemplate(
          state.tabs[tabId].headerConfig.secondary.actionConfiguration
        );
    } else if (
      state.tabs[tabId]?.headerConfig?.secondary?.actionConfiguration &&
      configurableOptions === RestrictExportForEntity.Remove
    ) {
      // below cases will handle when export restricted from tenant management

      state.tabs[tabId].headerConfig.secondary.actionConfiguration =
        handleRestrictionFromTenantManagement(
          state.tabs[tabId].headerConfig.secondary.actionConfiguration
        );
    }
  });
};

const getTabData = (tabId: string): ITabConfig => {
  return useSmartViewTabStore.getState()?.tabs?.[tabId];
};

const useActiveTab = (): string => useSmartViewTabStore((state) => state.activeTabId);

const useRefreshConfig = (): IRefreshConfig => useSmartViewTabStore((state) => state.refreshConfig);

const useSmartViewTab = (tabId: string): ITabConfig =>
  useSmartViewTabStore((state) => state.tabs[tabId]);

const useTabEntityCode = (tabId: string): string | undefined =>
  useSmartViewTabStore((state) => state.tabs[tabId]?.entityCode);

const useRepName = (): IEntityRepresentationName =>
  useSmartViewTabStore((state) => state.tabs[state.activeTabId]?.representationName);

const useTabType = (): EntityType => {
  const type = useSmartViewTabStore((state) => state.tabs[state.activeTabId]?.type);
  return entityTypeMap[type];
};

const useQuickFilter = (tabId: string): IQuickFilterResponse | undefined =>
  useSmartViewTabStore(
    (state) => state.tabs[tabId]?.headerConfig?.secondary?.quickFilterConfig?.quickFilter
  );

const useEntityManage = (): boolean => {
  const isEntityMange = useSmartViewTabStore(
    (state) => state.tabs[state.activeTabId]?.isEntityManage
  );
  return !!isEntityMange;
};

const useSmartViewPrimaryHeader = (tabId: string): IPrimaryHeader =>
  useSmartViewTabStore((state) => state.tabs[tabId]?.headerConfig?.primary);

const useSmartViewSecondaryHeader = (tabId: string): ISecondaryHeader =>
  useSmartViewTabStore((state) => state.tabs[tabId]?.headerConfig?.secondary);

const useSmartViewHeaderAction = (tabId: string): IHeaderAction[] =>
  useSmartViewTabStore((state) => state.tabs[tabId]?.headerConfig?.secondary?.actionConfiguration);

const useSmartViewsSearch = (tabId: string): string =>
  useSmartViewTabStore((state) => state.tabs[tabId]?.gridConfig?.fetchCriteria?.SearchText);

const useSmartViewRowActions = (): IRowActionConfig | undefined =>
  useSmartViewTabStore((state) => state.tabs[state.activeTabId]?.gridConfig?.actions?.rowActions);

const useSmartViewBulkActions = (): IMenuItem[] | undefined =>
  useSmartViewTabStore((state) => state.tabs[state.activeTabId]?.gridConfig?.actions?.bulkActions);

const useSmartViewGridOverlay = (): boolean => useSmartViewTabStore((state) => state.gridOverlay);

const useAdvancedSearchConfig = (tabId: string): boolean =>
  useSmartViewTabStore(
    (state) => !!state.tabs[tabId]?.gridConfig?.isManageEntityAdvancedSearchApplied
  );

const setSmartViewGridOverlay = (value: boolean): void => {
  useSmartViewTabStore.setState((state) => {
    state.gridOverlay = value;
  });
};

const useShowHiddenLists = (tabId: string): boolean | undefined =>
  useSmartViewTabStore((state) => state.tabs[tabId]?.gridConfig?.fetchCriteria?.ShowHidden);

const setSortOrder = (tabId: string, sortConfig?: ISortConfig): void => {
  useSmartViewTabStore.setState((state) => {
    if (state.tabs[tabId] && sortConfig) {
      state.tabs[tabId].gridConfig.fetchCriteria.SortBy = sortConfig.sortOrder;
      state.tabs[tabId].gridConfig.fetchCriteria.SortOn = sortConfig.sortColumn;

      // below condition is required for the manage list tabs
      state.tabs[tabId].gridConfig.fetchCriteria.SortColumn = sortConfig.sortColumn;
      state.tabs[tabId].gridConfig.fetchCriteria.SortOrder = sortConfig.sortOrder;

      state.tabs[tabId].gridConfig.fetchCriteria.PageIndex = 1;
    }
  });

  logSVModuleUsage(tabId, SVUsageWorkArea.GridSort);
};

const useRecordCount = (tabId: string): number =>
  useSmartViewTabStore((state) => {
    return (state.tabs?.[tabId]?.recordCount as number) || 0;
  });

const useIsGridInitialized = (): boolean =>
  useSmartViewTabStore((state) => state.isGridInitialized);

const useIsGridUpdated = (): boolean =>
  useSmartViewTabStore((state) => state.refreshConfig.isGridUpdated);

const setColumnSize = (tabId: string, config?: IResizeConfig): void => {
  useSmartViewTabStore.setState((state) => {
    if (state.tabs[tabId] && config) {
      const columnWidthConfig = {
        ...(state.tabs[tabId].gridConfig.tabColumnsWidth || {}),
        [config.columnId]: config.columnWidth
      };
      state.tabs[tabId].gridConfig.tabColumnsWidth = columnWidthConfig;

      const columns = [...state.tabs[tabId].gridConfig.columns];
      state.tabs[tabId].gridConfig.columns = columns.map((col: IColumn) => ({
        ...col,
        width: columnWidthConfig[col.id] || col.width
      }));
    }
    updateSmartViewsTab(tabId, state.tabs[tabId]);
    logSVModuleUsage(tabId, SVUsageWorkArea.GridColumnResize);
  });
};

const skipAutoRefresh = (skip?: boolean): void => {
  useSmartViewTabStore.setState((state) => {
    if (state?.refreshConfig) state.refreshConfig.skipAuto = !!skip;
  });
};

// eslint-disable-next-line max-lines-per-function
const setCustomFilters = (tabId: string): void => {
  const tabData = useSmartViewTabStore.getState()?.tabs?.[tabId];
  const tabType = tabData?.type;
  const filters = tabData?.headerConfig?.secondary?.filterConfig?.filters;
  const selectedFilters = filters?.selectedFilters;
  const bySchemaName = filters?.bySchemaName;

  if (!selectedFilters?.length && !bySchemaName) return;

  const { customFilters: accountCustomFilters, customDateFilters: accountCustomDateFilters } =
    generateAccountFiltersForFetchCriteria({
      selectedFilters,
      bySchemaName,
      tabType
    });

  const getCustomFilters = (): string | IAccountCustomFilters[] => {
    return tabType !== TabType.Account
      ? generateCustomFilters({
          selectedFilters,
          bySchemaName,
          tabType: tabData?.type,
          entityCode: tabData?.entityCode,
          leadTypeConfiguration: tabData?.leadTypeConfiguration
        })
      : accountCustomFilters;
  };

  // eslint-disable-next-line complexity
  useSmartViewTabStore.setState((state) => {
    const fetchCriteria = state?.tabs?.[tabId]?.gridConfig?.fetchCriteria;
    if (fetchCriteria) {
      fetchCriteria.CustomFilters = getCustomFilters();
      // changing pageIndex back to 1 everytime filter values change
      fetchCriteria.PageIndex = 1;
      if (FETCH_CRITERIA_SALES_GROUP_TABS[tabData?.type]) {
        fetchCriteria.SalesGroup = bySchemaName?.[`${leadSchemaNamePrefix}${GROUPS}`]?.value;
      }
      if (tabData?.type === TabType.Task) {
        const { Status, IncludeOnlyOverdue, IncludeOverdue } = getStatusRelatedFetchCriteria(
          createLatestRawTabData(getRawTabData(tabData.id), tabData),
          bySchemaName
        );
        fetchCriteria.Status = Status;
        fetchCriteria.IncludeOnlyOverdue = IncludeOnlyOverdue;
        fetchCriteria.IncludeOverdue = IncludeOverdue;
      }
      if (tabData?.type === TabType.Account) {
        fetchCriteria.CustomDateFilters = accountCustomDateFilters;
      }
      if (tabData?.type === TabType.Lists) {
        fetchCriteria.ListType =
          (bySchemaName?.[SCHEMA_NAMES.LIST_TYPE]?.value as unknown as ListType) || ListType.ALL;
        fetchCriteria.CreatedBy = bySchemaName?.[SCHEMA_NAMES.CREATED_BY]?.value;
      }
    }
  });
};

const setFilterDataForSchema = (
  tabId: string,
  filterData: IFilterData,
  schemaName: string
): void => {
  useSmartViewTabStore.setState((state) => {
    const filters =
      state?.tabs?.[tabId]?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName;
    const dependentSchemaName = filterData?.childSchema || '';
    if (filters && filters?.[schemaName]) {
      filters[schemaName] = filterData;
    }
    if (filters?.[dependentSchemaName]) {
      filters[dependentSchemaName] = resetDependentFilterValues(filters?.[dependentSchemaName]);
    }
  });
};

const getFilterDataForSchema = (tabId: string, schemaName: string): IFilterData => {
  return useSmartViewTabStore.getState()?.tabs?.[tabId]?.headerConfig?.secondary?.filterConfig
    ?.filters?.bySchemaName?.[schemaName];
};

const setFilterData = (filterDataMap: Record<string, IFilterData>, tabId: string): void => {
  useSmartViewTabStore.setState((state) => {
    let filters = state?.tabs?.[tabId]?.headerConfig?.secondary?.filterConfig?.filters;
    if (filters) {
      if (filters?.augmentationOnManageFilterSave) {
        filters = filters.augmentationOnManageFilterSave(filterDataMap, state?.tabs?.[tabId]);
        return;
      }
      filters.bySchemaName = filterDataMap;
      filters.selectedFilters = Object.keys(filterDataMap);
    }
  });
};

const setPageConfig = (tabId: string, pageConfig: Record<string, number>): void => {
  useSmartViewTabStore.setState((state) => {
    if (state.tabs[tabId] && pageConfig) {
      state.tabs[tabId].gridConfig.fetchCriteria.PageIndex = pageConfig.pageIndex || 1;
      state.tabs[tabId].gridConfig.fetchCriteria.PageSize = pageConfig.pageSize;
    }
  });
};

const setRecordCount = (tabId: string, totalRecords: number): void => {
  useSmartViewTabStore.setState((state) => {
    if (state.tabs[tabId]) {
      state.tabs[tabId].recordCount = totalRecords;
    }
  });
};

const setIsGridInitialized = (loading: boolean): void => {
  useSmartViewTabStore.setState((state) => {
    state.isGridInitialized = loading;
  });
};

const setIsGridUpdated = (loading: boolean): void => {
  useSmartViewTabStore.setState((state) => {
    state.refreshConfig.isGridUpdated = loading;
  });
};

const refreshGrid = (tabId?: string): void => {
  useSmartViewTabStore.setState((state) => {
    if (state.tabs[tabId ?? state.activeTabId]) {
      state.refreshConfig.timeStamp = Date.now();
    }
  });
};

const setTabSearch = (tabId: string, searchText: string): void => {
  useSmartViewTabStore.setState((state) => {
    if (state.tabs?.[tabId]?.gridConfig?.fetchCriteria) {
      state.tabs[tabId].gridConfig.fetchCriteria.SearchText = searchText;
      state.tabs[tabId].gridConfig.fetchCriteria.PageIndex = 1;
    }
  });
  logSVModuleUsage(tabId, SVUsageWorkArea.Search);
};

const showActionColumn = (gridConfig: IGridConfig): boolean => {
  return !!(
    gridConfig?.actions?.rowActions?.quickActions?.length ||
    gridConfig?.actions?.rowActions?.moreActions?.length
  );
};

// TODO: Remove eslint disable - https://leadsquared.atlassian.net/browse/SW-5609
// eslint-disable-next-line max-lines-per-function
const setColumns = async (
  tabId: string,
  selectedColumns: string,
  columnConfigMap?: IColumnConfigMap
): Promise<void> => {
  const tabData = useSmartViewTabStore.getState()?.tabs?.[tabId];
  const fetchCriteria = tabData?.gridConfig?.fetchCriteria;
  const gridConfig = tabData?.gridConfig;

  const getAugmenter = async (): Promise<ITabAugmenter> => {
    return (await getStandaloneSVAugmenter(tabId)) || (await getSVAugmenter(tabData?.type));
  };

  const entityCode =
    (await getAugmenter())?.getEntityCode?.(tabId, HeaderAction.SelectColumns) ||
    tabData?.entityCode;

  const getColumnConfig = (await getAugmenter())?.getColumnConfig;

  const { columns, gridColumns } = await getColumnConfig({
    columns: selectedColumns,
    actionsLength: gridConfig?.actions?.rowActions?.quickActions?.length,
    tabId,
    columnWidthConfig: gridConfig.tabColumnsWidth,
    entityCode: entityCode,
    relatedEntityCode: tabData?.relatedEntityCode,
    canShowActionColumn: showActionColumn(gridConfig),
    columnConfigMap: JSON.parse(JSON.stringify(columnConfigMap)) as IColumnConfigMap
  });

  const updatedGridConfig: IGridConfig = {
    ...gridConfig,
    columns: gridColumns,
    fetchCriteria: {
      ...fetchCriteria,
      Columns: columns
    },
    columnConfigMap: { ...columnConfigMap }
  };

  if (gridConfig.apiRequestColumns && columns) {
    updatedGridConfig.apiRequestColumns = (
      await import('../../augment-tab-data/task/helpers')
    ).getUpdatedColumns(columns.split(','));
  }

  useSmartViewTabStore.setState((state) => {
    if (state.tabs?.[tabId]?.gridConfig) {
      state.tabs[tabId].gridConfig = updatedGridConfig;
    }
  });
};

const resetManageListsFunction = async (tabId: string): Promise<void> => {
  // we need to reset the actions for manage list tabs, when we switch between hidden and visible lists

  //todo this need to be handled from tab augmentation
  if (isManageListTab(tabId)) {
    const listRowAction = await getListRowAction({ tabId, isHiddenListSelected: false });
    const listBulkActions = getListBulkAction(false);

    useSmartViewTabStore.setState((state) => {
      if (state.tabs?.[tabId]?.gridConfig?.fetchCriteria) {
        state.tabs[tabId].gridConfig.actions = {
          rowActions: {
            ...listRowAction
          },
          bulkActions: listBulkActions
        };
        state.tabs[tabId].headerConfig.secondary.actionConfiguration = getListTabActions(false);
        updateSmartViewsTab(tabId, state.tabs[tabId]);
      }
    });
  }
};

const changeFiltersToDefaultValue = (
  selectedFilters: string[],
  bySchemaName: IFilterConfig
): IFilterConfig => {
  const updatedFilterData: IFilterConfig = {};

  selectedFilters?.forEach((schemaName) => {
    const filterData = bySchemaName?.[schemaName] || {};
    const defaultOption =
      filterData?.renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
    if (filterData?.isNonClearable) {
      updatedFilterData[schemaName] = filterData;
    } else {
      updatedFilterData[schemaName] = {
        ...filterData,
        selectedValue: filterData?.defaultOption?.selectedValue || defaultOption,
        value: filterData?.defaultOption?.value || ''
      };
    }
    filterData?.customCallbacks?.onChange?.(defaultOption);
  });

  return updatedFilterData;
};

const resetQuickFilter = (): void => {
  useSmartViewTabStore.setState((state) => {
    const tabId = state.activeTabId;
    const gridConfig = state.tabs[tabId].gridConfig;
    const secondaryHeader = state.tabs[tabId].headerConfig.secondary;
    const leadTypeInternalName = state.tabs[tabId].leadTypeConfiguration?.[0]?.LeadTypeInternalName;

    if (secondaryHeader?.quickFilterConfig?.prevFilters) {
      if (secondaryHeader.quickFilterConfig.quickFilter?.InternalName === STARRED_LEAD) {
        secondaryHeader.quickFilterConfig.prevFilters = undefined;
      } else {
        secondaryHeader.quickFilterConfig.prevFilters.bySchemaName = changeFiltersToDefaultValue(
          secondaryHeader.quickFilterConfig.prevFilters.selectedFilters,
          secondaryHeader.quickFilterConfig.prevFilters.bySchemaName
        );
      }
    }

    if (secondaryHeader?.quickFilterConfig) {
      secondaryHeader.quickFilterConfig.quickFilter = QUICK_FILTER_DEFAULT_OPTION;
      secondaryHeader.quickFilterConfig.IsStarredList = false;
      secondaryHeader.quickFilterConfig.ListId = '';
    }

    state.tabs[tabId].headerConfig.secondary.filterConfig.selectFilterPopupConfig = {
      ...state.tabs[tabId].headerConfig.secondary.filterConfig.selectFilterPopupConfig,
      removePopup: false
    };

    if (leadTypeInternalName) {
      gridConfig.fetchCriteria.AdvancedSearch = `{"GrpConOp":"And","Conditions":[{"Type":"Lead","ConOp":"or","RowCondition":[{"SubConOp":"And","LSO":"LeadType","LSO_Type":"string","Operator":"eq","RSO":"${leadTypeInternalName}","RSO_IsMailMerged":false},{"RSO":""},{"RSO":""}]}],"QueryTimeZone":"${getUserStandardTimeZone()}"}`;
    } else {
      gridConfig.fetchCriteria.AdvancedSearch = '';
    }
    gridConfig.apiRoute = API_ROUTES.smartviews.leadGet;
  });
};

const resetManageEntityAdvSearch = (): void => {
  useSmartViewTabStore.setState((state) => {
    const tabId = state.activeTabId;
    state.tabs[tabId].gridConfig.isManageEntityAdvancedSearchApplied = false;
    if (state.tabs[tabId]?.entityCode) {
      state.tabs[tabId].gridConfig.fetchCriteria.AdvancedSearch = getDefaultAdvanceSearch(
        state.tabs[tabId].entityCode as string
      );
    }
  });
};

const resetShowHiddenFilter = (tabId: string): void => {
  resetManageListsFunction(tabId);
  useSmartViewTabStore.setState((state) => {
    if (isManageListTab(tabId)) {
      state.tabs[tabId].gridConfig.fetchCriteria.ShowHidden = false;
      state.tabs[tabId].gridConfig.fetchCriteria.PageIndex = 1;
    }
  });
};

const resetFilters = (tabId: string): void => {
  const tabConfig = useSmartViewTabStore.getState()?.tabs?.[tabId];

  const filters =
    tabConfig?.headerConfig?.secondary?.quickFilterConfig?.prevFilters ||
    tabConfig?.headerConfig?.secondary?.filterConfig?.filters;

  if (!filters) return;

  const selectedFilters = filters?.selectedFilters;

  resetManageListsFunction(tabId);

  useSmartViewTabStore.setState((state) => {
    if (isManageListTab(tabId)) {
      state.tabs[tabId].gridConfig.fetchCriteria.CreatedBy = '';
      state.tabs[tabId].gridConfig.fetchCriteria.ListType = ListType.ALL;
      state.tabs[tabId].gridConfig.fetchCriteria.ShowHidden = false;
    }

    const filtersConfig = state?.tabs?.[tabId]?.headerConfig?.secondary?.filterConfig?.filters;
    if (filtersConfig) {
      state.tabs[tabId].headerConfig.secondary.filterConfig.filters.bySchemaName =
        changeFiltersToDefaultValue(selectedFilters, filters.bySchemaName);
      state.tabs[tabId].headerConfig.secondary.filterConfig.filters.selectedFilters =
        selectedFilters;
    }
  });

  //TODO: SW-5610 isQuickFilterEnabled can is stored in tabData itself
  if (isQuickFilterEnabled(tabId)) {
    resetQuickFilter();
  } else if (isManageEntityAdvSearchEnabled(tabId)) {
    resetManageEntityAdvSearch();
  }
  setCustomFilters(tabId);
};

const setCalendarView = (tabId: string, calendarView: CalendarView): void => {
  useSmartViewTabStore.setState((state) => {
    if (state?.tabs?.[tabId]) {
      state.tabs[tabId].calendarView = calendarView;
    }
  });
};

const setQuickFilterAndAdvancedSearch = (
  tabId: string,
  advancedSearch: string,
  quickFilter: IQuickFilterResponse
): void => {
  useSmartViewTabStore.setState((state) => {
    if (state.tabs?.[tabId]?.gridConfig?.fetchCriteria) {
      state.tabs[tabId].gridConfig.fetchCriteria.AdvancedSearch = advancedSearch;
      if (state?.tabs?.[tabId]?.headerConfig?.secondary?.quickFilterConfig) {
        state.tabs[tabId].headerConfig.secondary.quickFilterConfig!.quickFilter = quickFilter;
      }
      state.tabs[tabId].gridConfig.fetchCriteria.PageIndex = 1;

      updateSmartViewsTab(tabId, state.tabs[tabId]);
    }
  });
};

const updateAdvancedSearchValue = (tabId: string, advancedSearch: string): void => {
  useSmartViewTabStore.setState((state) => {
    if (state.tabs?.[tabId]?.gridConfig?.fetchCriteria) {
      state.tabs[tabId].gridConfig.fetchCriteria.AdvancedSearch = advancedSearch;
      state.tabs[tabId].gridConfig.isManageEntityAdvancedSearchApplied = true;
      state.tabs[tabId].gridConfig.fetchCriteria.PageIndex = 1;

      updateSmartViewsTab(tabId, state.tabs[tabId]);
    }
  });
};

const handleStarredLeadFilters = (
  headerConfig: ITabHeader,
  starredLeadFilters: IFilter
): ITabHeader => {
  if (headerConfig?.secondary?.quickFilterConfig) {
    headerConfig.secondary.quickFilterConfig!.prevFilters =
      headerConfig?.secondary?.filterConfig?.filters;
  }

  headerConfig.secondary.filterConfig.filters = starredLeadFilters;

  if (headerConfig?.secondary?.filterConfig?.selectFilterPopupConfig) {
    headerConfig.secondary.filterConfig.selectFilterPopupConfig.removePopup = true;
  }
  return headerConfig;
};

const handleOtherQuickFilters = (headerConfig: ITabHeader): ITabHeader => {
  headerConfig.secondary.filterConfig.filters = headerConfig?.secondary?.quickFilterConfig
    ?.prevFilters || {
    bySchemaName: {},
    selectedFilters: []
  };
  headerConfig!.secondary!.quickFilterConfig!.prevFilters = undefined;

  if (headerConfig?.secondary?.filterConfig?.selectFilterPopupConfig) {
    headerConfig.secondary.filterConfig.selectFilterPopupConfig.removePopup = false;
  }
  return headerConfig;
};

const setFetchCriteriaAndRouteForManageLead = ({
  tabId,
  isStarredList,
  listId,
  route,
  advancedSearch,
  quickFilter,
  starredLeadFilters
}: ISetFetchCriteriaAndRouteForManageLead): void => {
  useSmartViewTabStore.setState((state) => {
    if (state.tabs?.[tabId]?.gridConfig?.fetchCriteria) {
      if (isStarredList && starredLeadFilters) {
        state.tabs[tabId].headerConfig = handleStarredLeadFilters(
          state.tabs[tabId].headerConfig,
          starredLeadFilters
        );
      } else if (
        state.tabs[tabId]?.headerConfig?.secondary?.quickFilterConfig?.prevFilters &&
        !isStarredList
      ) {
        state.tabs[tabId].headerConfig = handleOtherQuickFilters(state.tabs[tabId].headerConfig);
      }
      state.tabs[tabId].gridConfig.apiRoute = route;
      state.tabs[tabId].gridConfig.fetchCriteria.IsStarredList = isStarredList;
      if (state?.tabs?.[tabId]?.headerConfig?.secondary?.quickFilterConfig) {
        state.tabs[tabId].headerConfig.secondary.quickFilterConfig!.IsStarredList = isStarredList;
        state.tabs[tabId].headerConfig.secondary.quickFilterConfig!.ListId = listId;
        state.tabs[tabId].headerConfig.secondary.quickFilterConfig!.quickFilter = quickFilter;
      }
      state.tabs[tabId].gridConfig.fetchCriteria.ListId = listId;
      state.tabs[tabId].gridConfig.fetchCriteria.PageIndex = 1;
      state.tabs[tabId].gridConfig.fetchCriteria.AdvancedSearch = advancedSearch;
      updateSmartViewsTab(tabId, state.tabs[tabId]);
    }
  });
  setCustomFilters(tabId);
};

const setShowHiddenLists = async (tabId: string, showHiddenLists: boolean): Promise<void> => {
  const listRowAction = await getListRowAction({ tabId, isHiddenListSelected: showHiddenLists });
  const listBulkActions = getListBulkAction(showHiddenLists);
  useSmartViewTabStore.setState((state) => {
    if (state.tabs?.[tabId]?.gridConfig?.fetchCriteria) {
      state.tabs[tabId].gridConfig.fetchCriteria.ShowHidden = showHiddenLists;
      state.tabs[tabId].gridConfig.actions = {
        rowActions: {
          ...listRowAction
        },
        bulkActions: listBulkActions
      };
      state.tabs[tabId].gridConfig.fetchCriteria.PageIndex = 1;
      state.tabs[tabId].headerConfig.secondary.actionConfiguration =
        getListTabActions(showHiddenLists);
      updateSmartViewsTab(tabId, state.tabs[tabId]);
    }
  });
};

const updatePinnedFilter = (tabId: string, filterToPin: string, isPinned: boolean): void => {
  useSmartViewTabStore.setState((state) => {
    const filters = state.tabs?.[tabId]?.headerConfig?.secondary?.filterConfig?.filters;

    if (filters?.bySchemaName?.[filterToPin]) {
      filters.bySchemaName[filterToPin].isPinned = isPinned;
    }
  });
};

const setOpenFilter = (tabId: string, filterToOpen: string): void => {
  useSmartViewTabStore.setState((state) => {
    const filters = state.tabs?.[tabId]?.headerConfig?.secondary?.filterConfig?.filters;

    if (filters) {
      filters.filterToOpenOnMount = filterToOpen;
    }
  });
};

const setResetQuickFilterOptions = (tabId: string): void => {
  useSmartViewTabStore.setState((state) => {
    const quickFilterConfig = state.tabs?.[tabId]?.headerConfig?.secondary?.quickFilterConfig;
    if (quickFilterConfig) {
      quickFilterConfig.resetQuickFilterOptions = Math.random();
    }
  });
};

export {
  setResetQuickFilterOptions,
  useTabType,
  useRepName,
  setTabData,
  getTabData,
  setColumns,
  refreshGrid,
  setTabSearch,
  setActiveTab,
  getActiveTab,
  useActiveTab,
  setSortOrder,
  resetFilters,
  setPageConfig,
  setColumnSize,
  setFilterData,
  setRecordCount,
  useQuickFilter,
  useRecordCount,
  useSmartViewTab,
  setShowHiddenLists,
  setCalendarView,
  useEntityManage,
  skipAutoRefresh,
  useTabEntityCode,
  useRefreshConfig,
  setIsGridUpdated,
  useIsGridUpdated,
  setCustomFilters,
  useShowHiddenLists,
  useSmartViewsSearch,
  setIsGridInitialized,
  useIsGridInitialized,
  setUpdatedHeaderAction,
  getFilterDataForSchema,
  setFilterDataForSchema,
  useSmartViewRowActions,
  useSmartViewGridOverlay,
  setSmartViewGridOverlay,
  useSmartViewBulkActions,
  useSmartViewHeaderAction,
  useSmartViewPrimaryHeader,
  useSmartViewSecondaryHeader,
  setQuickFilterAndAdvancedSearch,
  setFetchCriteriaAndRouteForManageLead,
  resetSmartViewsTabStore,
  updateAdvancedSearchValue,
  useAdvancedSearchConfig,
  updatePinnedFilter,
  setOpenFilter,
  resetQuickFilter,
  resetManageEntityAdvSearch,
  resetShowHiddenFilter
};
