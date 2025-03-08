import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import {
  ConditionEntityType,
  GROUPS,
  HeaderAction,
  SCHEMA_NAMES,
  TabType
} from '../../constants/constants';
import { DataType } from 'common/types/entity/lead';
import {
  IColumnConfigMap,
  IFilterData,
  IOnFilterChange,
  ITaskFieldConfig
} from '../../components/smartview-tab/smartview-tab.types';
import {
  DATE_FILTER,
  FilterRenderType,
  OptionSeperator
} from '../../components/smartview-tab/components/filter-renderer/constants';
import { getFilterMethods } from '../../components/smartview-tab/components/filter-renderer/utils';
import fetchLeadAndTaskMetadata, {
  IAugmentedMetaDataForTasks,
  IAugmentedTaskMetaData
} from './metadata';
import {
  appendAdditionalFieldsToAvailableFields,
  getRenderType,
  replaceWithTaskRepresentationName
} from './helpers';
import {
  TASK_SCHEMA_NAME,
  allowedLeadFilterDataTypes,
  allowedTaskFilterDataTypes,
  defaultManageTaskColumns,
  defaultTaskColumns,
  defaultTaskFilters,
  notAllowedLeadFilters,
  notAllowedTaskColumns,
  notAllowedTaskFilters
} from './constants';
import {
  IAugmentedSmartViewEntityMetadata,
  IAugmentedTabSettingsDataParams,
  IGenerateFilterData
} from '../common-utilities/common.types';
import { TaskAttributeDataType } from 'common/types/entity/task/metadata.types';
import { API_ROUTES } from 'common/constants';
import { isCalendarViewActive, removeSchemaPrefix } from '../../components/smartview-tab/utils';
import { getTabData } from '../../components/smartview-tab/smartview-tab.store';
import {
  getFieldsConfig as getCommonFieldsConfig,
  getFilteredLeadFields,
  replaceWithLeadRepresentationName,
  getStringifiedLeadType
} from '../common-utilities/utils';
import { getTaskTypeFilterValue } from 'common/utils/helpers/helpers';
import { TABS_CACHE_KEYS } from '../../components/custom-tabs/constants';
import { canEnableDateTimePicker } from './utils';
import { isLeadSchema } from '../../utils/utils';
import {
  addActionColumn,
  filterColumnConfig,
  getPinActionConfig
} from '../common-utilities/pin-utils';
import {
  ACTION_COLUMN_CONFIG,
  ACTION_COLUMN_SCHEMA_NAME,
  DEFAULT_COLUMN_CONFIG_MAP
} from '../common-utilities/constant';
import { IGetIsFeatureRestriction } from '../../smartviews.types';
import { isValidActionColumn } from '../common-utilities/tab-settings';

interface IAvailableField extends IAugmentedSmartViewEntityMetadata {
  id: string;
  label: string;
  isRemovable: boolean;
  isSelected?: boolean;
  type?: TabType;
  isDisabled?: boolean;
  isRestricted?: boolean;
  isLocationEnabled?: boolean;
  badgeText?: string;
}

interface IAvailableColumnConfig {
  title: string;
  type: TabType;
  data: IAvailableField[];
}

const isOwnerInCalendar = (schema: string, tabId: string = ''): boolean => {
  return isCalendarViewActive(getTabData(tabId)) && schema === SCHEMA_NAMES.OWNER_ID;
};

interface ISelectedField {
  metadata: IAugmentedMetaDataForTasks;
  schemaName: string;
  tabId?: string;
  taskRepName?: string;
  leadRepName?: string;
  selectedAction?: string;
  columnConfigMap?: IColumnConfigMap;
}

