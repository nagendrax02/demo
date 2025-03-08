import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
import { ActionType } from 'common/utils/permission-manager';
import { CallerSource } from 'common/utils/rest-client';
import {
  IAugmentedSmartViewEntityMetadata,
  IAvailableField,
  IGetFieldsConfig
} from './common.types';
import {
  IAdvancedSearch,
  IFilterConfig,
  IGroupCondition,
  IMarvinData,
  IResponseDateFilter,
  IResponseFilterConfig,
  IRowActionConfig
} from '../../components/smartview-tab/smartview-tab.types';
import { getRestrictionMap } from 'common/utils/permission-manager/permission-manager';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  ConditionType,
  PlatformSettingsLeadDateFilter,
  PlatformSettingsLeadSchemaMap,
  SALES_GROUP_SCHEMA_NAME,
  SCHEMA_NAMES,
  sortByMap,
  TabType,
  TaskStatusOptions
} from '../../constants/constants';
import {
  MANAGE_ENTITY_LEAD_TYPE,
  PERMISSION_ENTITY_TYPE,
  PERMISSION_SCHEMA_NAME_MAP,
  PlatformDateOptionMap
} from './constant';
import { IDateOption } from 'common/component-lib/date-filter';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IColumn } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import {
  FilterRenderType,
  DATE_FILTER,
  OptionSeperator
} from '../../components/smartview-tab/components/filter-renderer/constants';
import { getCustomDateOption } from 'common/component-lib/date-filter/utils';
import { OPTIONS_OBJ } from 'common/component-lib/date-filter/constants';
import { removeCfsSchemaSuffix, removeSchemaPrefix } from '../../components/smartview-tab/utils';
import { IActionConfig } from 'apps/entity-details/types';
import { ILeadTypeConfiguration, ISvActionConfig, ITabResponse } from '../../smartviews.types';
import { safeParseJson } from 'common/utils/helpers';
import { isDetailsPage, isManageTab, isSmartviewTab } from '../../utils/utils';
import { getRawTabData } from '../../smartviews-store';
import { IStatusRelatedFetchCriteria } from '../task/task.types';
import { getDefaultFilterValue } from './tab-settings';
import {
  fetchLeadTypeConfig,
  isLeadTypeEnabled,
  isLeadTypeSupportedInManageEntity
} from 'common/utils/lead-type/settings';
import { getPinActionConfig } from './pin-utils';

export function sortMetadataByDisplayName(augmentedMetadata: IAvailableField[]): IAvailableField[] {
  if (!augmentedMetadata?.length) {
    return [];
  }
  return augmentedMetadata?.sort(function (a, b) {
    const nameA = a?.displayName?.toLowerCase();
    const nameB = b?.displayName?.toLowerCase();
    if (nameA > nameB) {
      return 1;
    }
    return nameA < nameB ? -1 : 0;
  });
}

const getSchemaNames = (
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>,
  schemaPrefix?: string,
  entityType?: TabType
): string[] => {
  return Object.keys(metaDataMap || {}).map((schema) => {
    const schemaName = removeSchemaPrefix(schema, schemaPrefix);
    if (entityType === TabType.Activity) {
      return schemaName;
    }
    return removeCfsSchemaSuffix(schemaName);
  });
};

const getValidSchemaName = (schema: string, entityType: TabType): string => {
  if (entityType === TabType.Lead) {
    return PERMISSION_SCHEMA_NAME_MAP?.[schema] ?? schema;
  }
  return schema;
};

const fetchRestrictionMap = async ({
  entityType,
  metaDataMap,
  entityCode,
  schemaPrefix
}: {
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  entityType: TabType;
  entityCode?: string;
  schemaPrefix?: string;
}): Promise<Record<string, boolean>> => {
  return getRestrictionMap(getSchemaNames(metaDataMap, schemaPrefix, entityType), {
    entity: PERMISSION_ENTITY_TYPE[entityType],
    action: ActionType.View,
    entityId: entityCode,
    callerSource: CallerSource.SmartViews
  });
};

