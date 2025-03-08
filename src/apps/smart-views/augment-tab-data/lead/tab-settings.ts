import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { getConditionEntityType, getDefaultLeadTabColumns, getUnRestrictedFields } from './helpers';
import { fetchSmartViewLeadMetadata } from './metadata';
import { ColumnRenderWorkArea, SCHEMA_NAMES, TabType } from '../../constants/constants';
import { DataType } from 'common/types/entity/lead';
import { getDefaultLeadFilters, notAllowedFilters } from './constants';
import {
  IExportLeadConfig,
  IFilterData,
  IOnFilterChange
} from '../../components/smartview-tab/smartview-tab.types';
import {
  DATE_FILTER,
  FilterRenderType,
  OptionSeperator
} from '../../components/smartview-tab/components/filter-renderer/constants';
import { getFilterMethods } from '../../components/smartview-tab/components/filter-renderer/utils';
import {
  IAugmentedSmartViewEntityMetadata,
  IAugmentedTabSettingsDataParams,
  IAvailableColumnConfig,
  IAvailableField,
  IGenerateFilterData
} from '../common-utilities/common.types';
import {
  getFieldsConfig,
  getFilteredLeadFields,
  replaceWithLeadRepresentationName,
  getStringifiedLeadType,
  filterCustomFieldTransformer
} from '../common-utilities/utils';
import { getLeadRenderType, getSelectedFields } from '../common-utilities/tab-settings';
import { API_ROUTES } from 'common/constants';
import { getRawTabData } from '../../smartviews-store';
import { DEFAULT_COLUMN_CONFIG_MAP } from '../common-utilities/constant';
import { isSmartviewTab } from '../../utils/utils';
import { filterColumnConfig } from '../common-utilities/pin-utils';

const customFieldTransformer = (field: IAvailableField): IAvailableField | null => {
  if (field?.schemaName === SCHEMA_NAMES.OWNER_ID) {
    return null;
  }
  return field;
};