const getSelectedField = ({
  schemaName,
  metadata,
  tabId,
  taskRepName,
  leadRepName,
  selectedAction,
  columnConfigMap
}: ISelectedField): IAvailableField => {
  return {
    ...metadata,
    schemaName: metadata?.schemaName || schemaName,
    id: metadata?.schemaName || schemaName,
    label: metadata?.displayName,
    isRemovable: isOwnerInCalendar(schemaName, tabId) ? false : true,
    isSelected: true,
    type: isLeadSchema(metadata?.schemaName) ? TabType.Lead : TabType.Task,
    isDisabled: isOwnerInCalendar(schemaName, tabId),
    badgeText: isLeadSchema(metadata?.schemaName) ? leadRepName : taskRepName,
    ...getPinActionConfig({
      schemaName: metadata?.schemaName || schemaName,
      columnConfigMap,
      selectedAction
    })
  } as IAvailableField;
};

interface IGetSelectedFields {
  augmentLeadMetadata: Record<string, IAugmentedMetaDataForTasks>;
  selectedColumns: string;
  tabId?: string;
  taskRepName?: string;
  leadRepName?: string;
  selectedAction?: string;
  columnConfigMap?: IColumnConfigMap;
  featureRestrictionData?: IGetIsFeatureRestriction;
}

const getSelectedFields = ({
  augmentLeadMetadata,
  selectedColumns,
  tabId,
  taskRepName,
  leadRepName,
  selectedAction,
  columnConfigMap,
  featureRestrictionData
}: IGetSelectedFields): IAvailableField[] => {
  if (!selectedColumns?.trim()?.length || !augmentLeadMetadata) {
    return [];
  }
  const selectedColumnsArray = selectedColumns?.split(',') || [];
  return selectedColumnsArray
    ?.map((schemaName) => {
      if (isValidActionColumn(schemaName, featureRestrictionData)) {
        return {
          ...ACTION_COLUMN_CONFIG,
          ...getPinActionConfig({
            schemaName: ACTION_COLUMN_SCHEMA_NAME,
            columnConfigMap,
            selectedAction
          })
        };
      } else {
        const metadata = augmentLeadMetadata?.[schemaName];
        return getSelectedField({
          schemaName,
          metadata,
          tabId,
          taskRepName,
          leadRepName,
          selectedAction,
          columnConfigMap
        });
      }
    })
    ?.filter((selectedColumn) => selectedColumn?.displayName?.trim()?.length);
};

interface IGetFieldsConfig {
  metaDataMap: Record<string, IAugmentedMetaDataForTasks>;
  selectedColumns: string;
  maxAllowed: number;
  entityType: TabType;
  tabId?: string;
  isSelectColumnAction?: boolean;
  repNameMap?: Record<string, string>;
  selectedAction?: string;
  columnConfigMap?: IColumnConfigMap;
}

const getFieldsConfig = async ({
  metaDataMap,
  selectedColumns,
  maxAllowed,
  entityType,
  tabId,
  isSelectColumnAction,
  repNameMap,
  selectedAction,
  columnConfigMap
}: IGetFieldsConfig): Promise<IAvailableField[]> => {
  const customFieldTransformer = (field: IAvailableField): IAvailableField | null => {
    const isOwnerFieldInCalendar = isOwnerInCalendar(field?.schemaName, tabId);
    if (isSelectColumnAction && field?.schemaName === `P_${SCHEMA_NAMES.OWNER_ID}`) {
      return null;
    }
    return {
      ...field,
      isRemovable: isOwnerFieldInCalendar ? false : true,
      isDisabled:
        field?.isDisabled ||
        isOwnerFieldInCalendar ||
        (isSelectColumnAction ? false : field?.isDisabled)
    };
  };

  return getCommonFieldsConfig({
    metaDataMap: metaDataMap as Record<string, IAugmentedSmartViewEntityMetadata>,
    selectedColumns,
    maxAllowed,
    entityType,
    customFieldTransformer,
    repNameMap: repNameMap,
    selectedAction: selectedAction,
    columnConfigMap: columnConfigMap
  });
};