export const getFieldsConfig = async ({
  metaDataMap,
  selectedColumns,
  maxAllowed,
  entityType,
  entityCode,
  schemaPrefix,
  customFieldTransformer, // return null from customFieldTransformer to remove field,
  repNameMap,
  columnConfigMap,
  selectedAction
}: IGetFieldsConfig): Promise<IAvailableField[]> => {
  if (!metaDataMap) {
    return [];
  }

  const selectedColumnsArray = selectedColumns?.split(',') || [];
  const selectedColumnsLength = selectedColumnsArray?.length;
  const selectedColumnMap: Record<string, number> = {};
  selectedColumnsArray.forEach((selectedColumn) => {
    selectedColumnMap[selectedColumn] = 1;
  });

  const restrictionMap = await fetchRestrictionMap({
    metaDataMap,
    entityType,
    entityCode,
    schemaPrefix
  });

  const metadataArray = Object.values(metaDataMap)?.reduce((acc: IAvailableField[], metadata) => {
    const metadataSchemaName = metadata?.schemaName;
    const isRestricted =
      restrictionMap?.[
        removeCfsSchemaSuffix(
          removeSchemaPrefix(getValidSchemaName(metadata?.schemaName, entityType), schemaPrefix)
        )
      ];
    let augmentedMetadata: IAvailableField | null = {
      ...metadata,
      id: metadataSchemaName,
      label: metadata?.displayName,
      isSelected: true,
      type: entityType,
      isRemovable: true,
      isRestricted,
      badgeText: repNameMap?.[entityType],
      ...getPinActionConfig({
        schemaName: metadataSchemaName,
        columnConfigMap,
        selectedAction
      })
    };
    augmentedMetadata = customFieldTransformer
      ? customFieldTransformer?.(augmentedMetadata)
      : augmentedMetadata;

    if (!augmentedMetadata) {
      return acc;
    }

    if (selectedColumnMap?.[metadataSchemaName]) {
      acc.push(augmentedMetadata);
      return acc;
    }
    if (selectedColumnsLength >= maxAllowed && !selectedColumnMap?.[metadataSchemaName]) {
      acc.push({ ...augmentedMetadata, isSelected: false, isDisabled: true });
      return acc;
    }
    acc.push({ ...augmentedMetadata, isSelected: false });
    return acc;
  }, []);

  return sortMetadataByDisplayName(metadataArray);
};

export const getActivityFieldsConfig = async ({
  metaDataMap,
  selectedColumns,
  maxAllowed,
  entityType,
  entityCode,
  repNameMap,
  selectedAction,
  columnConfigMap
}: IGetFieldsConfig): Promise<IAvailableField[]> => {
  if (!metaDataMap) {
    return [];
  }

  const selectedColumnsArray = selectedColumns?.split(',') || [];
  const selectedColumnsLength = selectedColumnsArray?.length;
  const selectedColumnMap: Record<string, number> = {};
  selectedColumnsArray.forEach((selectedColumn) => {
    selectedColumnMap[selectedColumn] = 1;
  });

  const restrictionMap = await fetchRestrictionMap({
    metaDataMap,
    entityType,
    entityCode
  });

  const metadataArray: IAvailableField[] = Object.values(metaDataMap)?.map((metadata) => {
    const metadataSchemaName = metadata?.schemaName;
    const isRestricted = restrictionMap?.[metadataSchemaName];
    const augmentedMetadata = {
      ...metadata,
      id: metadataSchemaName,
      label: metadata?.displayName,
      isSelected: true,
      type: TabType.Activity,
      isRemovable: true,
      isRestricted,
      badgeText: repNameMap?.[TabType.Activity],
      ...getPinActionConfig({
        schemaName: metadataSchemaName,
        columnConfigMap,
        selectedAction
      })
    };

    if (selectedColumnMap?.[metadataSchemaName]) {
      return augmentedMetadata;
    }
    if (selectedColumnsLength >= maxAllowed && !selectedColumnMap?.[metadataSchemaName]) {
      return { ...augmentedMetadata, isSelected: false, isDisabled: true };
    }
    return { ...augmentedMetadata, isSelected: false };
  });

  return sortMetadataByDisplayName(metadataArray);
};

