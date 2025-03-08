import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
import { IAuthenticationConfig } from 'common/types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { TIME_ZONE_OPTIONS } from 'common/constants/timezone-contants';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IDateOption } from 'common/component-lib/date-filter';
import {
  DATE_FILTER,
  FilterRenderType,
  OptionSeperator
} from './components/filter-renderer/constants';
import {
  IAccountCustomFilters,
  IAccountFiltersGeneration,
  IAdvancedSearch,
  IAugmentResponse,
  IFilterConfig,
  IFilterData,
  IGridConfig,
  IGroupCondition,
  IHeaderAction,
  IRecordType,
  ITabConfig,
  ITabHeader
} from './smartview-tab.types';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  ConditionType,
  HeaderAction,
  SALES_ACTIVITY_CODE,
  SCHEMA_NAMES,
  TabType,
  activityReplaceableSchema,
  cfsSchemaNameSuffix,
  PageSizeOptions,
  leadSchemaNamePrefix
} from '../../constants/constants';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { IColumnDef, IPaginationConfig } from '@lsq/nextgen-preact/v2/grid/grid.types';
import {
  endSVExpEvent,
  isManageListTab,
  isManageTab,
  IsMarvinRequest,
  isSmartviewTab,
  prependLeadSchemaPrefix,
  startSVExpEvent
} from '../../utils/utils';
import {
  activityCustomFilterGenerator,
  addSalesActivityCondition
} from '../../augment-tab-data/activity/custom-filter-generator';
import { TaskActionIds } from '../../augment-tab-data/task/constants';
import { taskCustomFilterGenerator } from '../../augment-tab-data/task/custom-filter-generator';
import { IFetchCriteria } from '../smartview-tab/smartview-tab.types';
import { SmartViewsEvents } from 'common/utils/experience/experience-modules';
import { opportunityCustomFilterGenerator } from '../../augment-tab-data/opportunity/custom-filter-generator';
import { IGetIsFeatureRestriction, ILeadTypeConfiguration } from '../../smartviews.types';
import { AccountActivityCustomFilterGenerator } from '../../augment-tab-data/account-activity/custom-filter-generator';
import handleWildCardRestriction from 'common/utils/wildcard-restriction';
import { leadCustomFilterGenerator } from '../../augment-tab-data/lead/custom-filter-generator';
import { isValidGUID } from 'common/utils/helpers/helpers';
import { removeActionColumn } from '../../augment-tab-data/common-utilities/pin-utils';
import { ErrorPageTypes } from 'common/component-lib/error-page/error-page.types';
import { getErrorType } from './components/grid/utils';

export const getUserStandardTimeZone = (): string => {
  const userDetails = getItem(StorageKey.Auth) as IAuthenticationConfig;
  const userTimeZone = userDetails?.User?.TimeZone;
  let standardTimeZone = '';

  Object.keys(TIME_ZONE_OPTIONS).map((timezone) => {
    if (TIME_ZONE_OPTIONS[timezone]?.split('$')[1] === userTimeZone) {
      standardTimeZone = (TIME_ZONE_OPTIONS[timezone] as string)?.split('$')[0];
    }
  });
  return standardTimeZone || '';
};

export const isFilterSelected = (selectedOption: IOption[] | IDateOption): boolean => {
  if (!selectedOption) {
    return false;
  }
  if ('startDate' in selectedOption) {
    return selectedOption?.value === DATE_FILTER.ALL_TIME ? false : true;
  } else {
    return selectedOption?.length ? true : false;
  }
};

export const removeSchemaPrefix = (schema: string, prefix = leadSchemaNamePrefix): string => {
  return schema?.startsWith(prefix) ? schema?.replace(prefix, '') : schema;
};

export const removeCfsSchemaSuffix = (schema: string, suffix = cfsSchemaNameSuffix): string => {
  return schema?.includes(suffix) ? schema?.split(suffix)?.[0] : schema;
};

const getSchemaName = (schemaName: string, tabType: TabType): string => {
  if (tabType === TabType.Lead && schemaName === SCHEMA_NAMES.CREATED_BY_NAME) {
    return SCHEMA_NAMES.CREATED_BY;
  }

  if (
    tabType === TabType.Task &&
    schemaName === prependLeadSchemaPrefix(SCHEMA_NAMES.CREATED_BY_NAME)
  ) {
    return SCHEMA_NAMES.CREATED_BY;
  }

  if (tabType === TabType?.Activity && activityReplaceableSchema[schemaName]) {
    schemaName = activityReplaceableSchema[schemaName];
  }
  return removeSchemaPrefix(schemaName);
};

