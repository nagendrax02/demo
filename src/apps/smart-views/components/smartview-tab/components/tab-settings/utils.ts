import { trackError } from 'common/utils/experience/utils/track-error';
import {
  ExportType,
  IAccountExportPayload,
  IAccountExportPayloadProps,
  IActivityExportPayload,
  IActivityExportPayloadProps,
  IEntityBody,
  IEntityExportConfig,
  IHandleEntityExport,
  ILeadBody,
  IOpportunityExportPayloadProps,
  IResponse,
  ITaskExportPayload,
  ITaskExportPayloadProps,
  ITaskFetchCriteria
} from './tab-settings.types';
import styles from './tab-settings.module.css';
import {
  activityReplaceableSchema,
  ALL_TASKS_TYPES_CACHE_KEY,
  DEFAULT_MAX_ALLOWED,
  HeaderAction,
  TabType
} from 'apps/smart-views/constants/constants';
import {
  IAdvancedSearch,
  IColumnConfigMap,
  IFilterConfig,
  IFilterData,
  IMarvinData,
  ITabConfig
} from '../../smartview-tab.types';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import {
  EXPORT_WILDCARD_MESSAGE,
  leadRelatedCompanyNameReplacement,
  redundantLeadExportSchemaNames,
  systemSelectedExportFields
} from './constants';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { IError, IFetchCriteria } from 'common/component-lib/entity-export/entity-export.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES, EXCEPTION_MESSAGE, ExceptionType } from 'common/constants';
import { Type, INotification } from '@lsq/nextgen-preact/notification/notification.types';
import {
  canCallTaskAsync,
  createLookUPNameAndValue,
  getStatusCode,
  getTaskSelectedFields,
  removeSeparator
} from './utils-helper';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import {
  IAvailableColumnConfig,
  IAvailableField,
  IGenerateFilterData
} from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import { DATE_FILTER, FilterRenderType, OptionSeperator } from '../filter-renderer/constants';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import {
  createHashMapFromArray,
  getTaskTypeFilterValue,
  safeParseJson
} from 'common/utils/helpers/helpers';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { getTabData } from '../../smartview-tab.store';
import { TABS_CACHE_KEYS } from 'apps/smart-views/components/custom-tabs/constants';
import { augmentTabData as createRawTabDataToCache } from 'apps/smart-views/utils/utils';
import { getRawTabData, setRawTabData } from 'apps/smart-views/smartviews-store';
import { postManageTabCache } from 'apps/smart-views/components/custom-tabs/utils';
import handleWildCardRestriction from 'common/utils/wildcard-restriction';
import { getStringifiedLeadType } from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import {
  addActionColumn,
  getSortedColumnString,
  removeActionColumn
} from '../../../../augment-tab-data/common-utilities/pin-utils';

const getClassName = (selectedAction: IMenuItem | null, selectedExportType: ExportType): string => {
  const classNameArray: string[] = [];
  if (selectedAction?.value === HeaderAction.ExportLeads) {
    classNameArray.push(styles.export_entity);
    if (selectedExportType === ExportType.AllFields) {
      classNameArray.push(styles.hide_body);
    } else if (selectedExportType === ExportType.SelectedFields) {
      classNameArray.push(styles.show_body);
    }
  }
  return classNameArray?.join(' ');
};

const getSelectedFields = (
  tabData: ITabConfig,
  selectedAction: IMenuItem | null,
  columnConfigMap?: IColumnConfigMap
): string => {
  const actionContainer = {
    [HeaderAction.SelectColumns]: tabData?.gridConfig?.fetchCriteria?.Columns ?? '',
    [HeaderAction.ExportLeads]:
      removeActionColumn(tabData?.gridConfig?.fetchCriteria?.Columns) ?? ''
  };
  if (selectedAction?.value === HeaderAction.SelectColumns) {
    return getSortedColumnString(
      addActionColumn(actionContainer?.[HeaderAction.SelectColumns]),
      columnConfigMap
    );
  }
  if (selectedAction?.value && actionContainer[selectedAction.value]) {
    return actionContainer[selectedAction.value];
  }
  return tabData?.headerConfig?.secondary?.filterConfig?.filters?.selectedFilters?.join(',');
};