export const getFilteredLeadFields = (
  fields: IAvailableField[],
  tabType?: TabType
): IAvailableField[] => {
  if (!fields?.length) {
    return [];
  }
  return fields?.filter((field) => {
    if (
      field?.schemaName === SALES_GROUP_SCHEMA_NAME.LEAD ||
      field?.schemaName === SALES_GROUP_SCHEMA_NAME.LEAD_PREFIX ||
      (tabType === TabType?.Task && field?.isCFS)
    ) {
      return;
    }
    return field;
  });
};

export const getSelectedValue = (
  filterValues: IResponseFilterConfig,
  schemaName: string,
  renderType: FilterRenderType
): IOption[] | IDateOption => {
  let finalSelectedValue: IOption[] | IDateOption;
  const defaultSelectedValue =
    renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
  try {
    if (renderType === FilterRenderType.DateTime) {
      const selectedValue = filterValues?.[schemaName]?.selectedValue as IResponseDateFilter;
      finalSelectedValue = {
        label: selectedValue?.label || DATE_FILTER.DEFAULT_OPTION.label,
        value: selectedValue?.value || DATE_FILTER.DEFAULT_OPTION.value,
        startDate: selectedValue?.start_date,
        endDate: selectedValue?.end_date
      };
    } else {
      finalSelectedValue = filterValues[schemaName]?.selectedValue as IOption[];
    }
    return finalSelectedValue || defaultSelectedValue;
  } catch (error) {
    trackError(error);
  }
  return defaultSelectedValue;
};

export const getFilteredLeadMetadataForNonLeadTab = ({
  leadMetadata,
  isAccountEnabled
}: {
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  isAccountEnabled: boolean;
}): Record<string, IAugmentedSmartViewEntityMetadata> => {
  const relatedCompanyId = leadMetadata?.P_RelatedCompanyId || leadMetadata?.RelatedCompanyId;

  if (!isAccountEnabled || !relatedCompanyId) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { P_CompanyTypeName, P_RelatedCompanyId, ...otherLeadMetadata } = leadMetadata;
    return otherLeadMetadata;
  }

  return leadMetadata;
};

const isDateFilter = (
  schemaName: string,
  parsedFilters: Record<string, string>,
  platformSettingsDateFilter: Record<string, string>
): boolean => {
  // Here platformSchema is either system date field mapped by 'PlatformSettingsDateFilter'
  // or custom date field schema which is directly available in 'DateFilterOn' of parsedFilters
  const platformSchema =
    (platformSettingsDateFilter[parsedFilters?.DateFilterOn] as string) ||
    (parsedFilters?.DateFilterOn as string);

  // Below condition checks if the schemaName is same as platformSchema assigned above
  if (platformSchema === schemaName) {
    return true;
  }
  return false;
};

export const getDateFilterValueFromSettings = (config: {
  value: string;
  from: string;
  to: string;
  isDateTimeCustomDate?: boolean;
}): IDateOption => {
  try {
    const { value, from, to, isDateTimeCustomDate } = config;
    const option =
      (PlatformDateOptionMap[value] as { label: string; value: string }) ?? OPTIONS_OBJ.ALL_TIME;
    const startDate = new Date(from);
    const endDate = new Date(to);

    if (option?.value === OPTIONS_OBJ.CUSTOM.value) {
      return getCustomDateOption({
        selectedValue: option,
        startDate,
        endDate,
        showDateTimePickerForCustom: isDateTimeCustomDate
      });
    }
    return {
      ...option,
      startDate: '',
      endDate: ''
    };
  } catch (error) {
    trackError(error);
    return { ...OPTIONS_OBJ.ALL_TIME, startDate: '', endDate: '' };
  }
};