export const getCustomFilterCondition = (
  filterData: IFilterData,
  schemaName: string
): IGroupCondition => {
  return {
    Type:
      filterData?.entityType === ConditionEntityType.Opportunity
        ? ConditionEntityType.Activity
        : filterData?.entityType,
    ConOp: ConditionType.AND,
    RowCondition: [
      {
        [`RSO_IsMailMerged`]: false,
        RSO: filterData?.value,
        Operator: filterData?.filterOperator,
        [`LSO_Type`]: filterData?.filterOperatorType,
        LSO: schemaName,
        SubConOp: ConditionType.AND,
        IsMarvinRequest: IsMarvinRequest(filterData?.filterOperator, filterData?.filterOperatorType)
      }
    ]
  };
};

// eslint-disable-next-line complexity
export const getAugmentEssTaskTabFilterData = ({
  filterData,
  filter
}: {
  filterData: IFilterData;
  filter: string;
}): IFilterData => {
  //below case is handled for due date filter in task tab (Ess tenant), when custom filter is applied on due date instead of sending 11:59:59 PM we will be sending 11:59:00 PM for backend compatibility

  const isEssTenantEnabled =
    ((getItem(StorageKey.Setting) as Record<string, string | object>) || {})
      ?.EnableESSForLeadManagement === '1';
  const updatedFilterDate = Object.assign({}, filterData);
  if (
    filter === SCHEMA_NAMES.DUE_DATE &&
    updatedFilterDate?.filterOperator === ConditionOperator.BETWEEN &&
    isEssTenantEnabled
  ) {
    const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [AP]M TO \d{4}-\d{2}-\d{2} 11:59:59 PM$/;
    if (pattern.test(updatedFilterDate?.value || '')) {
      updatedFilterDate.value =
        updatedFilterDate?.value?.replace(
          /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}):\d{2} ([AP]M)$/,
          '$1:00 $2'
        ) || '';
    }
  }

  return updatedFilterDate;
};

export const getLeadTypeCondition = (
  leadTypeConfiguration: ILeadTypeConfiguration[]
): IGroupCondition => {
  return {
    Type: ConditionEntityType.Lead,
    ConOp: ConditionType.AND,
    RowCondition: [
      {
        SubConOp: ConditionType.AND,
        LSO: SCHEMA_NAMES.LEAD_TYPE,
        ['LSO_Type']:
          leadTypeConfiguration?.length > 1
            ? ConditionOperatorType.SearchablePickList
            : ConditionOperatorType.Dropdown,
        Operator: ConditionOperator.EQUALS,
        ['RSO_IsMailMerged']: false,
        IsMarvinRequest: true,
        RSO: leadTypeConfiguration
          ?.map((leadType) => leadType.LeadTypeInternalName)
          ?.join(OptionSeperator.MXSeparator)
      }
    ]
  };
};

const getFilterCondition = (
  advancedSearch: IAdvancedSearch,
  leadTypeConfiguration?: ILeadTypeConfiguration[]
): string => {
  return leadTypeConfiguration?.length ? JSON.stringify(advancedSearch) : '';
};