const getMaxAllowed = (
  tabData: ITabConfig,
  selectedAction: IMenuItem | null,
  entityExportConfig?: IEntityExportConfig
): number => {
  const actionContainer = {
    [HeaderAction.SelectColumns]: DEFAULT_MAX_ALLOWED.Columns,
    [HeaderAction.ExportLeads]: entityExportConfig?.maxExportAllowed || DEFAULT_MAX_ALLOWED.Columns
  };
  if (selectedAction?.value && actionContainer[selectedAction.value]) {
    return actionContainer[selectedAction.value];
  }

  return tabData?.headerConfig?.secondary?.filterConfig?.maxAllowedFilters as number;
};

const getLeadExportPayload = async ({
  column,
  fetchCriteria,
  selectedExportType,
  tabId
}: {
  fetchCriteria?: IFetchCriteria;
  selectedExportType?: ExportType;
  column?: string[];
  tabId?: string;
}): Promise<ILeadBody> => {
  return {
    SearchText: fetchCriteria?.searchText,
    SortOrder: fetchCriteria?.sortOrder,
    SortColumn:
      fetchCriteria?.sortColumn === LEAD_SCHEMA_NAME.LEAD_IDENTIFIER
        ? LEAD_SCHEMA_NAME.FIRST_NAME
        : fetchCriteria?.sortColumn,
    AdvancedSearchTextNew: fetchCriteria?.advancedSearchText,
    LeadOnlyConditions: fetchCriteria?.leadOnlyCondition,
    ListId: fetchCriteria?.ListId || '',
    RetrieveColumns: selectedExportType === ExportType.AllFields ? '' : column?.join(','),
    LeadType: await getStringifiedLeadType(tabId ?? '', OptionSeperator.MXSeparator)
  };
};

// eslint-disable-next-line max-lines-per-function, complexity
const getTaskExportFetchCriteria = (
  props: ITaskExportPayloadProps,
  leadType?: string
): ITaskFetchCriteria => {
  const { fetchCriteria, column, minRecordForAsyncRequest } = props;
  const lookUPNameAndValue = createLookUPNameAndValue(fetchCriteria?.task_Owner || '');
  return {
    Parameter: {
      LookupName: lookUPNameAndValue?.lookupName,
      LookupValue: lookUPNameAndValue?.lookupValue,
      From: null,
      To: null,
      StatusCode: getStatusCode(removeSeparator(fetchCriteria?.task_Status || '')),
      SearchText: fetchCriteria?.searchText || '',
      TypeName:
        fetchCriteria?.entityCode === '-1' &&
        !canCallTaskAsync(
          fetchCriteria.task_entitiesCount !== undefined ? fetchCriteria.task_entitiesCount : 0,
          minRecordForAsyncRequest || 0
        )
          ? fetchCriteria?.task_Type ?? ''
          : fetchCriteria?.task_Type ?? fetchCriteria?.entityCode,
      IncludeOverdue: fetchCriteria?.task_IncludeOverDue,
      IncludeOnlyOverdue: fetchCriteria?.task_includeOnlyOverDue,
      TaskRetrievalDataSource: 1,
      IncludeCanUpdate: false,
      SelectedSalesGroupId: '',
      IncludeSalesGroupFilter: false,
      AdvancedSearchText: fetchCriteria?.advancedSearchText,
      FromDate: fetchCriteria?.task_FromDate || null,
      ToDate: fetchCriteria?.task_ToDate || null
    },
    Columns: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Exclude_CSV: '',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Include_CSV: column?.join(',')
    },
    Sorting: {
      ColumnName: fetchCriteria?.sortColumn,
      Direction: fetchCriteria?.sortOrder
    },
    Paging: {
      Offset: 0,
      RowCount: fetchCriteria?.task_entitiesCount
    },
    ParentOpportunityEvent: 0,
    TaskOnlyConditions:
      fetchCriteria?.taskOnlyConditions ||
      '{"GrpConOp":"and","QueryTimeZone":"India Standard Time","Conditions":[]}',
    SupportTaskCustomFilter: true,
    LeadType: leadType
  };
};