export const getDateFilterOnValue = (config: {
  parsedFilters: Record<string, string>;
  dateFilterOnValue: string;
  dateFilterOnFrom: string;
  dateFilterOnTo: string;
  updatedSchema: string;
  isDateTimeCustomDate?: boolean;
  platformSettingsDateFilter: Record<string, string>;
  renderType: FilterRenderType;
}): IOption[] | IDateOption | null => {
  const {
    updatedSchema,
    dateFilterOnFrom,
    isDateTimeCustomDate,
    parsedFilters,
    dateFilterOnTo,
    platformSettingsDateFilter,
    dateFilterOnValue,
    renderType
  } = config;

  if (renderType !== FilterRenderType.DateTime) return null;

  const value = parsedFilters?.[updatedSchema];
  if (!value && isDateFilter(updatedSchema, parsedFilters, platformSettingsDateFilter)) {
    return getDateFilterValueFromSettings({
      value: dateFilterOnValue,
      from: dateFilterOnFrom,
      to: dateFilterOnTo,
      isDateTimeCustomDate
    });
  }

  return null;
};

export const hiddenProcessForms = (
  actionConfig?: ISvActionConfig
): Record<string, boolean> | undefined =>
  actionConfig?.HiddenActions?.split(',').reduce((acc: Record<string, boolean>, key) => {
    acc[key] = true;
    return acc;
  }, {});

export const getActionsWidth = (actionsLength?: number): number => {
  const maxWidth = 140;
  const minWidth = 108;
  if ((actionsLength ?? 0) >= 3) return maxWidth;
  return minWidth;
};

export const filterDuplicateActions = <T>(actionsList: T[]): T[] => {
  try {
    const actions = actionsList as { key: string; subMenu?: T[]; children?: T[] }[];
    const uniqueIds = new Set<string>();

    return actions.filter((action) => {
      if (action?.subMenu?.length) {
        action.subMenu = filterDuplicateActions(action.subMenu);
        return true;
      } else if (action?.children?.length) {
        action.children = filterDuplicateActions(action.children);
        return true;
      } else if (action?.key) {
        if (!uniqueIds.has(action.key)) {
          uniqueIds.add(action.key);
          return true;
        }
      }
      return action?.key ? false : true;
    }) as T[];
  } catch (error) {
    trackError(error);
  }
  return actionsList;
};

export const augmentForQuickActions = (actions: IActionConfig[]): IActionConfig[] => {
  return actions?.map((action) => {
    action.title = '';
    action.renderAsIcon = true;
    action.isQuickAction = true;
    action.label = '';
    return action;
  });
};

export const getEntityRowActions = (config: IRowActionConfig): IRowActionConfig => {
  return {
    moreActions: filterDuplicateActions(config.moreActions),
    quickActions: filterDuplicateActions(config.quickActions)
  };
};

export const getSortConfig = (
  sortString: string,
  customColumnDefs: Record<string, IColumn>,
  platformSettingsSchemaMap?: Record<string, string>
): { SortOn: string; SortBy: number } => {
  if (!sortString) {
    return {
      SortOn: '',
      SortBy: 2
    };
  }

  const [schemaName, sortOrder = ''] = sortString.split('-');
  let SortOn = platformSettingsSchemaMap?.[schemaName] || schemaName;
  if (schemaName && customColumnDefs[schemaName]?.sortKey) {
    SortOn = customColumnDefs[schemaName].sortKey || schemaName;
  }
  return {
    SortOn,
    SortBy: SortOn ? sortByMap[sortOrder] : 2
  };
};

