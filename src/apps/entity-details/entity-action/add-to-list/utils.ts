import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import {
  CREATE_NEW_LIST,
  DataType,
  ExceptionType,
  IAPIBody,
  IBody,
  IConfig,
  IHandleList,
  IInvokeApi,
  IIsBulkActionValid,
  IModifySearchParams,
  INTERNAL_LIST_SCHEMA,
  INTERNAL_LIST_TRANSLATION_KEY,
  IResponse,
  IReturnResponse,
  OperationStatus,
  Response
} from './add-to-list.types';
import { IEntityRepresentationName } from '../../types/entity-data.types';
import { BulkMode, InputId } from 'common/component-lib/bulk-update/bulk-update.types';
import {
  IAdvancedSearch,
  IBulkAction,
  IFetchCriteria
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { safeParseJson } from 'common/utils/helpers';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { IBulkSelectionMode } from 'common/component-lib/bulk-update/bulk-update.store';
import { IComponent, ITitleConfig } from '../../types';
import { getLeadName } from '../../utils';
import handleWildCardRestriction from 'common/utils/wildcard-restriction';

const isInternalList = (data: Response): boolean => {
  return INTERNAL_LIST_SCHEMA?.includes(data?.InternalName as string);
};

const getInternalListName = (
  data: Response,
  leadRepresentationName?: IEntityRepresentationName
): string => {
  if (isInternalList(data)) {
    return INTERNAL_LIST_TRANSLATION_KEY[data?.InternalName]
      ? `Starred ${leadRepresentationName?.PluralName || 'lead'}`
      : data?.Name;
  }
  return data?.Name;
};

interface IFetchOption {
  searchKeyWord?: string;
  leadRepresentationName?: IEntityRepresentationName;
  leadTypeInternalName?: string;
}

// eslint-disable-next-line complexity
export const modifySearchParams = (
  searchParams: IFetchCriteria | undefined
): IModifySearchParams => {
  const clonedSearchParams = { ...searchParams };
  clonedSearchParams.CustomFilters =
    typeof clonedSearchParams.CustomFilters === 'string' ? clonedSearchParams.CustomFilters : '';
  if (clonedSearchParams) {
    const { AdvancedSearch, CustomFilters } = clonedSearchParams;
    const filters = safeParseJson(CustomFilters || '') as IAdvancedSearch;
    if (!AdvancedSearch && filters?.Conditions?.length) {
      clonedSearchParams.AdvancedSearch =
        '{"GrpConOp":"and","QueryTimeZone":"India Standard Time","Conditions":[]}';
    }
  }
  return {
    LeadSearchParams: {
      SearchText: clonedSearchParams?.SearchText || '',
      AdvancedSearchText: clonedSearchParams.AdvancedSearch || '',
      AdvancedSearchTextNew: clonedSearchParams.AdvancedSearch || '',
      LeadOnlyConditions: clonedSearchParams?.CustomFilters || ''
    }
  };
};

const fetchOption = async (props: IFetchOption): Promise<IReturnResponse[]> => {
  const { searchKeyWord, leadRepresentationName, leadTypeInternalName } = props;
  try {
    const path = API_ROUTES.list;
    const apiBody: IAPIBody = {
      SearchText: searchKeyWord,
      PageSize: '99999',
      PageIndex: 1,
      ListType: 0,
      SortColumn: 'CreatedOn',
      SortOrder: 1
    };
    if (leadTypeInternalName) {
      apiBody.LeadType = leadTypeInternalName;
    }
    const response = (await httpPost({
      path,
      module: Module.Marvin,
      body: apiBody,
      callerSource: CallerSource.LeadDetailsVCard
    })) as Response[];

    const option = response?.map((item) => ({
      value: item?.ID,
      label: getInternalListName(item, leadRepresentationName),
      dataType: DataType.SearchableDropdown
    })) as IReturnResponse[];

    return option || [];
  } catch (error) {
    trackError(error);
  }
  return [];
};

const getBodyForNLeads = (
  props: IBody
): Record<string, string[] | string | boolean | undefined | number | object> => {
  const {
    leadIds,
    selectedOption,
    fetchCriteria,
    bulkSelectionMode,
    settingConfig,
    leadTypeInternalName
  } = props;

  return {
    LeadIds: [...leadIds],
    LeadRetrieveCriteria: {
      ...modifySearchParams(fetchCriteria),
      PageSize: bulkSelectionMode?.nLead
    },
    UpdateAll:
      bulkSelectionMode?.nLead &&
      settingConfig &&
      parseInt(bulkSelectionMode?.nLead) > parseInt(settingConfig?.MaxNLeadsToUpdateInSync),
    Nleads: bulkSelectionMode?.nLead,
    ListId: selectedOption,
    LeadType: leadTypeInternalName ?? ''
  };
};

const getBodyForTotalRecords = (
  props: IBody
): Record<string, string[] | string | boolean | undefined | number | object> => {
  const { leadIds, selectedOption, fetchCriteria, leadTypeInternalName } = props;

  return {
    LeadIds: [...leadIds],
    LeadRetrieveCriteria: modifySearchParams(fetchCriteria),
    UpdateAll: true,
    Nleads: 0,
    ListId: selectedOption,
    LeadType: leadTypeInternalName ?? ''
  };
};

const getBody = (
  props: IBody
): Record<string, string[] | string | boolean | undefined | number | object> => {
  const { leadIds, selectedOption, listName, message, bulkSelectionMode, leadTypeInternalName } =
    props;
  if (selectedOption === CREATE_NEW_LIST.value) {
    return {
      Name: listName,
      Description: message,
      Definition: '',
      CreateEmptyList: true,
      LeadType: leadTypeInternalName ?? ''
    };
  } else if (bulkSelectionMode?.mode === BulkMode.NLeads) {
    return getBodyForNLeads(props);
  } else if (bulkSelectionMode?.mode === BulkMode.TotalRecords) {
    return getBodyForTotalRecords(props);
  }
  return {
    LeadIds: [...leadIds],
    LeadRetrieveCriteria: undefined,
    UpdateAll: false,
    Nleads: 0,
    ListId: selectedOption,
    IsStaticList: true,
    LeadType: leadTypeInternalName ?? ''
  };
};

const handleList = async (props: IHandleList): Promise<IResponse> => {
  const {
    selectedValue,
    leadIds,
    listName,
    message,
    body,
    fetchCriteria,
    bulkSelectionMode,
    settingConfig,
    leadTypeInternalName
  } = props;

  const path =
    selectedValue !== CREATE_NEW_LIST.value ? API_ROUTES.addToList : API_ROUTES.createList;
  const module = selectedValue !== CREATE_NEW_LIST.value ? Module.Marvin : Module.Platform;

  const response = (await httpPost({
    path,
    module: module,
    body,
    callerSource: CallerSource.LeadDetailsVCard
  })) as IResponse;

  if (selectedValue === CREATE_NEW_LIST.value && response?.Status === OperationStatus.SUCCESS) {
    return (await httpPost({
      path: API_ROUTES.addToList,
      module: Module.Marvin,
      body: getBody({
        leadIds,
        selectedOption: response?.ListId || '',
        listName,
        message,
        fetchCriteria,
        bulkSelectionMode,
        settingConfig,
        leadTypeInternalName
      }),
      callerSource: CallerSource.LeadDetailsVCard
    })) as IResponse;
  }
  return response;
};

const invokeApi = async (props: IInvokeApi): Promise<IResponse> => {
  const {
    leadIds,
    selectedValue,
    listName,
    message,
    fetchCriteria,
    bulkSelectionMode,
    settingConfig,
    leadTypeInternalName
  } = props;

  try {
    const body = getBody({
      leadIds,
      selectedOption: selectedValue,
      listName,
      message,
      fetchCriteria,
      bulkSelectionMode,
      settingConfig,
      leadTypeInternalName
    });

    const response = await handleList({
      selectedValue: selectedValue,
      leadIds: leadIds,
      listName: listName,
      message: message,
      body: body,
      fetchCriteria,
      bulkSelectionMode,
      settingConfig,
      leadTypeInternalName
    });

    return response;
  } catch (error) {
    if (error?.name === ExceptionType.MXXSSException) {
      return {
        ExceptionType: ExceptionType.MXXSSException as ExceptionType,
        ExceptionMessage: error.message as string
      };
    } else if (
      error?.name === ExceptionType.MXDuplicateEntryException ||
      error?.ExceptionType === ExceptionType.MXDuplicateEntityNameException
    ) {
      return {
        ExceptionType: error.name as ExceptionType,
        ExceptionMessage: error.message as string
      };
    }

    handleWildCardRestriction({
      type: (error?.name || error?.ExceptionType) as string,
      message: (error?.message || error?.ExceptionMessage) as string
    });

    trackError(error);
  }
  return {};
};

const isBulkActionValid = (props: IIsBulkActionValid): boolean => {
  const {
    settingConfig,
    allRecordSelected,
    config,
    bulkSelectionMode,
    showAlert,
    setBulkNLeadError
  } = props;
  const totalRecordsLimit = parseInt(settingConfig.BulkLeadUpdateCount);
  const selectedRecordsCount = allRecordSelected ? config?.totalRecords : 0;

  const isTotalRecordsValid = (): boolean => {
    return (
      bulkSelectionMode?.mode === BulkMode.TotalRecords && selectedRecordsCount > totalRecordsLimit
    );
  };

  const isNLeadsValid = (): boolean => {
    return (
      bulkSelectionMode?.mode === BulkMode.NLeads &&
      parseInt(bulkSelectionMode?.nLead || '') > totalRecordsLimit
    );
  };

  const isNLeadsZero = (): boolean => {
    return bulkSelectionMode?.mode === BulkMode.NLeads && !parseInt(bulkSelectionMode?.nLead || '');
  };

  if (isTotalRecordsValid() || isNLeadsValid()) {
    showAlert({
      type: Type.ERROR,
      message: `You can update only up to 1 to ${totalRecordsLimit} in bulk update`
    });
    return false;
  }

  if (isNLeadsZero()) {
    setBulkNLeadError(InputId.NLeads);
    const inputElement = document.getElementById(InputId.NLeads) as HTMLInputElement;
    inputElement?.focus();
    return false;
  }

  return true;
};

const getRepresentationName = (
  leadCount: string | number | undefined,
  leadRepresentationName: IEntityRepresentationName
): string => {
  const data = leadCount ? Number(leadCount) : 1;
  if (data === 1) {
    return leadRepresentationName?.SingularName || 'Lead';
  }
  return leadRepresentationName?.PluralName || 'Leads';
};

const getLeadCountForSelectedLeadMode = (entityIds: string[] | undefined): number | undefined => {
  return entityIds?.length;
};

const getLeadCountForTotalRecordsMode = (config: IConfig): number => {
  return config?.totalRecords;
};

const getLeadCountForNLeadsMode = (
  bulkSelectionMode: IBulkSelectionMode,
  config: IConfig
): number => {
  const nLead = parseInt(bulkSelectionMode.nLead || '');
  if (config?.totalRecords && config?.totalRecords < nLead) {
    return config?.totalRecords;
  }
  return nLead;
};

const getLeadCount = (
  bulkSelectionMode: IBulkSelectionMode,
  entityIds: string[] | undefined,
  config: IConfig
): number | undefined => {
  if (bulkSelectionMode?.mode === BulkMode.SelectedLead) {
    return getLeadCountForSelectedLeadMode(entityIds);
  }
  if (bulkSelectionMode?.mode === BulkMode.TotalRecords) {
    return getLeadCountForTotalRecordsMode(config);
  }
  if (bulkSelectionMode?.mode === BulkMode.NLeads) {
    return getLeadCountForNLeadsMode(bulkSelectionMode, config);
  }
  return entityIds?.length;
};

const fetchNameFromSelectedRow = (
  bulkAction: IBulkAction | null | undefined,
  entityIds: string[] | undefined,
  leadRepresentationName: IEntityRepresentationName
): string => {
  if (bulkAction?.selectedRows) {
    const recordData = bulkAction?.selectedRows?.[entityIds?.[0] || ''] as Record<string, string>;
    return getLeadName(recordData) ?? leadRepresentationName?.SingularName;
  }
  return leadRepresentationName?.SingularName;
};

const getLeadMessage = ({
  leadCount,
  leadRepresentationName,
  augmentedData,
  customConfig,
  bulkAction,
  entityIds
}: {
  leadCount: number;
  leadRepresentationName: IEntityRepresentationName;
  augmentedData: IComponent[] | undefined;
  customConfig: Record<string, string | null> | undefined;
  bulkAction: IBulkAction | null | undefined;
  entityIds: string[] | undefined;
}): string => {
  let leadMessage: string;

  if (leadCount !== 1) {
    leadMessage = `${leadCount} ${getRepresentationName(leadCount, leadRepresentationName)}`;
  } else {
    leadMessage =
      getLeadName(customConfig || {}) ||
      (augmentedData?.[0]?.config as ITitleConfig)?.content ||
      fetchNameFromSelectedRow(bulkAction, entityIds, leadRepresentationName);
  }

  if (leadMessage === '[No Name]' && leadCount === 1) {
    leadMessage = leadRepresentationName?.SingularName;
  }

  return leadMessage;
};

const getSuccessMessage = ({
  leadRepresentationName,
  bulkSelectionMode,
  entityIds,
  config,
  augmentedData,
  selectedOption,
  listName,
  customConfig,
  bulkAction
}: {
  leadRepresentationName: IEntityRepresentationName;
  bulkSelectionMode: IBulkSelectionMode;
  entityIds: string[] | undefined;
  config: IConfig;
  augmentedData: IComponent[] | undefined;
  selectedOption: {
    value: string;
    label: string;
  }[];
  listName: string;
  customConfig: Record<string, string | null> | undefined;
  bulkAction: IBulkAction | null | undefined;
}): string => {
  const leadCount = getLeadCount(bulkSelectionMode, entityIds, config) || 1;

  const leadMessage = getLeadMessage({
    leadCount,
    leadRepresentationName,
    augmentedData,
    customConfig,
    bulkAction,
    entityIds
  });

  if (selectedOption[0].value !== CREATE_NEW_LIST.value) {
    return `'${leadMessage}' added to '${selectedOption[0].label}' successfully`;
  } else {
    return `'${listName}' is created and '${leadMessage}' added successfully.`;
  }
};

export { fetchOption, getBody, invokeApi, isBulkActionValid, getSuccessMessage };