const getTaskExportPayload = async (
  props: ITaskExportPayloadProps
): Promise<ITaskExportPayload> => {
  const { fetchCriteria, selectedExportType, minRecordForAsyncRequest, tabId } = props;

  const leadType = await getStringifiedLeadType(tabId ?? '', OptionSeperator.MXSeparator);
  const taskAPIFetchCriteria = {
    FetchCriteria: getTaskExportFetchCriteria(props, leadType),
    ExportAllFields: selectedExportType === ExportType.AllFields,
    SelectedFields: getTaskSelectedFields(
      fetchCriteria?.task_entitiesCount !== undefined ? fetchCriteria?.task_entitiesCount : 0,
      minRecordForAsyncRequest || 0
    ),
    TaskTypes: fetchCriteria?.task_Type ?? fetchCriteria?.entityCode,
    LeadType: leadType
  };

  return taskAPIFetchCriteria;
};

const updateActivitySchemasName = (customFiltersStr: string): string => {
  try {
    const customFilters = safeParseJson(customFiltersStr) as IAdvancedSearch;
    if (!customFilters) {
      return '';
    }

    const customFiltersClone = {
      ...customFilters,
      Conditions: customFilters?.Conditions?.map((customFilterConditions) => ({
        ...customFilterConditions,
        RowCondition: customFilterConditions?.RowCondition?.map((o) => {
          return {
            ...o,
            LSO: activityReplaceableSchema[o?.LSO] ?? o?.LSO
          };
        })
      }))
    };

    return JSON.stringify(customFiltersClone);
  } catch (error) {
    trackError(error);
  }
  return '';
};

const getActivityExportPayload = (props: IActivityExportPayloadProps): IActivityExportPayload => {
  const { fetchCriteria, selectedExportType, column, tabEntityCode } = props;

  return {
    ActivityEventCode: tabEntityCode,
    SearchText: fetchCriteria?.searchText,
    AdvancedSearch: fetchCriteria?.advancedSearchText,
    ActivityOnlyConditions:
      updateActivitySchemasName(fetchCriteria?.leadOnlyCondition ?? '') ??
      fetchCriteria?.leadOnlyCondition,
    OpportunitySalesGroup: '',
    SortColumn:
      activityReplaceableSchema[fetchCriteria?.sortColumn ?? ''] ?? fetchCriteria?.sortColumn,
    SortOrder: fetchCriteria?.sortOrder,
    ExportAllFields: selectedExportType === ExportType.AllFields,
    SelectedFields: column?.join(','),
    IsOpportunity: false,
    ParentOpportunityEvent: '-1',
    ParentOpportunityColumns:
      'O_ProspectActivityId, O_ActivityEvent, O_ActivityEventName, O_mx_Custom_1, O_ModifiedOn'
  };
};

// eslint-disable-next-line complexity
const getAccountExportPayload = (props: IAccountExportPayloadProps): IAccountExportPayload => {
  const { fetchCriteria, selectedExportType, column } = props;

  return {
    CompanyTypeId: fetchCriteria?.entityCode || '',
    SearchText: fetchCriteria?.searchText || '',
    Stage: fetchCriteria?.stage || 'All',
    OwnerId: fetchCriteria?.ownerId || 'any',
    Columns: selectedExportType === ExportType.AllFields ? '' : column?.join(','),
    AdvancedSearch: fetchCriteria?.advancedSearchText || '',
    DatePickerField: fetchCriteria?.datePickerField || '',
    DatePickerFrom: fetchCriteria?.fromDate || '',
    DatePickerTo: fetchCriteria?.toDate || '',
    ExportAllFields: selectedExportType === ExportType.AllFields
  };
};

const getOpportunityExportPayload = (
  props: IOpportunityExportPayloadProps
): IActivityExportPayload => {
  const { fetchCriteria, selectedExportType, column } = props;

  return {
    ActivityEventCode: fetchCriteria?.entityCode,
    SearchText: fetchCriteria?.searchText,
    AdvancedSearch: fetchCriteria?.advancedSearchText,
    ActivityOnlyConditions: fetchCriteria?.leadOnlyCondition,
    OpportunitySalesGroup: '',
    SortColumn: fetchCriteria?.sortColumn,
    SortOrder: fetchCriteria?.sortOrder,
    ExportAllFields: selectedExportType === ExportType.AllFields,
    SelectedFields: column?.join(','),
    IsOpportunity: true,
    ParentOpportunityEvent: '-1',
    ParentOpportunityColumns:
      'O_ProspectActivityId, O_ActivityEvent, O_ActivityEventName, O_mx_Custom_1, O_ModifiedOn'
  };
};