const getFilteredTaskFields = (
  taskFields: IAvailableField[],
  entityCode: string | undefined,
  selectedHeaderAction?: string
): IAvailableField[] => {
  if (!taskFields?.length) {
    return [];
  }
  const taskTypeNoneOrMoreThanOne =
    entityCode === '-1' || (entityCode || '')?.split(',')?.length > 1;
  const filteredTaskFields = taskFields?.filter((taskField) => {
    if (notAllowedTaskColumns[taskField?.schemaName]) {
      return;
    }
    if (taskField?.schemaName === 'Location' && !taskField?.isLocationEnabled) {
      return;
    }
    if (taskTypeNoneOrMoreThanOne && taskField?.schemaName?.startsWith('mx')) {
      return;
    }
    return taskField;
  });
  if (selectedHeaderAction && selectedHeaderAction === HeaderAction.ExportLeads) {
    return appendAdditionalFieldsToAvailableFields(filteredTaskFields);
  }
  return filteredTaskFields;
};

// eslint-disable-next-line max-lines-per-function, complexity
const getColumnConfig = async ({
  entityCode,
  maxAllowed,
  selectedFieldsSchema,
  tabId = '',
  selectedHeaderAction,
  columnConfigMap,
  featureRestrictionData
}: IAugmentedTabSettingsDataParams): Promise<{
  fields: IAvailableColumnConfig[];
  selectedFields: IAvailableField[];
  defaultFields: IAvailableField[];
}> => {
  try {
    const tabData = getTabData(tabId);
    const systemConfiguredColumns = tabData.tabSettings
      .getSystemColumns?.()
      ?.replaceAll('CheckBoxColumn,', '');

    const { metadata, leadRepName, taskRepName } = await fetchLeadAndTaskMetadata(
      entityCode || '',
      CallerSource.SmartViews,
      tabId
    );
    const leadMetadataMap = metadata?.leadMetadata;
    const taskMetadataMap = metadata?.taskMetadata;
    const taskAndLeadMetadata = { ...leadMetadataMap, ...taskMetadataMap };

    const selectedFields = getSelectedFields({
      augmentLeadMetadata: taskAndLeadMetadata,
      selectedColumns: selectedFieldsSchema ?? '',
      taskRepName,
      leadRepName,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap,
      featureRestrictionData
    });
    const selectedFieldsSchemaName =
      selectedFields.map((field) => field.schemaName).join(',') || '';

    const repNameMap = {
      [TabType.Lead]: leadRepName,
      [TabType.Task]: taskRepName
    };

    const [leadFields, taskFields] = await Promise.all([
      getFieldsConfig({
        metaDataMap: leadMetadataMap,
        selectedColumns: selectedFieldsSchemaName,
        maxAllowed: maxAllowed || 0,
        entityType: TabType.Lead,
        isSelectColumnAction: true,
        repNameMap,
        selectedAction: selectedHeaderAction,
        columnConfigMap: columnConfigMap
      }),
      getFieldsConfig({
        metaDataMap: taskMetadataMap,
        selectedColumns: selectedFieldsSchemaName,
        maxAllowed: maxAllowed || 0,
        entityType: TabType.Task,
        isSelectColumnAction: true,
        repNameMap,
        selectedAction: selectedHeaderAction,
        columnConfigMap: columnConfigMap
      })
    ]);

    const leadTitle = replaceWithLeadRepresentationName('Lead Fields', leadRepName);
    const taskTitle = replaceWithTaskRepresentationName('Task Fields', taskRepName);

    const isManageTaskTab = tabId === TABS_CACHE_KEYS.MANAGE_TASKS_TAB;
    const defaultColumns = addActionColumn(
      systemConfiguredColumns ?? isManageTaskTab ? defaultManageTaskColumns : defaultTaskColumns,
      isManageTaskTab ? 4 : 1
    );

    const defaultFields = getSelectedFields({
      augmentLeadMetadata: taskAndLeadMetadata,
      selectedColumns: defaultColumns,
      taskRepName,
      leadRepName,
      selectedAction: selectedHeaderAction,
      columnConfigMap: filterColumnConfig(
        isManageTaskTab ? DEFAULT_COLUMN_CONFIG_MAP.ManageTask : DEFAULT_COLUMN_CONFIG_MAP.Task,
        defaultColumns
      ),
      featureRestrictionData
    });

    return {
      fields: [
        {
          title: taskTitle,
          type: TabType.Task,
          data: getFilteredTaskFields(taskFields, entityCode, selectedHeaderAction)
        },
        {
          title: leadTitle,
          type: TabType.Lead,
          data: getFilteredLeadFields(leadFields, TabType.Task)
        }
      ],
      selectedFields: selectedFields,
      defaultFields
    };
  } catch (error) {
    trackError(error);
    return {
      fields: [{ title: 'Lead Fields', type: TabType.Lead, data: [] }],
      selectedFields: [],
      defaultFields: []
    };
  }
};