// eslint-disable-next-line max-lines-per-function
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
    const leadMetadata = await fetchSmartViewLeadMetadata(CallerSource?.SmartViews, tabId ?? '');
    const selectedFields = getSelectedFields({
      augmentEntityMetadata: leadMetadata?.metaDataMap,
      selectedColumns: selectedFieldsSchema || '',
      defaultEntityType: TabType?.Lead,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap
    });

    const fields = await getFieldsConfig({
      metaDataMap: leadMetadata?.metaDataMap,
      selectedColumns: selectedFields.map((field) => field.schemaName).join(','),
      maxAllowed: maxAllowed ?? 0,
      entityType: TabType.Lead,
      entityCode,
      customFieldTransformer,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap
    });
    const title = replaceWithLeadRepresentationName(
      'Lead Fields',
      leadMetadata?.representationName?.SingularName
    );

    const defaultColumns = await getDefaultLeadTabColumns({
      tabData: getRawTabData(tabId),
      leadMetaData: leadMetadata?.metaDataMap,
      columnRenderWorkArea: ColumnRenderWorkArea.SelectColumns,
      isSmartviewTab: isSmartviewTab(tabId)
    });

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: leadMetadata?.metaDataMap,
      selectedColumns: defaultColumns,
      defaultEntityType: TabType.Lead,
      selectedAction: selectedHeaderAction,
      columnConfigMap: filterColumnConfig(DEFAULT_COLUMN_CONFIG_MAP.Lead, defaultColumns),
      featureRestrictionData
    });
    return {
      fields: [
        {
          title: title,
          type: TabType.Lead,
          data: getFilteredLeadFields(fields)
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

const getFilteredMetaData = (
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  const filteredMetaData = {};
  const allowedDataTypes = [DataType.Select, DataType.Date, DataType.MultiSelect];
  const allowedSchemas = [
    SCHEMA_NAMES.CREATED_BY_NAME,
    SCHEMA_NAMES.OWNER_ID,
    SCHEMA_NAMES.GROUP,
    SCHEMA_NAMES.COMPANY_TYPE_NAME,
    SCHEMA_NAMES.RELATED_COMPANY_ID
  ];

  Object.keys(metaDataMap)?.map((schemaName) => {
    if (metaDataMap?.[schemaName]?.isCFS || notAllowedFilters[schemaName]) {
      return;
    }
    if (
      allowedDataTypes.includes(metaDataMap?.[schemaName]?.dataType as DataType) ||
      allowedSchemas.includes(schemaName)
    ) {
      filteredMetaData[schemaName] = metaDataMap?.[schemaName];
    }
  });

  return filteredMetaData;
};

const generateFilterData = async (
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
  schemaName: string,
  tabType: TabType
): Promise<IFilterData> => {
  const renderType = getLeadRenderType(leadMetadata, schemaName);
  const selectedValue = renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];

  const filterValue =
    ((await (
      await getFilterMethods(getConditionEntityType(schemaName))
    )?.getFilterValue?.({
      selectedOption: selectedValue,
      schemaName,
      tabType
    })) as IOnFilterChange) || {};

  return {
    ...filterValue,
    renderType,
    selectedValue,
    label: leadMetadata[schemaName]?.displayName
  };
};

const getFilterFields = (
  fields: IAvailableField[],
  title: string
): { title: string; type: TabType; data: IAvailableField[] }[] => {
  return [
    {
      title: title,
      type: TabType.Lead,
      data: fields
    }
  ];
};

// eslint-disable-next-line max-lines-per-function
const getFilterConfig = async ({
  selectedFieldsSchema,
  maxAllowed,
  tabId
}: IAugmentedTabSettingsDataParams): Promise<{
  fields: IAvailableColumnConfig[];
  selectedFields: IAvailableField[];
  defaultFields: IAvailableField[];
  generateFilterData?: IGenerateFilterData;
}> => {
  try {
    const leadMetadata = await fetchSmartViewLeadMetadata(CallerSource?.SmartViews, tabId ?? '');
    const filteredLeadMetaData = getFilteredMetaData(leadMetadata?.metaDataMap);

    const fields = await getFieldsConfig({
      metaDataMap: filteredLeadMetaData,
      selectedColumns: selectedFieldsSchema || '',
      maxAllowed: maxAllowed || 0,
      entityType: TabType.Lead,
      customFieldTransformer: filterCustomFieldTransformer
    });
    const selectedFields = getSelectedFields({
      augmentEntityMetadata: leadMetadata?.metaDataMap,
      selectedColumns: selectedFieldsSchema || '',
      defaultEntityType: TabType.Lead
    });

    const defaultUnRestrictedFilters = await getUnRestrictedFields(getDefaultLeadFilters(tabId));
    const defaultFields = getSelectedFields({
      augmentEntityMetadata: leadMetadata?.metaDataMap,
      selectedColumns: defaultUnRestrictedFilters.join(',') || '',
      defaultEntityType: TabType.Lead
    });
    const title = replaceWithLeadRepresentationName(
      'Lead Fields',
      leadMetadata?.representationName?.SingularName
    );
    return {
      fields: getFilterFields(fields, title),
      selectedFields,
      defaultFields,
      generateFilterData: (schemaName: string, tabType: TabType) =>
        generateFilterData(leadMetadata?.metaDataMap, schemaName, tabType)
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

const getExportConfig = async (tabId: string): Promise<IExportLeadConfig> => {
  const config: IExportLeadConfig = await httpGet({
    path: `${API_ROUTES.leadExportConfig}?leadType=${
      (await getStringifiedLeadType(tabId, OptionSeperator.MXSeparator)) ?? ''
    }`,
    module: Module.Marvin,
    callerSource: CallerSource?.SmartViews
  });
  return config;
};

const tabSettingsAugmentHandler = {
  getColumnConfig,
  getFilterConfig
};

export { tabSettingsAugmentHandler, getExportConfig };
export type { IAvailableColumnConfig, IAvailableField };