// eslint-disable-next-line max-lines-per-function
const getExportEntityPayload = async (
  props: IHandleEntityExport
): Promise<IEntityBody | object> => {
  const { entityExportConfig, selectedExportType, selectedColumns, tabType, tabEntityCode, tabId } =
    props;

  switch (tabType) {
    case TabType.Lead:
      return getLeadExportPayload({
        fetchCriteria: entityExportConfig?.fetchCriteria,
        selectedExportType,
        column: selectedColumns,
        tabId
      });
    case TabType.Task:
      return getTaskExportPayload({
        fetchCriteria: entityExportConfig?.fetchCriteria,
        selectedExportType: selectedExportType,
        column: selectedColumns,
        minRecordForAsyncRequest: entityExportConfig?.minRecordForAsyncRequest,
        tabId: tabId
      });
    case TabType.Activity:
      return getActivityExportPayload({
        fetchCriteria: entityExportConfig?.fetchCriteria,
        selectedExportType: selectedExportType,
        column: selectedColumns,
        tabEntityCode: tabEntityCode
      });
    case TabType.Account:
      return getAccountExportPayload({
        fetchCriteria: entityExportConfig?.fetchCriteria,
        selectedExportType: selectedExportType,
        column: selectedColumns
      });
    case TabType.Opportunity:
      return getOpportunityExportPayload({
        fetchCriteria: entityExportConfig?.fetchCriteria,
        selectedExportType: selectedExportType,
        column: selectedColumns
      });
    default:
      return {};
  }
};

const handleLeadExportApi = async (entityBody: IEntityBody): Promise<IResponse> => {
  try {
    const response = (await httpPost({
      path: API_ROUTES.leadExport,
      module: Module.Marvin,
      body: entityBody,
      callerSource: CallerSource.SmartViews
    })) as IResponse;
    return response;
  } catch (error) {
    console.log(error);
    return {
      Status: 'Failure',
      Message: {
        IsSuccessful: false,
        Result: false
      },
      ExceptionMessage: (error as IError)?.response?.ExceptionMessage,
      ExceptionType: (error as IError)?.response?.ExceptionType as ExceptionType
    };
  }
};