const normalizeConditions = (
  entityCode: string,
  tabType: TabType,
  conditions?: IGroupCondition[]
): IGroupCondition[] | undefined => {
  const searchConditions = conditions;
  if (!searchConditions) return searchConditions;

  if (!searchConditions.find((condition) => condition?.Type === 'Activity')) {
    const activityCondition = {
      LSO: 'ActivityEvent',
      ['LSO_Type']:
        tabType === TabType.Activity
          ? ConditionOperatorType.PAEvent
          : ConditionOperatorType.POEvent,
      SubConOp: ConditionType.AND,
      ['RSO_IsMailMerged']: false,
      Operator: ConditionOperator.EQUALS,
      RSO: entityCode
    };
    searchConditions.push({
      Type: ConditionEntityType.Activity,
      ConOp: ConditionType.AND,
      RowCondition: [activityCondition]
    });
  }

  return searchConditions;
};

export const getNormalizedAdvancedSearch = (
  advancedSearch: string,
  entityCode: string,
  tabType: TabType
): string => {
  if (!advancedSearch) return advancedSearch;
  const parsedAdvancedSearchText = safeParseJson(advancedSearch) as IAdvancedSearch;
  parsedAdvancedSearchText.Conditions = normalizeConditions(
    entityCode,
    tabType,
    parsedAdvancedSearchText?.Conditions
  );

  return JSON.stringify(parsedAdvancedSearchText);
};

export const getLeadTypeInternalNameFromUrl = (): string | null => {
  return new URLSearchParams(window?.location?.search)?.get(MANAGE_ENTITY_LEAD_TYPE);
};

const getLeadTypeDataForManageEntity = async (): Promise<ILeadTypeConfiguration[] | undefined> => {
  try {
    const leadType = isLeadTypeSupportedInManageEntity() ? getLeadTypeInternalNameFromUrl() : null;

    if (!leadType) return undefined;

    const leadTypeConfig = (await fetchLeadTypeConfig(CallerSource.SmartViews))?.[leadType];

    return [
      {
        LeadTypeName: leadTypeConfig.Name,
        LeadTypeInternalName: leadTypeConfig.InternalName,
        LeadTypeId: leadTypeConfig.LeadTypeId,
        LeadTypePluralName: leadTypeConfig.PluralName
      }
    ];
  } catch (error) {
    trackError(error);
  }
  return undefined;
};
export const getLDTypeConfigFromRawData = async (
  tabId: string
): Promise<ILeadTypeConfiguration[] | undefined> => {
  // Adding this check to reduce LeadType impacts to smartview tabs and mip manage entity tabs. Can be removed later if not required.
  if (await isLeadTypeEnabled(CallerSource.SmartViews)) {
    if (isManageTab(tabId) || isDetailsPage(tabId)) {
      const leadTypeConfig = await getLeadTypeDataForManageEntity();
      return leadTypeConfig;
    }
    if (isSmartviewTab(tabId)) {
      const leadTypeConfigOfTab = safeParseJson<ILeadTypeConfiguration[]>(
        getRawTabData(tabId)?.TabContentConfiguration?.FetchCriteria?.LeadTypeConfiguration ?? ''
      );

      if (!leadTypeConfigOfTab) {
        return undefined;
      }

      const leadTypeConfig = await fetchLeadTypeConfig(CallerSource.SmartViews);
      return leadTypeConfigOfTab?.map((config) => ({
        ...config,
        LeadTypeId: leadTypeConfig?.[config?.LeadTypeInternalName]?.LeadTypeId
      }));
    }
  }
  return undefined;
};

export const replaceWithLeadRepresentationName = (
  originalName: string,
  replacer: string | undefined
): string => {
  if (!originalName) {
    return '';
  }

  if (!replacer) {
    return originalName;
  }

  return originalName?.replace('Lead', replacer);
};