// eslint-disable-next-line max-lines-per-function
const getFilteredMetaData = (
  metaDataMap: {
    leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
    taskMetadata: Record<string, IAugmentedTaskMetaData>;
  },
  tabId: string
): {
  filteredLeadMetaData: Record<string, IAugmentedSmartViewEntityMetadata>;
  filteredTaskMetadata: Record<string, IAugmentedTaskMetaData>;
} => {
  const { leadMetadata, taskMetadata } = metaDataMap;
  const filteredLeadMetaData = {};
  const filteredTaskMetadata = {};
  const allowedLeadSchemas = [SCHEMA_NAMES.CREATED_BY_NAME, SCHEMA_NAMES.OWNER_ID, GROUPS];
  const allowedTaskSchemas = [
    SCHEMA_NAMES.CREATED_BY,
    SCHEMA_NAMES.OWNER_ID,
    SCHEMA_NAMES.CREATED_ON,
    SCHEMA_NAMES.COMPLETED_ON
  ];

  Object.keys(leadMetadata)?.map((schemaName) => {
    if (
      leadMetadata?.[schemaName]?.isCFS ||
      notAllowedLeadFilters[removeSchemaPrefix(schemaName)]
    ) {
      return;
    }

    if (
      allowedLeadFilterDataTypes.includes(leadMetadata?.[schemaName]?.dataType as DataType) ||
      allowedLeadSchemas.includes(removeSchemaPrefix(schemaName))
    ) {
      filteredLeadMetaData[schemaName] = leadMetadata?.[schemaName];
    }
  });

  Object.keys(taskMetadata)?.map((schemaName) => {
    if (
      notAllowedTaskFilters[schemaName] ||
      (isCalendarViewActive(getTabData(tabId)) && schemaName === TASK_SCHEMA_NAME.SCHEDULE)
    ) {
      return;
    }
    if (
      allowedTaskFilterDataTypes.includes(
        taskMetadata?.[schemaName]?.dataType as TaskAttributeDataType
      ) ||
      allowedTaskSchemas.includes(schemaName)
    ) {
      filteredTaskMetadata[schemaName] = taskMetadata?.[schemaName];
    }
  });

  return { filteredLeadMetaData, filteredTaskMetadata };
};

const generateFilterData = async ({
  entityCode,
  metadata,
  schemaName,
  tabType
}: {
  metadata: {
    leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
    taskMetadata: Record<string, IAugmentedTaskMetaData>;
  };
  schemaName: string;
  tabType: TabType;
  entityCode: string;
}): Promise<IFilterData> => {
  const { leadMetadata, taskMetadata } = metadata;
  const leadAndTaskmetadata = { ...leadMetadata, ...taskMetadata };
  const renderType = getRenderType(leadAndTaskmetadata, schemaName);
  const selectedValue = renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
  const conditionEntityType = isLeadSchema(schemaName)
    ? ConditionEntityType.Lead
    : ConditionEntityType.Task;
  const filterValue =
    ((await (
      await getFilterMethods(conditionEntityType)
    )?.getFilterValue?.({
      selectedOption: selectedValue,
      schemaName,
      entityCode,
      tabType
    })) as IOnFilterChange) || {};

  return {
    ...filterValue,
    renderType,
    selectedValue,
    label: leadAndTaskmetadata[schemaName]?.displayName,
    enableDateTimePicker: canEnableDateTimePicker(schemaName)
  };
};