const handleTaskExportApiForEntityCountLessThanAsyncRequest = async (
  entityBody: IEntityBody
): Promise<IResponse> => {
  try {
    const response = await httpPost({
      path: API_ROUTES.taskExport,
      module: Module.Marvin,
      body: entityBody,
      callerSource: CallerSource.SmartViews
    });

    const url = window.URL.createObjectURL(
      new Blob([atob(response as string)], {
        type: 'text/plain'
      })
    );

    const link = document.createElement('a');
    link.href = url;
    const fileName = `Lsq_Tasks_Export_${new Date().getHours()}${new Date().getMinutes()}_${new Date()
      .toLocaleString()
      .split(',')[0]
      .replaceAll('/', '')}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    //Adding it to save the memory leak issue
    window.URL.revokeObjectURL(url);
    return {
      Status: 'Success'
    };
  } catch (error) {
    trackError(error);
  }
  return {
    Status: 'Failure'
  };
};

const handleTaskExportApi = async (
  entityBody: IEntityBody,
  entityExportConfig?: IEntityExportConfig
): Promise<IResponse> => {
  try {
    if (
      entityExportConfig?.fetchCriteria?.task_entitiesCount !== undefined &&
      entityExportConfig?.minRecordForAsyncRequest &&
      entityExportConfig.fetchCriteria.task_entitiesCount <
        entityExportConfig.minRecordForAsyncRequest
    ) {
      return await handleTaskExportApiForEntityCountLessThanAsyncRequest(entityBody);
    } else {
      return await httpPost({
        path: API_ROUTES.taskExportAsync,
        module: Module.Marvin,
        body: entityBody,
        callerSource: CallerSource.SmartViews
      });
    }
  } catch (error) {
    console.log(error);
  }
  return {
    Status: 'Failure',
    Message: {
      IsSuccessful: false,
      Result: false
    }
  };
};

const handleActivityExportApi = async (entityBody: IEntityBody): Promise<IResponse> => {
  try {
    return await httpPost({
      path: API_ROUTES.activityExport,
      module: Module.Marvin,
      body: entityBody,
      callerSource: CallerSource.SmartViews
    });
  } catch (error) {
    console.log(error);
    return {
      Status: 'Failure',
      Message: {
        IsSuccessful: false,
        Result: false
      },
      ExceptionType: (error as IError)?.response?.ExceptionType as ExceptionType,
      ExceptionMessage: (error as IError)?.response?.ExceptionMessage
    };
  }
};

const handleAccountExportApi = async (
  entityBody: IEntityBody,
  entityExportConfig?: IEntityExportConfig
): Promise<IResponse> => {
  try {
    return await httpPost({
      path: `${API_ROUTES.accountExport}${entityExportConfig?.fetchCriteria?.entityCode}`,
      module: Module.Marvin,
      body: entityBody,
      callerSource: CallerSource.SmartViews
    });
  } catch (error) {
    console.log(error);
  }
  return {
    Status: 'Failure',
    Message: {
      IsSuccessful: false,
      Result: false
    }
  };
};

const handleOpportunityExportApi = async (entityBody: IEntityBody): Promise<IResponse> => {
  try {
    return await httpPost({
      path: API_ROUTES.activityExport,
      module: Module.Marvin,
      body: entityBody,
      callerSource: CallerSource.SmartViews
    });
  } catch (error) {
    console.log(error);
    return {
      Status: 'Failure',
      Message: {
        IsSuccessful: false,
        Result: false
      },
      ExceptionType: (error as IError)?.response?.ExceptionType as ExceptionType,
      ExceptionMessage: (error as IError)?.response?.ExceptionMessage
    };
  }
};

const handleExportEntityAPI = async (
  tabType: TabType,
  entityBody: IEntityBody,
  entityExportConfig?: IEntityExportConfig
): Promise<IResponse> => {
  switch (tabType) {
    case TabType.Lead:
      return handleLeadExportApi(entityBody);
    case TabType.Task:
      return handleTaskExportApi(entityBody, entityExportConfig);
    case TabType.Activity:
      return handleActivityExportApi(entityBody);
    case TabType.Account:
      return handleAccountExportApi(entityBody, entityExportConfig);
    case TabType.Opportunity:
      return handleOpportunityExportApi(entityBody);

    default:
      return {
        Status: 'Failure',
        Message: {
          IsSuccessful: false,
          Result: false
        }
      };
  }
};

const replaceCompanyTypeAndCompanyIdFields = (selectedColumns: string[]): string[] => {
  if (selectedColumns?.length) {
    const indexOfRelCompanyIdName = selectedColumns?.indexOf?.(
      leadRelatedCompanyNameReplacement.relatedCompanyIdName.value
    );
    if (indexOfRelCompanyIdName !== -1) {
      selectedColumns?.splice(
        indexOfRelCompanyIdName,
        1,
        leadRelatedCompanyNameReplacement.relatedCompanyIdName.newSchemaName
      );
    }
    const indexOfLeadOwner = selectedColumns?.indexOf?.('P_OwnerIdName');
    if (indexOfLeadOwner !== -1) {
      selectedColumns[indexOfLeadOwner] = 'P_OwnerId';
    }
  }

  return selectedColumns;
};

const getLeadColumns = (tabType: TabType, columns: string[]): string[] => {
  const systemSelectedFields = systemSelectedExportFields[tabType] as string[];
  const selectedColumns = [...columns];

  systemSelectedFields?.forEach((currSchema: string) => {
    if (!selectedColumns.includes(currSchema)) {
      selectedColumns.unshift(currSchema);
    }
  });

  if (
    selectedColumns?.length &&
    selectedColumns.includes(LEAD_SCHEMA_NAME.OWNER_ID_NAME) &&
    !selectedColumns.includes(LEAD_SCHEMA_NAME.OWNER_ID_EMAIL_ADDRESS)
  ) {
    const indexOfOwnerIdName = selectedColumns.indexOf(LEAD_SCHEMA_NAME.OWNER_ID_NAME);
    if (indexOfOwnerIdName !== -1)
      selectedColumns.splice(indexOfOwnerIdName, 1, LEAD_SCHEMA_NAME.OWNER_ID_EMAIL_ADDRESS);
    selectedColumns.splice(indexOfOwnerIdName, 0, LEAD_SCHEMA_NAME.OWNER_ID_NAME);
  }

  return selectedColumns.filter(
    (currSchema) => !redundantLeadExportSchemaNames.includes(currSchema)
  );
};

const getTaskColumns = (columns: string[]): string[] => {
  return replaceCompanyTypeAndCompanyIdFields(columns);
};

const getActivityColumns = (tabType: TabType, columns: string[]): string[] => {
  const systemSelectedFields = systemSelectedExportFields[tabType] as string[];
  const selectedColumns = [...columns];

  systemSelectedFields?.forEach((field) => {
    if (!selectedColumns?.includes(field)) {
      selectedColumns.push(field);
    }
  });

  return replaceCompanyTypeAndCompanyIdFields(selectedColumns);
};

const getOpportunityColumns = (tabType: TabType, columns: string[]): string[] => {
  const systemSelectedFields = systemSelectedExportFields[tabType] as string[];

  if (!columns?.includes(systemSelectedFields[0])) {
    columns?.unshift(systemSelectedFields[0]);
  }
  if (!columns?.includes(systemSelectedFields[1])) {
    columns?.push(systemSelectedFields[1]);
  }

  return columns;
};

const getAccountColumns = (tabType: TabType, columns: string[]): string[] => {
  const systemSelectedFields = systemSelectedExportFields[tabType] as string[];
  columns?.unshift(systemSelectedFields[0]);
  columns?.push(systemSelectedFields[1]);

  if (columns?.length && columns?.includes(LEAD_SCHEMA_NAME.OWNER_ID)) {
    const indexOfOwnerId = columns?.indexOf(LEAD_SCHEMA_NAME.OWNER_ID);
    if (indexOfOwnerId !== -1) columns.splice(indexOfOwnerId, 1, LEAD_SCHEMA_NAME.OWNER_ID);
  }

  return columns;
};

const getEntityColumns = (tabType: TabType, selectedColumns: string[]): string[] => {
  switch (tabType) {
    case TabType.Lead:
      return getLeadColumns(tabType, selectedColumns);
    case TabType.Task:
      return getTaskColumns(selectedColumns);
    case TabType.Activity:
      return getActivityColumns(tabType, selectedColumns);
    case TabType.Account:
      return getAccountColumns(tabType, selectedColumns);
    case TabType.Opportunity:
      return getOpportunityColumns(tabType, selectedColumns);
    default:
      return [];
  }
};

const setSelectedExportFieldsInCache = (
  tabType: TabType,
  selectedFields: IAvailableField[]
): void => {
  const getCachedData =
    (getItem(StorageKey.EntityExportColumns) as Record<string, IAvailableField[]>) || {};

  getCachedData[TabType[tabType]] = selectedFields;
  setItem(StorageKey.EntityExportColumns, getCachedData);
};

const getSelectedExportFieldsFromCache = (tabType: TabType): IAvailableField[] => {
  const getCachedData =
    (getItem(StorageKey.EntityExportColumns) as Record<string, IAvailableField[]>) || {};
  return getCachedData[TabType[tabType]] || [];
};

const getFilteredCacheSelectedColumns = (
  allFields: IAvailableColumnConfig[],
  tabType: TabType
): IAvailableField[] => {
  const schemaDictionary: Record<string, IAvailableField> = allFields?.reduce((acc, section) => {
    section?.data?.forEach((item) => {
      acc[item?.schemaName] = item;
    });
    return acc;
  }, {});

  const cachedColumns = getSelectedExportFieldsFromCache(tabType);
  const updatedCachedColumns = cachedColumns
    ?.filter((item) => schemaDictionary?.[item?.schemaName])
    ?.map((item) => ({ ...item, ...schemaDictionary?.[item?.schemaName], isSelected: true }));

  return updatedCachedColumns;
};

const handleExportFailure = (
  response: IResponse,
  tabType: TabType,
  showAlert: ((notification: INotification) => void) | undefined
): void => {
  if (
    response?.ExceptionType === ExceptionType.MXWildcardAPIRateLimitExceededException &&
    response?.ExceptionMessage
  ) {
    let entityPluralName = '';
    switch (tabType) {
      case TabType.Lead:
        entityPluralName = 'leads';
        break;
      case TabType.Activity:
        entityPluralName = 'activities';
        break;
      case TabType.Opportunity:
        entityPluralName = 'opportunities';
        break;
    }
    handleWildCardRestriction({
      type: response?.ExceptionType as string,
      message: EXPORT_WILDCARD_MESSAGE.replace('-ENTITYNAME-', entityPluralName)
    });
  } else
    showAlert?.({
      type: Type.ERROR,
      message: response?.ExceptionMessage || EXCEPTION_MESSAGE
    });
};

// eslint-disable-next-line max-lines-per-function
const handleEntityExport = async (props: IHandleEntityExport): Promise<void> => {
  const {
    entityExportConfig,
    selectedExportType,
    selectedColumns,
    tabType,
    setEntityExportSucceeded,
    showAlert,
    setSubmitButtonDisabled,
    setIsLoading,
    tabEntityCode,
    selectedFields,
    tabId
  } = props;

  try {
    setSubmitButtonDisabled?.(true);
    setIsLoading?.(true);
    const selectedColumnsToBeExported = getEntityColumns(tabType, selectedColumns);
    const entityBody = await getExportEntityPayload({
      entityExportConfig: entityExportConfig,
      selectedExportType: selectedExportType,
      selectedColumns: selectedColumnsToBeExported,
      tabType: tabType,
      tabEntityCode: tabEntityCode,
      tabId: tabId
    });
    const response = await handleExportEntityAPI(tabType, entityBody, entityExportConfig);
    if (response?.Status === 'Success' && setEntityExportSucceeded) {
      setEntityExportSucceeded(true);
      setSelectedExportFieldsInCache(tabType, selectedFields || []);
    } else if (response?.Status === 'Failure') {
      handleExportFailure(response, tabType, showAlert);
    }
  } catch (error) {
    showAlert?.({
      type: Type.ERROR,
      message: EXCEPTION_MESSAGE
    });
  } finally {
    setSubmitButtonDisabled?.(false);
    setIsLoading?.(false);
  }
};

export const checkIfExportPossible = (selectedColumns: string[], entityType: TabType): boolean => {
  if (!(entityType === TabType.Lead)) {
    if (selectedColumns.length > 0) {
      const onlyEntitySchemaNames = selectedColumns?.filter(
        (currSchema) => !(currSchema[0] === 'P' && currSchema[1] === '_')
      );

      if (onlyEntitySchemaNames?.length >= 1) {
        return true;
      }
      return false;
    }
    return false;
  }
  return true;
};

const showCustomMessageForTask = (
  entityType: TabType,
  entityExportConfig?: IEntityExportConfig
): boolean => {
  if (entityType === TabType.Task && entityExportConfig?.minRecordForAsyncRequest) {
    if (
      entityExportConfig?.fetchCriteria?.task_entitiesCount !== undefined &&
      entityExportConfig.fetchCriteria.task_entitiesCount <=
        entityExportConfig.minRecordForAsyncRequest
    )
      return true;
    return false;
  }
  return false;
};

const getMessage = (
  tabType: TabType,
  entityExportConfig?: IEntityExportConfig,
  entityRepName?: IEntityRepresentationName
): string => {
  if (showCustomMessageForTask(tabType, entityExportConfig)) {
    return `Your request for ${
      entityRepName?.SingularName || 'task'
    } export has been successfully processed`;
  }
  return `Your request for exporting ${entityRepName?.SingularName} has been queued`;
};

const getDescription = (tabType: TabType, entityExportConfig?: IEntityExportConfig): string => {
  if (tabType === TabType.Task && !showCustomMessageForTask(tabType, entityExportConfig)) {
    return `You have selected more than ${entityExportConfig?.minRecordForAsyncRequest} tasks. As soon as the process is completed, we will intimate you through email`;
  } else if (showCustomMessageForTask(tabType, entityExportConfig)) {
    return 'The file will be downloaded soon';
  }
  return 'As soon as the process is completed, we will intimate you through email.';
};

const getSubDescription = (
  tabType: TabType,
  entityExportConfig?: IEntityExportConfig,
  entityRepName?: IEntityRepresentationName
): string => {
  if (tabType !== TabType.Account) {
    if (!showCustomMessageForTask(tabType, entityExportConfig)) {
      return `Note: We will export upto ${entityExportConfig?.maxExportAllowed} ${entityRepName?.SingularName}.`;
    }
  }
  return '';
};

const getTaskFieldExistInSelectedFields = (selectedFields: IAvailableField[]): boolean => {
  const isTaskFieldExist = selectedFields?.find((selField) => selField?.type === TabType.Task);
  return !!isTaskFieldExist;
};

const resetFilterOptions = (filterData: Record<string, IFilterData>): void => {
  const getUpdatedFilter = (filter: IFilterData): IFilterData => {
    if (filter?.isDisabled) {
      return filter;
    }
    return {
      ...filter,
      selectedValue:
        filter?.renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [],
      value: ''
    };
  };

  Object.entries(filterData)?.map(([key, filter]) => (filterData[key] = getUpdatedFilter(filter)));
};

const getAugmentedAvailableFieldsForExport = (
  fields: IAvailableColumnConfig[],
  cachedSelectedColumns: IAvailableField[]
): IAvailableColumnConfig[] => {
  const schemaDict = createHashMapFromArray(cachedSelectedColumns, 'schemaName');
  return fields?.map((field) => {
    return {
      ...field,
      data: field?.data?.map((metadata) => {
        return {
          ...metadata,
          isSelected: schemaDict?.[metadata?.schemaName] ? true : metadata?.isSelected
        };
      })
    };
  });
};

const handleManageTasksTaskTypeColumnCache = (currColumns: string[]): void => {
  try {
    const tabData = getTabData(TABS_CACHE_KEYS.MANAGE_TASKS_TAB);
    const rawData = createRawTabDataToCache(
      getRawTabData(TABS_CACHE_KEYS.MANAGE_TASKS_TAB),
      tabData
    );
    const {
      TabContentConfiguration: { FetchCriteria }
    } = safeParseJson(JSON.stringify(rawData)) as ITabResponse;
    const marvinData = safeParseJson(FetchCriteria?.AdditionalData || '') as IMarvinData;
    const taskTypeFilterArray = (getTaskTypeFilterValue(tabData) || null)?.split(',');

    if (marvinData?.Marvin) {
      const manageTasksTaskTypeColumn = { ...marvinData?.Marvin?.ManageTasksTaskTypeColumn };
      const entityCode =
        taskTypeFilterArray?.length === 1 ? taskTypeFilterArray?.[0] : ALL_TASKS_TYPES_CACHE_KEY;
      manageTasksTaskTypeColumn[entityCode] = currColumns;
      marvinData.Marvin.ManageTasksTaskTypeColumn = manageTasksTaskTypeColumn;
    }
    rawData.TabContentConfiguration.FetchCriteria.AdditionalData = JSON.stringify(marvinData);
    setRawTabData(tabData?.id, rawData);
    postManageTabCache(rawData);
  } catch (error) {
    trackError(error);
  }
};

export const getFilterData = async ({
  tabId,
  field,
  bySchemaName,
  generateFilterData
}: {
  tabId: string;
  field: IAvailableField;
  bySchemaName: IFilterConfig;
  generateFilterData?: IGenerateFilterData;
}): Promise<IFilterData> => {
  const tabData = getTabData(tabId);
  let filterData = bySchemaName[field.id];
  if (!filterData) {
    filterData = (await generateFilterData?.(
      field.id,
      tabData.type,
      tabData.entityCode ?? ''
    )) as IFilterData;
  }
  return filterData;
};

export {
  getClassName,
  getSelectedFields,
  getMaxAllowed,
  handleEntityExport,
  replaceCompanyTypeAndCompanyIdFields,
  showCustomMessageForTask,
  getMessage,
  getDescription,
  getSubDescription,
  getTaskFieldExistInSelectedFields,
  resetFilterOptions,
  getSelectedExportFieldsFromCache,
  getAugmentedAvailableFieldsForExport,
  getFilteredCacheSelectedColumns,
  handleManageTasksTaskTypeColumnCache
};