const isSelectedValuesPendingAndOverdue = (valueArray: string[]): boolean => {
  if (valueArray?.length === 2) {
    const filteredValues = valueArray.filter(
      (value) => value === TaskStatusOptions.Pending || value === TaskStatusOptions.Overdue
    );
    return filteredValues.length === 2;
  }
  return false;
};

export const getTaskStatusFromAdvancedSearch = (advancedSearch: string): string => {
  let taskStatus = TaskStatusOptions.All;
  const parsedAdvancedSearch = safeParseJson(advancedSearch) as IAdvancedSearch;
  const rowConditions = parsedAdvancedSearch?.Conditions?.[0]?.RowCondition || [];
  if (rowConditions?.length) {
    rowConditions.forEach((rowCondition) => {
      if (rowCondition.LSO === SCHEMA_NAMES.TASK_STATUS) {
        taskStatus = rowCondition?.RSO;
      }
    });
  }
  return taskStatus;
};

const getTaskStatusFromFilters = (tabData: ITabResponse, filterMap?: IFilterConfig): string => {
  const marvinData =
    (safeParseJson(
      tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
    ) as IMarvinData) || {};

  if (filterMap) {
    return filterMap[SCHEMA_NAMES.TASK_STATUS]?.value;
  } else {
    return marvinData?.Marvin?.FilterValues?.[SCHEMA_NAMES.TASK_STATUS]?.value ?? '';
  }
};

const getTaskStatusValue = (tabData: ITabResponse, filterMap?: IFilterConfig): string => {
  function getAdvSearch(): string {
    const marvinData =
      (safeParseJson(
        tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
      ) as IMarvinData) || {};

    return (
      marvinData?.Marvin?.AdvancedSearchText ||
      tabData?.TabContentConfiguration?.FetchCriteria?.AdvancedSearchText
    );
  }

  const taskStatusFromAdvSearch = getTaskStatusFromAdvancedSearch(getAdvSearch());
  const taskStatusFromFilters = getTaskStatusFromFilters(tabData, filterMap);

  if (
    !taskStatusFromAdvSearch ||
    taskStatusFromAdvSearch?.toLowerCase()?.replace('tasks', '') === TaskStatusOptions.All
  ) {
    return taskStatusFromFilters;
  }

  if (
    taskStatusFromAdvSearch?.toLowerCase().includes(TaskStatusOptions.Pending) &&
    taskStatusFromAdvSearch?.toLowerCase().includes(TaskStatusOptions.Overdue)
  ) {
    return [TaskStatusOptions.Overdue, TaskStatusOptions.Pending].includes(taskStatusFromFilters)
      ? taskStatusFromFilters
      : taskStatusFromAdvSearch;
  }
  return taskStatusFromAdvSearch;
};

// eslint-disable-next-line complexity
const generateTaskStatusFetchCriteria = (status: string): IStatusRelatedFetchCriteria => {
  try {
    const statusFetchCriteria = {
      Status: -1,
      IncludeOverdue: false,
      IncludeOnlyOverdue: false
    };

    if (!status || status?.toLowerCase()?.includes(TaskStatusOptions?.All?.toLowerCase())) {
      return statusFetchCriteria;
    }

    const valueArray = status.includes(OptionSeperator.CommaSeparator)
      ? status.split(OptionSeperator.CommaSeparator)
      : status.split(OptionSeperator.MXSeparator);
    if (
      valueArray.length > 2 ||
      (valueArray.length === 2 && !isSelectedValuesPendingAndOverdue(valueArray))
    ) {
      return statusFetchCriteria;
    }
    statusFetchCriteria.Status = 0;
    if (status.includes(TaskStatusOptions.Pending) && status.includes(TaskStatusOptions.Overdue)) {
      statusFetchCriteria.IncludeOverdue = true;
      return statusFetchCriteria;
    }
    if (status.includes(TaskStatusOptions.Overdue)) {
      statusFetchCriteria.IncludeOnlyOverdue = true;
    }
    if (status.includes(TaskStatusOptions.Completed)) {
      statusFetchCriteria.Status = 1;
    }
    if (status.includes(TaskStatusOptions.Cancelled)) {
      statusFetchCriteria.Status = 2;
    }
    return statusFetchCriteria;
  } catch (error) {
    trackError(error);
    return {
      Status: -1,
      IncludeOverdue: false,
      IncludeOnlyOverdue: false
    };
  }
};