export const generateCustomFilters = ({
  bySchemaName,
  selectedFilters,
  tabType,
  entityCode,
  leadTypeConfiguration
}: {
  selectedFilters: string[];
  bySchemaName: IFilterConfig;
  tabType: TabType;
  entityCode?: string;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
}): string => {
  try {
    const advancedSearch: IAdvancedSearch = {
      GrpConOp: ConditionType.AND,
      QueryTimeZone: getUserStandardTimeZone(),
      Conditions: []
    };

    if (leadTypeConfiguration) {
      advancedSearch.Conditions?.push(getLeadTypeCondition(leadTypeConfiguration));
    }

    if (!selectedFilters?.length && !bySchemaName) {
      return getFilterCondition(advancedSearch, leadTypeConfiguration);
    }

    const isFilterNotSelected = (filterData: IFilterData): boolean | undefined => {
      return !isFilterSelected(filterData?.selectedValue) || filterData?.excludeFromApi;
    };

    // eslint-disable-next-line complexity
    selectedFilters?.map((filter) => {
      const filterData = bySchemaName[filter];
      if (isFilterNotSelected(filterData)) return;

      const schemaName = getSchemaName(filter, tabType);

      if (tabType === TabType.Activity) {
        advancedSearch.Conditions?.push(
          ...activityCustomFilterGenerator({
            schemaName,
            filterData,
            entityCode: entityCode || '',
            defaultValue: getCustomFilterCondition(filterData, schemaName)
          })
        );
      } else if (tabType === TabType.Task) {
        const augmentedFilterData = getAugmentEssTaskTabFilterData({
          filterData,
          filter
        });

        advancedSearch.Conditions?.push(
          ...taskCustomFilterGenerator({
            schemaName,
            defaultValue: getCustomFilterCondition(augmentedFilterData, schemaName)
          })
        );
      } else if (tabType === TabType.Opportunity) {
        advancedSearch.Conditions?.push(
          ...opportunityCustomFilterGenerator({
            schemaName,
            filterData,
            entityCode: entityCode || '',
            defaultValue: getCustomFilterCondition(filterData, schemaName)
          })
        );
      } else if (tabType === TabType.AccountActivity) {
        advancedSearch.Conditions?.push(
          ...AccountActivityCustomFilterGenerator(getCustomFilterCondition(filterData, schemaName))
        );
      } else if (tabType === TabType.Lead) {
        advancedSearch.Conditions?.push(
          ...leadCustomFilterGenerator({
            schemaName,
            filterData,
            defaultValue: getCustomFilterCondition(filterData, schemaName)
          })
        );
      } else advancedSearch.Conditions?.push(getCustomFilterCondition(filterData, schemaName));
    });

    if (tabType === TabType?.Activity && entityCode === SALES_ACTIVITY_CODE) {
      advancedSearch.Conditions?.push(addSalesActivityCondition());
    }
    return JSON.stringify(advancedSearch);
  } catch (error) {
    trackError(error);
  }
  return '';
};

const filterFetchCriteriaColumns = (fetchCriteriaColumns: string): string => {
  if (fetchCriteriaColumns?.length) {
    return fetchCriteriaColumns
      .split(',')
      .filter((column) => column)
      .join(',');
  }

  return fetchCriteriaColumns;
};

const getUpdatedFetchCriteria = (
  fetchCriteria: IFetchCriteria,
  tabId: string
): Partial<IFetchCriteria> => {
  if (!isManageListTab(tabId)) fetchCriteria.Columns = removeActionColumn(fetchCriteria.Columns);
  fetchCriteria = { ...fetchCriteria, Columns: filterFetchCriteriaColumns(fetchCriteria.Columns) };

  if (fetchCriteria.SortBy === 2) {
    // we can sort the column ascending, descending and then back to normal,the reason why we are removing SortBy and SortOrder(only required in manage list) is because when we are back to normal sorting, we don't pass these in api payload.
    const { SortBy, SortOrder, ...updatedFetchCriteria } = fetchCriteria;
    return updatedFetchCriteria;
  }
  return fetchCriteria;
};

const handleError = ({
  tabId,
  setError,
  tabData,
  recordCount,
  apiFailure,
  apiStatus
}: {
  tabId: string;
  setError?: (type: ErrorPageTypes | undefined) => void;
  tabData?: ITabConfig;
  recordCount?: number;
  apiFailure?: boolean;
  apiStatus?: number;
}): void => {
  // if (setError) setError(getErrorType({ tabId, apiFailure, tabData, recordCount, apiStatus }));
};

const updateFetchCriteria = ({
  apiRequestColumns,
  fetchCriteria,
  requiredColumns,
  augmentFetchCriteria,
  headerConfig
}: {
  fetchCriteria: IFetchCriteria;
  apiRequestColumns?: string;
  requiredColumns?: string;
  augmentFetchCriteria?: (
    fetchCriteria: IFetchCriteria,
    headerConfig: ITabHeader
  ) => IFetchCriteria;
  headerConfig: ITabHeader;
}): IFetchCriteria => {
  if (apiRequestColumns) {
    fetchCriteria = {
      ...fetchCriteria,
      Columns: apiRequestColumns
    };
  }

  if (requiredColumns) {
    fetchCriteria = {
      ...fetchCriteria,
      Columns: `${fetchCriteria.Columns},${requiredColumns}`
    };
  }

  if (fetchCriteria.SortOn === SCHEMA_NAMES.LEAD_IDENTIFIER) {
    fetchCriteria.SortOn = SCHEMA_NAMES.FIRST_NAME;
  }

  return augmentFetchCriteria?.({ ...fetchCriteria }, headerConfig) ?? fetchCriteria;
};

const shouldFetchPreviousPage = (records: IRecordType[], pageIndex = 1): boolean => {
  return !records?.length && pageIndex > 1;
};