// eslint-disable-next-line max-lines-per-function
const getFilterConfig = async ({
  entityCode,
  selectedFieldsSchema = '',
  maxAllowed,
  tabId = ''
}: IAugmentedTabSettingsDataParams): Promise<{
  fields: IAvailableColumnConfig[];
  selectedFields: IAvailableField[];
  defaultFields: IAvailableField[];
  generateFilterData?: IGenerateFilterData;
}> => {
  try {
    const { metadata, leadRepName, taskRepName } = await fetchLeadAndTaskMetadata(
      entityCode || '',
      CallerSource?.SmartViews,
      tabId
    );
    const { filteredLeadMetaData, filteredTaskMetadata } = getFilteredMetaData(
      metadata,
      tabId || ''
    );
    const leadAndTaskMetadata = { ...filteredLeadMetaData, ...filteredTaskMetadata };

    const [leadFields, taskFields] = await Promise.all([
      getFieldsConfig({
        metaDataMap: filteredLeadMetaData,
        selectedColumns: selectedFieldsSchema,
        maxAllowed: maxAllowed || 0,
        entityType: TabType.Lead
      }),
      getFieldsConfig({
        metaDataMap: filteredTaskMetadata,
        selectedColumns: selectedFieldsSchema,
        maxAllowed: maxAllowed || 0,
        entityType: TabType.Task,
        tabId
      })
    ]);
    const leadTitle = replaceWithLeadRepresentationName('Lead Fields', leadRepName);
    const taskTitle = replaceWithTaskRepresentationName('Task Fields', taskRepName);

    const selectedFields = getSelectedFields({
      augmentLeadMetadata: leadAndTaskMetadata,
      selectedColumns: selectedFieldsSchema,
      tabId
    });
    const defaultFields = getSelectedFields({
      augmentLeadMetadata: leadAndTaskMetadata,
      selectedColumns: defaultTaskFilters.join(',') || '',
      tabId
    });

    return {
      fields: [
        {
          title: taskTitle,
          type: TabType.Task,
          data: taskFields
        },
        {
          title: leadTitle,
          type: TabType.Lead,
          data: leadFields
        }
      ],
      selectedFields: selectedFields,
      defaultFields: defaultFields,
      generateFilterData: (schemaName: string, tabType: TabType, tabEntityCode: string) =>
        generateFilterData({ metadata, schemaName, tabType, entityCode: tabEntityCode || '' })
    };
  } catch (error) {
    trackError(error);
    return {
      fields: [
        { title: 'Task Fields', type: TabType.Task, data: [] },
        { title: 'Lead Fields', type: TabType.Lead, data: [] }
      ],
      selectedFields: [],
      defaultFields: []
    };
  }
};

const getExportTaskConfig = async (
  entityCode: string,
  tabId: string,
  setMinRecordForAsyncRequest?: React.Dispatch<React.SetStateAction<number | undefined>>
): Promise<ITaskFieldConfig> => {
  const taskCode = entityCode?.split?.(',')?.length > 1 ? '-1' : entityCode;

  const config: ITaskFieldConfig = await httpGet({
    path: `${API_ROUTES.taskExportConfig}${taskCode}&leadType=${
      (await getStringifiedLeadType(tabId, OptionSeperator.MXSeparator)) ?? ''
    }`,
    module: Module.Marvin,
    callerSource: CallerSource?.SmartViews
  });

  setMinRecordForAsyncRequest?.(parseInt(config?.TaskExportLimit));

  return config;
};

const getEntityCode = (tabId: string, selectedTabType: string): string => {
  const tabData = getTabData(tabId);
  const entityCode = tabData?.entityCode || '-1';
  if (
    selectedTabType === HeaderAction.ExportLeads ||
    (tabId === TABS_CACHE_KEYS.MANAGE_TASKS_TAB && selectedTabType === HeaderAction.SelectColumns)
  ) {
    return getTaskTypeFilterValue(tabData) || entityCode;
  }
  return entityCode;
};

const taskTabSettingsAugmentHandler = {
  getColumnConfig,
  getFilterConfig,
  getEntityCode
};

export { taskTabSettingsAugmentHandler, getExportTaskConfig };
export type { IAvailableColumnConfig, IAvailableField };