export const getStatusRelatedFetchCriteria = (
  tabData: ITabResponse,
  filterMap?: IFilterConfig
): IStatusRelatedFetchCriteria => {
  try {
    const taskStatus = getTaskStatusValue(tabData, filterMap)?.toLowerCase();
    return generateTaskStatusFetchCriteria(taskStatus);
  } catch (error) {
    trackError(error);
    return {
      Status: -1,
      IncludeOverdue: false,
      IncludeOnlyOverdue: false
    };
  }
};

/* Returns options without labels, dropdown components based on RenderType will take care 
   of getting labels for these options */
export const getLeadDefaultFilterValue = (config: {
  parsedFilters: Record<string, string>;
  renderType: FilterRenderType;
  schemaName: string;
}): IOption[] | IDateOption => {
  const { renderType, parsedFilters, schemaName } = config;
  try {
    const updatedSchema = (PlatformSettingsLeadSchemaMap[schemaName] as string) || schemaName;
    const value = parsedFilters?.[updatedSchema];

    const dateFilterOnValue = getDateFilterOnValue({
      dateFilterOnFrom: parsedFilters?.DateRangeFrom,
      dateFilterOnTo: parsedFilters?.DateRangeTo,
      dateFilterOnValue: parsedFilters?.DateRange,
      parsedFilters,
      platformSettingsDateFilter: PlatformSettingsLeadDateFilter,
      renderType,
      updatedSchema
    });

    return dateFilterOnValue || getDefaultFilterValue({ renderType, value });
  } catch (error) {
    trackError(error);
  }
  return renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
};

export const getSeparatedLeadType = (
  leadTypeConfig: ILeadTypeConfiguration[] | undefined,
  separator = ','
): string | undefined => {
  const leadType = leadTypeConfig?.reduce((acc, currLeadTypeConfig) => {
    if (acc) {
      return `${acc}${separator}${currLeadTypeConfig.LeadTypeInternalName}`;
    }
    return currLeadTypeConfig.LeadTypeInternalName;
  }, '');

  return leadType;
};

export const getStringifiedLeadType = async (
  tabId: string,
  separator = ','
): Promise<string | undefined> => {
  const leadTypeConfig: ILeadTypeConfiguration[] | undefined =
    await getLDTypeConfigFromRawData(tabId);

  return getSeparatedLeadType(leadTypeConfig, separator);
};

export const addAccountColumns = (columns: string[], prefix: string = ''): string => {
  let updatedColumns = columns?.join(',')?.replaceAll('CheckBoxColumn,', '');

  const isCompanyTypeExist = columns?.includes(`${prefix}CompanyType`);
  const isRelatedCompanyIdExist = columns?.includes(`${prefix}RelatedCompanyId`);
  const isRelatedCompanyIdNameExist = columns?.includes(`${prefix}RelatedCompanyIdName`);

  if (!isCompanyTypeExist && isRelatedCompanyIdExist) {
    updatedColumns += `,${prefix}CompanyType`;
  }
  if (!isRelatedCompanyIdNameExist && isRelatedCompanyIdExist) {
    updatedColumns += `,${prefix}RelatedCompanyIdName`;
  }
  if (!isRelatedCompanyIdExist && isRelatedCompanyIdNameExist) {
    updatedColumns += `,${prefix}RelatedCompanyId`;
  }

  return updatedColumns;
};

export const filterCustomFieldTransformer = (field: IAvailableField): IAvailableField | null => {
  if (field.isRestricted) {
    field.isDisabled = true;
  }
  return field;
};