const getGridRecord = async (params: {
  apiRoute: string;
  tabId: string;
  apiFetchCriteria: Partial<IFetchCriteria>;
  augmentResponse: IAugmentResponse;
  setError?: (type: ErrorPageTypes | undefined) => void;
}): Promise<{ recordCount: number; gridRecords: IRecordType[]; pageIndex: number }> => {
  const { apiFetchCriteria, apiRoute, tabId, augmentResponse, setError } = params;
  startSVExpEvent(SmartViewsEvents.GridGetAPI, tabId);

  const response = await httpPost({
    path: apiRoute,
    module: Module.Marvin,
    body: apiFetchCriteria,
    callerSource: CallerSource.SmartViews,
    responseInterceptor: (data) => {
      handleError({ tabId, apiFailure: !data?.ok, apiStatus: data?.status, setError });
    }
  });

  endSVExpEvent(SmartViewsEvents.GridGetAPI, tabId);

  const pageIndex = apiFetchCriteria.PageIndex as number;

  if (response) {
    const augmentedResponse = await augmentResponse(response);
    const count =
      (response as Record<string, number>)?.RecordCount ??
      (response as Record<string, number>)?.Total ??
      augmentedResponse?.totalRecordCount;

    // If there are no records on the current page index (index > 1) after an action, go back to 1st page.
    if (
      apiFetchCriteria.PageIndex &&
      shouldFetchPreviousPage(augmentedResponse?.records, apiFetchCriteria.PageIndex)
    ) {
      const reInitiatedApiResponse = await getGridRecord({
        ...params,
        apiFetchCriteria: {
          ...params.apiFetchCriteria,
          PageIndex: 1
        }
      });
      return reInitiatedApiResponse;
    }
    return {
      gridRecords: augmentedResponse.records,
      recordCount: count,
      pageIndex: pageIndex
    };
  }

  return {
    recordCount: 0,
    gridRecords: [] as IRecordType[],
    pageIndex: pageIndex
  };
};

export const fetchGridRecords = async (params: {
  gridConfig: IGridConfig;
  handlePageSizeSelection?: (pageSize: IOption) => void;
  handlePageSelect: (pageNumber: number) => void;
  tabId: string;
  headerConfig: ITabHeader;
  setError?: (type: ErrorPageTypes | undefined) => void;
  tabData?: ITabConfig;
}): Promise<{ count: number; gridRecords: IRecordType[]; config?: IPaginationConfig }> => {
  const {
    gridConfig,
    handlePageSizeSelection,
    handlePageSelect,
    tabId,
    headerConfig,
    setError,
    tabData
  } = params;

  const { requiredColumns, apiRoute, augmentResponse, apiRequestColumns, augmentFetchCriteria } =
    gridConfig;
  let { fetchCriteria } = gridConfig;
  let config: IPaginationConfig = {
    noOfRecords: 0,
    pageSelected: fetchCriteria.PageIndex,
    totalRecords: 0,
    disablePageSelection: false,
    handlePageSizeSelection,
    handlePageSelect,
    pageSize: fetchCriteria.PageSize || parseInt(PageSizeOptions[0].value, 10),
    pageSizeOptions: PageSizeOptions
  };

  fetchCriteria = updateFetchCriteria({
    apiRequestColumns,
    augmentFetchCriteria,
    fetchCriteria,
    requiredColumns,
    headerConfig
  });

  try {
    const apiFetchCriteria = getUpdatedFetchCriteria(fetchCriteria, tabId);
    const {
      gridRecords,
      recordCount,
      pageIndex: pageSelected
    } = await getGridRecord({
      apiFetchCriteria,
      apiRoute,
      augmentResponse,
      tabId,
      setError
    });

    config = {
      ...config,
      noOfRecords: gridRecords?.length,
      totalRecords: recordCount,
      pageSelected: pageSelected
    };

    handleError({ tabId, setError, tabData, recordCount });
    return {
      count: recordCount,
      config,
      gridRecords: gridRecords
    };
  } catch (err) {
    handleError({ tabId: tabId, apiFailure: true, apiStatus: err.status as number, setError });

    handleWildCardRestriction({
      type: err?.response?.ExceptionType as string,
      message: err?.response?.ExceptionMessage as string
    });
    trackError(err);
    endSVExpEvent(SmartViewsEvents.GridGetAPI, tabId, true);
  }
  return {
    count: 0,
    gridRecords: [] as IRecordType[],
    config
  };
};

