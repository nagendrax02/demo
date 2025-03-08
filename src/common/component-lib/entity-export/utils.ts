import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable @typescript-eslint/naming-convention */
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  ConditionType,
  TabType
} from 'apps/smart-views/constants/constants';
import { getExportConfig } from 'apps/smart-views/augment-tab-data/lead/tab-settings';
import {
  IAdvancedSearch,
  IFilterConfig,
  IGroupCondition,
  IRowCondition,
  ITabConfig
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import {
  getTaskFilterDate,
  getTaskFilterIncludeOverDue,
  getAdvanceSearchText,
  getEntityCode,
  getLeadOnlyConditions,
  getSearchText,
  getSortColumn,
  getSortOrder,
  getTaskFilterOwner,
  getTaskFilterStatus,
  safeParseJson,
  getTaskTypeFilterValue
} from 'common/utils/helpers/helpers';
import {
  ExceptionType,
  IError,
  IExportPermission,
  IFetchCriteria,
  IGetAccountAdvancedSearchText,
  IParsedRestrictEntityExport,
  IResponseInfo,
  ISettingInfo
} from './entity-export.types';
import { getExportTaskConfig } from 'apps/smart-views/augment-tab-data/task/tab-settings';
import { getActivityExportConfig } from 'apps/smart-views/augment-tab-data/activity/tab-settings';
import { ActionType, PermissionEntityType, isRestricted } from 'common/utils/permission-manager';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import {
  getUserStandardTimeZone,
  isFilterSelected
} from 'src/apps/smart-views/components/smartview-tab/utils';
import { getCustomFilterCondition } from '../../../apps/smart-views/components/smartview-tab/utils';
import { getOpportunityExportConfig } from 'apps/smart-views/augment-tab-data/opportunity/tab-settings';

interface IMaxExportConfig {
  tabType: TabType;
  entityCode?: string;
  setMinRecordForAsyncRequest?: React.Dispatch<React.SetStateAction<number | undefined>>;
  tabEntityCode: string;
  tabId: string;
}

// eslint-disable-next-line complexity, max-lines-per-function
const getMaxExportConfig = async (props: IMaxExportConfig): Promise<string> => {
  try {
    const { tabType, entityCode, setMinRecordForAsyncRequest, tabEntityCode, tabId } = props;

    switch (tabType) {
      case TabType.Lead:
        return (await getExportConfig(tabId))?.Configs?.MaxLeadsToExport;
      case TabType.Task:
        return (
          await getExportTaskConfig(entityCode ?? '', tabId, setMinRecordForAsyncRequest)
        )?.MaxTasksToExport?.toString();

      case TabType.Activity:
        return (
          await getActivityExportConfig(tabEntityCode, tabId)
        )?.MaxActivitiesToExport?.toString();
      case TabType.Account:
        return '100000';
      case TabType.Opportunity:
        return (
          await getOpportunityExportConfig(tabEntityCode, tabId)
        )?.MaxActivitiesToExport?.toString();
      default:
        return '';
    }
  } catch (error) {
    trackError(error);
    if ((error as IError)?.response?.ExceptionType === ExceptionType.MXUnauthorizedRequestException)
      return (error as IError)?.response?.ExceptionMessage;
  }
  return '';
};

const augmentFetchCriteria = (fetchCriteria: IGetAccountAdvancedSearchText): IRowCondition[] => {
  const augmentedFilters: IRowCondition[] = [];
  try {
    if (fetchCriteria?.CustomFilters && fetchCriteria?.CustomFilters !== '') {
      const customFilters = JSON.parse(fetchCriteria?.CustomFilters)
        .Conditions as IGroupCondition[];
      customFilters?.forEach((filter) => {
        if (filter?.RowCondition?.[0]) augmentedFilters.push(filter.RowCondition[0]);
      });
      return augmentedFilters;
    }
  } catch (error) {
    console.log('Error in augmentFetchCriteria export', error);
  }
  return [];
};

export const getAccountAdvancedSearchText = (
  fetchCriteria: IGetAccountAdvancedSearchText
): IAdvancedSearch => {
  const advancedSearchText: IAdvancedSearch =
    fetchCriteria?.AdvancedSearch !== ''
      ? (safeParseJson(fetchCriteria?.AdvancedSearch) as IAdvancedSearch)
      : {
          GrpConOp: ConditionType.AND,
          QueryTimeZone: '',
          Conditions: []
        };
  try {
    const filterValues = augmentFetchCriteria(fetchCriteria);

    if (advancedSearchText?.Conditions) {
      filterValues.forEach((filter) => {
        const { LSO_Type, RSO } = filter;
        if (LSO_Type === 'PickList') {
          filter.LSO_Type = ConditionOperatorType.MultiSelect;
        }
        if (LSO_Type === 'DateTime') {
          filter.RSO = RSO.split('_').join('-');
          filter.Operator = ConditionOperator.EQUALS;
        }
        advancedSearchText?.Conditions?.push({
          Type: ConditionEntityType.Company,
          ConOp: ConditionType.AND,
          RowCondition: [filter]
        });
      });
    }
  } catch (error) {
    console.log('Error in getAccountAdvancedSearchText AccountGrid', error);
  }
  return advancedSearchText;
};

export const generateAccountFiltersCriteria = ({
  selectedFilters,
  bySchemaName
}: {
  selectedFilters: string[];
  bySchemaName: IFilterConfig;
}): string => {
  const queryTimeZone = getUserStandardTimeZone();
  const defaultCustomFilters = {
    GrpConOp: ConditionType.AND,
    QueryTimeZone: queryTimeZone ?? '',
    Conditions: []
  };

  const customGeneratedFilters = selectedFilters?.reduce(
    (
      acc: { customFilterConfig: IAdvancedSearch },
      schema: string
    ): { customFilterConfig: IAdvancedSearch } => {
      const filterData = bySchemaName?.[schema];
      if (!isFilterSelected(filterData?.selectedValue)) {
        return acc;
      }

      acc?.customFilterConfig?.Conditions?.push({
        ...getCustomFilterCondition(filterData, schema),
        Type: ConditionEntityType.Company
      });

      return acc;
    },
    { customFilterConfig: defaultCustomFilters }
  );

  return JSON.stringify(customGeneratedFilters.customFilterConfig);
};

const getFetchCriteriaForAccount = (tabData: ITabConfig): IFetchCriteria => {
  return {
    entityCode: getEntityCode(tabData),
    advancedSearchText: JSON.stringify(
      getAccountAdvancedSearchText({
        AdvancedSearch: getAdvanceSearchText(tabData),
        CustomFilters: generateAccountFiltersCriteria({
          selectedFilters: tabData?.headerConfig?.secondary?.filterConfig?.filters?.selectedFilters,
          bySchemaName: tabData?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName
        })
      })
    ),

    searchText: getSearchText(tabData),
    stage: 'All',
    datePickerField: '',
    fromDate: '',
    toDate: '',
    ownerId: 'Any'
  };
};

const getFetchCriteria = (
  tabData: ITabConfig,
  tabType: TabType,
  listId: string
): IFetchCriteria => {
  if (tabType === TabType.Account) {
    return getFetchCriteriaForAccount(tabData);
  }
  const fetchCriteria = {
    entityCode: getEntityCode(tabData),
    advancedSearchText: getAdvanceSearchText(tabData),
    searchText: getSearchText(tabData),
    sortColumn: getSortColumn(tabData),
    sortOrder: getSortOrder(tabData),
    ListId: listId,
    leadOnlyCondition: getLeadOnlyConditions(tabData)
  };

  if (tabType === TabType.Task) {
    const taskFetchCriteria = {
      ...fetchCriteria,
      task_Owner: getTaskFilterOwner(tabData),
      task_IncludeOverDue: getTaskFilterIncludeOverDue(tabData),
      task_includeOnlyOverDue: getTaskFilterIncludeOverDue(tabData, true),
      task_FromDate: getTaskFilterDate(tabData, 'From_Date'),
      task_ToDate: getTaskFilterDate(tabData, 'To_Date'),
      task_Status: getTaskFilterStatus(tabData),
      task_entitiesCount: tabData?.recordCount,
      task_Type: getTaskTypeFilterValue(tabData),
      taskOnlyConditions: getLeadOnlyConditions(tabData)
    };
    return taskFetchCriteria;
  }

  return fetchCriteria;
};

const getAdditionalEntityColumns = (tabType: TabType): string => {
  switch (tabType) {
    case TabType.Lead:
      return 'EmailAddress,FirstName,LastName';
    default:
      return '';
  }
};

const getRestrictionPermission = async (params: IExportPermission): Promise<boolean> => {
  const { entityType, action, entityCode, skipTaskUserValidation } = params || {};

  const restrictionData = await isRestricted({
    entity: entityType,
    action,
    entityId: entityCode,
    skipTaskUserValidation,
    callerSource: CallerSource.SmartViews
  });

  return restrictionData;
};

const getPermissionForExport = async (tabType: TabType, entityCode?: string): Promise<boolean> => {
  const permissionParams = {
    [TabType.Lead]: {
      entityType: PermissionEntityType.Lead,
      action: ActionType.Export,
      entityCode: ''
    },
    [TabType.Task]: {
      entityType: PermissionEntityType.Task,
      action: ActionType.Export,
      entityCode: '',
      skipTaskUserValidation: true
    },
    [TabType.Activity]: {
      entityType: PermissionEntityType.Activity,
      action: ActionType.Export,
      entityCode: ''
    },
    [TabType.Account]: {
      entityType: PermissionEntityType.Accounts,
      action: ActionType.Export,
      entityCode: entityCode || ''
    },
    [TabType.Opportunity]: {
      entityType: PermissionEntityType.Opportunity,
      action: ActionType.Export,
      entityCode: entityCode || ''
    }
  };

  const params = permissionParams[tabType] as IExportPermission;
  if (params) {
    return getRestrictionPermission(params);
  }

  return false;
};

const getExportRestrictionFromTenantSetting = async (): Promise<ISettingInfo> => {
  try {
    const settingInfo = getItem(StorageKey.Setting) as Record<string, string | object>;
    const exportData = settingInfo.ExportSetting as IResponseInfo;

    if (!exportData) {
      const setting = (await httpPost({
        path: API_ROUTES.setting,
        module: Module.Marvin,
        body: ['RestrictExportForAllEntities', 'RestrictEntityExport', 'AccountEntitySettings'],
        callerSource: CallerSource.SmartViews
      })) as IResponseInfo;

      settingInfo.ExportSetting = setting;
      setItem(StorageKey.Setting, settingInfo);
      return {
        RestrictExportForAllEntities: setting?.RestrictExportForAllEntities === '1',
        AccountEntitySettings: setting?.AccountEntitySettings,
        RestrictEntityExport: (
          safeParseJson(setting?.RestrictEntityExport) as IParsedRestrictEntityExport
        )?.Entity
      };
    }
    return {
      RestrictExportForAllEntities: exportData?.RestrictExportForAllEntities === '1',
      AccountEntitySettings: exportData?.AccountEntitySettings,
      RestrictEntityExport: (
        safeParseJson(exportData?.RestrictEntityExport) as IParsedRestrictEntityExport
      )?.Entity
    };
  } catch (error) {
    console.log(error);
  }
  return {
    RestrictExportForAllEntities: false,
    AccountEntitySettings: '',
    RestrictEntityExport: []
  };
};

export {
  getMaxExportConfig,
  getFetchCriteria,
  getAdditionalEntityColumns,
  getPermissionForExport,
  getExportRestrictionFromTenantSetting
};