export const isCalendarViewActive = (tabData: ITabConfig): boolean => {
  const headerActions = tabData?.headerConfig?.secondary?.actionConfiguration;
  const calendarAction = headerActions?.filter(
    (action) => action.id === TaskActionIds.CALENDAR_VIEW
  )?.[0];

  return calendarAction?.isActive || false;
};

export const handleRestrictionFromPermissionTemplate = (data: IHeaderAction[]): IHeaderAction[] => {
  data?.forEach((action) => {
    if (action?.id === 'more_actions' && action?.subMenu?.length) {
      action.subMenu.forEach((subAction) => {
        if (subAction?.value === HeaderAction.ExportLeads) {
          subAction.disabled = true;
          subAction.toolTip = "You don't have permission to perform this action";
        }
      });
    }
  });
  return data;
};

export const handleRestrictionFromTenantManagement = (data: IHeaderAction[]): IHeaderAction[] => {
  const moreActionsObject = data?.find((item) => item.id === 'more_actions');

  if (
    moreActionsObject?.subMenu?.length === 1 &&
    moreActionsObject?.subMenu[0]?.value === HeaderAction.ExportLeads
  ) {
    //below cases will handle when export restricted from tenant management, and we have only one option i.e export in More Action
    data = data?.filter((action) => action?.id !== 'more_actions');
  } else if (moreActionsObject?.subMenu?.length && moreActionsObject.subMenu.length > 1) {
    //below cases will handle when export restricted from tenant management, and we have multiple options in More Action

    moreActionsObject.subMenu = moreActionsObject?.subMenu?.filter(
      (menuItem) => menuItem.value !== HeaderAction.ExportLeads
    );
  }
  return data;
};

export const generateAccountFiltersForFetchCriteria = ({
  selectedFilters,
  bySchemaName,
  tabType
}: {
  selectedFilters: string[];
  bySchemaName: IFilterConfig;
  tabType: TabType;
}): {
  customFilters: IAccountCustomFilters[];
  customDateFilters: string;
} => {
  if (tabType !== TabType.Account) return { customFilters: [], customDateFilters: '' };

  const queryTimeZone = getUserStandardTimeZone();
  const defaultCustomDateFilters = {
    GrpConOp: ConditionType.AND,
    QueryTimeZone: queryTimeZone ?? '',
    Conditions: []
  };

  const customGeneratedFilters = selectedFilters?.reduce(
    (acc: IAccountFiltersGeneration, schema: string): IAccountFiltersGeneration => {
      const filterData = bySchemaName?.[schema];
      if (!isFilterSelected(filterData?.selectedValue)) {
        return acc;
      }

      if (filterData?.renderType === FilterRenderType.DateTime) {
        acc.customDateFilters.Conditions?.push({
          ...getCustomFilterCondition(filterData, schema),
          Type: ConditionEntityType.Company
        });
      } else {
        acc.customFilters.push({
          LookupName: schema,
          LookupValues: filterData?.value?.split(OptionSeperator.MXSeparator) || []
        });
      }

      return acc;
    },
    { customFilters: [], customDateFilters: defaultCustomDateFilters }
  );

  return {
    customFilters: customGeneratedFilters.customFilters,
    customDateFilters: JSON.stringify(customGeneratedFilters.customDateFilters)
  };
};

export const getGridConfigColumns = (
  featureRestriction: IGetIsFeatureRestriction | null | undefined,
  columns: IColumnDef<IRecordType>[]
): IColumnDef<IRecordType>[] => {
  try {
    const updatedColumns = columns.reduce((acc: IColumnDef<IRecordType>[], col) => {
      if (featureRestriction?.isFeatureRestrictedForRowActions && col.id === 'Actions') {
        return acc;
      } else if (featureRestriction?.isFeatureRestrictedForSorting) {
        acc.push({ ...col, sortable: false });
      } else {
        acc.push(col);
      }

      return acc;
    }, []);
    return updatedColumns;
  } catch (error) {
    console.log(error);
  }
  return columns;
};

export const getDisableSelection = (
  featureRestriction: IGetIsFeatureRestriction | null | undefined,
  tabId: string,
  disableSelection: boolean | undefined
): boolean => {
  try {
    if (featureRestriction?.isFeatureRestrictedForBulkActions && isSmartviewTab(tabId)) {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
  return !disableSelection;
};

export const resetDependentFilterValues = (filter: IFilterData): IFilterData => {
  return {
    ...filter,
    selectedValue: [],
    value: ''
  };
};

export const canUpdateFullScreenRecords = (activeTabId: string): boolean => {
  return isValidGUID(activeTabId) || isManageTab(activeTabId);
};
